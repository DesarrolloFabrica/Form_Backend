import { Body, Controller, Get, ParseArrayPipe, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../users/user-role.enum';
import { CreateFabricaDto } from './dto/create-fabrica.dto';
import { FabricaService } from './fabrica.service';

interface AuthenticatedRequest extends Request {
  user: {
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
    return this.fabricaService.create(createFabricaDto, req.user.correo);
  }

  @Post('bulk')
  createMany(
    @Body(new ParseArrayPipe({ items: CreateFabricaDto }))
    createFabricaDtos: CreateFabricaDto[],
    @Req() req: AuthenticatedRequest,
  ) {
    return this.fabricaService.createMany(createFabricaDtos, req.user.correo);
  }

  @Get()
  findAll() {
    return this.fabricaService.findAll();
  }

  @Get('export/pdf')
  async exportPdf(@Res() res: Response) {
    const pdfBuffer = await this.fabricaService.exportFactoryRequestsPdf();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="factory_requests.pdf"');
    return res.send(pdfBuffer);
  }
}
