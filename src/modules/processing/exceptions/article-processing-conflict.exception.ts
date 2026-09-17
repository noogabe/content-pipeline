import { ConflictException } from '@nestjs/common';

export class ArticleProcessingConflictException extends ConflictException {
    constructor() {
        super('Article is already being processed');
    }
}
