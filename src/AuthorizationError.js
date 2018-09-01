import { ApolloError } from 'apollo-server-errors';

export default class AuthorizationError extends ApolloError {
  constructor(message, properties) {
    super(message, 'UNAUTHORIZED', properties);
  }
}
