import { Module } from '@nestjs/common';
import { ScraperService } from './scraper/scraper.service';
import { OpenaiService } from './openai/openai.service';
import { SalaryController } from './salary.controller';

@Module({
  providers: [ScraperService, OpenaiService],
  controllers: [SalaryController]
})
export class SalaryModule {}
