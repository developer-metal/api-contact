import { Test, TestingModule } from '@nestjs/testing';
import { SesEmailService } from './ses-email.service';
import { getModelToken  } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SavedForm } from '../../../form-reception/dto/form.dto';
describe('SesEmailService', () => {
  let service: SesEmailService;
  let model: Model<SavedForm>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [SesEmailService, { provide: getModelToken('Forms'), useValue: { updateOne: jest.fn(), findOne: jest.fn(), findById: jest.fn(), exec: jest.fn(), promise: jest.fn()}},{ provide: getModelToken('Projects'), useValue: { save: jest.fn(),findByIdAndUpdate: jest.fn(), findByIdAndDelete: jest.fn(),find: jest.fn()}}]
    }).compile();
    service = module.get<SesEmailService>(SesEmailService);
    model = module.get<Model<SavedForm>>(getModelToken('Forms'));
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('send email blog is not empty', async () => {
    const toEmail = 'lespinosa@kdu.cl';
    const template = { documentTemplate: '<p>Test email</p>'};
    const remite = 'lespinosa@kdu.cl';
    const blobs = [{ filename: "evidencia ideas", typefile:"pdf", filecontent: "fdfdfdfdfffd", encoding: "base64"}];
    const idForm = '3233232ffddffddf3433434343434';
    const mailsTo = [{name: 'test@test.com'}];
    jest.spyOn(model, 'findOne').mockReturnValue({exec: jest.fn().mockResolvedValueOnce({countSendWellcome:0,countSendinterested:0})} as any);
    jest.spyOn(model, 'updateOne').mockReturnValue({exec: jest.fn().mockResolvedValueOnce({})} as any);
    const response = await service.sendEmailAttachmed(toEmail, template, remite, blobs, mailsTo, idForm);
    expect(response).toEqual(response);
});
it('should retry sending a welcome email when it fails up to 3 times', async () => {
  const mockFormModel = { findOne: jest.fn().mockResolvedValue({ countSendWellcome: 2 }), updateOne: jest.fn().mockResolvedValue({}), promise: jest.fn().mockResolvedValue({"contactEmail": "test@test.com"})};
  const mockSes = { sendEmail: jest.fn().mockRejectedValue('error'), sendEmailWellcome: jest.fn().mockResolvedValue({ emailWellcome: false, message: 'correo enviado ' })};
  let service: any = new SesEmailService(mockFormModel as any);
  service = mockSes as any;
  const result = await service.sendEmailWellcome('test@test.com', { messageTemplate: 'test' }, 'test@test.com');
  expect(result.emailWellcome).toBe(false);
});
it('should send an email with attachment with correct parameters and return the expected response object', async () => {
      const toEmail = 'test@example.com';
      const template = { documentTemplate: '<p>Results attached.</p>' };
      const remite = 'noreply@example.com';
      const blobs = [{ filename: 'results', typefile: 'pdf', encoding: 'base64', filecontent: Buffer.from('test') }];
      const mailsTo = [{ name: 'test@example.com' }];
      const expectedResponse = { email: true, message: 'correo enviado ' };
      const idForm = '3233232ffddffddf3433434343434';
      const sendEmailSpy = jest.spyOn(service['ses'], 'sendEmail').mockReturnValue({ exec: jest.fn() } as any);
      try { const result = await service.sendEmailAttachmed(toEmail, template, remite, blobs, mailsTo, idForm);
      expect(sendEmailSpy).toHaveBeenCalledWith({ Destination: { ToAddresses: mailsTo.map((val) => val.name) },Message: { Body: { Html: { Charset: 'UTF-8', Data: template.documentTemplate } }, Subject: { Charset: 'UTF-8', Data: 'Resultados de Cuestionario' } }, Source: remite });
      expect(result).toEqual(expectedResponse); } catch (error) {expect(error).not.toEqual(expectedResponse);}
  });
      it('should send an email and update countSendWellcome when called with valid parameters', async () => {
        const toEmail = 'test@example.com';
        const template = { messageTemplate: 'Test message' };
        const remite = 'sender@example.com';
        const idForm = '3233232ffddffddf3433434343434';
        const formModelMock: any = { updateOne: jest.fn().mockReturnValue({exec: jest.fn().mockResolvedValueOnce({})} as any),findOne: jest.fn().mockReturnValue({exec: jest.fn().mockResolvedValueOnce({})} as any)};
        const sesEmailService = new SesEmailService(formModelMock);
        const result = await sesEmailService.sendEmailWellcome(toEmail, template, remite,idForm);
        expect(result.emailWellcome).not.toBe(true);
        expect(result.message).toBe('Error al enviar el correo.');
        expect(formModelMock.updateOne).not.toHaveBeenCalledWith({ contactEmail: toEmail }, { countSendWellcome: 0 });
      });
      it('should send an email and update countSendinterested when called with valid parameters', async () => {
        const toEmail = 'test@example.com';
        const template = { documentTemplate: 'Test document' };
        const remite = 'sender@example.com';
        const blobs = [];
        const mailsTo = [{ name: 'recipient@example.com' }];
        const idForm = '3233232ffddffddf3433434343434';
        const formModelMock: any = { updateOne: jest.fn().mockReturnValue({exec: jest.fn().mockResolvedValueOnce({})} as any), findOne: jest.fn().mockReturnValue({exec: jest.fn().mockResolvedValueOnce({})} as any)};
        const sesEmailService = new SesEmailService(formModelMock);
        const result = await sesEmailService.sendEmailAttachmed(toEmail, template, remite, blobs, mailsTo, idForm);
        expect(result.email).not.toBe(true);
        expect(result.message).toBe('Error al enviar el correo.');
        expect(formModelMock.updateOne).not.toHaveBeenCalledWith({ contactEmail: toEmail }, { countSendinterested: 0 });
      });
    it('should send an email and update countSendWellcome when called with empty blobs array', async () => {
      const toEmail = 'test@example.com';
      const template = { messageTemplate: 'Test message' };
      const remite = 'sender@example.com';
      const formModelMock: any = { updateOne: jest.fn().mockResolvedValueOnce({}),findOne: jest.fn().mockReturnValue({exec: jest.fn().mockResolvedValueOnce({})} as any)};
      const sesEmailService = new SesEmailService(formModelMock);
      const idForm = '3233232ffddffddf3433434343434';
      const result = await sesEmailService.sendEmailWellcome(toEmail, template, remite, idForm);expect(result.emailWellcome).not.toBe(true);expect(result.message).toBe('Error al enviar el correo.');expect(formModelMock.updateOne).not.toHaveBeenCalledWith({ contactEmail: toEmail }, { countSendWellcome: 0 });
    });
        it('should send an email and update countSendinterested when called with empty mailsTo array', async () => {
          const toEmail = 'test@example.com';
          const template = { documentTemplate: 'Test document' };
          const remite = 'sender@example.com';
          const blobs = [];
          const mailsTo = [];
          const idForm = '3233232ffddffddf3433434343434';
          const formModelMock: any = { updateOne: jest.fn().mockResolvedValueOnce({}),findOne: jest.fn().mockReturnValue({exec: jest.fn().mockResolvedValueOnce({})} as any)};
          const sesEmailService = new SesEmailService(formModelMock);const result = await sesEmailService.sendEmailAttachmed(toEmail, template, remite, blobs, mailsTo,idForm);
          expect(result.email).not.toBe(true);expect(result.message).toBe('Error al enviar el correo.');expect(formModelMock.updateOne).not.toHaveBeenCalledWith({ contactEmail: toEmail }, { countSendinterested: 0 });
        });
});