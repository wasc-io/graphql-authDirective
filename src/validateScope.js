export default function validateScope(required, provided) {
  const hasRequired = [];

  required.forEach(scope => {
    hasRequired.push(
      provided.some(perm => {
        // user:* -> user:create, user:view:self
        const permRe = new RegExp(`^${perm.replace("*", ".*")}$`);

        return permRe.exec(scope);
      })
    );
  });

  return !hasRequired.includes(false);
}
