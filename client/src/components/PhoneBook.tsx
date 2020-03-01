import { History } from 'history'
import * as React from 'react'
import {
  Button,
  Divider,
  Grid,
  Header,
  Card,
  Input,
  Loader,
  Form,
  Label,
  Icon
} from 'semantic-ui-react'

import { createContact, deleteContact, getContacts } from '../api/phonebook-api'
import Auth from '../auth/Auth'
import { Contact } from '../types/Contact'

interface ContactProps {
  auth: Auth
  history: History
}

interface ContactState {
  contacts: Contact[]
  newContact: any,
  loadingContacts: boolean
}

export class PhoneBook extends React.PureComponent<ContactProps, ContactState> {
  state: ContactState = {
    contacts: [],
    newContact: {},
    loadingContacts: true
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { newContact } = this.state
    const { name, value } = event.target

    newContact[name] = value 

    this.setState({ newContact })
  }

  onEditButtonClick = (contactId: string) => {
    const { history } = this.props
    history.push(`/phonebook/${contactId}/edit`)
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    const { newContact } = this.state
    const { auth } = this.props
    try {
      const contact = await createContact(auth.getIdToken(), {
        ...newContact
      })
      this.setState({
        contacts: [...this.state.contacts, contact],
        newContact: {}
      })
    } catch {
      alert('Contact creation failed')
    }
  }

  onContactDelete = async (contactId: string) => {
    const { auth } = this.props
    const { contacts } = this.state

    try {
      await deleteContact(auth.getIdToken(), contactId)
      this.setState({
        contacts: contacts.filter(contact => contact.contactId != contactId)
      })
    } catch {
      alert('Contact deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const contacts = await getContacts(this.props.auth.getIdToken())
      this.setState({
        contacts,
        loadingContacts: false
      })
    } catch (e) {
      alert(`Failed to fetch contacts: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Add New Contact</Header>

        {this.renderCreateContactInput()}
        <Header as="h1">Contact List</Header>
        {this.renderContactsList()}
      </div>
    )
  }

  renderCreateContactInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <br />
            <Label>Name</Label>
            
            <Input
              type="text"
              name="name"
              placeholder="Edit user name"
              onChange={this.handleChange}
            />
            <br />
            <Label>Phone</Label>            
            <Input
              type="text"
              name="phone"
              placeholder="Edit user phone"
              onChange={this.handleChange}
            />
            
          </Form.Field>
          {this.renderButton()}
          </Form>          
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderTodos() {
    if (this.state.loadingContacts) {
      return this.renderLoading()
    }

    return this.renderContactsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Phone book Contacts
        </Loader>
      </Grid.Row>
    )
  }

  renderContactsList() {
    const { contacts } = this.state
    return (
      <Card.Group>
        {(contacts.length > 0) ? contacts.map((contact, pos) => {
          return (
            <Card key={contact.contactId}>
              <Card.Content>
                <Card.Header>{contact.name}</Card.Header>
                <Card.Meta>
                  Phone:
                  {' '}
                  {contact.phone}
                </Card.Meta>
                <Card.Description>
                  {(contact.email) && (<><strong>Email: </strong> {contact.email}</>)}
                  {(contact.address) && (<><br/><strong>Address: </strong> {contact.address}</>)}
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <div className='ui two buttons'>
                  <Button basic color='blue' onClick={() => this.onEditButtonClick(contact.contactId)}>
                    <Icon name="pencil" />
                  </Button>
                  <Button basic color='red' onClick={() => this.onContactDelete(contact.contactId)}>
                    <Icon name="delete" />
                  </Button>
                </div>
              </Card.Content>
            </Card>          
          )
        }) : <p>You currently don't have any contacts. Please add some!</p>}
      </Card.Group>
    )
  }

  renderButton() {
    return (
      <div>
        <Button
          type="submit"
        >
          Create New Contact
        </Button>
      </div>
    )
  }
}