import { randomUUID } from 'crypto';

export class Project {
  private constructor(
    private readonly id: string,
    private readonly organizationId: string,
    private readonly createdAt: Date,
    private name: string,
    private description?: string,
  ) {}

  static create(props: {
    organizationId: string;
    name: string;
    description?: string;
  }) {
    return new Project(
      randomUUID(),
      props.organizationId,
      new Date(),
      props.name,
      props.description,
    );
  }

  getId() {
    return this.id;
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

  static fromPersistence(props: {
    id: string;
    organizationId: string;
    name: string;
    description?: string;
    createdAt: Date;
  }) {
    return new Project(
      props.id,
      props.organizationId,
      props.createdAt,
      props.name,
      props.description,
    );
  }
}
