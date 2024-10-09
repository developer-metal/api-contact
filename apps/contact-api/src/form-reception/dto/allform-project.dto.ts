import {
  OmitType
} from '@nestjs/swagger';
import { FormProjectDto } from './create-project.dto';

export class FormProjecAllss extends OmitType(FormProjectDto, [
  'pocImage',
  'templateEmails'
] as const) {}
