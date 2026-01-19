import { randomUUID } from 'crypto';

export class Organization {
  private constructor(
    private readonly id: string,
    private readonly createdAt: Date,
    private name: string,
  ) {}

  static create(props: { name: string }) {
    return new Organization(randomUUID(), new Date(), props.name);
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getCreatedAt() {
    return this.createdAt;
  }

  updateName(name: string) {
    this.name = name;
  }

  static fromPersistence(props: { id: string; name: string; createdAt: Date }) {
    return new Organization(props.id, props.createdAt, props.name);
  }
}
