import { randomUUID } from 'crypto';

export class Organization {
  constructor(
    readonly id: string = randomUUID(),
    readonly name: string,
  ) {}
}
