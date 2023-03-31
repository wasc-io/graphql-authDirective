import { GraphQLError, GraphQLErrorExtensions } from 'graphql';

export default class AuthorizationError extends GraphQLError {
  constructor(message: string, extensions: GraphQLErrorExtensions = {}) {
    super(message, null, null, null, null, null, {
      ...extensions,
      code: 'UNAUTHORIZED',
    });

    Object.defineProperty(this, 'name', { value: 'AuthorizationError' });
  }
}
