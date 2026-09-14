import { Injectable, Logger } from '@nestjs/common';

import { ProcessingService } from '../processing/processing.service.js';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class JobsService {
  constructor(
    private readonly processingService: ProcessingService,
  ) {}

  private readonly logger = new Logger(JobsService.name);

  async processPendingArticles() {
    const articles = await this.processingService.findPendingArticles();

    for (const article of articles) {
      await this.processingService.startProcessing(article.id);
      await this.processingService.finishProcessing(article.id);
    }
  }

  @Cron('* * * * *')
  async processPendingArticlesJob() {
    this.logger.log('Processing job started');
    await this.processPendingArticles();
    this.logger.log('Processing job finished');
  }
}
