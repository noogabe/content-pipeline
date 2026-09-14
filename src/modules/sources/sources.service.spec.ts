import { Test, TestingModule } from '@nestjs/testing';
import { vi } from 'vitest';

import { PrismaService } from '../../common/prisma/prisma.service.js';
import { SourcesService } from './sources.service.js';
import { NotFoundException } from '@nestjs/common';

describe('SourcesService', () => {
  let service: SourcesService;

  const prismaMock = {
    source: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SourcesService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<SourcesService>(SourcesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all sources', async () => {
    const sources = [
      {
        id: 1,
        name: 'Diário do Nordeste',
        type: 'API',
        url: 'https://diariodonordeste.verdesmares.com.br',
        active: true,
      },
      {
        id: 2,
        name: 'Globo',
        type: 'API',
        url: 'https://globo.com',
        active: true,
      },
    ];

    prismaMock.source.findMany.mockResolvedValue(sources);

    const result = await service.findAll();

    expect(result).toEqual(sources);
    expect(prismaMock.source.findMany).toHaveBeenCalled();
  });

  it('should return a source by id', async () => {
    const source = {
      id: 1,
      name: 'Diário do Nordeste',
      type: 'API',
      url: 'https://diariodonordeste.verdesmares.com.br',
      active: true,
    };

    prismaMock.source.findUnique.mockResolvedValue(source);

    const result = await service.findOne(1);

    expect(result).toEqual(source);
    expect(prismaMock.source.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should throw NotFoundException when source does not exist', async () => {
    prismaMock.source.findUnique.mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);

    expect(prismaMock.source.findUnique).toHaveBeenCalledWith({
      where: { id: 999 },
    });
  });

  it('should create a source', async () => {
    const createSourceDto = {
      name: 'Folha de S.Paulo',
      type: 'API',
      url: 'https://www.folha.uol.com.br',
    };

    const createdSource = {
      id: 3,
      ...createSourceDto,
      active: true,
    };

    prismaMock.source.create.mockResolvedValue(createdSource);

    const result = await service.create(createSourceDto);

    expect(result).toEqual(createdSource);
    expect(prismaMock.source.create).toHaveBeenCalledWith({
      data: createSourceDto,
    });
  });

  it('should update a source', async () => {
    const updateSourceDto = {
      name: 'Diário do Nordeste API',
    };

    const source = {
      id: 1,
      name: 'Diário do Nordeste',
      type: 'API',
      url: 'https://diariodonordeste.verdesmares.com.br',
      active: true,
    };

    const updatedSource = {
      ...source,
      name: updateSourceDto.name,
    };

    prismaMock.source.findUnique.mockResolvedValue(source);
    prismaMock.source.update.mockResolvedValue(updatedSource);

    const result = await service.update(1, updateSourceDto);

    expect(result).toEqual(updatedSource);

    expect(prismaMock.source.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });

    expect(prismaMock.source.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: updateSourceDto,
    });
  });

  it('should throw NotFoundException when updating a source that does not exist', async () => {
    prismaMock.source.findUnique.mockResolvedValue(null);

    const updateSourceDto = {
      name: 'Nova fonte',
    };

    await expect(service.update(999, updateSourceDto)).rejects.toThrow(
      NotFoundException,
    );

    expect(prismaMock.source.findUnique).toHaveBeenCalledWith({
      where: { id: 999 },
    });

    expect(prismaMock.source.update).not.toHaveBeenCalled();
  });
});
