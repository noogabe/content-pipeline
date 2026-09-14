import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ProcessingService } from '../processing/processing.service.js';
import { JobsService } from './jobs.service.js';

describe('JobsService', () => {
  let service: JobsService;

  const processingService = {
    findPendingArticles: vi.fn(),
    startProcessing: vi.fn(),
    finishProcessing: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    service = new JobsService(
      processingService as unknown as ProcessingService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

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
});
