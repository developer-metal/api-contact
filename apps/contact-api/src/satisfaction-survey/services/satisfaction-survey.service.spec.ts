import { Test, TestingModule } from '@nestjs/testing';
import { SatisfactionSurveyService } from './satisfaction-survey.service';

describe('SatisfactionSurveyService', () => {
  let service: SatisfactionSurveyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SatisfactionSurveyService]
    }).compile();

    service = module.get<SatisfactionSurveyService>(SatisfactionSurveyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
