export class SamePlayerError extends Error {
  constructor() {
    super('Players must be different')
  }
}
