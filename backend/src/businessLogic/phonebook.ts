import * as uuid from 'uuid';
import { Contact } from '../models/Contact';
import { ContactUpdate } from '../models/ContactUpdate';
import { PhoneBookAccess } from '../dataLayer/phoneBookAccess';
import { CreateContactRequest } from '../requests/CreateContactRequest';
import { parseUserId } from '../auth/utils';

const phoneBookAccess = new PhoneBookAccess();

export async function GetAllContacts(jwtToken: string): Promise<Contact[]> {
  const userId = parseUserId(jwtToken);

  if (userId) {
    const allContacts = await phoneBookAccess.getAllContacts(userId);
    return allContacts;
  }
}

export async function CreateContact(
  CreateContactRequest: CreateContactRequest,
  jwtToken: string,
): Promise<Contact> {
  const contactId = uuid.v4();
  const userId = parseUserId(jwtToken);

  const newContact = {
    userId,
    contactId,
    ...CreateContactRequest,
  };

  await phoneBookAccess.createContact(newContact);

  return newContact;
}

export async function DeleteContact(
  contactId: string,
  jwtToken: string,
): Promise<String> {
  const userId = parseUserId(jwtToken);

  if (userId) {
    const deleteContact = await phoneBookAccess.deleteContact(contactId);
    return deleteContact;
  }
}

export async function UpdateContact(
  contactId: string,
  jwtToken: string,
  updates: ContactUpdate,
): Promise <ContactUpdate> {
  const userId = parseUserId(jwtToken);

  if (userId) {
    const updateContact = await phoneBookAccess.updateContact(contactId, updates);
    return updateContact;
  }
}
