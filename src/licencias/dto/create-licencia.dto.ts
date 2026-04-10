import { IsDateString, IsEmail, IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class CreateLicenciaDto {
  @IsString()
  @IsNotEmpty()
  nombreLicencias: string;

  @IsEmail()
  correoVinculado: string;

  @IsDateString()
  fechaCompra: string;

  @IsDateString()
  fechaFinalizacion: string;

  @IsString()
  @IsNotEmpty()
  tipoLicencia: string;

  @IsString()
  @IsNotEmpty()
  coordinacion: string;

  @IsNumberString()
  costo: string;

  @IsString()
  @IsNotEmpty()
  moneda: string;
}
