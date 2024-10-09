import { Test, TestingModule } from '@nestjs/testing';
import { SendEmailProcessor } from './sendEmail.processor';
import { ParseTemplateService } from '../../parse-template/parse-template.service';
import { SesEmailService } from '../ses-email.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SavedForm } from 'src/form-reception/dto/form.dto';
import { any } from 'joi';
describe('SendEmailProcessor', () => {
  let service: SendEmailProcessor;
  let serviceEmail: SesEmailService;
  let model: Model<SavedForm>;
  let parseTemplateService: ParseTemplateService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SendEmailProcessor, ParseTemplateService, SesEmailService, 
        { 
          provide: getModelToken('Forms'), 
          useValue: {
            updateOne: jest.fn(),
            findOne: jest.fn(),
            findById: jest.fn(),
            exec: jest.fn(),
            promise: jest.fn()
          }
       }]
    }).compile();
    service = module.get<SendEmailProcessor>(SendEmailProcessor);
    serviceEmail = module.get<SesEmailService>(SesEmailService);
    parseTemplateService = module.get<ParseTemplateService>(ParseTemplateService);
    model = module.get<Model<SavedForm>>(getModelToken('Forms'));
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send email with message template', async () => {
    const job: any = {
      data: {
        messageTemplate: 'Hello {{name}}!',
        documentTemplate: '',
        dataQuestions: {},
        dataTemplate: { name: 'John' },
        contactEmail: 'john@example.com',
        sender: 'sender@example.com',
        blobs: [],
        mailsTo: [],
        projectSlug: 'project-slug'
      }
    };
    const parseTemplateService: any= {
      parseTemplate: jest.fn().mockResolvedValue({ messageTemplate: 'Hello John!', documentTemplate: '' })
    };
    const SesEmailServices: any = {
      sendEmailWellcome: jest.fn().mockResolvedValue({ emailWellcome: true }),
      sendEmailAttachmed: jest.fn().mockResolvedValue({ email: true })
    };
    jest.spyOn(model, 'updateOne').mockReturnValue({exec: jest.fn().mockResolvedValueOnce({})} as any);
    const processor = new SendEmailProcessor(model, parseTemplateService, SesEmailServices);
    await processor.sendEmailTemplate(job);
    expect(parseTemplateService.parseTemplate).toHaveBeenCalledWith({ messageTemplate: 'Hello {{name}}!', documentTemplate: '' }, { name: 'John' }, {});
    expect(SesEmailServices.sendEmailWellcome).toHaveBeenCalledWith('john@example.com', { messageTemplate: 'Hello John!', documentTemplate: '' }, 'sender@example.com','334343434fgf');
    expect(SesEmailServices.sendEmailAttachmed).toHaveBeenCalledWith('john@example.com', { messageTemplate: 'Hello John!', documentTemplate: '' }, 'sender@example.com', [], [],'334343434fgf');
    expect(model.updateOne).toHaveBeenCalledWith({ $and: [{ projectSlug: 'project-slug', contactEmail: 'john@example.com' }] }, { thanksSent: true, interestedSent: true });
  });

      // Tests that the sendEmailTemplate function successfully sends an email with document template and questions data
      it('should send email with document template and questions data', async () => {
        const jobData: any = {
          messageTemplate: 'message template',
          documentTemplate: 'document template',
          dataQuestions: { question1: 'answer1', question2: 'answer2' },
          dataTemplate: { name: 'John Doe' },
          contactEmail: 'john.doe@example.com',
          sender: 'sender@example.com',
          blobs: [],
          mailsTo: [{ name: 'recipient@example.com' }],
          projectSlug: 'project-slug'
        };
        const parseTemplateService: any = {
          parseTemplate: jest.fn().mockResolvedValue({ messageTemplate: 'message', documentTemplate: 'document' })
        };
        const SesEmailServices: any = {
          sendEmailWellcome: jest.fn().mockResolvedValue({ emailWellcome: true }),
          sendEmailAttachmed: jest.fn().mockResolvedValue({ email: true })
        };
        jest.spyOn(model, 'updateOne').mockReturnValue({exec: jest.fn().mockResolvedValueOnce({})} as any);
        const sendEmailProcessor = new SendEmailProcessor(model, parseTemplateService, SesEmailServices);
        try {
        await sendEmailProcessor.sendEmailTemplate({ data: jobData } as any);
        expect(parseTemplateService.parseTemplate).toHaveBeenCalledWith({ messageTemplate: 'message template', documentTemplate: 'document template' }, { name: 'John Doe' }, { question1: 'answer1', question2: 'answer2' });
        expect(SesEmailServices.sendEmailWellcome).toHaveBeenCalledWith('john.doe@example.com', { messageTemplate: 'message', documentTemplate: 'document' }, 'sender@example.com','f45b5cbf-9fe6-4256-8114-959b15621ccc');
        expect(SesEmailServices.sendEmailAttachmed).toHaveBeenCalledWith('john.doe@example.com', { messageTemplate: 'message', documentTemplate: 'document' }, 'sender@example.com', [], [{ name: 'recipient@example.com' }],'f45b5cbf-9fe6-4256-8114-959b15621ccc');
        expect(model.updateOne).toHaveBeenCalledWith({ $and: [{ projectSlug: 'project-slug', contactEmail: 'john.doe@example.com' }] }, { thanksSent: true, interestedSent: true });
        } catch (error) {
          expect(error).toBeUndefined();
        } 
      });
});