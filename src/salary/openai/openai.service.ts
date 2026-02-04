import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { JobDetails } from '../interfaces/job-details.interface';

@Injectable()
export class OpenaiService {
    private readonly logger = new Logger(OpenaiService.name);
    private openai: OpenAI;

    constructor(private configService: ConfigService) {
        this.openai = new OpenAI({
            apiKey: this.configService.get<string>('OPENAI_API_KEY')
        });
    }

    async predictSalary(jobDetails: JobDetails): Promise<string> {
        try {
            const prompt = `
                You are an expert technical recruiter and salary analyst.
                Given the following details, predict the annual salary in USD.
                Return ONLY the predicted salary in the format "Role Name $Amount" (Example: Software Engineer $150,000)

                Job title: ${jobDetails.title}
                Location: ${jobDetails.location}
                Department: ${jobDetails.department}
                Description: ${jobDetails.description}
            `;

            const response = await this.openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.3
            });
            
            return response.choices[0].message.content || 'No prediction results';
        } catch (error) {
            this.logger.error(`Error predicting salary ${error.message}`);
            throw error;
        }
    }
}
