import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as AWS from 'aws-sdk';
import { Model } from 'mongoose';
import { SavedForm } from '../../../form-reception/dto/form.dto';
import { InjectModel } from '@nestjs/mongoose';
import { formsProviders } from '../../../form-reception/model/form.providers';
@Injectable()
export class SesEmailService {
  private readonly ses: AWS.SES;
  public readonly logger = new Logger();
  private formModel: Model<SavedForm>;
  constructor(@InjectModel(formsProviders.name) formModel: Model<SavedForm>) {
    AWS.config.update({
      accessKeyId: process.env.ACCESSKEYID,
      secretAccessKey: process.env.SECRETAWS,
      region: process.env.REGION
    });
    this.ses = new AWS.SES();
    AWS.config.update({ region: process.env.REGION });
    this.formModel = formModel;
  }
  async sendEmailWellcome(
    toEmail: string,
    template: any,
    remite: string,
    idForm: string,
    titleGratitude: string
  ): Promise<any> {
    const respEmail: any = { emailWellcome: true, message: 'correo enviado ' };
    const params: any = {};
    params.Destination = { ToAddresses: [toEmail] };
    params.Message = {
      Body: { Html: { Charset: 'UTF-8', Data: template.messageTemplate } },
      Subject: {
        Charset: 'UTF-8',
        Data: titleGratitude
      }
    };
    params.Source = remite;
    const responseEmail = this.ses.sendEmail(params).promise();
    return responseEmail
      .then(async (data) => {
        this.logger.log(`[SesEmailService - wellcome-sendEmail] Ok`);
        respEmail.emailWellcome = true;
        await this.formModel
          .updateOne({ $and: [{ contactEmail: toEmail, requestNumber: idForm }]}, { countSendWellcome: 0 })
          .exec();
        return respEmail;
      })
      .catch(async (err) => {
        this.logger.log(`[SesEmailService - wellcome-sendEmail] Error ${err}}`);
        const flatWellcome = 1;
        let blobs: Array<any> = [];
        let mailsTo: Array<any> = [];
        await this.retrySendEmail(flatWellcome, toEmail, template, remite, idForm, titleGratitude, blobs, mailsTo);
        respEmail.emailWellcome = false;
        respEmail.message = 'Error al enviar el correo.';
        return respEmail;
      });
  }
  async sendEmailAttachmed(
    toEmail: string,
    template: any,
    remite: string,
    blobs: Array<any>,
    mailsTo: Array<any>,
    idForm: string,
    titleGratitude: string
  ): Promise<any> {
    const respEmail: any = { email: true, message: 'correo enviado ' };
    const params: any = {};
    const contentEmail: any = { toEmail, remite, blobs, mailsTo, titleGratitude };
    if (blobs.length > 0) {
      return await this.sendEmailAttachmend(contentEmail, template, idForm);
    }
    params.Destination = { ToAddresses: mailsTo.map((val) => val.name) };
    params.Message = {
      Body: { Html: { Charset: 'UTF-8', Data: template.documentTemplate } },
      Subject: { Charset: 'UTF-8', Data: titleGratitude }
    };
    params.Source = remite;

    const responseEmail = this.ses.sendEmail(params).promise();
    return responseEmail
      .then(async (data) => {
        this.logger.log(`[SesEmailService - Questions-sendEmail] Ok`);
        respEmail.email = true;
        await this.formModel
          .updateOne({ $and: [{ contactEmail: toEmail, requestNumber: idForm }] }, {countSendinterested: 0 })
          .exec();
        return respEmail;
      })
      .catch(async (err) => {
        this.logger.log(
          `[SesEmailService - Questions-sendEmail] Error}`
        );
        const flatinterested = 2;
        await this.retrySendEmail(
          flatinterested,
          toEmail,
          template,
          remite,
          idForm,
          titleGratitude,
          blobs,
          mailsTo
        );
        respEmail.email = false;
        respEmail.message = 'Error al enviar el correo.';
        return respEmail;
      });
  }
  private async sendEmailAttachmend(
    contentEmail: any,
    template: any,
    idForm: string
  ): Promise<void> {
    const respEmailAttachmend: any = {
      email: true,
      message: 'correo Adjunto enviado'
    };
    const paramsAttch: any = {};
    paramsAttch.Destinations = contentEmail.mailsTo.map((val) => val.name);
    paramsAttch.Source = contentEmail.remite;
    paramsAttch.RawMessage = {
      Data: this.createRawEmail(
        contentEmail.titleGratitude,
        template.documentTemplate,
        contentEmail.blobs
      )
    };
    const responseEmailAttchamend = this.ses
      .sendRawEmail(paramsAttch)
      .promise();
    return responseEmailAttchamend
      .then(async (data) => {
        this.logger.log(`[SesEmailService - sendEmail - Attachment] Ok`);
        respEmailAttachmend.email = true;
        await this.formModel
          .updateOne({ $and: [{ contactEmail: contentEmail.toEmail, requestNumber: idForm }]}, { countSendinterested: 0 })
          .exec();
        return respEmailAttachmend;
      })
      .catch(async (err) => {
        this.logger.log(
          `[SesEmailService - sendEmail - Attachment] Error ${err}}`
        );
        const flatinterested = 2;
        await this.retrySendEmail(
          flatinterested,
          contentEmail.toEmail,
          template,
          contentEmail.remite,
          idForm,
          contentEmail.titleGratitude,
          contentEmail.blobs,
          contentEmail.mailsTo
        );
        respEmailAttachmend.email = false;
        respEmailAttachmend.message = 'Error al enviar el correo.';
        return respEmailAttachmend;
      });
  }

  private createRawEmail(
    subject: string,
    body: string,
    attachmentData: any
  ): string {
    const boundary = uuidv4();
    let rawEmail = '';
    rawEmail += `Subject: ${subject}\n`;
    rawEmail += `MIME-Version: 1.0\n`;
    rawEmail += `Content-Type: multipart/mixed; boundary="${boundary}"\n\n`;
    rawEmail += `--${boundary}\n`;
    rawEmail += `Content-Type: text/html; charset=UTF-8\n\n`;
    rawEmail += `${body}\n\n`;
    rawEmail += `--${boundary}\n`;
    rawEmail += `Content-Type: application/octet-stream; name=\"${attachmentData.map(
      (val) => val.filename + '.' + val.typefile
    )}\"\n`;
    rawEmail += `Content-Transfer-Encoding: ${attachmentData.map(
      (val) => val.encoding,
    )}\n`;
    rawEmail += 'Content-Disposition: attachment\n\n';
    rawEmail += `${attachmentData.map((val) =>
      val.filecontent.toString('base64').replace(/([^\0]{76})/g, '$1\n'),
    )}\n\n`;
    rawEmail += `\n\n--${boundary}--`;
    return rawEmail;
  }

  private async retrySendEmail(
    flag: number,
    toEmail: string,
    template: any,
    remite: string,
    idForm: string,
    titleEmail: string,
    blobs?: Array<any>,
    mailsTo?: Array<any>
  ): Promise<void> {
    const retrySendEmail: any = await this.formModel
      .findOne(
        { $and: [{ contactEmail: toEmail, requestNumber: idForm }] },
        'countSendWellcome  countSendinterested'
      )
      .exec();
    if (flag == 1 && retrySendEmail.countSendWellcome < 3) {
      retrySendEmail.countSendWellcome += 1;
      await this.formModel
        .updateOne(
          { $and: [{ contactEmail: toEmail, requestNumber: idForm }]}, { countSendWellcome: retrySendEmail.countSendWellcome }
        )
        .exec();
      await this.sendEmailWellcome(toEmail, template, remite, idForm, titleEmail);
      this.logger.log(`retry Wellcome ${retrySendEmail.countSendWellcome}`);
    }
    if (flag == 2 && retrySendEmail?.countSendinterested < 3) {
      this.logger.log(
        `retry countSendinterested ${retrySendEmail?.countSendinterested}`
      );
      retrySendEmail.countSendinterested += 1;
      await this.formModel
        .updateOne(
          { $and: [{ contactEmail: toEmail, requestNumber: idForm }]}, { countSendinterested: retrySendEmail?.countSendinterested }
        )
        .exec();
      await this.sendEmailAttachmed(toEmail, template, remite, blobs, mailsTo, idForm, titleEmail);
      this.logger.log(
        `retry countSendinterested ${retrySendEmail?.countSendinterested}`
      );
    }
    if (
      retrySendEmail?.countSendWellcome == 3 &&
      retrySendEmail?.countSendinterested == 3
    ) {
      this.logger.log(`retry Maximo intentos superados ${retrySendEmail}`);
      this.logger.log(`'[FormGeneralService - submitForm] Error ${retrySendEmail}`);
    }
  }
}
