import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import PDFDocument = require('pdfkit');
import { Repository } from 'typeorm';
import { LogsService } from '../logs/logs.service';
import { CreateFabricaDto } from './dto/create-fabrica.dto';
import { Fabrica } from './fabrica.entity';

type FabricaPdfRecord = Pick<
  Fabrica,
  | 'tipoRequisicion'
  | 'cantidadModulos'
  | 'cantidadGranulos'
  | 'materiales'
  | 'cantidadMateriales'
  | 'fechaSolicitudOt'
  | 'solicitante'
  | 'fechaEntrega'
  | 'escuela'
  | 'programa'
  | 'estado'
>;

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

  private formatDateForDisplay(value?: string): string {
    return this.formatDateOnly(value) || '-';
  }

  private buildCardLines(record: FabricaPdfRecord, index: number): string[] {
    return [
      `Registro #${index + 1}`,
      `Tipo de solicitud: ${record.tipoRequisicion || '-'}`,
      `Solicitante: ${record.solicitante || '-'}`,
      `Estado: ${record.estado || '-'}`,
      `Escuela: ${record.escuela || '-'}`,
      `Programa: ${record.programa || '-'}`,
      `Materiales: ${record.materiales || '-'}`,
      `Cantidad modulos: ${record.cantidadModulos ?? 0}`,
      `Cantidad granulos: ${record.cantidadGranulos ?? 0}`,
      `Cantidad materiales: ${record.cantidadMateriales ?? 0}`,
      `Fecha solicitud OT: ${this.formatDateForDisplay(record.fechaSolicitudOt)}`,
      `Fecha entrega: ${this.formatDateForDisplay(record.fechaEntrega)}`,
    ];
  }

  private measureCardHeight(doc: any, lines: string[], textWidth: number): number {
    const topPadding = 8;
    const bottomPadding = 8;
    const lineGap = 2;

    let height = topPadding + bottomPadding;
    lines.forEach((line, idx) => {
      doc.font(idx === 0 ? 'Helvetica-Bold' : 'Helvetica').fontSize(idx === 0 ? 9.5 : 8.2);
      height += doc.heightOfString(line, { width: textWidth, lineGap });
      if (idx < lines.length - 1) {
        height += 2;
      }
    });

    return height;
  }

  private drawCard(doc: any, x: number, y: number, width: number, lines: string[]): void {
    const textX = x + 8;
    const textWidth = width - 16;
    const lineGap = 2;
    let currentY = y + 8;

    lines.forEach((line, idx) => {
      doc
        .fillColor(idx === 0 ? '#0b3d91' : '#334155')
        .font(idx === 0 ? 'Helvetica-Bold' : 'Helvetica')
        .fontSize(idx === 0 ? 9.5 : 8.2);

      const lineHeight = doc.heightOfString(line, { width: textWidth, lineGap });
      doc.text(line, textX, currentY, { width: textWidth, lineGap });
      currentY += lineHeight + 2;
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

    const records = registros as FabricaPdfRecord[];

    const doc = new PDFDocument({ margin: 28, size: 'A4' });
    const chunks: Buffer[] = [];
    doc.on('data', (chunk: Buffer) => chunks.push(chunk));

    const pdfBufferPromise = new Promise<Buffer>((resolve, reject) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
    });

    const margin = 28;
    const gap = 10;
    const pageWidth = doc.page.width - margin * 2;
    const cardWidth = (pageWidth - gap) / 2;
    const maxY = doc.page.height - margin;

    doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(18).text('Exportacion de solicitudes de fabrica');
    doc
      .moveDown(0.2)
      .fillColor('#64748b')
      .font('Helvetica')
      .fontSize(9)
      .text(`Total registros: ${records.length}  |  Generado: ${this.formatDateForDisplay(new Date().toISOString())}`);
    doc.moveDown(0.6);

    let cursorY = doc.y;

    if (records.length === 0) {
      doc.fillColor('#334155').fontSize(11).text('No hay registros para exportar.');
      doc.end();
      return pdfBufferPromise;
    }

    for (let i = 0; i < records.length; i += 2) {
      const left = records[i];
      const right = records[i + 1];
      const leftLines = this.buildCardLines(left, i);
      const rightLines = right ? this.buildCardLines(right, i + 1) : [];

      const leftHeight = this.measureCardHeight(doc, leftLines, cardWidth - 16);
      const rightHeight = right ? this.measureCardHeight(doc, rightLines, cardWidth - 16) : 0;
      const rowHeight = Math.max(leftHeight, rightHeight);

      if (cursorY + rowHeight > maxY) {
        doc.addPage();
        cursorY = margin;
      }

      doc.roundedRect(margin, cursorY, cardWidth, rowHeight, 6).fillAndStroke('#f8fafc', '#cbd5e1');
      this.drawCard(doc, margin, cursorY, cardWidth, leftLines);

      if (right) {
        const rightX = margin + cardWidth + gap;
        doc.roundedRect(rightX, cursorY, cardWidth, rowHeight, 6).fillAndStroke('#f8fafc', '#cbd5e1');
        this.drawCard(doc, rightX, cursorY, cardWidth, rightLines);
      }

      cursorY += rowHeight + gap;
    }

    doc.end();
    return pdfBufferPromise;
  }
}
