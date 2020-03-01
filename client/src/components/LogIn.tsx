import * as React from 'react'
import Auth from '../auth/Auth'
import { Button, Segment, Header } from 'semantic-ui-react'

interface LogInProps {
  auth: Auth
}

interface LogInState {}

export class LogIn extends React.PureComponent<LogInProps, LogInState> {
  onLogin = () => {
    this.props.auth.login()
  }

  render() {
    return (
      <div>
        <Segment placeholder>
          <Header icon>
            <h1>Personal Phone Book</h1>
          </Header>
          <Segment.Inline>
            <Button onClick={this.onLogin} size="huge" color="olive">
              Log in
            </Button>
          </Segment.Inline>
        </Segment>
      </div>
    )
  }
}