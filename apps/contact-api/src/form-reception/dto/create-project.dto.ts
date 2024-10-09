
import {
  ApiProperty,
  ApiPropertyOptional
} from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
  IsOptional,
  IsIn,
  IsObject,
  IsNumber,
  Min,
  Max,
  IsInt
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { SanitizeHtml } from '../validators/sanitizeHtml.constraint';
export class ValidEmail {
  @ApiPropertyOptional({ description: 'email del contacto', example: 'test@gmail.com', required: true })
  @IsOptional({ message: 'El email del contacto es opcional.' })
  @IsEmail({}, { message: 'El email del contacto debe ser un email válido.' })
  @SanitizeHtml({ message: 'HTML no permitido.'})
  name: string;
}
export class TemplateEmail {
  @ApiPropertyOptional({ description: 'Titulo Email cliente', example: '', required: true })
  @IsString({ message: 'Titulo cliente Requerido.' })
  @IsNotEmpty({ message: 'Titulo cliente Requerido.' })
  @SanitizeHtml({ message: 'HTML no permitido.'})
  @IsOptional({ message: 'Titulo cliente es opcional.' })
  titleClient: string;
  @ApiPropertyOptional({ description: 'Template cliente', example: '', required: true })
  @IsNotEmpty({ message: 'El template cliente es requerido.' })
  @IsString({ message: 'El template cliente debe ser un string.' })
  @SanitizeHtml({ message: 'HTML no permitido.'})
  @IsOptional({ message: 'El template cliente es opcional.' })
  messageTemplate: string;
  @ApiPropertyOptional({ description: 'Titulo Ejecutivo', example: '', required: true })
  @IsNotEmpty({ message: 'Titulo Ejecutivo Requerido.' })
  @IsString({ message: 'Titulo Ejecutivo Requerido.' })
  @SanitizeHtml({ message: 'HTML no permitido.'})
  @IsOptional({ message: 'Titulo Ejecutivo es opcional.' })
  titleExecutive: string;
  @ApiPropertyOptional({ description: 'Template ejecutivo', example: '', required: true })
  @IsNotEmpty({ message: 'El template ejecutivo es requerido.' })
  @IsString({ message: 'El template ejecutivo debe ser un string.'})
  @SanitizeHtml({ message: 'HTML no permitido.'})
  @IsOptional({ message: 'template ejecutivo es opcional.' })
  documentTemplate: string;
  @ApiPropertyOptional({ description: 'Correos Destinatarios (Ejecutivo) del proyecto', example: 'lespinos@transbank.cl,luis@transbank.cl', required: false})
  @IsArray({ message: 'Los correos destinatarios deben ser un array.' })
  @ValidateNested({ each: true })
  @ArrayNotEmpty({ message: 'Los correos destinatarios no pueden estar vacios.'})
  @IsOptional({ message: 'Los correos destinatarios son opcionales.' })
  @Type(() => ValidEmail)
  mailsTo: ValidEmail[];
}

export class AttachedData {
  @IsNotEmpty({ message: 'filename es requerido.' })
  @IsString({ message: 'filename debe ser un string.' })
  filename: string;
  @IsNotEmpty({ message: 'encoding es requerido.' })
  @IsString({ message: 'encoding debe ser un string.' })
  @IsIn(['pdf', 'csv', 'zip'], { message: 'tipo de archivo no permitido.' })
  typefile: string;
  @IsNotEmpty({ message: 'filecontent es requerido.' })
  @IsString({ message: 'filecontent debe ser un string.' })
  filecontent: string;
  @IsNotEmpty({ message: 'encoding es requerido.' })
  @IsString({ message: 'encoding debe ser un string.' })
  @IsIn(['base64'], { message: 'tipo de codificacion no permitido.' })
  encoding: string;
}
export class FormProjectDto {
  @ApiProperty({ description: 'Nombre del marca', example: 'PORI', required: false })
  @IsNotEmpty({ message: 'El nombre del marca es requerido.' })
  @IsString({ message: 'El nombre del marca debe ser un string.' })
  @SanitizeHtml({ message: 'HTML no permitido.'})
  slug: string; // marca
  @ApiProperty({ description: 'Nombre del Proyecto', example: 'HERMES', required: false })
  @IsNotEmpty({ message: 'El nombre del Proyecto es requerido.' })
  @IsString({ message: 'El nombre del Proyecto debe ser un string.' })
  @SanitizeHtml({ message: 'HTML no permitido.'})
  name: string;
  @ApiPropertyOptional({ description: 'Nombre del remitente', example: 'Transbank', required: false})
  @SanitizeHtml({ message: 'HTML no permitido.'})
  @IsOptional({ message: 'El nombre del remitente es opcional.' })
  sender?: string;
  @ApiPropertyOptional({ description: 'Maximo registro de formularios', example: 'Transbank', required: false})
  @IsOptional({ message: 'El max_form es opcional.' })
  @IsNumber({}, { message: 'El max_form debe ser un número.' })
  @IsNotEmpty({ message: 'El max_form es requerido.' })
  @IsInt({ message: 'El max_form debe ser un número entero.' })
  @Min(0, { message: 'El max_form debe ser mayor a 0.' })
  @Max(80, { message: 'El max_form debe ser menor a 80.' })
  max_form?: number;
  @ApiPropertyOptional({ description: 'Adjunto Imagen', example: 'Datos Adjunto Imagen', required: false })
  @IsNotEmpty({ message: 'El Archivo adjunto es requerido.' })
  @IsString({ message: 'El Archivo adjunto es requerido.' })
  @SanitizeHtml({ message: 'HTML no permitido.'})
  @IsOptional({ message: 'El pocImage es opcional.' })
  pocImage: Object;
  /**********************************template refactor************************************ */
  @ApiPropertyOptional({ description: 'Template Emails', required: false })
  @IsNotEmpty({ message: 'templateEmails template es requerido.' })
  @IsObject({ message: 'templateEmails debe ser un objecto.' })
  @IsOptional({ message: 'templateEmails es opcional.' })
  @ValidateNested({ each: true})
  @Type(() => TemplateEmail )
  templateEmails: TemplateEmail;
  /********************************************************************************** */
}

export class FormProjecAll {
  @ApiPropertyOptional({ description: 'Nombre del slug Proyecto', required: true })
  @IsNotEmpty({ message: 'Nombre del slug Proyecto es requerido.' })
  @IsString({ message: 'Nombre del slug Proyecto ser un string.' })
  @IsOptional({ message: 'Nombre del slug Proyecto es opcional.' })
  slug: string; // marca
  @ApiPropertyOptional({ description: 'Nombre del Proyecto', required: false})
  @IsNotEmpty({ message: 'El nombre del Proyecto es requerido.' })
  @IsString({ message: 'El nombre del Proyecto debe ser un string.' })
  @IsOptional({ message: 'El nombre del Proyecto es opcional.' })
  name: string;
  @ApiPropertyOptional({ description: 'Nombre del remitente', required: false })
  @IsOptional({ message: 'El nombre del remitente es opcional.' })
  @IsNotEmpty({ message: 'El nombre del remitente es requerido.' })
  @IsString({ message: 'El nombre del remitente debe ser un string.' })
  @IsEmail({}, { message: 'El nombre del remitente debe ser un email válido.' })
  sender: string;
}
export class updateDataProject { 
  @ApiPropertyOptional({ description: 'Nombre del slug Proyecto', example: 'PORI', required: false })
  @IsNotEmpty({ message: 'Nombre del slug Proyecto es requerido.' })
  @IsString({ message: 'Nombre del slug Proyecto ser un string.' })
  @IsOptional({ message: 'Nombre del slug Proyecto es opcional.' })
  slug: string; // marca
  @ApiPropertyOptional({ description: 'Nombre del Proyecto', example: 'HERMES', required: false })
  @IsNotEmpty({ message: 'El nombre del Proyecto es requerido.' })
  @IsString({ message: 'El nombre del Proyecto debe ser un string.' })
  @IsOptional({ message: 'El nombre del Proyecto es opcional.' })
  name: string;
  @ApiPropertyOptional({ description: 'Nombre del remitente', example: 'Transbank', required: false })
  @IsOptional({ message: 'El nombre del remitente es opcional.' })
  @IsNotEmpty({ message: 'El nombre del remitente es requerido.' })
  @IsString({ message: 'El nombre del remitente debe ser un string.' })
  @IsEmail({}, { message: 'El nombre del remitente debe ser un email válido.' })
  sender: string;
}