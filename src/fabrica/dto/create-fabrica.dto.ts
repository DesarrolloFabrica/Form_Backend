import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  ValidateIf,
} from 'class-validator';

export class CreateFabricaDto {
  @IsString()
  @IsNotEmpty()
  tipoRequisicion: string;

  @IsInt()
  @Min(0)
  cantidadModulos: number;

  @IsInt()
  @Min(0)
  cantidadGranulos: number;

  @IsString()
  @IsNotEmpty()
  materiales: string;

  @IsInt()
  @Min(0)
  cantidadMateriales: number;

  @IsDateString()
  fechaSolicitudOt: string;

  @IsString()
  @IsNotEmpty()
  solicitante: string;

  @ValidateIf((o) => o.fechaEntrega != null && String(o.fechaEntrega).trim() !== '')
  @IsDateString()
  fechaEntrega?: string;

  @IsOptional()
  @IsString()
  entregaInsumo?: string;

  @IsOptional()
  @IsUrl()
  enlaceInsumo?: string;

  @IsString()
  @IsNotEmpty()
  tipoPaquete: string;

  @IsString()
  @IsNotEmpty()
  canalSolicitud: string;

  @IsString()
  @IsNotEmpty()
  estado: string;

  @IsString()
  @IsNotEmpty()
  tipoProgreso: string;

  @IsString()
  @IsNotEmpty()
  escuela: string;

  @IsString()
  @IsNotEmpty()
  programa: string;

  @IsString()
  @IsNotEmpty()
  modalidad: string;

  @IsInt()
  @Min(0)
  cantidadMaterias: number;
}
