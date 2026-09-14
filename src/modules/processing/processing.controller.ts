import { Controller, Param, Patch } from '@nestjs/common';

import { ProcessingService } from './processing.service.js';

@Controller('processing')
export class ProcessingController {
  constructor(private readonly processingService: ProcessingService) {}

  @Patch(':id/start')
  startProcessing(@Param('id') id: string) {
    return this.processingService.startProcessing(Number(id));
  }

  @Patch(':id/finish')
  finishProcessing(@Param('id') id: string) {
    return this.processingService.finishProcessing(Number(id));
  }
}
