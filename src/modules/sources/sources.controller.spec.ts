import { Test, TestingModule } from '@nestjs/testing';
import { vi } from 'vitest';

import { SourcesController } from './sources.controller.js';
import { SourcesService } from './sources.service.js';

describe('SourcesController', () => {
  let controller: SourcesController;

  const sourcesServiceMock = {
    findAll: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SourcesController],
      providers: [
        {
          provide: SourcesService,
          useValue: sourcesServiceMock,
        },
      ],
    }).compile();

    controller = module.get<SourcesController>(SourcesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
    ];

    sourcesServiceMock.findAll.mockResolvedValue(sources);

    const result = await controller.findAll();

    expect(result).toEqual(sources);
    expect(sourcesServiceMock.findAll).toHaveBeenCalled();
  });


  it('should return a source by id', async () => {
    const source = {
      id: 1,
      name: 'Diário do Nordeste',
      type: 'API',
      url: 'https://diariodonordeste.verdesmares.com.br',
      active: true,
    };

    sourcesServiceMock.findOne.mockResolvedValue(source);

    const result = await controller.findOne('1');

    expect(result).toEqual(source);
    expect(sourcesServiceMock.findOne).toHaveBeenCalledWith(1);
  });

  it('should create a source', async () => {
    const createSourceDto = {
      name: 'Diário do Nordeste',
      type: 'API',
      url: 'https://diariodonordeste.verdesmares.com.br',
    };

    const createdSource = {
      id: 1,
      ...createSourceDto,
      active: true,
    };

    sourcesServiceMock.create.mockResolvedValue(createdSource);

    const result = await controller.create(createSourceDto);

    expect(result).toEqual(createdSource);
    expect(sourcesServiceMock.create).toHaveBeenCalledWith(createSourceDto);
  });

  it('should update a source', async () => {
    const updateSourceDto = {
      name: 'Diário do Nordeste API',
    };

    const updatedSource = {
      id: 1,
      name: 'Diário do Nordeste API',
      type: 'API',
      url: 'https://diariodonordeste.verdesmares.com.br',
      active: true,
    };

    sourcesServiceMock.update.mockResolvedValue(updatedSource);

    const result = await controller.update('1', updateSourceDto);

    expect(result).toEqual(updatedSource);
    expect(sourcesServiceMock.update).toHaveBeenCalledWith(1, updateSourceDto);
  });
});

