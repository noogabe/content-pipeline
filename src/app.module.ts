import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { PrismaModule } from './common/prisma/prisma.module.js';
import { SourcesModule } from './modules/sources/sources.module.js';
import { ArticlesModule } from './modules/articles/articles.module.js';
import { ProcessingModule } from './modules/processing/processing.module.js';
import { JobsModule } from './modules/jobs/jobs.module.js';
import { PublishingModule } from './modules/publishing/publishing.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    SourcesModule,
    ArticlesModule,
    ProcessingModule,
    JobsModule,
    PublishingModule,
  ],
})
export class AppModule {}
