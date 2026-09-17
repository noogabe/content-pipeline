import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../common/prisma/prisma.service.js';
import { ArticleStatus } from '../../generated/prisma/enums.js';

@Injectable()
export class PublishingService {
  constructor(private readonly prisma: PrismaService) { }

  async publish(articleId: number) {
    const article = await this.prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    if (article.status !== ArticleStatus.READY_TO_PUBLISH) {
      throw new BadRequestException('Article is not ready to publish');
    }

    return this.prisma.article.update({
      where: { id: articleId },
      data: {
        status: ArticleStatus.PUBLISHED,
        publishedAt: new Date(),
      },
    });
  }

  findPendingArticles() {
    return this.prisma.article.findMany({
      where: {
        status: ArticleStatus.READY_TO_PUBLISH,
      },
    });
  }
}