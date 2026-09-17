import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PublishingService } from './publishing.service.js';
import { PublishingController } from './publishing.controller.js';

describe('PublishingController', () => {
  let controller: PublishingController;

  const publishingService = {
    publish: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    controller = new PublishingController(
      publishingService as unknown as PublishingService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('publish', () => {
    it('should publish the article', async () => {
      const publishedArticle = {
        id: 1,
        status: 'PUBLISHED',
      };

      publishingService.publish.mockResolvedValue(publishedArticle);

      const result = await controller.publish('1');

      expect(result).toEqual(publishedArticle);
      expect(publishingService.publish).toHaveBeenCalledWith(1);
    });
  });
});