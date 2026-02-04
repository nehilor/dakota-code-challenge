import { Test, TestingModule } from '@nestjs/testing';
import { SalaryController } from './salary/salary.controller';
import { ScraperService } from './salary/scraper/scraper.service';
import { OpenaiService } from './salary/openai/openai.service';

describe('AppController', () => {
  let appController: SalaryController;

  const mockScraperService = {
    fetchJobDetails: jest.fn()
  };

  const mockOpenaiService = {
    predictSalary: jest.fn()
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SalaryController],
      providers: [
        { provide: ScraperService, useValue: mockScraperService },
        { provide: OpenaiService, useValue: mockOpenaiService }
      ],
    }).compile();

    appController = app.get<SalaryController>(SalaryController);
  });

  it('should return prediected salary', () => {
    async () => {
      mockScraperService.fetchJobDetails.mockResolvedValue({
        title: 'Senior Engineer',
        location: 'Remote',
        department: 'Engineering',
        description: 'Role Desc'
      })

      mockOpenaiService.predictSalary.mockResolvedValue('Forward Deployed Engineer $120,000');

      const result = await appController.getSalary('cohere', 'b0bcef37-1d20-414f-aade-c54942d63df9');

      expect(result).toBe('Forward Deployed Engineer $120,000');
    }
  });
});
