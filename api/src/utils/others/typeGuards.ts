export function isUserToken(user: any): user is Express.UserToken {
  return (
    user && typeof user.token === "string" && typeof user.user.id === "string"
  );
}

export function isNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value);
}
