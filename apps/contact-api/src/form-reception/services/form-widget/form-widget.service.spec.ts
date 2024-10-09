import { Test, TestingModule } from '@nestjs/testing';
import { FormWidgetService } from './form-widget.service';

describe('FormWidgetService', () => {
  let service: FormWidgetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FormWidgetService]
    }).compile();

    service = module.get<FormWidgetService>(FormWidgetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
