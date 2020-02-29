import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import { CreateContactRequest } from '../../requests/CreateContactRequest';
import { CreateContact } from '../../businessLogic/phonebook';
import { createLogger } from '../../utils/logger';

// logger
const logger = createLogger('createContact');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newContact: CreateContactRequest = JSON.parse(event.body);
  const authorization = event.headers.Authorization;
  const split = authorization.split(' ');
  const jwtToken = split[1];

  // log events
  logger.info('new contact: ', newContact);

  const item = await CreateContact(newContact, jwtToken);

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      item,
    }),
  };
};
