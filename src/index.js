import { SchemaDirectiveVisitor } from '@graphql-tools/utils';
import { AuthenticationError } from 'apollo-server-errors';
import { defaultFieldResolver } from 'graphql';
import AuthorizationError from './AuthorizationError';

import validateScope from './validateScope';

export default class AuthenticationDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    const { scope: requiredScope } = this.args;

    /* eslint-disable no-param-reassign */
    field.resolve = async function rslv(...args) {
      /* eslint-enable no-param-reassign */
      const [, , { auth }] = args;

      // Kick out any not authenticated user
      if (!auth) throw new AuthenticationError('UNAUTHENTICATED');

      // Kick out anyone with empty authentication
      if (!auth.isAuthenticated)
        throw new AuthenticationError('UNAUTHENTICATED');

      // Kick out anyone with empty authentication
      if (auth.isAuthenticated === false)
        throw new AuthenticationError('UNAUTHENTICATED');

      // Setting a required scope is optional
      if (requiredScope) {
        if (!validateScope(requiredScope, auth.scope))
          throw new AuthorizationError('INVALID_SCOPE', {
            required: requiredScope,
            provided: auth.scope,
          });
      }

      return resolve.apply(this, args);
    };
  }

  visitObject(object) {
    const { resolve = defaultFieldResolver } = object;
    const { scope: requiredScope } = this.args;

    /* eslint-disable no-param-reassign */
    object.resolve = async function rslv(...args) {
      /* eslint-enable no-param-reassign */
      const [, , { auth }] = args;

      // Kick out any not authenticated user
      if (!auth) throw new AuthenticationError('UNAUTHENTICATED');

      // Kick out anyone with empty authentication
      if (!auth.isAuthenticated)
        throw new AuthenticationError('UNAUTHENTICATED');

      // Kick out anyone with empty authentication
      if (auth.isAuthenticated === false)
        throw new AuthenticationError('UNAUTHENTICATED');

      // Setting a required scope is optional
      if (requiredScope) {
        if (!validateScope(requiredScope, auth.scope))
          throw new AuthorizationError('INVALID_SCOPE', {
            required: requiredScope,
            provided: auth.scope,
          });
      }

      return resolve.apply(this, args);
    };
  }
}
