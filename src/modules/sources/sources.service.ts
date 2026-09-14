import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../common/prisma/prisma.service.js';
import { CreateSourceDto } from './dto/create-source.dto.js';
import { UpdateSourceDto } from './dto/update-source.dto.js';

@Injectable()
export class SourcesService {
    constructor(private readonly prisma: PrismaService) { }

    findAll() {
        return this.prisma.source.findMany();
    }

    async findOne(id: number) {
        const source = await this.prisma.source.findUnique({
            where: { id },
        });

        if (!source) {
            throw new NotFoundException('Source not found');
        }

        return source;
    }

    create(createSourceDto: CreateSourceDto) {
        return this.prisma.source.create({
            data: createSourceDto,
        });
    }

    async update(id: number, updateSourceDto: UpdateSourceDto) {
        const source = await this.prisma.source.findUnique({
            where: { id },
        });

        if (!source) {
            throw new NotFoundException('Source not found');
        }

        return this.prisma.source.update({
            where: { id },
            data: updateSourceDto,
        });
    }
}