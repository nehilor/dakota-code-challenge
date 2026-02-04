import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { JobDetails } from '../interfaces/job-details.interface';

@Injectable()
export class ScraperService {
    private readonly logger = new Logger(ScraperService.name);
    private readonly ASHBY_API_URL = 'https://jobs.ashbyhq.com/api/non-user-graphql?op=ApiJobPosting';

    async fetchJobDetails(board: string, postingId: string): Promise<JobDetails> {
        try {
            const response = (await axios.post(this.ASHBY_API_URL, {
                operationName: 'ApiJobPosting',
                variables: {
                    organizationHostedJobsPageName: board,
                    jobPostingId: postingId
                },
                query:`query ApiJobPosting($organizationHostedJobsPageName: String!, $jobPostingId: String!) {
                    jobPosting(
                    organizationHostedJobsPageName: $organizationHostedJobsPageName
                    jobPostingId: $jobPostingId
                    ) {
                        title
                        locationName
                        descriptionHtml
                        departmentName
                    }
                }`
            }));

            const jobPosting = response.data?.data?.jobPosting;
            if (!jobPosting) {
                throw new Error('Job posting not found');
            }

            return {
                title: jobPosting.title,
                location: jobPosting.locationName,
                department: jobPosting.departmentName,
                description: jobPosting.descriptionHtml,
            }

        } catch (error) {
            this.logger.error(`Error fetching job details ${error.message}`);
            throw error;
        }

    }
}
