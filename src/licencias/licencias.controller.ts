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
<<<<<<< HEAD
    return this.licenciasService.create(createLicenciaDto, {
      userId: req.user.sub,
      email: req.user.correo,
    });
=======
    return this.licenciasService.create(createLicenciaDto, req.user.correo, req.user.sub);
>>>>>>> c054de65574d98dbf938b4ca344090ad2c8f0c0c
  }

  @Post('bulk')
  createMany(
    @Body(new ParseArrayPipe({ items: CreateLicenciaDto }))
    createLicenciaDtos: CreateLicenciaDto[],
    @Req() req: AuthenticatedRequest,
  ) {
<<<<<<< HEAD
    return this.licenciasService.createMany(createLicenciaDtos, {
      userId: req.user.sub,
      email: req.user.correo,
    });
=======
    return this.licenciasService.createMany(createLicenciaDtos, req.user.correo, req.user.sub);
>>>>>>> c054de65574d98dbf938b4ca344090ad2c8f0c0c
  }

  @Get()
  findAll() {
    return this.licenciasService.findAll();
  }
}
