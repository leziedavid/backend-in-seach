import { Controller, Get, Query, UseGuards, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { LogsService } from './logs.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { BaseResponse } from 'src/common/dto/base-response.dto';
import { HttpStatus } from '@nestjs/common';

@ApiTags('Admin Logs')
@ApiBearerAuth('access-token')
// @UseGuards(JwtAuthGuard, AdminGuard)
@UseGuards(JwtAuthGuard)
@Controller('admin/logs')
export class LogsController {
    constructor(private readonly logsService: LogsService) { }

    @Get()
    @ApiOperation({ summary: 'Get logs with filtering and pagination' })
    @ApiQuery({ name: 'startDate', required: false, description: 'Format: YYYY-MM-DD' })
    @ApiQuery({ name: 'endDate', required: false, description: 'Format: YYYY-MM-DD' })
    @ApiQuery({ name: 'level', required: false, enum: ['info', 'warn', 'error'] })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    async getLogs(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('level') level?: string,
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10',
    ) {
        const result = await this.logsService.getLogs(startDate, endDate, level, parseInt(page), parseInt(limit));
        return new BaseResponse(HttpStatus.OK, 'Logs récupérés', result);
    }

    @Delete()
    @ApiOperation({ summary: 'Delete multiple log files by date' })
    @ApiQuery({ name: 'dates', required: true, type: [String], description: 'Array of dates (YYYY-MM-DD) to delete' })
    async deleteLogs(@Query('dates') dates: string | string[]) {
        const datesArray = Array.isArray(dates) ? dates : [dates];
        const result = await this.logsService.deleteLogs(datesArray);
        return new BaseResponse(HttpStatus.OK, 'Logs supprimés', result);
    }

    @Get('files')
    @ApiOperation({ summary: 'Get list of available log file dates' })
    async getLogFiles() {
        const result = await this.logsService.getLogFiles();
        return new BaseResponse(HttpStatus.OK, 'Dates des logs récupérées', result);
    }
}
