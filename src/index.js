/* eslint-disable react/destructuring-assignment */

import { SchemaDirectiveVisitor } from 'graphql-tools';
import { AuthenticationError } from 'apollo-server-errors';
import AuthorizationError from './AuthorizationError';
import graphql from 'graphql';

import validateScope from './validateScope';

export default class AuthenticationDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { defaultFieldResolver } = graphql;
    const { resolve = defaultFieldResolver } = field;
    const { scope: requiredScope } = this.args;

    /* eslint-disable no-param-reassign */
    field.resolve = async function rslv(...args) {
      /* eslint-enable no-param-reassign */
      const [, , { auth }] = args;

      // Kick out any not authenticated user
      if (!auth) throw new AuthenticationError('UNAUTHENTICATED');

      // Kick out anyone with empty authentication
      if (!auth.isAuthenticated) throw new AuthenticationError('UNAUTHENTICATED');

      // Kick out anyone with empty authentication
      if (auth.isAuthenticated === false) throw new AuthenticationError('UNAUTHENTICATED');

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
