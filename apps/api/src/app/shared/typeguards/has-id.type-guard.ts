export function hasId(arg: unknown): arg is { id: string } {
  if (arg) return Object.prototype.hasOwnProperty.call(arg, 'id');
}
