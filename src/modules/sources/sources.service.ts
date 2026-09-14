import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../common/prisma/prisma.service.js';

@Injectable()
export class SourcesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.source.findMany();
  }
}