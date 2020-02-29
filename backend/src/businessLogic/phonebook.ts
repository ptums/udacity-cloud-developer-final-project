import * as uuid from 'uuid'
import { Contact } from '../models/Contact'
import { ContactUpdate } from '../models/ContactUpdate'
import { PhoneBookAccess } from '../dataLayer/phoneBookAccess'
import { CreateContactRequest } from '../requests/CreateContactRequest'
import { parseUserId } from '../auth/utils'

const phoneBookAccess = new PhoneBookAccess()

export async function GetAllContacts(jwtToken: string): Promise<Contact[]> {
    const userId = parseUserId(jwtToken)

    if (userId) { 
        return phoneBookAccess.getAllContacts(userId)
    }
}

export async function CreateContact(
    CreateContactRequest: CreateContactRequest,
    jwtToken: string
): Promise<Contact> {
    const contactId = uuid.v4()
    const userId = parseUserId(jwtToken)

    const newContact = {
        userId,
        contactId,
        ...CreateContactRequest
    }

    await phoneBookAccess.createContact(newContact)

    return newContact
}

export async function DeleteContact(
    contactId: string, 
    jwtToken: string
): Promise<String> {
    const userId = parseUserId(jwtToken)

    if(userId) {
        return await phoneBookAccess.deleteContact(contactId)
    }
}

export async function UpdateContact(
    contactId: string,
    jwtToken: string, 
    updates: ContactUpdate
): Promise <ContactUpdate> {
    const userId = parseUserId(jwtToken)

    if(userId) {
        return phoneBookAccess.updateContact(contactId, updates)
    }
}