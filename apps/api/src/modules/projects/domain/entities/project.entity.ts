import { randomUUID } from 'crypto';

export class Project {
  private constructor(
    private readonly id: string,
    private readonly userId: string,
    private readonly createdAt: Date,
    private name: string,
    private description?: string,
    private readonly organizationId?: string,
  ) {}

  static create(props: {
    userId: string;
    name: string;
    description?: string;
    organizationId?: string;
  }) {
    return new Project(
      randomUUID(),
      props.userId,
      new Date(),
      props.name,
      props.description,
      props.organizationId,
    );
  }

  static fromPersistence(props: {
    id: string;
    userId: string;
    name: string;
    description?: string;
    organizationId?: string;
    createdAt: Date;
  }) {
    return new Project(
      props.id,
      props.userId,
      props.createdAt,
      props.name,
      props.description,
      props.organizationId,
    );
  }

  getId() {
    return this.id;
  }

  getUserId() {
    return this.userId;
  }

  getOrganizationId() {
    return this.organizationId;
  }

  getName() {
    return this.name;
  }

  getDescription() {
    return this.description;
  }

  getCreatedAt() {
    return this.createdAt;
  }

  updateName(name: string) {
    this.name = name;
  }

  updateDescription(description?: string) {
    this.description = description;
  }
}
