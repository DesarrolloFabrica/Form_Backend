import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDesarrolloDto {
  @IsString()
  @IsNotEmpty()
  nombreProyecto: string;

  @IsDateString()
  fechaSolicitud: string;

  @IsDateString()
  fechaEntrega: string;

  @IsString()
  @IsNotEmpty()
  solicitante: string;

  @IsString()
  @IsNotEmpty()
  estado: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
