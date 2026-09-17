import { Controller, Param, Patch } from '@nestjs/common';

import { PublishingService } from './publishing.service.js';

@Controller('publishing')
export class PublishingController {
  constructor(private readonly publishingService: PublishingService) { }

  @Patch(':id')
  publish(@Param('id') id: string) {
    return this.publishingService.publish(Number(id));
  }
}