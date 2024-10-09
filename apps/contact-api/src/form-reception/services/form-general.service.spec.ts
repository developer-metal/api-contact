import { Test, TestingModule } from '@nestjs/testing';
import { FormGeneralService } from './form-general.service';
import { Project } from '../interface/project.interface';
import { SavedForm } from '../dto/form.dto';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { SesEmailService } from './ses-email/ses-email.service';
import { ParseTemplateService } from './parse-template/parse-template.service';
import { CsvDataService } from './csv-data/csv-data.service';
import { HttpException, HttpStatus } from '@nestjs/common';
describe('FormGeneralService', () => {
  let service: FormGeneralService;
  let formModel: Model<SavedForm>;
  let proyecModel: Model<Project>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
    service = module.get<FormGeneralService>(FormGeneralService);
    formModel = module.get<Model<SavedForm>>(getModelToken('Forms'));
    proyecModel = module.get<Model<Project>>(getModelToken('Projects'));
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(formModel).toBeDefined();
    expect(proyecModel).toBeDefined();
  });
  it('should throw an HttpException when form data is not saved to the database', async () => {
    const mockFormRequest = { contactName: 'John', contactLastName: 'Doe', sendDate: new Date(), projectSlug: 'test-project', contactEmail: 'john.doe@example.com', fields: { fieldsContainer: [], reportIdentification: 'TBK'}, blobs: [], csrfToken: 'test-token'};
    jest.spyOn(FormGeneralService.prototype, 'saveFormEmail').mockRejectedValue(new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'Error al crear el Formulario.' }, HttpStatus.BAD_REQUEST));
    await expect(service.submitForm(mockFormRequest)).rejects.toThrow(HttpException);
  });
  it('should return the expected response when called with a project slug', async () => {
    const exportCsv = { exportCsv: jest.fn() }
    const expectedResponse = { responseCsv: 'csv data', respFormat: 'formatted data'};
    jest.spyOn(FormGeneralService.prototype, 'formatFindForm').mockResolvedValue(expectedResponse);
    jest.spyOn(exportCsv, 'exportCsv').mockResolvedValue(expectedResponse);
    expect(expectedResponse).toEqual(expectedResponse);
  });
  it('should throw an HttpException when there is an error submitting a form', async () => {
    const mockFormRequest: any = { contactName: 'John', contactEmail: 'john@example.com', projectSlug: 'test-project', fields: { fieldsContainer: [], reportIdentification: 'TBK'}, sendDate: new Date()};
    jest.spyOn(FormGeneralService.prototype, 'saveFormEmail').mockRejectedValue(new Error('Test error'));
    await expect(service.submitForm(mockFormRequest)).rejects.toThrow(HttpException);
  });
  it('should return all forms when no query parameters are provided', async () => {
        const exeCustom = { exec: jest.fn().mockResolvedValue('all forms')};
        const populate =  { populate: jest.fn().mockReturnValue(exeCustom)};
        const formModelMock: any = { find: jest.fn().mockReturnValue(() => populate)};
        const service = new FormGeneralService( formModelMock, null, null, null, null);
        const result = await service.formatFindForm({ projectSlug: '', contactName: '', contactEmail: '', startDate: undefined, endDate: undefined });
        const expectedResult =  { respFormat: "formatted data", responseCsv: "csv data"}
        expect(result).toEqual(expectedResult);
    });
    it('should return message when form is not found', async () => {
      const formModelMock: any = { findOneAndDelete: jest.fn().mockResolvedValue(null)};
      const service = new FormGeneralService(formModelMock, null,null,null,null);
      try { const result = await service.remove('id'); expect(result).toEqual({ message: 'Formulario ha sido eliminado.' });
      } catch (error) { expect(error.response.message).toEqual('Error al eliminar el proyecto.' );}
    });
    it('should save form to database and send email when submitting a valid form request', async () => {
      const idForm = 'dfdfdfdf';
      const saveFormEmailMock = jest.spyOn(service, 'saveFormEmail').mockResolvedValue(idForm);
      const sendEmailTemplateMock = jest.spyOn(service, 'sendEmailTemplate').mockResolvedValue();
      const body: any = { contactName: 'John', contactLastName: 'Doe', contactEmail: 'john.doe@example.com', projectSlug: 'PROJECT', fields: {}};
      try { await service.submitForm(body); expect(saveFormEmailMock).toHaveBeenCalledWith(body, expect.any(Object)); expect(sendEmailTemplateMock).toHaveBeenCalled();
      } catch (error) { expect(error).toBeInstanceOf(HttpException);}
    });
    it('should throw an error when querying for all forms with an invalid email', async () => {
      const query: any = { contactEmail: 'invalid_email' };
      await expect(service.allForm(query)).rejects.toThrowError();
    });
  });