import { AuthenticationError } from 'apollo-server-errors';
import { defaultFieldResolver } from 'graphql';
import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils';

import AuthorizationError from './AuthorizationError';

import validateScope from './validateScope';

export { default as validateScope } from './validateScope';

export default function authDirective(
  directiveName,
  AuthError = AuthenticationError,
  ScopeError = AuthorizationError,
) {
  const typeDirectiveArgumentMaps = {};

  return {
    authDirectiveTypeDefs: `directive @${directiveName}(scope: [String!]) on FIELD_DEFINITION`,
    authDirectiveTransformer: (schema) =>
      mapSchema(schema, {
        [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
          const authDirectiveDefinition =
            getDirective(schema, fieldConfig, directiveName)?.[0] ??
            typeDirectiveArgumentMaps[typeName];

          if (authDirectiveDefinition) {
            const { scope: requiredScope } = authDirectiveDefinition;

            if (requiredScope) {
              const { resolve = defaultFieldResolver } = fieldConfig;

              // eslint-disable-next-line no-param-reassign
              fieldConfig.resolve = (...args) => {
                const [, , { auth }] = args;

                // Kick out any not authenticated user
                if (!auth) throw new AuthError('UNAUTHENTICATED');

                // Kick out anyone with empty authentication
                if (!auth.isAuthenticated)
                  throw new AuthError('UNAUTHENTICATED');

                // Kick out anyone with empty authentication
                if (auth.isAuthenticated === false)
                  throw new AuthError('UNAUTHENTICATED');

                // Setting a required scope is optional
                if (requiredScope) {
                  if (!validateScope(requiredScope, auth.scope))
                    throw new ScopeError('INVALID_SCOPE', {
                      required: requiredScope,
                      provided: auth.scope,
                    });
                }

                return resolve(...args);
              };
            }
          }

          return fieldConfig;
        },
      }),
  };
}
