import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { createLogger } from '../../utils/logger';
import { GetSingleContact } from '../../businessLogic/phonebook';

// logger
const logger = createLogger('getsinglecontacts');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event);

  const { contactId } = event.pathParameters;
  const authorization = event.headers.Authorization;
  const split = authorization.split(' ');
  const jwtToken = split[1];

  logger.info('get a single contact from user\'s phoneboook');

  const items = await GetSingleContact(contactId, jwtToken);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      items: items[0],
    }),
  };
};
