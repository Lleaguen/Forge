import { randomUUID } from 'crypto';

export class Task {
  private constructor(
    private readonly id: string,
    private readonly projectId: string,
    private readonly createdAt: Date,
    private title: string,
    private status: string,
  ) {}

  static create(props: { projectId: string; title: string; status?: string }) {
    return new Task(
      randomUUID(),
      props.projectId,
      new Date(),
      props.title,
      props.status || 'TODO',
    );
  }

  getId() {
    return this.id;
  }

  getProjectId() {
    return this.projectId;
  }

  getTitle() {
    return this.title;
  }

  getStatus() {
    return this.status;
  }

  getCreatedAt() {
    return this.createdAt;
  }

  updateTitle(title: string) {
    this.title = title;
  }

  updateStatus(status: string) {
    this.status = status;
  }

  static fromPersistence(props: {
    id: string;
    projectId: string;
    title: string;
    status: string;
    createdAt: Date;
  }) {
    return new Task(
      props.id,
      props.projectId,
      props.createdAt,
      props.title,
      props.status,
    );
  }
}
