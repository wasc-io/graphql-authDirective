import { GraphQLError } from 'graphql';

export default class AuthorizationError extends GraphQLError {
  constructor(message, extensions) {
    super(message, { ...extensions, code: 'UNAUTHORIZED' });

    Object.defineProperty(this, 'name', { value: 'AuthorizationError' });
  }
}
