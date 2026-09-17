import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ArticleProcessingConflictException } from '../processing/exceptions/article-processing-conflict.exception.js';
import { ProcessingService } from '../processing/processing.service.js';
import { PublishingService } from '../publishing/publishing.service.js';
import { JobsService } from './jobs.service.js';

describe('JobsService', () => {
  let service: JobsService;

  const processingService = {
    findPendingArticles: vi.fn(),
    startProcessing: vi.fn(),
    finishProcessing: vi.fn(),
  };

  const publishingService = {
    findPendingArticles: vi.fn(),
    publish: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    service = new JobsService(
      processingService as unknown as ProcessingService,
      publishingService as unknown as PublishingService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processPendingArticles', () => {
    it('should process all pending articles', async () => {
      const articles = [{ id: 1 }, { id: 2 }, { id: 3 }];

      processingService.findPendingArticles.mockResolvedValue(articles);
      processingService.startProcessing.mockResolvedValue({});
      processingService.finishProcessing.mockResolvedValue({});

      await service.processPendingArticles();

      expect(processingService.findPendingArticles).toHaveBeenCalledTimes(1);

      expect(processingService.startProcessing).toHaveBeenCalledTimes(3);
      expect(processingService.startProcessing).toHaveBeenNthCalledWith(1, 1);
      expect(processingService.startProcessing).toHaveBeenNthCalledWith(2, 2);
      expect(processingService.startProcessing).toHaveBeenNthCalledWith(3, 3);

      expect(processingService.finishProcessing).toHaveBeenCalledTimes(3);
      expect(processingService.finishProcessing).toHaveBeenNthCalledWith(1, 1);
      expect(processingService.finishProcessing).toHaveBeenNthCalledWith(2, 2);
      expect(processingService.finishProcessing).toHaveBeenNthCalledWith(3, 3);
    });

    it('should not process anything when there are no pending articles', async () => {
      processingService.findPendingArticles.mockResolvedValue([]);

      await service.processPendingArticles();

      expect(processingService.findPendingArticles).toHaveBeenCalledTimes(1);
      expect(processingService.startProcessing).not.toHaveBeenCalled();
      expect(processingService.finishProcessing).not.toHaveBeenCalled();
    });

    it('should continue processing when an article fails', async () => {
      const articles = [{ id: 1 }, { id: 2 }, { id: 3 }];

      processingService.findPendingArticles.mockResolvedValue(articles);

      processingService.startProcessing
        .mockRejectedValueOnce(new Error('Processing failed'))
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({});

      processingService.finishProcessing
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({});

      await service.processPendingArticles();

      expect(processingService.startProcessing).toHaveBeenCalledTimes(3);

      expect(processingService.startProcessing).toHaveBeenNthCalledWith(1, 1);
      expect(processingService.startProcessing).toHaveBeenNthCalledWith(2, 2);
      expect(processingService.startProcessing).toHaveBeenNthCalledWith(3, 3);

      expect(processingService.finishProcessing).not.toHaveBeenCalledWith(1);

      expect(processingService.finishProcessing).toHaveBeenCalledWith(2);
      expect(processingService.finishProcessing).toHaveBeenCalledWith(3);
    });

    it('should continue processing when an article is already claimed', async () => {
      const articles = [{ id: 1 }, { id: 2 }, { id: 3 }];

      processingService.findPendingArticles.mockResolvedValue(articles);

      processingService.startProcessing
        .mockRejectedValueOnce(new ArticleProcessingConflictException())
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({});

      processingService.finishProcessing
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({});

      await service.processPendingArticles();

      expect(processingService.startProcessing).toHaveBeenCalledTimes(3);

      expect(processingService.startProcessing).toHaveBeenNthCalledWith(1, 1);
      expect(processingService.startProcessing).toHaveBeenNthCalledWith(2, 2);
      expect(processingService.startProcessing).toHaveBeenNthCalledWith(3, 3);

      expect(processingService.finishProcessing).not.toHaveBeenCalledWith(1);

      expect(processingService.finishProcessing).toHaveBeenCalledWith(2);
      expect(processingService.finishProcessing).toHaveBeenCalledWith(3);
    });
  });

  describe('publishPendingArticles', () => {
    it('should publish all pending articles', async () => {
      const articles = [{ id: 1 }, { id: 2 }, { id: 3 }];

      publishingService.findPendingArticles.mockResolvedValue(articles);
      publishingService.publish.mockResolvedValue({});

      await service.publishPendingArticles();

      expect(publishingService.findPendingArticles).toHaveBeenCalledTimes(1);

      expect(publishingService.publish).toHaveBeenCalledTimes(3);
      expect(publishingService.publish).toHaveBeenNthCalledWith(1, 1);
      expect(publishingService.publish).toHaveBeenNthCalledWith(2, 2);
      expect(publishingService.publish).toHaveBeenNthCalledWith(3, 3);
    });

    it('should not publish anything when there are no pending articles', async () => {
      publishingService.findPendingArticles.mockResolvedValue([]);

      await service.publishPendingArticles();

      expect(publishingService.findPendingArticles).toHaveBeenCalledTimes(1);
      expect(publishingService.publish).not.toHaveBeenCalled();
    });

    it('should continue publishing when an article fails', async () => {
      const articles = [{ id: 1 }, { id: 2 }, { id: 3 }];

      publishingService.findPendingArticles.mockResolvedValue(articles);

      publishingService.publish
        .mockRejectedValueOnce(new Error('Publishing failed'))
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({});

      await service.publishPendingArticles();

      expect(publishingService.publish).toHaveBeenCalledTimes(3);

      expect(publishingService.publish).toHaveBeenNthCalledWith(1, 1);
      expect(publishingService.publish).toHaveBeenNthCalledWith(2, 2);
      expect(publishingService.publish).toHaveBeenNthCalledWith(3, 3);
    });
  });
});