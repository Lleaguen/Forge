import { Project } from '../entities/project.entity';

export interface ProjectRepository {
  create(project: Project): Promise<void>;
  findByOrganization(organizationId: string): Promise<Project[]>;
  findById(id: string): Promise<Project | null>;
  update(project: Project): Promise<void>;
  delete(id: string): Promise<void>;
}
