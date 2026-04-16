import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import PDFDocument = require('pdfkit');
import { Repository } from 'typeorm';
import { LogsService } from '../logs/logs.service';
import { CreateFabricaDto } from './dto/create-fabrica.dto';
import { Fabrica } from './fabrica.entity';

@Injectable()
export class FabricaService {
  constructor(
    @InjectRepository(Fabrica)
    private readonly fabricaRepository: Repository<Fabrica>,
    private readonly logsService: LogsService,
  ) {}

  async create(createFabricaDto: CreateFabricaDto, actor: string) {
    const fabrica = this.fabricaRepository.create(createFabricaDto);
    const saved = await this.fabricaRepository.save(fabrica);
    await this.logsService.create(actor, 'CREA_FABRICA');
    return saved;
  }

  async createMany(createFabricaDtos: CreateFabricaDto[], actor: string) {
    const fabricas = this.fabricaRepository.create(createFabricaDtos);
    const saved = await this.fabricaRepository.save(fabricas);
    await this.logsService.create(actor, `CREA_FABRICA_BULK:${saved.length}`);
    return saved;
  }

  findAll() {
    return this.fabricaRepository.find({
      order: {
        id: 'DESC',
      },
    });
  }

  async exportFactoryRequestsPdf() {
    const registros = await this.fabricaRepository.find({
      select: {
        tipoRequisicion: true,
        cantidadModulos: true,
        cantidadGranulos: true,
        materiales: true,
        cantidadMateriales: true,
        fechaSolicitudOt: true,
        solicitante: true,
        fechaEntrega: true,
        escuela: true,
        programa: true,
        estado: true,
      },
      order: {
        id: 'DESC',
      },
    });

    const doc = new PDFDocument({
      margin: 40,
      size: 'A4',
    });

    const chunks: Buffer[] = [];
    doc.on('data', (chunk: Buffer) => chunks.push(chunk));

    const pdfBufferPromise = new Promise<Buffer>((resolve, reject) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
    });

    doc.fontSize(16).text('Export Factory Requests', { align: 'center' });
    doc.moveDown();

    registros.forEach((registro, index) => {
      doc.fontSize(12).text(`Registro #${index + 1}`, { underline: true });
      doc.moveDown(0.3);
      doc.fontSize(10).text(`request_type: ${registro.tipoRequisicion ?? ''}`);
      doc.text(`module_count: ${registro.cantidadModulos ?? ''}`);
      doc.text(`granule_count: ${registro.cantidadGranulos ?? ''}`);
      doc.text(`materials: ${registro.materiales ?? ''}`);
      doc.text(`material_count: ${registro.cantidadMateriales ?? ''}`);
      doc.text(`work_order_request_date: ${registro.fechaSolicitudOt ?? ''}`);
      doc.text(`requester: ${registro.solicitante ?? ''}`);
      doc.text(`delivery_date: ${registro.fechaEntrega ?? ''}`);
      doc.text(`school: ${registro.escuela ?? ''}`);
      doc.text(`program: ${registro.programa ?? ''}`);
      doc.text(`status: ${registro.estado ?? ''}`);
      doc.moveDown();

      if (index < registros.length - 1) {
        doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke('#AAAAAA');
        doc.moveDown();
      }
    });

    doc.end();
    return pdfBufferPromise;
  }
}
