export interface Policy<T> {
  can(ctx: T): boolean;
}
