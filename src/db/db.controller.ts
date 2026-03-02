import { Controller, Post, UseGuards, HttpStatus } from '@nestjs/common';
import { DbService } from './db.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BaseResponse } from '../common/dto/base-response.dto';

@ApiTags('Database')
@Controller('db')
export class DbController {
  constructor(private readonly dbService: DbService) {}

  @Post('seed')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.ADMIN)
  // @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Run database seed script (Admin only)' })
  async seed() {
    const result = await this.dbService.seed();
    return new BaseResponse(
      HttpStatus.OK,
      'Base de données seedée avec succès',
      result,
    );
  }
}
