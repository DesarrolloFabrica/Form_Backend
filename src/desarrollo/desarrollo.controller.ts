import { Body, Controller, Get, ParseArrayPipe, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../users/user-role.enum';
import { CreateDesarrolloDto } from './dto/create-desarrollo.dto';
import { DesarrolloService } from './desarrollo.service';

interface AuthenticatedRequest extends Request {
  user: {
    sub: number;
    correo: string;
  };
}

@Controller('desarrollo')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.DESARROLLO)
export class DesarrolloController {
  constructor(private readonly desarrolloService: DesarrolloService) {}

  @Post()
  create(@Body() createDesarrolloDto: CreateDesarrolloDto, @Req() req: AuthenticatedRequest) {
    return this.desarrolloService.create(createDesarrolloDto, req.user.correo, req.user.sub);
  }

  @Post('bulk')
  createMany(
    @Body(new ParseArrayPipe({ items: CreateDesarrolloDto }))
    createDesarrolloDtos: CreateDesarrolloDto[],
    @Req() req: AuthenticatedRequest,
  ) {
    return this.desarrolloService.createMany(createDesarrolloDtos, req.user.correo, req.user.sub);
  }

  @Get()
  findAll() {
    return this.desarrolloService.findAll();
  }
}
