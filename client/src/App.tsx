import React, { Component } from 'react';
import {
  Link, Route, Router, Switch,
} from 'react-router-dom';
import { Grid, Menu, Segment } from 'semantic-ui-react';

import Auth from './auth/Auth';
import { EditContact } from './components/EditContact';
import { LogIn } from './components/LogIn';
import { NotFound } from './components/NotFound';
import { PhoneBook } from './components/PhoneBook';

export interface AppProps {}

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState {}

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogin() {
    this.props.auth.login();
  }

  handleLogout() {
    this.props.auth.logout();
  }

  render() {
    return (
      <div>
        <Segment style={{ padding: '8em 0em' }} vertical>
          <Grid container stackable verticalAlign="middle">
            <Grid.Row>
              <Grid.Column>
                <Router history={this.props.history}>
                  {this.generateMenu()}
                  {this.generateCurrentPage()}
                </Router>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </div>
    );
  }

  generateMenu() {
    return (
      <Menu secondary>
        <Menu.Item name="home">
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Menu>
          {this.logInLogOutButton()}
        </Menu.Menu>
      </Menu>
    );
  }

  logInLogOutButton() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <Menu.Item name="logout" onClick={this.handleLogout}>
          Log Out
        </Menu.Item>
      );
    }
    return (
      <Menu.Item name="login" onClick={this.handleLogin}>
        Log In
      </Menu.Item>
    );
  }

  generateCurrentPage() {
    if (!this.props.auth.isAuthenticated()) {
      return <LogIn auth={this.props.auth} />;
    }

    return (
      <Switch>
        <Route
          path="/"
          exact
          render={(props) => <PhoneBook {...props} auth={this.props.auth} />}
        />
        <Route
          path="/phonebook/:contactId/edit"
          exact
          render={(props) => <EditContact {...props} auth={this.props.auth} />}
        />

        <Route component={NotFound} />
      </Switch>
    );
  }
}
