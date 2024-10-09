import { Model } from "mongoose";
import { ParseTemplateService } from "./parse-template.service";
import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
let service: ParseTemplateService;
let saveEmailModel: Model<any>; // Puedes reemplazar 'any' con el tipo específico de tu modelo

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      ParseTemplateService,
      {
        provide: 'SaveEmailModel',
        useValue: {
          findOne: jest.fn(),
          create: jest.fn()
        }
      },
      ConfigService
    ]
  }).compile();

  service = module.get<ParseTemplateService>(ParseTemplateService);
  saveEmailModel = module.get<Model<any>>('SaveEmailModel');
});
    it('should throw an error when the message template has invalid base64 encoding', () => {
      const template = {
        messageTemplate: 'SGVsbG8gd29ybGQh',
        documentTemplate: 'SGVsbG8gd29ybGQh'
      };
      const dataMessage = { name: 'John' };
      const idForm = '123';
      const dataQuestions = { question1: 'Answer1' };
      expect(() =>
        service.parseTemplate(template, dataMessage, dataQuestions, idForm)
      ).toEqual(expect.anything());
    });
        it('should handle an empty dataQuestions object', () => {
          const template: any = {
            messageTemplate: 'SGVsbG8gd29ybGQh',
            documentTemplate: 'SGVsbG8gd29ybGQh'
          };
          const idForm = '123';
          const dataMessage = { name: 'John' };
          const dataQuestions = {};
          const result: any = service.parseTemplate(
            template,
            dataMessage,
            dataQuestions,
            idForm
          );
          expect(result.documentTemplate).toBeUndefined();
        });
    it('should handle an empty document template', () => {
      const template = {
        messageTemplate: 'SGVsbG8gd29ybGQh',
        documentTemplate: ''
      };
      const idForm = '123';
      const dataMessage = { name: 'John' };
      const dataQuestions = { question1: 'Answer1' };
      const result: any = service.parseTemplate(
        template,
        dataMessage,
        dataQuestions,
        idForm
      );
      expect(result.documentTemplate).toBeUndefined();
    });
    it('should handle an empty message template', () => {
      const template = {
        messageTemplate: '',
        documentTemplate: 'SGVsbG8gd29ybGQh'
      };
      const idForm = '123';
      const dataMessage = { name: 'John' };
      const dataQuestions = { question1: 'Answer1' };
     
      const result: any = service.parseTemplate(
        template,
        dataMessage,
        dataQuestions,
        idForm
      );
      expect(result.messageTemplate).toBeUndefined();
    });
        it('should parse the document template when it is provided and dataQuestions is not empty', () => {
          const template = {
            messageTemplate: 'SGVsbG8gd29ybGQh',
            documentTemplate: 'SGVsbG8gd29ybGQh'
          };
          const idForm = '123';
          const dataMessage = { name: 'John' };
          const dataQuestions = { question1: 'Answer1' };

          const result: any = service.parseTemplate(
            template,
            dataMessage,
            dataQuestions,
            idForm
          );
          expect(result.documentTemplate).toBeUndefined();
        });
    it('should parse the message template when it is provided', () => {
      const template = {
        messageTemplate: 'SGVsbG8gd29ybGQh',
        documentTemplate: 'SGVsbG8gd29ybGQh'
      };
      const idForm = '123';
      const dataMessage = { name: 'John' };
      const dataQuestions = { question1: 'Answer1' };
      const result: any = service.parseTemplate(
        template,
        dataMessage,
        dataQuestions,
        idForm
      );
      expect(result.messageTemplate).toBeUndefined();
    });