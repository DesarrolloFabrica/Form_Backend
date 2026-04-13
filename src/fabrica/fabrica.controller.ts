import { Body, Controller, Get, ParseArrayPipe, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../users/user-role.enum';
import { CreateFabricaDto } from './dto/create-fabrica.dto';
import { FabricaService } from './fabrica.service';

interface AuthenticatedRequest extends Request {
  user: {
    sub: number;
    correo: string;
  };
}

@Controller('fabrica')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.FABRICA)
export class FabricaController {
  constructor(private readonly fabricaService: FabricaService) {}

  @Post()
  create(@Body() createFabricaDto: CreateFabricaDto, @Req() req: AuthenticatedRequest) {
<<<<<<< HEAD
    return this.fabricaService.create(createFabricaDto, {
      userId: req.user.sub,
      email: req.user.correo,
    });
=======
    return this.fabricaService.create(createFabricaDto, req.user.correo, req.user.sub);
>>>>>>> c054de65574d98dbf938b4ca344090ad2c8f0c0c
  }

  @Post('bulk')
  createMany(
    @Body(new ParseArrayPipe({ items: CreateFabricaDto }))
    createFabricaDtos: CreateFabricaDto[],
    @Req() req: AuthenticatedRequest,
  ) {
<<<<<<< HEAD
    return this.fabricaService.createMany(createFabricaDtos, {
      userId: req.user.sub,
      email: req.user.correo,
    });
=======
    return this.fabricaService.createMany(createFabricaDtos, req.user.correo, req.user.sub);
>>>>>>> c054de65574d98dbf938b4ca344090ad2c8f0c0c
  }

  @Get()
  findAll() {
    return this.fabricaService.findAll();
  }
}
