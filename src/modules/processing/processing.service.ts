import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../common/prisma/prisma.service.js';
import { ArticleStatus } from '../../generated/prisma/enums.js';

@Injectable()
export class ProcessingService {
  constructor(private readonly prisma: PrismaService) {}

  findPendingArticles() {
    return this.prisma.article.findMany({
      where: {
        status: ArticleStatus.COLLECTED,
      },
    });
  }

  async startProcessing(articleId: number) {
    const result = await this.prisma.article.updateMany({
      where: {
        id: articleId,
        status: ArticleStatus.COLLECTED,
      },
      data: {
        status: ArticleStatus.PROCESSING,
      },
    });

    if (result.count === 0) {
      const article = await this.prisma.article.findUnique({
        where: { id: articleId },
      });

      if (!article) {
        throw new NotFoundException('Article not found');
      }

      throw new BadRequestException('Article is not ready for processing');
    }

    return this.prisma.article.findUnique({
      where: { id: articleId },
    });
  }

  async finishProcessing(articleId: number) {
    const article = await this.prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    if (article.status !== ArticleStatus.PROCESSING) {
      throw new BadRequestException('Article is not being processed');
    }

    return this.prisma.article.update({
      where: { id: articleId },
      data: {
        status: ArticleStatus.READY_TO_PUBLISH,
        processedAt: new Date(),
      },
    });
  }
}
