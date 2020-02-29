import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { DeleteContact } from '../../businessLogic/phonebook';
import { createLogger } from '../../utils/logger';

// logger
const logger = createLogger('deleteContact');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { contactId } = event.pathParameters;
  const authorization = event.headers.Authorization;
  const split = authorization.split(' ');
  const jwtToken = split[1];

  // log events
  logger.info('deleted contact with id: ', contactId);

  const deletedContact = await DeleteContact(contactId, jwtToken);


  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      deletedContact,
    }),
  };
};
