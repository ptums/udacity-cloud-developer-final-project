import Axios from 'axios';
import { apiEndpoint } from '../config';
import { Contact } from '../types/Contact';
import { CreateContactRequest } from '../types/CreateContactRequest';
import { UpdateContactRequest } from '../types/UpdateContactRequest';

export async function getContacts(idToken: string): Promise<Contact[]> {
  console.log('Fetching contacts');

  const response = await Axios.get(`${apiEndpoint}/phonebook`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
  });
  console.log('Contacts:', response.data);
  return response.data.items;
}

export async function createContact(
  idToken: string,
  newContact: CreateContactRequest,
): Promise<Contact> {
  const response = await Axios.post(`${apiEndpoint}/phonebook`, JSON.stringify(newContact), {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
  });
  return response.data.item;
}

export async function patchContact(
  idToken: string,
  contactId: string,
  updatedContact: UpdateContactRequest,
) {

  console.log('api idtoken', idToken)
  console.log('api contactId', contactId)
  console.log('api updateContact')
  console.log(updatedContact)
  
  await Axios.patch(`${apiEndpoint}/phonebook/${contactId}`, JSON.stringify(updatedContact), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteContact(
  idToken: string,
  contactId: string,
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/phonebook/${contactId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
  });
}

export async function singleContact(
  idToken: string,
  contactId:string
): Promise<void> {
  const response = await Axios.get(`${apiEndpoint}/phonebook/contact/${contactId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
  });

  return response.data.items;

}
