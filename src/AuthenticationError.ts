import { GraphQLError, GraphQLErrorExtensions } from 'graphql';

export default class AuthorizationError extends GraphQLError {
  constructor(message: string, extensions: GraphQLErrorExtensions = {}) {
    super(message, null, null, null, null, null, {
      ...extensions,
      code: 'UNAUTHENTICATED',
    });

    Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
  }
}
