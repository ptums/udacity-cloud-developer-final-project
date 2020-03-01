import * as AWS  from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { Contact } from '../models/Contact';
import { UpdateContact } from '../models/UpdateContact';
;

export class PhoneBookAccess {
  constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly phoneBookTable = process.env.PHONE_BOOK_TABLE,
        private readonly userIndex = process.env.USER_ID_INDEX,
        private readonly contactIndex = process.env.CONTACT_ID_INDEX,
  ) { }

  async getAllContacts(userId: string): Promise <Contact[]> {
    console.log('Getting all user contacts for their phonebook');

    const result = await this.docClient.query({
      TableName: this.phoneBookTable,
      IndexName: this.userIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId':userId
      },
    }).promise();

    const items = result.Items;
    return items as Contact[];
  }

  async getSingleContact(contactId: string) {
    const result = await this.docClient.query({
      TableName: this.phoneBookTable,
      IndexName: this.contactIndex,
      KeyConditionExpression: 'contactId = :contactId',
      ExpressionAttributeValues: {
        ':contactId':contactId
      },
    }).promise();

    const items = result.Items;
    return items;
  }

  async createContact(contact: Contact): Promise<Contact> {
    await this.docClient.put({
      TableName: this.phoneBookTable,
      Item: contact,
    }).promise();

    return contact;
  }

  async deleteContact(contactId: string): Promise<String> {
    await this.docClient.delete({
      TableName: this.phoneBookTable,
      Key: {
        contactId,
      },
    }).promise();

    return contactId;
  }

  async updateContact(contactId: string, updates: UpdateContact): Promise<UpdateContact> {
    const {
      name, email, phone, address,
    } = updates;
    await this.docClient.update({
      TableName: this.phoneBookTable,
      Key: {
        contactId,
      },
      UpdateExpression: 'set #namefield = :n, phone = :phone, email = :email, address = :address',
      ExpressionAttributeValues: {
        ':n': name,
        ':email': email,
        ':phone': phone,
        ':address': address,
      },
      ExpressionAttributeNames: {
        '#namefield': 'name',
      },
    }).promise();

    return updates;
  }
}
