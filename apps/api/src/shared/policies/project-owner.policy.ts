export class ProjectOwnerPolicy {
  can(ctx: { userId: string; ownerId: string }): boolean {
    return ctx.userId === ctx.ownerId;
  }
}
