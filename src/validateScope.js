export default function validateScope(required, provided) {
  let hasScope = false;

  required.forEach(scope => {
    provided.forEach(perm => {
      // user:* -> user:create, user:view:self
      const permRe = new RegExp(`^${perm.replace('*', '.*')}$`);
      if (permRe.exec(scope)) hasScope = true;
    });
  });

  return hasScope;
}
