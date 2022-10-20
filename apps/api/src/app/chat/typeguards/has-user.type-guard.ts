export function hasUser(arg: unknown): arg is { user: { id: string } } {
  return Object.prototype.hasOwnProperty.call(arg, 'user');
}
