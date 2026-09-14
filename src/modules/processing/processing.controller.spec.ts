import { describe, expect, it, beforeEach, vi } from 'vitest';

import { ProcessingController } from './processing.controller.js';
import { ProcessingService } from './processing.service.js';

describe('ProcessingController', () => {
  let controller: ProcessingController;

  const processingService = {
    startProcessing: vi.fn(),
    finishProcessing: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    controller = new ProcessingController(
      processingService as unknown as ProcessingService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should start processing an article', async () => {
    const article = {
      id: 1,
      status: 'PROCESSING',
    };

    processingService.startProcessing.mockResolvedValue(article);

    const result = await controller.startProcessing('1');

    expect(result).toEqual(article);
    expect(processingService.startProcessing).toHaveBeenCalledWith(1);
  });

  it('should finish processing an article', async () => {
    const article = {
      id: 1,
      status: 'READY_TO_PUBLISH',
    };

    processingService.finishProcessing.mockResolvedValue(article);

    const result = await controller.finishProcessing('1');

    expect(result).toEqual(article);
    expect(processingService.finishProcessing).toHaveBeenCalledWith(1);
  });
});