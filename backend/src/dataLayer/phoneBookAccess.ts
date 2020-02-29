import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

import { Contact } from '../models/Contact'
import { ContactUpdate } from '../models/ContactUpdate'

export class PhoneBookAccess {
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly phoneBookTable = process.env.PHONE_BOOK_TABLE,
        private readonly userIndex = process.env.USER_ID_INDEX
    ) { }

    async getAllContacts(userId: string): Promise <Contact[]> {
        console.log('Getting all user contacts for their phonebook')

        const result = await this.docClient.query({
            TableName: this.phoneBookTable,
            IndexName: this.userIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                'userId': userId
            }   
        }).promise()

        const items = result.Items
        return items as Contact[]
    }

    async createContact(contact: Contact): Promise<Contact> {
        await this.docClient.put({
            TableName: this.phoneBookTable,
            Item: contact
        }).promise() 
        
        return contact
    }

    async deleteContact(contactId: string): Promise<String> {
        await this.docClient.delete({
            TableName: this.phoneBookTable,
            Key: {
                contactId
            }
        }).promise()

        return contactId
    }
    
    async updateContact(contactId: string, updates: ContactUpdate): Promise<ContactUpdate> {
        const { name, email, phone, address } = updates
        await this.docClient.update({
            TableName: this.phoneBookTable,
            Key: {
                contactId
            },
            UpdateExpression: 'set #namefield = :n, email = :e, phone = :p, address = :a',
            ExpressionAttributeValues: {
                ':n' : name,
                ':e' : email,
                ':p' : phone,
                ':a' : address
            },
            ExpressionAttributeNames:{
                "#namefield": "name"
              }
        }).promise()
         
         return updates
    }
}