import { IsBoolean, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

import { CreateSourceDto } from './create-source.dto.js';

export class UpdateSourceDto extends PartialType(CreateSourceDto) {
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
