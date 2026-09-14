import { Controller, Get } from '@nestjs/common';

import { SourcesService } from './sources.service.js';

@Controller('sources')
export class SourcesController {
  constructor(private readonly sourcesService: SourcesService) {}

  @Get()
  findAll() {
    return this.sourcesService.findAll();
  }
}