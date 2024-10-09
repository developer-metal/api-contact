import { Test, TestingModule } from '@nestjs/testing';
import { GroupWidgetController } from './group-widget.controller';

describe('GroupWidgetController', () => {
  let controller: GroupWidgetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupWidgetController]
    }).compile();

    controller = module.get<GroupWidgetController>(GroupWidgetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
