import { Injectable } from '@nestjs/common';

import { ProcessingService } from '../processing/processing.service.js';

@Injectable()
export class JobsService {
  constructor(private readonly processingService: ProcessingService) {}

  async processPendingArticles() {
    const articles = await this.processingService.findPendingArticles();

    for (const article of articles) {
      await this.processingService.startProcessing(article.id);
      await this.processingService.finishProcessing(article.id);
    }
  }
}