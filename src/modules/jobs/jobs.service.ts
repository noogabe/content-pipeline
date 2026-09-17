import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { ProcessingService } from '../processing/processing.service.js';
import { ArticleProcessingConflictException } from '../processing/exceptions/article-processing-conflict.exception.js';

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(private readonly processingService: ProcessingService) { }

  async processPendingArticles() {
    const articles = await this.processingService.findPendingArticles();

    for (const article of articles) {
      try {
        await this.processingService.startProcessing(article.id);
        await this.processingService.finishProcessing(article.id);
      } catch (error) {
        if (error instanceof ArticleProcessingConflictException) {
          this.logger.warn(`Article ${article.id} was already claimed`);
        } else {
          this.logger.error(
            `Failed to process article ${article.id}`,
            error,
          );
        }
      }
    }
  }

  @Cron('* * * * *')
  async processPendingArticlesJob() {
    this.logger.log('Processing job started');

    await this.processPendingArticles();

    this.logger.log('Processing job finished');
  }
}
