import {
  PartialType
} from '@nestjs/swagger';
import { FormProjectDto } from './create-project.dto';

export class UpdateFormProjectDto extends PartialType(FormProjectDto) {}
