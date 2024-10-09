import { Test, TestingModule } from '@nestjs/testing';
import { FormWidgetController } from './form-widget.controller';

describe('FormWidgetController', () => {
  let controller: FormWidgetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormWidgetController]
    }).compile();

    controller = module.get<FormWidgetController>(FormWidgetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
