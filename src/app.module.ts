import { Module } from '@nestjs/common';
import { SourcesModule } from './modules/sources/sources.module.js';

@Module({
  imports: [SourcesModule]
})
export class AppModule {}