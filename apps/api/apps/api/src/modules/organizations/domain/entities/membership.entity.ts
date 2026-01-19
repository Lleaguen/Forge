export class Membership {
  constructor(
    readonly userId: string,
    readonly organizationId: string,
    readonly role: string,
  ) {}
}
