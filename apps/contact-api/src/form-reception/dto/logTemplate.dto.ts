import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty,IsBase64 } from 'class-validator';
export class LogTemplateEmailDto {
  @ApiProperty({description: 'template email', required: true })
  @IsNotEmpty({ message: 'El template es requerido.' })  
  @IsBase64()
  template_email: string;
}
