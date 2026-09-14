import { Test, TestingModule } from '@nestjs/testing';
import { vi } from 'vitest';

import { ArticlesController } from './articles.controller.js';
import { ArticlesService } from './articles.service.js';

describe('ArticlesController', () => {
  let controller: ArticlesController;

  const articlesServiceMock = {
    findAll: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [
        {
          provide: ArticlesService,
          useValue: articlesServiceMock,
        },
      ],
    }).compile();

    controller = module.get<ArticlesController>(ArticlesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all articles', async () => {
    const articles = [
      {
        id: 1,
        externalId: 'dn-001',
        title: 'Primeiro artigo',
        content: 'Conteúdo do primeiro artigo',
        url: 'https://diariodonordeste.verdesmares.com.br/artigo-1',
        status: 'COLLECTED',
        sourceId: 1,
      },
    ];

    articlesServiceMock.findAll.mockResolvedValue(articles);

    const result = await controller.findAll();

    expect(result).toEqual(articles);
    expect(articlesServiceMock.findAll).toHaveBeenCalled();
  });

  it('should return an article by id', async () => {
    const article = {
      id: 1,
      externalId: 'dn-001',
      title: 'Primeiro artigo',
      content: 'Conteúdo do primeiro artigo',
      url: 'https://diariodonordeste.verdesmares.com.br/artigo-1',
      status: 'COLLECTED',
      sourceId: 1,
    };

    articlesServiceMock.findOne.mockResolvedValue(article);

    const result = await controller.findOne('1');

    expect(result).toEqual(article);
    expect(articlesServiceMock.findOne).toHaveBeenCalledWith(1);
  });

  it('should create an article', async () => {
    const createArticleDto = {
      externalId: 'dn-002',
      title: 'Novo artigo',
      content: 'Conteúdo do novo artigo',
      url: 'https://diariodonordeste.verdesmares.com.br/artigo-2',
      sourceId: 1,
    };

    const createdArticle = {
      id: 2,
      ...createArticleDto,
      status: 'COLLECTED',
    };

    articlesServiceMock.create.mockResolvedValue(createdArticle);

    const result = await controller.create(createArticleDto);

    expect(result).toEqual(createdArticle);
    expect(articlesServiceMock.create).toHaveBeenCalledWith(createArticleDto);
  });

  it('should update an article', async () => {
    const updateArticleDto = {
      title: 'Título atualizado',
    };

    const updatedArticle = {
      id: 1,
      externalId: 'dn-001',
      title: 'Título atualizado',
      content: 'Conteúdo do artigo',
      url: 'https://diariodonordeste.verdesmares.com.br/artigo-1',
      status: 'COLLECTED',
      sourceId: 1,
    };

    articlesServiceMock.update.mockResolvedValue(updatedArticle);

    const result = await controller.update('1', updateArticleDto);

    expect(result).toEqual(updatedArticle);
    expect(articlesServiceMock.update).toHaveBeenCalledWith(
      1,
      updateArticleDto,
    );
  });
});
