import { Test, TestingModule } from '@nestjs/testing';
import { FormProjectService } from './form-project.service';
import { SavedForm } from '../dto/form.dto';
import { Project } from '../interface/project.interface';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';
import { FormProjectDto } from '../dto/create-project.dto';
import { UpdateFormProjectDto } from '../dto/update-form-project.dto';

describe('FormProjectService', () => {
  let service: FormProjectService;
  let formModel: Model<SavedForm>;
  let proyecModel: Model<Project>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<FormProjectService>(FormProjectService);
    formModel = module.get<Model<SavedForm>>(getModelToken('Forms'));
    proyecModel = module.get<Model<Project>>(getModelToken('Projects'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a project successfully', async () => {
    const createFormProjectDto: any = {
      slug: 'test-slug',
      name: 'test-name',
      mailsTo: [{ email: 'test1@test.com' }, { email: 'test2@test.com' }],
      sender: 'test-sender@test.com',
      pocImage: '556655656566565fgfgfg',
      messageTemplate: '<html><body><h1>test1</h1></body></html>',
      documentTemplate: '<html><body><h1>test2</h1></body></html>',
      csrfToken: 'test-csrf-token'
    };
    jest.spyOn(FormProjectService.prototype, 'create').mockResolvedValue({ message: 'Proyecto creado correctamente.' });
    expect(createFormProjectDto).toEqual(createFormProjectDto);
  });
  it('should throw an HttpException when there is an error creating a project', async () => {
    const createFormProjectDto = new FormProjectDto();
    jest.spyOn(FormProjectService.prototype, 'create').mockRejectedValue(new HttpException({
      status: HttpStatus.BAD_REQUEST,
      message: 'Error al crear el proyecto.'
    }, HttpStatus.BAD_REQUEST));
    await expect(service.create(createFormProjectDto)).rejects.toThrow(HttpException);
  });
  it('should return a message when no results are found', async () => {
    const query = { name: 'non-existent' };
    jest.spyOn(FormProjectService.prototype, 'formatFindProject').mockResolvedValue({ message: 'No se encontraron resultados asociados a la busqueda.' });
    const result = await service.formatFindProject(query);
    expect(result).toEqual({ message: 'No se encontraron resultados asociados a la busqueda.' });
  });
  it('should return the expected response when called with a custom query', async () => {
    const query = { name: 'test' };
    const expectedResponse = [{ slug: 'test', name: 'test', mailsTo: ['test@test.com'], sender: 'test@test.com', pocImage: {}, messageTemplate: 'test', documentTemplate: 'test'}];
    jest.spyOn(service, 'formatFindProject').mockResolvedValue(expectedResponse);
    const result = await service.findAll(query);
    expect(result).toEqual(expectedResponse);
  });
    it('should update a project successfully', async () => {
      const id = 'testId';
      const updateFormProjectDto = new UpdateFormProjectDto();
      const findByIdAndUpdateSpy = jest.spyOn(proyecModel, 'findByIdAndUpdate').mockResolvedValueOnce({ exec: jest.fn().mockResolvedValueOnce({}) });
      expect(findByIdAndUpdateSpy).not.toHaveBeenCalledWith(id, updateFormProjectDto);
    });
});