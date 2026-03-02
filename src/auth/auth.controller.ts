import { Controller, Post, Body, HttpCode, HttpStatus, Get, BadRequestException, Query, UseGuards, Req, Param, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiBearerAuth, } from '@nestjs/swagger';
import { BaseResponse } from '../common/dto/base-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SearchDto } from './dto/search.dto';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  async register(@Body() dto: RegisterDto) {
    const result = await this.authService.register(dto);
    return new BaseResponse(HttpStatus.CREATED, 'Utilisateur créé avec succès', result,);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  async login(@Body() dto: LoginDto) {
    const result = await this.authService.login(dto);
    return new BaseResponse(HttpStatus.OK, 'Connexion réussie', result);
  }

  /** --------------------- Reverse Geocoding --------------------- */
  @Get('reverse-geocode')
  @ApiOperation({ summary: 'Récupérer l’adresse depuis des coordonnées', description: 'Retourne une adresse complète via latitude et longitude.', })
  @ApiQuery({ name: 'lat', type: 'number', required: true, description: 'Latitude', })
  @ApiQuery({ name: 'lng', type: 'number', required: true, description: 'Longitude', })
  @ApiResponse({ status: 200, description: 'Adresse récupérée avec succès.', schema: { type: 'object' }, })
  async reverseGeocode(@Query('lat') lat: string, @Query('lng') lng: string,): Promise<any> {
    if (!lat || !lng) throw new BadRequestException('Latitude et longitude requises');
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const result = await this.authService.reverseGeocode(latitude, longitude);
    return new BaseResponse(HttpStatus.OK, 'Adresse récupérée avec succès', result,);
  }

  @Get('search')
  @ApiOperation({ summary: 'Global search (public)' })
  async globalSearch(@Query() search: SearchDto) {
    const result = await this.authService.getGlobalDataBySearch(search);
    return new BaseResponse(HttpStatus.OK, 'Recherche effectuée avec succès', result,);
  }

  @Get('my-space')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get current user global data (My Space)' })
  async getMySpace(@Req() req: any, @Query() search: SearchDto) {
    const result = await this.authService.getGlobalDataByUserId(req.user.id, search,);
    return new BaseResponse(HttpStatus.OK, 'Données de votre espace récupérées avec succès', result,);
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get user global data by ID (Admin only)' })
  async getUserData(@Param('userId') userId: string, @Query() search: SearchDto,) {
    const result = await this.authService.getGlobalDataByUserId(userId, search);
    return new BaseResponse(HttpStatus.OK, `Données de l'utilisateur récupérées avec succès`, result,);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get current user profile' })
  async getMe(@Req() req: any) {
    const result = await this.authService.getMe(req.user.id);
    return new BaseResponse(HttpStatus.OK, 'Profil récupéré avec succès', result,);
  }

  @Post('reconnect/:id')
  // @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Reconnect as another user (Simulation)' })
  async reconnect(@Param('id') id: string) {
    const result = await this.authService.reconnect(id);
    return new BaseResponse(HttpStatus.OK, 'Reconnexion réussie', result,);
  }
}
