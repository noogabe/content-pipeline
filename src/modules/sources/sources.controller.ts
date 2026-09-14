import { Controller, Get, Post, Body } from '@nestjs/common';

import { SourcesService } from './sources.service.js';
import { CreateSourceDto } from './dto/create-source.dto.js';

@Controller('sources')
export class SourcesController {
  constructor(private readonly sourcesService: SourcesService) {}

  @Get()
  findAll() {
    return this.sourcesService.findAll();
  }

  @Post()
  create(@Body() createSourceDto: CreateSourceDto) {
    return this.sourcesService.create(createSourceDto);
  }
}