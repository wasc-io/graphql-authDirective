import { GraphQLError } from 'graphql';

export default class AuthenticationError extends GraphQLError {
  constructor(message, extensions) {
    super(message, { ...extensions, code: 'UNAUTHENTICATED' });

    Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
  }
}
