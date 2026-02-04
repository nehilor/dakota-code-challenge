import { Controller, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { ScraperService } from './scraper/scraper.service';
import { OpenaiService } from './openai/openai.service';

@Controller('predict/salary')
export class SalaryController {

    constructor(
        private readonly scraperService: ScraperService,
        private readonly openaiService: OpenaiService,
    ) {}

    @Get(':board/:postingId')
    async getSalary(
        @Param('board') board: string,
        @Param('postingId') postingId: string,
    ) {
        try {
            // This will return the job details
            const jobDetails = await this.scraperService.fetchJobDetails(board, postingId);
            const prediction = await this.openaiService.predictSalary(jobDetails);
            return prediction;

        } catch (error) {
            throw new HttpException(
                error.message || 'Internal error',
                error.status || HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

}
