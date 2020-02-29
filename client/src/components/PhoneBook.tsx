import { History } from 'history'
import * as React from 'react'
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Loader,
  Form,
  Label,
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

export class Todos extends React.PureComponent<ContactProps, ContactState> {
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
        <Header as="h1">Phone Book</Header>

        {this.renderCreateContactInput()}

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
            <Label>Name</Label>
            <Input
              type="text"
              accept="name"
              placeholder="Edit user name"
              onChange={this.handleChange}
            />
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
      <Grid padded>
        {contacts.map((contact, pos) => {
          return (
            <Grid.Row key={contact.contactId}>
              <Grid.Column width={10} verticalAlign="middle">
                {contact.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                Phone: 
                {contact.phone}
              </Grid.Column>
              {(contact.email) && (
                <Grid.Column width={3} floated="right">
                    Email:
                    {contact.email}
                </Grid.Column>
              )}
              {(contact.address) && (
                <Grid.Column width={3} floated="right">
                    Address:
                    {contact.address}
                </Grid.Column>
              )}
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(contact.contactId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onContactDelete(contact.contactId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  renderButton() {
    return (
      <div>
        <Button>
          type="submit"
        >
          Create New Contact
        </Button>
      </div>
    )
  }
}