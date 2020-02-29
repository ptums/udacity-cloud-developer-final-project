const apiId = 'ecnvsszk60';
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`;

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-39w-y5ot.auth0.com', // Auth0 domain
  clientId: '3J2sMKJU7nHN11Nws6W5f8sAzK5d6ARf', // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback',
};
