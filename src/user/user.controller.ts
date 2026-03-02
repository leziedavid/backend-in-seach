import {
  Controller,
  Get,
  UseGuards,
  Request,
  Query,
  Patch,
  Body,
  Param,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/user.dto';
import { BaseResponse } from '../common/dto/base-response.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Request() req: any) {
    const user = await this.userService.findById(req.user.id);
    return new BaseResponse(HttpStatus.OK, 'Profil récupéré', user);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update current user profile' })
  async updateProfile(@Request() req: any, @Body() dto: UpdateUserDto) {
    const user = await this.userService.update(req.user.id, dto);
    return new BaseResponse(HttpStatus.OK, 'Profil mis à jour', user);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'List all users (Admin only)' })
  async findAll(@Query() query: any) {
    const users = await this.userService.findAll(query);
    return new BaseResponse(
      HttpStatus.OK,
      'Liste des utilisateurs récupérée',
      users,
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update user by ID (Admin only)' })
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const user = await this.userService.update(id, dto);
    return new BaseResponse(HttpStatus.OK, 'Utilisateur mis à jour', user);
  }
}
