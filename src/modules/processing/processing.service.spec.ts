import { BadRequestException, NotFoundException } from '@nestjs/common';
import { describe, expect, it, beforeEach, vi } from 'vitest';

import { PrismaService } from '../../common/prisma/prisma.service.js';
import { ArticleStatus } from '../../generated/prisma/enums.js';
import { ProcessingService } from './processing.service.js';

describe('ProcessingService', () => {
  let service: ProcessingService;

  const prisma = {
    article: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    service = new ProcessingService(prisma as unknown as PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findPendingArticles', () => {
    it('should return collected articles', async () => {
      const articles = [
        {
          id: 1,
          status: ArticleStatus.COLLECTED,
        },
      ];

      prisma.article.findMany.mockResolvedValue(articles);

      const result = await service.findPendingArticles();

      expect(result).toEqual(articles);
      expect(prisma.article.findMany).toHaveBeenCalledWith({
        where: {
          status: ArticleStatus.COLLECTED,
        },
      });
    });
  });

  describe('startProcessing', () => {
    it('should throw NotFoundException when article does not exist', async () => {
      prisma.article.findUnique.mockResolvedValue(null);

      await expect(service.startProcessing(999)).rejects.toThrow(
        NotFoundException,
      );

      expect(prisma.article.update).not.toHaveBeenCalled();
    });

    it('should start processing a collected article', async () => {
      const article = {
        id: 1,
        status: ArticleStatus.COLLECTED,
      };

      const updatedArticle = {
        ...article,
        status: ArticleStatus.PROCESSING,
      };

      prisma.article.findUnique.mockResolvedValue(article);
      prisma.article.update.mockResolvedValue(updatedArticle);

      const result = await service.startProcessing(1);

      expect(result).toEqual(updatedArticle);

      expect(prisma.article.update).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
        data: {
          status: ArticleStatus.PROCESSING,
        },
      });
    });

    it('should throw BadRequestException when article is not collected', async () => {
      prisma.article.findUnique.mockResolvedValue({
        id: 1,
        status: ArticleStatus.PROCESSING,
      });

      await expect(service.startProcessing(1)).rejects.toThrow(
        BadRequestException,
      );

      expect(prisma.article.update).not.toHaveBeenCalled();
    });
  });

  describe('finishProcessing', () => {
    it('should throw NotFoundException when article does not exist', async () => {
      prisma.article.findUnique.mockResolvedValue(null);

      await expect(service.finishProcessing(999)).rejects.toThrow(
        NotFoundException,
      );

      expect(prisma.article.update).not.toHaveBeenCalled();
    });

    it('should finish processing a processing article', async () => {
      const article = {
        id: 1,
        status: ArticleStatus.PROCESSING,
      };

      const updatedArticle = {
        ...article,
        status: ArticleStatus.READY_TO_PUBLISH,
        processedAt: new Date(),
      };

      prisma.article.findUnique.mockResolvedValue(article);
      prisma.article.update.mockResolvedValue(updatedArticle);

      const result = await service.finishProcessing(1);

      expect(result).toEqual(updatedArticle);

      expect(prisma.article.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            id: 1,
          },
          data: expect.objectContaining({
            status: ArticleStatus.READY_TO_PUBLISH,
            processedAt: expect.any(Date),
          }),
        }),
      );
    });

    it('should throw BadRequestException when article is not being processed', async () => {
      prisma.article.findUnique.mockResolvedValue({
        id: 1,
        status: ArticleStatus.COLLECTED,
      });

      await expect(service.finishProcessing(1)).rejects.toThrow(
        BadRequestException,
      );

      expect(prisma.article.update).not.toHaveBeenCalled();
    });
  });
});