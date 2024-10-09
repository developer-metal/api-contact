import { Test, TestingModule } from '@nestjs/testing';
import { SatisfactionSurveyController } from './satisfaction-survey.controller';
import { SatisfactionSurveyService } from '../services/satisfaction-survey.service';

describe('SatisfactionSurveyController', () => {
  let controller: SatisfactionSurveyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SatisfactionSurveyController],
      providers: [SatisfactionSurveyService]
    }).compile();

    controller = module.get<SatisfactionSurveyController>(SatisfactionSurveyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
