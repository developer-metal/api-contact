import { Test, TestingModule } from '@nestjs/testing';
import { FormProjectController } from './form-project.controller';
import { FormProjectService } from '../services/form-project.service';
import { getModelToken } from '@nestjs/mongoose';
import { HttpStatus } from '@nestjs/common';
describe('FormProjectController', () => {
  let controller: FormProjectController;
  let service: FormProjectService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormProjectController],
      providers: [FormProjectService,
        { 
          provide: getModelToken('Forms'), 
          useValue: {
            updateOne: jest.fn(),
            findOne: jest.fn(),
            findById: jest.fn(),
            exec: jest.fn(),
            promise: jest.fn()
          }
       },
       { 
        provide: getModelToken('Projects'), 
        useValue: {
          save: jest.fn(),
          findByIdAndUpdate: jest.fn(),
          findByIdAndDelete: jest.fn(),
          find: jest.fn()
        }
      }
      ]
    }).compile();
    controller = module.get<FormProjectController>(FormProjectController);
    service = module.get<FormProjectService>(FormProjectService);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should create a project successfully', async () => {
    const mockResponse = { status: jest.fn(() => mockResponse), send: jest.fn()};
    const mockFormProjectService: any = { create: jest.fn(() => Promise.resolve({ message: 'Proyecto creado correctamente.' }))};
    const formProjectController = new FormProjectController(mockFormProjectService);
    const formProjectDto: any = { slug: 'test-slug', name: 'test-name'};
    await formProjectController.create(mockResponse, formProjectDto);
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
    expect(mockResponse.send).toHaveBeenCalledWith({ code: HttpStatus.CREATED, payload: { message: 'Proyecto creado correctamente.' } });
  });
  it('should return all projects when findAll is called', async () => {
    const mockResponse = { status: jest.fn().mockReturnThis(),send: jest.fn()};
    const mockService: any = {findAll: jest.fn().mockResolvedValue([{ name: 'Project 1' }, { name: 'Project 2' }])};
    const controller = new FormProjectController(mockService);
    await controller.findAll(mockResponse, {slug: '',name: '',sender: ''});
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(mockResponse.send).toHaveBeenCalledWith({ code: HttpStatus.OK, payload: [{ name: 'Project 1' }, { name: 'Project 2' }] });
  });
    it('should update a project and return 200 status code', async () => {
      const mockResponse = {status: jest.fn().mockReturnThis(),send: jest.fn()};
      const mockId = 'mockId';
      const mockUpdateFormProjectDto = {};
      const mockResponseUpdate = {};
      jest.spyOn(service, 'update').mockResolvedValue(mockResponseUpdate);
      await controller.update(mockResponse, mockId, mockUpdateFormProjectDto);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.send).toHaveBeenCalledWith({ code: HttpStatus.OK, payload: mockResponseUpdate });
  });
    it('should return 400 status code when createFormProjectDto is invalid', async () => {
      const mockResponse = {status: jest.fn().mockReturnThis(),send: jest.fn()};
      const mockCreateFormProjectDto: any = {};
      jest.spyOn(service, 'create').mockRejectedValue({ response: { status: HttpStatus.BAD_REQUEST, message: 'Bad Request' } });
      await controller.create(mockResponse, mockCreateFormProjectDto);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.send).toHaveBeenCalledWith({time: expect.any(String),error: {code: HttpStatus.BAD_REQUEST,message: 'Bad Request'}
      });
  });
      it('should return 400 status code when FormProjecAll is invalid', async () => {
        const mockResponse = {status: jest.fn().mockReturnThis(),send: jest.fn()};
        const mockFormProjecAll: any = {};
        jest.spyOn(service, 'findAll').mockRejectedValue({ response: { status: HttpStatus.BAD_REQUEST, message: 'Bad Request' } });
        await controller.findAll(mockResponse, mockFormProjecAll);
        expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
        expect(mockResponse.send).toHaveBeenCalledWith({time: expect.any(String),error: {code: HttpStatus.BAD_REQUEST,message: 'Bad Request'}});
    });
});