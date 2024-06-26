import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  ConflictException
} from '@nestjs/common';
import { PermissionsService } from '../services/permissions.service';
import { Permission as PermissionModel } from '@prisma/client';
import { Permission } from 'src/dtos/permission.dto';



@Controller('/integrations/permissions/')
export class PermissionController {
  constructor(private readonly permissionService: PermissionsService) { }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() permissionData: Permission): Promise<PermissionModel> {
    const { login } = permissionData;

    const existingPermission = await this.permissionService.findUnique({ login });
    if (existingPermission) {
      throw new ConflictException('A permission with the same login already exists');
    }

    return this.permissionService.create(permissionData);
  }
}