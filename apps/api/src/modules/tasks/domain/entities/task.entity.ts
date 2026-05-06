import { DomainError } from '@/shared/errors/domain.error'

export enum TaskCategory {
  DEVELOPMENT = 'DEVELOPMENT',
  DESIGN = 'DESIGN',
  ARCHITECTURE = 'ARCHITECTURE',
  TESTING = 'TESTING',
  DOCUMENTATION = 'DOCUMENTATION',
  RESEARCH = 'RESEARCH',
  DEPLOYMENT = 'DEPLOYMENT',
  MAINTENANCE = 'MAINTENANCE',
  PLANNING = 'PLANNING',
  REVIEW = 'REVIEW',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
  CRITICAL = 'CRITICAL',
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  IN_REVIEW = 'IN_REVIEW',
  BLOCKED = 'BLOCKED',
  DONE = 'DONE',
  CANCELLED = 'CANCELLED',
}

export interface TaskProps {
  id: string
  projectId: string
  title: string
  description?: string
  category: TaskCategory
  priority: TaskPriority
  status: TaskStatus
  assigneeId?: string
  createdById: string
  estimatedHours?: number
  actualHours: number
  dueDate?: Date
  startedAt?: Date
  completedAt?: Date
  tags: string[]
  position: number
  createdAt: Date
  updatedAt: Date
}

export class Task {
  private constructor(private props: TaskProps) {
    this.validate()
  }

  static create(props: Omit<TaskProps, 'id' | 'createdAt' | 'updatedAt' | 'actualHours' | 'position'>): Task {
    return new Task({
      ...props,
      id: crypto.randomUUID(),
      actualHours: 0,
      position: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  static fromPersistence(props: TaskProps): Task {
    return new Task(props)
  }

  private validate(): void {
    if (!this.props.title || this.props.title.trim().length === 0) {
      throw new DomainError('Task title is required')
    }
    
    if (this.props.title.length > 200) {
      throw new DomainError('Task title cannot exceed 200 characters')
    }

    if (this.props.description && this.props.description.length > 2000) {
      throw new DomainError('Task description cannot exceed 2000 characters')
    }

    if (this.props.estimatedHours && this.props.estimatedHours < 0) {
      throw new DomainError('Estimated hours cannot be negative')
    }

    if (this.props.actualHours < 0) {
      throw new DomainError('Actual hours cannot be negative')
    }
  }

  // Getters
  get id(): string { return this.props.id }
  get projectId(): string { return this.props.projectId }
  get title(): string { return this.props.title }
  get description(): string | undefined { return this.props.description }
  get category(): TaskCategory { return this.props.category }
  get priority(): TaskPriority { return this.props.priority }
  get status(): TaskStatus { return this.props.status }
  get assigneeId(): string | undefined { return this.props.assigneeId }
  get createdById(): string { return this.props.createdById }
  get estimatedHours(): number | undefined { return this.props.estimatedHours }
  get actualHours(): number { return this.props.actualHours }
  get dueDate(): Date | undefined { return this.props.dueDate }
  get startedAt(): Date | undefined { return this.props.startedAt }
  get completedAt(): Date | undefined { return this.props.completedAt }
  get tags(): string[] { return this.props.tags }
  get position(): number { return this.props.position }
  get createdAt(): Date { return this.props.createdAt }
  get updatedAt(): Date { return this.props.updatedAt }

  // Business methods
  updateStatus(newStatus: TaskStatus): void {
    this.props.status = newStatus
    this.props.updatedAt = new Date()
    
    if (newStatus === TaskStatus.IN_PROGRESS && !this.props.startedAt) {
      this.props.startedAt = new Date()
    }
    
    if (newStatus === TaskStatus.DONE && !this.props.completedAt) {
      this.props.completedAt = new Date()
    }
    
    if (newStatus !== TaskStatus.DONE) {
      this.props.completedAt = undefined
    }
  }

  assignTo(userId: string): void {
    this.props.assigneeId = userId
    this.props.updatedAt = new Date()
  }

  unassign(): void {
    this.props.assigneeId = undefined
    this.props.updatedAt = new Date()
  }

  addTimeSpent(hours: number): void {
    if (hours < 0) {
      throw new DomainError('Hours cannot be negative')
    }
    
    this.props.actualHours += hours
    this.props.updatedAt = new Date()
  }

  updatePriority(newPriority: TaskPriority): void {
    this.props.priority = newPriority
    this.props.updatedAt = new Date()
  }

  addTag(tag: string): void {
    const normalizedTag = tag.trim().toLowerCase()
    if (normalizedTag && !this.props.tags.includes(normalizedTag)) {
      this.props.tags.push(normalizedTag)
      this.props.updatedAt = new Date()
    }
  }

  removeTag(tag: string): void {
    const normalizedTag = tag.trim().toLowerCase()
    this.props.tags = this.props.tags.filter(t => t !== normalizedTag)
    this.props.updatedAt = new Date()
  }

  isOverdue(): boolean {
    return this.props.dueDate ? 
      this.props.dueDate < new Date() && this.props.status !== TaskStatus.DONE : 
      false
  }

  isHighPriority(): boolean {
    return [TaskPriority.HIGH, TaskPriority.URGENT, TaskPriority.CRITICAL].includes(this.props.priority)
  }

  toPrimitives(): TaskProps {
    return { ...this.props }
  }
}