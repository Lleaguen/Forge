import {
  Body,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { BaseCrudService, BaseEntity, UserContext, ApiResponse } from '../services/base-crud.service';

export abstract class BaseCrudController<T extends BaseEntity> {
  constructor(protected readonly service: BaseCrudService<T>) {}

  @Post()
  async create(@Body() createDto: any, @Request() req: any) {
    const userContext: UserContext = {
      sub: req.user.sub,
      organizationId: req.user.organizationId
    };

    const entity = await this.service.createWithUser(createDto, userContext);
    return ApiResponse.success(entity);
  }

  @Get()
  async findAll(@Request() req: any) {
    const userContext: UserContext = {
      sub: req.user.sub,
      organizationId: req.user.organizationId
    };

    const entities = await this.service.findManyWithAccess(userContext);
    return ApiResponse.success(entities);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    const userContext: UserContext = {
      sub: req.user.sub,
      organizationId: req.user.organizationId
    };

    const entity = await this.service.findByIdWithAccess(id, userContext);
    return ApiResponse.success(entity);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: any,
    @Request() req: any
  ) {
    const userContext: UserContext = {
      sub: req.user.sub,
      organizationId: req.user.organizationId
    };

    const entity = await this.service.updateWithAccess(id, updateDto, userContext);
    return ApiResponse.success(entity);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    const userContext: UserContext = {
      sub: req.user.sub,
      organizationId: req.user.organizationId
    };

    await this.service.deleteWithAccess(id, userContext);
    return ApiResponse.success(null, 'Entity deleted successfully');
  }
}