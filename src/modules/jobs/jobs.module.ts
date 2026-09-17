import { Module } from '@nestjs/common';

import { ProcessingModule } from '../processing/processing.module.js';
import { JobsService } from './jobs.service.js';
import { PublishingModule } from '../publishing/publishing.module.js';

@Module({
  imports: [ProcessingModule, PublishingModule],
  providers: [JobsService],
})
export class JobsModule {}
