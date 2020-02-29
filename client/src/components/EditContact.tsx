import * as React from 'react'
import { Form, Button } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { patchContact } from '../api/phonebook-api'

interface EditContactProps {
  match: {
    params: {
      contactId: string
    }
  }
  auth: Auth
}

interface EditContactState {
  formData: any
  uploadState: string
}

export class EditContact extends React.PureComponent<
  EditContactProps,
  EditContactState
> {
  state: EditContactState = {
    formData: {},
    uploadState: ''
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { formData } = this.state 
      const { name, value } = event.target

      formData[name] = value

      this.setState({ formData })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    const { formData } = this.state

    try {
      if (!formData) {
        alert('Please fill out the form to update contact')
        return
      }

      const contactId = this.props.match.params.contactId
      const idToken = this.props.auth.getIdToken()
      
      await patchContact(idToken, contactId, formData)

      this.setState({uploadState: `User ${contactId} has been updated!`})
    } catch (e) {
      const contactId = this.props.match.params.contactId
      this.setState({uploadState: `Could not update user ${contactId}! Error: ${e.message}`})
    } 
  }

  render() {
    return (
      <div>
        <h1>Edit Contact</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>Name</label>
            <input
              type="text"
              accept="name"
              placeholder="Edit user name"
              onChange={this.handleChange}
            />
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              placeholder="Edit user phone"
              onChange={this.handleChange}
            />
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Edit user email"
              onChange={this.handleChange}
            />
            <label>Address</label>
            <input
              type="text"
              name="address"
              placeholder="Edit user address"
              onChange={this.handleChange}
            />
          </Form.Field>

          {this.renderButton()}
        </Form>
      </div>
    )
  }

  renderButton() {
    const { uploadState } = this.state
    return (
      <div>
        {(uploadState.length > 0 ) && <p>{uploadState}</p>}
        <Button>
          type="submit"
        >
          Upload
        </Button>
      </div>
    )
  }
}