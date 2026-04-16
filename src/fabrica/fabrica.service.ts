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

  async create(createFabricaDto: CreateFabricaDto, actor: string, userId: number) {
    const fabrica = this.fabricaRepository.create({
      ...createFabricaDto,
      createdByUser: { id: userId },
    });
    const saved = await this.fabricaRepository.save(fabrica);
    await this.logsService.create(actor, 'CREA_FABRICA', {
      userId,
      targetTable: 'factory_requests',
      targetId: saved.id,
      payload: createFabricaDto as unknown as Record<string, unknown>,
    });
    return saved;
  }

  async createMany(createFabricaDtos: CreateFabricaDto[], actor: string, userId: number) {
    const fabricas = this.fabricaRepository.create(
      createFabricaDtos.map((fabrica) => ({
        ...fabrica,
        createdByUser: { id: userId },
      })),
    );
    const saved = await this.fabricaRepository.save(fabricas);
    await this.logsService.create(actor, `CREA_FABRICA_BULK:${saved.length}`, {
      userId,
      targetTable: 'factory_requests',
      payload: {
        count: saved.length,
        ids: saved.map((fabrica) => fabrica.id),
      },
    });
    return saved;
  }

  findAll() {
    return this.fabricaRepository.find({
      order: {
        id: 'DESC',
      },
    });
  }

  private formatDateOnly(value?: string): string {
    if (!value) {
      return '';
    }

    const parsedDate = new Date(value);
    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate.toISOString().slice(0, 10);
    }

    return value.slice(0, 10);
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

    const pageMargin = 40;
    const cardPadding = 14;
    const cardGap = 12;
    const cardWidth = doc.page.width - pageMargin * 2;
    const contentWidth = cardWidth - cardPadding * 2;
    const bottomLimit = doc.page.height - pageMargin;

    doc.fillColor('#0F172A').font('Helvetica-Bold').fontSize(20).text('Exportacion de solicitudes de fabrica', {
      align: 'center',
    });
    doc.moveDown(0.3);
    doc
      .fillColor('#64748B')
      .font('Helvetica')
      .fontSize(10)
      .text(`Generado el ${this.formatDateOnly(new Date().toISOString())}`, { align: 'center' });
    doc.moveDown(1.2);

    if (registros.length === 0) {
      doc
        .fillColor('#334155')
        .font('Helvetica')
        .fontSize(12)
        .text('No hay registros para exportar.', { align: 'center' });
      doc.end();
      return pdfBufferPromise;
    }

    registros.forEach((registro, index) => {
      const campos = [
        { label: 'Cantidad de modulos', value: String(registro.cantidadModulos ?? '-') },
        { label: 'Cantidad de granulos', value: String(registro.cantidadGranulos ?? '-') },
        { label: 'Materiales', value: registro.materiales ?? '-' },
        { label: 'Cantidad de materiales', value: String(registro.cantidadMateriales ?? '-') },
        { label: 'Fecha solicitud OT', value: this.formatDateOnly(registro.fechaSolicitudOt) || '-' },
        { label: 'Solicitante', value: registro.solicitante ?? '-' },
        { label: 'Fecha de entrega', value: this.formatDateOnly(registro.fechaEntrega) || '-' },
        { label: 'Escuela', value: registro.escuela ?? '-' },
        { label: 'Programa', value: registro.programa ?? '-' },
        { label: 'Estado', value: registro.estado ?? '-' },
      ];

      const requestType = registro.tipoRequisicion ?? '-';
      const requestTypeHeight = doc.heightOfString(requestType, {
        width: contentWidth,
        align: 'left',
      });
      const fieldsHeight = campos.reduce((acc, campo) => {
        const labelHeight = doc.heightOfString(campo.label, { width: contentWidth });
        const valueHeight = doc.heightOfString(campo.value, { width: contentWidth });
        return acc + labelHeight + valueHeight + 8;
      }, 0);
      const cardHeight = cardPadding * 2 + 18 + requestTypeHeight + 10 + fieldsHeight;

      if (doc.y + cardHeight > bottomLimit) {
        doc.addPage();
      }

      const cardX = pageMargin;
      const cardY = doc.y;
      doc.roundedRect(cardX, cardY, cardWidth, cardHeight, 8).fillAndStroke('#F8FAFC', '#CBD5E1');

      doc.x = cardX + cardPadding;
      doc.y = cardY + cardPadding;
      doc
        .fillColor('#475569')
        .font('Helvetica-Bold')
        .fontSize(10)
        .text(`Registro #${index + 1}`, { width: contentWidth });
      doc.moveDown(0.2);
      doc
        .fillColor('#0B3D91')
        .font('Helvetica-Bold')
        .fontSize(16)
        .text(requestType, { width: contentWidth });
      doc.moveDown(0.5);

      campos.forEach((campo) => {
        doc.fillColor('#1D4ED8').font('Helvetica-Bold').fontSize(9).text(campo.label, {
          width: contentWidth,
        });
        doc.fillColor('#111827').font('Helvetica').fontSize(11).text(campo.value, {
          width: contentWidth,
        });
        doc.moveDown(0.4);
      });

      doc.y = cardY + cardHeight + cardGap;
    });

    doc.end();
    return pdfBufferPromise;
  }
}
