import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import handlebars from 'handlebars';
import { LogTemplatesProviders } from '../../model/logTemplate.providers';
import { Model } from 'mongoose';
import { base64ToString, decodeBase64, getBase64 } from '../../../common/helpers/decodeBase64';
import { DateNow } from '../../../common/helpers/validateDate';
import { ConfigService } from '@nestjs/config';
import removeSection from '../../../common/helpers/removeSection';
@Injectable()
export class ParseTemplateService {
  private readonly logger = new Logger();
  private saveEmail: Model<any>;
  private configService: ConfigService;
  constructor(@InjectModel(LogTemplatesProviders.name) saveEmail: Model<any>, configService: ConfigService) {
    this.saveEmail = saveEmail;
    this.configService = configService;
  }
  async parseTemplate(
    body: any,
    template: object,
    dataQuestions: any,
    idForm: any
  ): Promise<any> {
    try {
      const respoTemplate = await this.dataTemplate(body, template,dataQuestions, idForm);
      return respoTemplate;
    } catch (error) {
      this.logger.log(`[ParseTemplateService - parseTemplate] Error ${error}`);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Error al leer el template.'
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }
  async dataTemplate(body: any, templte: any, dataQuestions, idForm: any ): Promise<any> {
    try {
      let template: any = await this.validFormatTemplate(body, templte, dataQuestions,idForm);
      return template;
    } catch (error) {
      this.logger.error(`'[ParseTemplateService -  dataTemplate] :'${error}`);
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: error
        },
        HttpStatus.NOT_FOUND
      );
    }
  }
  validFormatTemplate = async (body: any, templte: any, dataQuestions, idform): Promise<any> => {
    const replacedHtml: any = { messageTemplate: '', documentTemplate: '' }; 
    if (dataQuestions?.hasOwnProperty('reportIdentification') && dataQuestions?.reportIdentification) {
        let bodyClient = await this.saveLogTemplate(dataQuestions, templte, idform);
        const templateGeeral: any = this.validTemplateCompile(templte, body, replacedHtml, bodyClient);
        await this.updateLogTemplate(templateGeeral, bodyClient);
        return templateGeeral;
      } else if (!body?.fields.hasOwnProperty('reportIdentification')) {
        let bodyEject = await this.saveLogTemplate(body, templte, idform);
        const templateGeeral: any = this.validTemplateCompile(templte, bodyEject, replacedHtml, dataQuestions);
        await this.updateLogTemplate(templateGeeral, bodyEject);
        this.logger.log(`'[ParseTemplateService - dataTemplate] Ok`);
        return templateGeeral;
      }
  };
  validTemplateCompile = (templte: any,data: any, templateFinal: any, dataQuestions: any): object => {
    for(let key in templte) {
        templte[key] = base64ToString(templte[key]);
        const template = handlebars.compile(templte[key]);
        templateFinal[key] = (dataQuestions?.hasOwnProperty('reportIdentification') && dataQuestions?.reportIdentification) ?template(dataQuestions) : template(data);
    }
    return templateFinal;
  }
  saveLogTemplate = async (data: any,templte: any, idForm: any): Promise<any> => {
    try {
    let formaBody: any = { ...data };
    if (templte?.hasOwnProperty('messageTemplate') && templte?.messageTemplate != '') {
      const saveClient = { template_email: templte?.messageTemplate, forms: idForm, date_register: DateNow()};
      const temeplateOne = await new this.saveEmail(saveClient).save();
      const endpointEmail = `${this.configService.get<string>('endpoint_host')}/${temeplateOne?._id}`
      formaBody = {...formaBody, id_client: temeplateOne?._id, email_client: endpointEmail};
    }
    if (templte?.hasOwnProperty('documentTemplate') && templte?.documentTemplate != '') {
      const saveEjectu = { template_email: templte?.documentTemplate, forms: idForm, date_register: DateNow()};
      const temeplateTwo = await new this.saveEmail(saveEjectu).save();
      const endpointEmail = `${this.configService.get<string>('endpoint_host')}/${temeplateTwo?._id}`
      formaBody = { ...formaBody, id_ejecutive: temeplateTwo?._id, email_ejecutive: endpointEmail };
    }
    return formaBody;
    } catch (error) {
      this.logger.error(`'[ParseTemplateService - saveLogTemplate] :'${error}`);
    }
  }
  updateLogTemplate = async (templateGeeral: any,body: any): Promise<any> => {
    try {
    if (templateGeeral?.messageTemplate != '' && body?.id_client) {
      let client = await getBase64(templateGeeral?.messageTemplate);
    await this.saveEmail.findByIdAndUpdate({ _id: body?.id_client }, { $set: { template_email:  client } });
    }
    if (templateGeeral?.documentTemplate != '' && body?.id_ejecutive) {
      let ejectu = await getBase64(templateGeeral?.documentTemplate);
      await this.saveEmail.findByIdAndUpdate({ _id: body?.id_ejecutive }, { $set: { template_email: ejectu } });
    }
  } catch (error) {
    this.logger.error(`'[ParseTemplateService - updateLogTemplate] :'${error}`);
  }
  }
  async getTemplateEmail(id: string): Promise<any> {
    try {
      this.logger.log(`'[ParseTemplateService - getTemplateEmail] Ok`);
      const templateEmail = await this.saveEmail.findById({ _id: id }).exec();
      if (!templateEmail) { throw new Error('No se encontro el template de email.'); }
      const emailHtml = decodeBase64(templateEmail.template_email);
      const customHtml = removeSection(emailHtml);
      this.logger.warn(`'[ParseTemplateService - getTemplateEmail] OK`);
      return customHtml;
    } catch (error) {
      this.logger.error(`'[ParseTemplateService - getTemplateEmail] :'${JSON.stringify(error)}`);
      throw new Error('Error al obtener el template de email.');
    }
  }
}