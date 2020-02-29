import React from 'react';
import { Router, Route } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import Auth from './auth/Auth';
import Callback from './components/Callback';
import App from './App';

const history = createHistory();

const auth = new Auth(history);

const handleAuthentication = (props: any) => {
  const { location } = props;
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication();
  }
};

export const makeAuthRouting = () => (
  <Router history={history}>
    <div>
      <Route
        path="/callback"
        render={(props) => {
          handleAuthentication(props);
          return <Callback />;
        }}
      />
      <Route
        render={(props) => <App auth={auth} {...props} />}
      />
    </div>
  </Router>
);
