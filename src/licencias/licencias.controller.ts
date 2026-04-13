import { Body, Controller, Get, ParseArrayPipe, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../users/user-role.enum';
import { CreateLicenciaDto } from './dto/create-licencia.dto';
import { LicenciasService } from './licencias.service';

interface AuthenticatedRequest extends Request {
  user: {
    sub: number;
    correo: string;
  };
}

@Controller('licencias')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.FABRICA, UserRole.DESARROLLO)
export class LicenciasController {
  constructor(private readonly licenciasService: LicenciasService) {}

  @Post()
  create(@Body() createLicenciaDto: CreateLicenciaDto, @Req() req: AuthenticatedRequest) {
    return this.licenciasService.create(createLicenciaDto, {
      userId: req.user.sub,
      email: req.user.correo,
    });
  }

  @Post('bulk')
  createMany(
    @Body(new ParseArrayPipe({ items: CreateLicenciaDto }))
    createLicenciaDtos: CreateLicenciaDto[],
    @Req() req: AuthenticatedRequest,
  ) {
    return this.licenciasService.createMany(createLicenciaDtos, {
      userId: req.user.sub,
      email: req.user.correo,
    });
  }

  @Get()
  findAll() {
    return this.licenciasService.findAll();
  }
}
