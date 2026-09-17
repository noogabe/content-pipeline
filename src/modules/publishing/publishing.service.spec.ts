import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PrismaService } from '../../common/prisma/prisma.service.js';
import { ArticleStatus } from '../../generated/prisma/enums.js';
import { PublishingService } from './publishing.service.js';

describe('PublishingService', () => {
  let service: PublishingService;

  const prisma = {
    article: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    service = new PublishingService(
      prisma as unknown as PrismaService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('publish', () => {
    it('should throw NotFoundException when article does not exist', async () => {
      prisma.article.findUnique.mockResolvedValue(null);

      await expect(service.publish(999)).rejects.toThrow(
        NotFoundException,
      );

      expect(prisma.article.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when article is not ready to publish', async () => {
      prisma.article.findUnique.mockResolvedValue({
        id: 1,
        status: ArticleStatus.PROCESSING,
      });

      await expect(service.publish(1)).rejects.toThrow(
        BadRequestException,
      );

      expect(prisma.article.update).not.toHaveBeenCalled();
    });

    it('should publish a ready article', async () => {
      const article = {
        id: 1,
        status: ArticleStatus.READY_TO_PUBLISH,
      };

      const publishedArticle = {
        ...article,
        status: ArticleStatus.PUBLISHED,
        publishedAt: new Date(),
      };

      prisma.article.findUnique.mockResolvedValue(article);
      prisma.article.update.mockResolvedValue(publishedArticle);

      const result = await service.publish(1);

      expect(result).toEqual(publishedArticle);

      expect(prisma.article.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            id: 1,
          },
          data: expect.objectContaining({
            status: ArticleStatus.PUBLISHED,
            publishedAt: expect.any(Date),
          }),
        }),
      );
    });
  });
});