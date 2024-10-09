import { Test, TestingModule } from '@nestjs/testing';
import { FormGeneralController } from './form-general.controller';
import { FormGeneralService } from '../services/form-general.service';
import { getModelToken } from '@nestjs/mongoose';
import { CsvDataService } from '../services/csv-data/csv-data.service';
import { ParseTemplateService } from '../services/parse-template/parse-template.service';
import { SesEmailService } from '../services/ses-email/ses-email.service';
import { Model } from 'mongoose';
import { FormRequest, SavedForm } from '../dto/form.dto';
import { Project } from '../interface/project.interface';
import { HttpStatus } from '@nestjs/common';
import * as fs from 'fs';
describe('FormGeneralController', () => {
  let controller: FormGeneralController;
  let service: FormGeneralService;
  let formModel: Model<SavedForm>;
  let proyecModel: Model<Project>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormGeneralController],
      providers: [FormGeneralService, ParseTemplateService, SesEmailService, CsvDataService,
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
    controller = module.get<FormGeneralController>(FormGeneralController);
    service = module.get<FormGeneralService>(FormGeneralService);
    formModel = module.get<Model<SavedForm>>(getModelToken('Forms'));
    proyecModel = module.get<Model<Project>>(getModelToken('Projects'));
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should return a success response when submitting a valid form', async () => {
    const mockResponse = { status: jest.fn().mockReturnThis(), send: jest.fn()};
    const mockFormRequest: any = { contactName: 'John', contactLastName: 'Doe', sendDate: new Date(), projectSlug: 'test-project', contactEmail: 'john.doe@example.com', fields: { fieldsContainer: [], reportIdentification: 'TBK' }, blobs: [] };
    const mockFormGeneralService: any = { submitForm: jest.fn()};
    const formGeneralController = new FormGeneralController(mockFormGeneralService);
    await formGeneralController.submitForm(mockResponse, mockFormRequest);
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
    expect(mockResponse.send).toHaveBeenCalledWith({ code: HttpStatus.CREATED, payload: { message: 'Formulario enviado correctamente.' }});
  });
  it('should return HTTP status 200 and payload when called with valid query parameters', async () => {
    const query: any = { projectSlug: 'test', startDate: '2022-01-01', endDate: '2022-01-31' };
    const response = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    const expectedResponse = { code: HttpStatus.OK, payload: {} };
    jest.spyOn(FormGeneralService.prototype, 'allForm').mockResolvedValue({});
    await controller.allForm(response, query);
    expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(response.send).toHaveBeenCalledWith(expectedResponse);
});
it('should return HTTP status 400 and error message when called with invalid query parameters', async () => {
  const query: any = { projectSlug: 'test', startDate: 'invalid', endDate: '2022-01-31' };
  const response = { status: jest.fn().mockReturnThis(), send: jest.fn() };
  const expectedResponse = { time: expect.any(String), error: { code: HttpStatus.BAD_REQUEST, message: expect.any(String) } };
  jest.spyOn(FormGeneralService.prototype, 'allForm').mockRejectedValue({ response: { status: HttpStatus.BAD_REQUEST, message: 'Invalid query parameters' } });
  await controller.allForm(response, query);
  expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
  expect(response.send).toHaveBeenCalledWith(expectedResponse);
});
it('should return HTTP status 200 and CSV file when called with valid body parameters', async () => {
  const body: any = { projectSlug: 'test', contactName: 'test', contactEmail: 'test@test.com', startDate: '2022-01-01', endDate: '2022-01-31' };
  const response = { setHeader: jest.fn(), status: jest.fn(), send: jest.fn() };
  const expectedResponse = fs.createReadStream('./src/public/Formulario.csv');
  jest.spyOn(FormGeneralService.prototype, 'retrieveForm').mockResolvedValue({ responseCsv: './src/public/Formulario.csv' });
  try { await controller.retrieveForm(response, body); expect(response.setHeader).toHaveBeenCalledWith('Content-Type', 'text/csv');
  expect(response.setHeader).toHaveBeenCalledWith('Content-Disposition', 'attachment; filename=Formulario.csv');
  expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
  expect(response.send).toHaveBeenCalledWith(expectedResponse);
  } catch (error) { expect(error).toBeInstanceOf(Error);}
});
it('should return HTTP status 400 and error message when called with invalid id parameter', async () => {
  const id = 'invalid-id';
  const response = { status: jest.fn().mockReturnThis(), send: jest.fn() };
  const expectedResponse = { time: expect.any(String), error: { code: HttpStatus.BAD_REQUEST, message: expect.any(String) } };
  jest.spyOn(FormGeneralService.prototype, 'remove').mockRejectedValue({ response: { status: HttpStatus.BAD_REQUEST, message: 'Invalid id parameter' } });
  await controller.remove(response, id);
  expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
  expect(response.send).toHaveBeenCalledWith(expectedResponse);
});
});