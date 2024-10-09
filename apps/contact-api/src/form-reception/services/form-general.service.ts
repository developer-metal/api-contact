import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AllForm, FormRequest, RetrieveForm, SavedForm } from '../dto/form.dto';
import { formsProviders } from '../model/form.providers';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from '../interface/project.interface';
import { ProjectProviders } from '../model/project.providers';
import { ObjectIdConstructor } from '../types/objectId.type';
import { CsvDataService } from './csv-data/csv-data.service';
import { ParseTemplateService } from './parse-template/parse-template.service';
import { formateaRut } from '../../common/helpers/formatRut';
import { SesEmailService } from './ses-email/ses-email.service';
import { v4 as uuidv4 } from 'uuid';
import { ValidationFormError } from '../../common/enums/codes-error.enum';
import { userAgent } from '../../common/helpers/userAgetData';
import { DateNow } from '../../common/helpers/validateDate';
@Injectable()
export class FormGeneralService {
  private readonly logger = new Logger();
  private formModel: Model<SavedForm>;
  private proyecModel: Model<Project>;
  private exportCsv: CsvDataService;
  private parseTemplateService: ParseTemplateService;
  private SesEmailServices: SesEmailService
  constructor(
    @InjectModel(formsProviders.name) formModel: Model<SavedForm>,
    @InjectModel(ProjectProviders.name) proyecModel: Model<Project>,
    exportCsv: CsvDataService,
    parseTemplateService: ParseTemplateService,
    SesEmailServices: SesEmailService

  ) {
    this.formModel = formModel;
    this.proyecModel = proyecModel;
    this.parseTemplateService = parseTemplateService;
    this.SesEmailServices = SesEmailServices;
    this.exportCsv = exportCsv;
  }
  async submitForm(body: FormRequest, headers): Promise<any> {
    try {
      this.logger.log(`'[FormGeneralService - submitForm] Ok`);
      const requestNumber: string = uuidv4();
      const {
        contactName,
        projectSlug,
        contactEmail,
        fields,
        blobs = []
      } = body;
      const dataTemplate = {
        nameFull: `${ contactName }`,
        idRequestForm: requestNumber,
        reportIdentification:  fields.fieldsContainer.find((item) => (item.statement?.toUpperCase() === 'TIPO DE REPORTE'))?.response ?? fields.reportIdentification,
        rut: formateaRut(fields.fieldsContainer.find((item) => item.statement?.toUpperCase() === 'RUT COMERCIO')?.response),
        nombreGeneral: fields.fieldsContainer.find((item) => (item.statement?.toUpperCase() === 'NOMBRE COMPLETO'))?.response,
        nombreComercio: fields.fieldsContainer.find((item) => (item.statement?.toUpperCase() === 'NOMBRE DEL COMERCIO'))?.response
      };
      const dataQuestions = {
        reportIdentification: fields.fieldsContainer.find((item) => (item.statement?.toUpperCase() === 'TIPO DE REPORTE'))?.response ?? fields.reportIdentification,
        nameContact: fields.fieldsContainer.find((item) => item.statement?.toUpperCase() === 'NOMBRE COMPLETO')?.response,
        email: fields.fieldsContainer.find((item) => item.statement?.toUpperCase() === 'EMAIL')?.response,
        celular: fields.fieldsContainer.find((item) => item.statement === 'Teléfono')?.response,
        rut: formateaRut(fields.fieldsContainer.find((item) => item.statement?.toUpperCase() === 'RUT COMERCIO')?.response),
        nombreGeneral: fields.fieldsContainer.find((item) => (item.statement?.toUpperCase() === 'NOMBRE COMPLETO'))?.response,
        nombreComercio: fields.fieldsContainer.find((item) => (item.statement?.toUpperCase() === 'NOMBRE DEL COMERCIO'))?.response,
        idRequestForm: requestNumber
      };
      const { _id, templateEmails: { titleClient, messageTemplate, titleExecutive, documentTemplate, mailsTo }, sender } =
        await this.proyecModel.findOne({ slug: projectSlug }).exec();
      const templateGeneral = {
        messageTemplate,
        titleClient,
        documentTemplate,
        titleExecutive,
        dataQuestions,
        dataTemplate,
        contactEmail,
        sender,
        blobs,
        mailsTo,
        projectSlug
      };
      const respon: any = await this.saveFormEmail(body, _id, requestNumber, headers);
      /*---------------------Job de Envio de correo-------*/
      await this.sendEmailTemplate(body ,templateGeneral, respon?.requestNumber, respon?._id);
      /*this._emailSendQueue.add('email-job', templateGeneral, {
        attempts: 1,
        removeOnFail: true
      });*/
      /*----------------------------------------------------*/
    } catch (error) {
      this.logger.log(`'[FormGeneralService - submitForm] Error1 ${JSON.stringify(error)}`);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Error al crear el Formulario.'
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }
  async retrieveForm(body: RetrieveForm): Promise<any> {
    try {
      const respFormat = await this.formatFindForm(body);
      const responseCsv = await this.exportCsv.exportCsv(respFormat);
      return { responseCsv, respFormat };
    } catch (error) {
      this.logger.log(`'[FormGeneralService - retrieveForm]: ${error}`);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message
        },
        HttpStatus.BAD_REQUEST
      );
  }
}
  async formatFindForm(data: RetrieveForm): Promise<object> {
    let $regex: object = {};
    let sendDate: object = {};
    const queryCustom: Array<object> = [];
    if (
      data.hasOwnProperty('startDate') &&
      data.hasOwnProperty('endDate')
    ) {
      sendDate = {
        $gte: new Date(data.startDate),
        $lte: new Date(data.endDate)
      };
      queryCustom.push({ sendDate });
    }
    const { startDate, endDate, ...restNew } = data;
    for (const key in restNew) {
      $regex = data[key];
      queryCustom.push({ [key]: { $regex, $options: 'i' } });
    }
   
    if (queryCustom.length === 0) {
      const response  = await this.formModel
        .find()
        .populate({ path: 'project', select: 'name sender mailsTo' })
        .exec();
        if (response.length === 0) {
          throw new Error('No se encontraron resultados asociados a la busqueda.');
        }
      return response;
    }
    const responseCustom = await this.formModel
      .find({ $and: queryCustom })
      .populate({ path: 'project', select: 'name sender mailsTo' })
      .exec();
    if (responseCustom.length === 0) {
      throw new Error('No se encontraron resultados asociados a la busqueda.');
    }
    return responseCustom;
  }
  async remove(id: string): Promise<any> {
    try {
      const message: any = { message: 'Formulario ha sido eliminado.' };
      const updateProject = await this.formModel.findOneAndDelete({ _id: id }).exec();
      if (!updateProject) {
        this.logger.log(`[service - FormGeneralService - remove ]:  Error al eliminar el Formulario.`);
        message.message = 'Error al eliminar el Formulario.';
        return message;
      }
      return message;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Error al eliminar el formulario.'
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async saveFormEmail(
    body: FormRequest,
    _id: ObjectIdConstructor,
    idRequest: string,
    headers: any
  ): Promise<string> {
    try {
      let dataUserAgent: string = userAgent(headers['user-agent']);
  const resposeMax: any = await this.formModel.findOne({project: _id}).populate({ path: 'project', select: 'max_form', match: { _id } }).exec();
      if(resposeMax) {
    const { project: {max_form} } = resposeMax;
    const countForm = await this.formModel.findOne({project: _id}).populate({ path: 'project', match: { _id } }).countDocuments().exec();
      if (max_form > 0 && countForm >= max_form) {
        this.logger.error(`'[FormGeneralService - saveFormEmail] - [MAXIMUM-EXCEED] - [FORM: ${countForm} - MAX: ${max_form}]`);
        throw { message: `[MAXIMUM-EXCEED] - [FORM: ${countForm} - MAX: ${max_form}`};
      }
   }
    let currentDate = DateNow();
    const requestForm = { ...body, project: _id, requestNumber: idRequest, user_agent: dataUserAgent, sendDate: currentDate};
    const formProject = new this.formModel(requestForm);
    const  responseForm: any = await formProject.save();
    return responseForm;
  } catch (error) {
    this.logger.log(`'[FormGeneralService - saveFormEmail] - Error ${JSON.stringify(error)}`);
    throw (`Error al guardar el formulario. ${JSON.stringify(error)}`)
  }
  }
  async sendEmailTemplate(body: any, templateGeneral: any, idRequest: string, idForm: any): Promise<void> {
    this.logger.log(`'[email-queue - email-job Ok `);
    const {
      messageTemplate,
      titleClient,
      documentTemplate,
      titleExecutive,
      dataQuestions,
      contactEmail,
      sender,
      blobs,
      mailsTo,
      projectSlug
    } = templateGeneral;
    const templateEmail = { messageTemplate, documentTemplate };
    const template = await this.parseTemplateService.parseTemplate(body, templateEmail, dataQuestions, idForm);
    const dataEmail = {contactEmail, template, sender, blobs, mailsTo, idRequest, titleOne: titleClient ?? '', titleTwo: titleExecutive ?? ''};
    const responseEmail = await this.sendEmailGeneral(dataEmail);
    const dataUpdateEmail = { projectSlug, contactEmail, idRequest, gratitude: responseEmail.messageTemplate, emailGeneral: responseEmail.documentTemplate };
    await this.updateStatusSendEmail(dataUpdateEmail);
  }
  async updateStatusSendEmail(dataUpdateEmail: any): Promise<any> {
    this.logger.log(`'[FormGeneralService - UpdateStatusFormEmail] Ok`);
    await this.formModel.updateOne(
        { $and: [{ projectSlug: dataUpdateEmail.projectSlug, contactEmail: dataUpdateEmail.contactEmail, requestNumber: dataUpdateEmail.idRequest }] },
        { thanksSent: dataUpdateEmail.gratitude, interestedSent: dataUpdateEmail.emailGeneral }
      ).exec();
  }
  async sendEmailGeneral(dataSend: any):Promise<any> {
    const template: any = {};
    if (dataSend.template.hasOwnProperty('messageTemplate') && dataSend.template?.messageTemplate) {
    const { emailWellcome } = await this.SesEmailServices.sendEmailWellcome(dataSend.contactEmail, dataSend.template, dataSend.sender, dataSend.idRequest, dataSend.titleOne);
    template.messageTemplate = emailWellcome;
    }
    if (dataSend.template.hasOwnProperty('documentTemplate') && dataSend.template?.documentTemplate) {
    const { email } = await this.SesEmailServices.sendEmailAttachmed(dataSend.contactEmail, dataSend.template, dataSend.sender, dataSend.blobs, dataSend.mailsTo, dataSend.idRequest, dataSend.titleTwo);
    template.documentTemplate = email;
    }
    return template;
  }
  async allForm(query: AllForm): Promise<any> {
    try {
      this.logger.log(`[service - FormProjectService - allForm ] Ok`);
      const format = await this.formatFormAll(query);
      return format;
    } catch (error) {
      this.logger.log(`[service - FormProjectService - allForm ] error ${JSON.stringify(error)}`);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Error al listar Formularios.'
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async formatFormAll(data: AllForm): Promise<any> {
    let content: object = {};
    let sendDate: object = {};
    const queryCustom: Array<any> = [];
    
    if (data.hasOwnProperty('startDate') && data.hasOwnProperty('endDate')) {
      sendDate = {
        $gte: new Date(data.startDate),
        $lte: new Date(data.endDate)
      };
      queryCustom.push({ sendDate });
    }
    const { startDate, endDate, ...restNew } = data;
    for (const key in restNew) {
      content = data[key];
      queryCustom.push({ [key]: content });
    }

    if (queryCustom.length === 0) {
      return await this.formModel.find()
        .populate({ path: 'project', select: 'name sender mailsTo' })
        .exec();
    }
    const responseCustom = await this.formModel.find({ $and: queryCustom })
      .populate({ path: 'project', select: 'name sender mailsTo' })
      .exec();
    if (responseCustom.length === 0) {
      return {
        message: 'No se encontraron resultados asociados a la busqueda.'
      };
    }
    return responseCustom;
  }
 async validationForm(body: any): Promise<any> {
    try {
        const { slug } = body;
        const responseProject = await this.proyecModel.findOne({slug}).exec();
        if (responseProject) {
        const _id: ObjectIdConstructor = responseProject._id;
        const resposeMax: any = await this.formModel.findOne({project: _id}).populate({ path: 'project', select: 'max_form', match: { _id } }).exec();
        if(resposeMax) {
      const { project: {max_form} } = resposeMax;
      const countForm = await this.formModel.findOne({project: responseProject._id}).populate({ path: 'project', match: { _id } }).countDocuments().exec();
        if (max_form > 0 && countForm >= max_form) {
          this.logger.error(`'[FormGeneralService - saveFormEmail] - [MAXIMUM-EXCEED] - [FORM: ${countForm} - MAX: ${max_form}]`);
          return { code: ValidationFormError.Top_max_project, flag: true, message: 'Se ha excedido el máximo de formularios permitidos.' };
        }
      }
    }
      return { flag: false, message: 'Se ha validado el formulario.'};
    } catch (error) {
      this.logger.log(`'[FormGeneralService - validationForm] - Error ${JSON.stringify(error)}`);
      throw { status: 500, message: 'Error al validar el formulario.' };
    }
  }
}