import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { vi } from 'vitest';

import { PrismaService } from '../../common/prisma/prisma.service.js';
import { ArticlesService } from './articles.service.js';

describe('ArticlesService', () => {
  let service: ArticlesService;

  const prismaMock = {
    article: {
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
        ArticlesService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
      {
        id: 2,
        externalId: 'globo-001',
        title: 'Segundo artigo',
        content: 'Conteúdo do segundo artigo',
        url: 'https://globo.com/artigo-1',
        status: 'COLLECTED',
        sourceId: 2,
      },
    ];

    prismaMock.article.findMany.mockResolvedValue(articles);

    const result = await service.findAll();

    expect(result).toEqual(articles);
    expect(prismaMock.article.findMany).toHaveBeenCalled();
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

    prismaMock.article.findUnique.mockResolvedValue(article);

    const result = await service.findOne(1);

    expect(result).toEqual(article);
    expect(prismaMock.article.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should throw NotFoundException when article does not exist', async () => {
    prismaMock.article.findUnique.mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);

    expect(prismaMock.article.findUnique).toHaveBeenCalledWith({
      where: { id: 999 },
    });
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

    prismaMock.article.create.mockResolvedValue(createdArticle);

    const result = await service.create(createArticleDto);

    expect(result).toEqual(createdArticle);
    expect(prismaMock.article.create).toHaveBeenCalledWith({
      data: createArticleDto,
    });
  });

  it('should update an article', async () => {
    const updateArticleDto = {
      title: 'Título atualizado',
    };

    const article = {
      id: 1,
      externalId: 'dn-001',
      title: 'Primeiro artigo',
      content: 'Conteúdo do primeiro artigo',
      url: 'https://diariodonordeste.verdesmares.com.br/artigo-1',
      status: 'COLLECTED',
      sourceId: 1,
    };

    const updatedArticle = {
      ...article,
      title: updateArticleDto.title,
    };

    prismaMock.article.findUnique.mockResolvedValue(article);
    prismaMock.article.update.mockResolvedValue(updatedArticle);

    const result = await service.update(1, updateArticleDto);

    expect(result).toEqual(updatedArticle);

    expect(prismaMock.article.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });

    expect(prismaMock.article.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: updateArticleDto,
    });
  });

  it('should throw NotFoundException when updating an article that does not exist', async () => {
    prismaMock.article.findUnique.mockResolvedValue(null);

    const updateArticleDto = {
      title: 'Novo título',
    };

    await expect(service.update(999, updateArticleDto)).rejects.toThrow(
      NotFoundException,
    );

    expect(prismaMock.article.findUnique).toHaveBeenCalledWith({
      where: { id: 999 },
    });

    expect(prismaMock.article.update).not.toHaveBeenCalled();
  });
});
