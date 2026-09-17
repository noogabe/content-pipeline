import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { ArticleProcessingConflictException } from '../processing/exceptions/article-processing-conflict.exception.js';
import { ProcessingService } from '../processing/processing.service.js';
import { PublishingService } from '../publishing/publishing.service.js';

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(
    private readonly processingService: ProcessingService,
    private readonly publishingService: PublishingService,
  ) {}

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

  async publishPendingArticles() {
    const articles = await this.publishingService.findPendingArticles();

    for (const article of articles) {
      try {
        await this.publishingService.publish(article.id);
      } catch (error) {
        this.logger.error(
          `Failed to publish article ${article.id}`,
          error,
        );
      }
    }
  }

  @Cron('* * * * *')
  async processPendingArticlesJob() {
    this.logger.log('Processing job started');

    await this.processPendingArticles();

    this.logger.log('Processing job finished');
  }

  @Cron('* * * * *')
  async publishPendingArticlesJob() {
    this.logger.log('Publishing job started');

    await this.publishPendingArticles();

    this.logger.log('Publishing job finished');
  }
}