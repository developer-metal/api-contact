import { Processor } from '@nestjs/bull';
import { ParseTemplateService } from '../../parse-template/parse-template.service';
import { SesEmailService } from '../ses-email.service';
import { Logger } from '@nestjs/common';
import { SavedForm } from '../../../dto/form.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { formsProviders } from '../../../model/form.providers';
@Processor('email-queue') //cola de procesamiento
export class SendEmailProcessor {
  private readonly logger = new Logger();
  private formModel: Model<SavedForm>;
  private readonly parseTemplateService: ParseTemplateService;
  private readonly SesEmailServices: SesEmailService;
  constructor(
    @InjectModel(formsProviders.name) formModelSrv: Model<SavedForm>,
    parseTemplateService: ParseTemplateService,
    SesEmailServices: SesEmailService
  ) {
    this.formModel = formModelSrv;
    this.parseTemplateService = parseTemplateService;
    this.SesEmailServices = SesEmailServices;
  }

  /*@Process('email-job')
  async sendEmailTemplate(body: any,job: Job<any>) {
    this.logger.log(`'[email-queue - email-job Ok`);
    const requestNumber: string = uuidv4();
    const {
      messageTemplate,
      documentTemplate,
      dataQuestions,
      dataTemplate,
      contactEmail,
      sender,
      blobs,
      mailsTo,
      projectSlug,
      titleGratitude,
      titleForm
    } = job.data;
    const templateEmail = { messageTemplate, documentTemplate };
    const template = await this.parseTemplateService.parseTemplate(
      body,
      templateEmail,
      dataQuestions,
      idProject
    );
    const { emailWellcome } = await this.SesEmailServices.sendEmailWellcome(
      contactEmail,
      template,
      sender,
      requestNumber,
      titleGratitude
    );
    const { email } = await this.SesEmailServices.sendEmailAttachmed(
      contactEmail,
      template,
      sender,
      blobs,
      mailsTo,
      requestNumber,
      titleForm
    );
    if (email || emailWellcome) {
      this.logger.log(`'[FormGeneralService - UpdateFormEmail] Ok`);
      await this.formModel
        .updateOne(
          { $and: [{ projectSlug, contactEmail }] },
          { thanksSent: emailWellcome, interestedSent: email }
        )
        .exec();
    }
  }*/
}
