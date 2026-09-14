import { Module } from '@nestjs/common';

import { ProcessingModule } from '../processing/processing.module.js';
import { JobsService } from './jobs.service.js';

@Module({
  imports: [ProcessingModule],
  providers: [JobsService],
})
export class JobsModule {}