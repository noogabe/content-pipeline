import { Module } from '@nestjs/common';
import { ProcessingController } from './processing.controller.js';
import { ProcessingService } from './processing.service.js';

@Module({
  controllers: [ProcessingController],
  providers: [ProcessingService],
})
export class ProcessingModule {}
