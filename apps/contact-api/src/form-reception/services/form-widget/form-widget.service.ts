import {Injectable, Logger } from '@nestjs/common';
import handlebars from 'handlebars';
import { base64ToString } from '../../../common/helpers/decodeBase64';
import validationScript from '../../../common/const/validationScript';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { widgetFormsProviders } from '../../../form-reception/model/widgetForm.providers';
import { Model } from 'mongoose';
import { FormWidget, RangeDate, SearchFormDto, StageQuestionsData } from '../../../form-reception/dto/form-widget.dto';
import { Project } from '../../../form-reception/interface/project.interface';
import { ProjectProviders } from '../../../form-reception/model/project.providers';
import { GroupQuestionsProviders } from '../../../form-reception/model/group-questions.providers';
import { DateNow } from '../../../common/helpers/validateDate';
import { FormWidgetError, GroupQuestionstError } from '../../../common/enums/codes-error.enum';
import { FormWidgetSuccess, GroupQuestionsSuccess } from '../../../common/enums/codes-success.enum';
import { ObjectIdConstructor } from '../../../form-reception/types/objectId.type';
import validId from '../../../common/helpers/valid-ID';
import validationScriptTwo from '../../../common/const/form_2.0/validationScript';
@Injectable()
export class FormWidgetService {
    private readonly logger = new Logger();
    private _configService: ConfigService;
    private widgetFormModel: Model<FormWidget>;
    private proyecModel: Model<Project>;
    private groupQuestionsModel: Model<StageQuestionsData>;
    constructor(_configService: ConfigService,
      @InjectModel(widgetFormsProviders.name) widgetFormModel: Model<FormWidget>, 
      @InjectModel(ProjectProviders.name) projectModel: Model<Project>,
      @InjectModel(GroupQuestionsProviders.name) groupQuestionsModel: Model<StageQuestionsData>) {
        this._configService = _configService;
        this.widgetFormModel = widgetFormModel;
        this.proyecModel = projectModel;
        this.groupQuestionsModel = groupQuestionsModel;
        }
    async saveGroupQuestionsService(body: StageQuestionsData): Promise<any> {
      try {
      const { project_name } = body;
      const responseGroup = { code: GroupQuestionsSuccess.Group_Create_Success, message: 'Grupo creado exitosamente.'}; 
      const idProject: any = await this.widgetFormModel.findOne({project_name}).populate({ path: 'project', select: 'name', match: { name: project_name } }).exec();
      if (!idProject) { throw { message: 'El formulario no existe.', code: GroupQuestionstError.Form_Not_Exists };}
      const groupRequest = {...body, forms: idProject, active: true, creationDate: DateNow(), updateDate: DateNow() };
      const saveGroup: any = new this.groupQuestionsModel(groupRequest);
      await saveGroup.save();
      this.logger.log(`[FormWidgetService - saveGroupQuestionsService ] OK`);
      return responseGroup;
      } catch (error) {
        this.logger.log(`[FormWidgetService - saveGroupQuestionsService ] Error ${JSON.stringify(error)}`);
          if (error.code === 11000) {
            throw { message: 'Grupo ya existe', code: GroupQuestionstError.Group_Exists };
        } else {
            throw error;
        }
      }
    }
    async saveWidgetFormService(body: any): Promise<any> {
      try {
        const { project_name, title, description, image, template, apiEndpoint, elements } = body;
        const idProject: any = await this.proyecModel.findOne({ slug: project_name }).exec();
        if (!idProject) { throw { message: 'El proyecto no existe.', code: FormWidgetError.Project_No_Exists };}
        const idForm = uuidv4();
        if (!idForm) { throw { message: 'Uuid no se genero.', code: FormWidgetError.Error_Uuid_Not_Generated };}
        const response = { code: FormWidgetSuccess.Form_Create_Success, message: 'Formulario creado exitosamente.'}; 
        const formatRequest = {...body, project: idProject, single_form: idForm, active: true , project_name, title, description, image, template, apiEndpoint, elements, creationDate: DateNow(), updateDate: DateNow() };
        const createdWidgetForm: any = new this.widgetFormModel(formatRequest);
        await createdWidgetForm.save();
        this.logger.log(`[FormWidgetService - saveWidgetForm ] OK`);
        return response;
      } catch (error) {
        this.logger.log(`[FormWidgetService - saveWidgetForm ] Error ${JSON.stringify(error)}`);
            if (error.code === 11000) {
              throw { message: 'formulario ya existe', code: FormWidgetError.Form_Exists };
          } else {
              throw error;
          }
      }
  }
  async deleteWidgetFormService(_id: any): Promise<any> {
    try {
      let response = { code: FormWidgetSuccess.Form_Delete_Success, message: 'Formulario Eliminado.'};
      const deleteResponse = await this.widgetFormModel.findByIdAndDelete(_id).exec();
      if (!deleteResponse) { throw { code: FormWidgetError.Form_Not_Exists ,message: 'Formulario no encontrado' }}
      this.logger.log(`[FormWidgetService - deleteWidgetForm ] OK`);
      return response;
    } catch (error) {
      this.logger.log(`[FormWidgetService - deleteWidgetForm ] Error ${JSON.stringify(error)}`);
      throw error;
    }
  }
  async deleteWidgetGroupService(_id: any): Promise<any> {
    try {
      let response = { code: GroupQuestionsSuccess.Group_Delete_Success, message: 'Grupo Eliminado.'};
      const deleteResponse = await this.groupQuestionsModel.findByIdAndDelete(_id).exec();
      if (!deleteResponse) { throw { code: FormWidgetError.Form_Not_Exists ,message: 'Grupo no existe.' }}
      this.logger.log(`[FormWidgetService - deleteWidgetGroupService ] OK`);
      return response;
    } catch (error) {
      this.logger.log(`[FormWidgetService - deleteWidgetGroupService ] Error ${JSON.stringify(error)}`);
      throw error;
    }
  }
  async searchWidgetFormService(body: SearchFormDto): Promise<any> {
    try {
      let content: object = {};
      let creationDate: object = {};
      const queryCustom: Array<any> = [];
      if (body.hasOwnProperty('startDate') && body.hasOwnProperty('endDate')) {
        creationDate = {
          $gte: body.startDate,
          $lte: body.endDate
        };
        queryCustom.push({ creationDate });
      }
      const { startDate, endDate, ...restNew } = body;
      for (const key in restNew) {
        content = body[key];
        queryCustom.push({ [key]: content });
      }
      if (queryCustom.length === 0) {
        return await this.widgetFormModel.find().populate({ path: 'project', select: 'name' }).exec();
      }
      const responseCustom = await this.widgetFormModel.find({ $and: queryCustom }).populate({ path: 'project', select: 'name' }).exec();
      if (responseCustom.length === 0) {
      throw { code: FormWidgetError.Form_Not_Result_Search, message: 'No existen resultados asociados a la busquedad.' };
      }
      this.logger.log(`[FormWidgetService - searchWidgetForm ] OK`);
      return responseCustom;
    } catch (error) {
      this.logger.log(`[FormWidgetService - searchWidgetForm ] Error ${JSON.stringify(error)}`);
      throw error;
    }
  }

  async searchWidgetGroupService(body: RangeDate): Promise<any> {
    try {
      let content: object = {};
      let creationDate: object = {};
      const queryCustom: Array<any> = [];
      if (body.hasOwnProperty('startDate') && body.hasOwnProperty('endDate')) {
        creationDate = {
          $gte: body.startDate,
          $lte: body.endDate
        };
        queryCustom.push({ creationDate });
      }
      const { startDate, endDate, ...restNew } = body;
      for (const key in restNew) {
        content = body[key];
        queryCustom.push({ [key]: content });
      }
      if (queryCustom.length === 0) {
        return await this.groupQuestionsModel.find().exec();
      }
      const responseCustom = await this.groupQuestionsModel.find({ $and: queryCustom }).exec();
      if (responseCustom.length === 0) {
      throw { code: FormWidgetError.Form_Not_Result_Search, message: 'No existen resultados asociados a la busquedad.' };
      }
      this.logger.log(`[FormWidgetService - searchWidgetGroupService ] OK`);
      return responseCustom;
    } catch (error) {
      this.logger.log(`[FormWidgetService - searchWidgetGroupService ] Error ${JSON.stringify(error)}`);
      throw error;
    }
  }
    async getWidgetFormService(idForm: any, dataParams: any): Promise<any> {
         try {
       const responseProject: any =  await this.widgetFormModel.findOne({single_form: idForm}).select('project_name').exec();
       if (!responseProject) { throw { message: "Proyecto no encontrado", code: FormWidgetError.Project_No_Exists };}
       const responseForm: any = await this.groupQuestionsModel.findOne({project_name: responseProject.project_name}).populate({ path: 'forms', select: 'project_name template elements title title_position header_image url_external description notifications', match: { single_form: idForm }
      }).exec();
      if (!responseForm?.forms) { throw { message: "Formulario no encontrado", code: FormWidgetError.Form_Not_Exists };}
        const elements: any = this.matchQuestionsStage(responseForm?.stages, responseForm?.forms);
        let captchaGeneral: string = this._configService.get<string>('key_recapta'); 
        let urlExternal: string = responseForm?.forms?.url_external;
        const dataTemplate = { ...responseForm, title: responseForm?.forms?.title, header_image: responseForm?.forms?.header_image, description: responseForm?.forms?.description, stages_form: elements, captchaScoupe: captchaGeneral, generateValidationScript: this.generateValidationScript.bind(this, responseForm, captchaGeneral, dataParams, urlExternal), captcha: captchaGeneral, notifications: responseForm?.forms?.notifications, image_notif: responseForm?.image_notifications};
        handlebars.registerHelper("generateInputHTMLCutom", (answer, questions) => {
          return this.generateInputHTML(answer, questions);
        });
      handlebars.registerHelper('eq', function(a, b) {
        return a === b;
      });
      handlebars.registerHelper('not', function(value) {
        return !value;
      });
      handlebars.registerHelper('gt', function(a, b) {
        return a > b;
      });
      handlebars.registerHelper('subtract', function(a, b) {
        return a - b;
      });
        handlebars.registerHelper('validationBlocks', (answer, questions, nameSelect, nameChek, labelCheck, checkDiv, itefom): any => {
          const resultFromHelperA = handlebars.helpers['generateInputHTMLCutom'](answer, questions);
          switch (answer?.type) {
            case 'button':
              return new handlebars.SafeString('<div class="'+itefom+'"><div class="'+nameSelect+'">'+resultFromHelperA+'</div></div>');
            case 'text':
              return new handlebars.SafeString('<div class="'+itefom+'">'+resultFromHelperA+'</div>');
            case 'email':
              return new handlebars.SafeString('<div class="'+itefom+'">'+resultFromHelperA+'</div>');
            case 'checkbox':
              return new handlebars.SafeString('<div class="'+checkDiv+'">'+this.generateCheckbox(answer, questions, nameChek, labelCheck)+'</div>');
            case 'radio':
              return new handlebars.SafeString('<div class="'+itefom+'">'+this.generateRadio(answer, questions, nameChek, labelCheck)+'</div>');
              case 'textarea':
              return new handlebars.SafeString('<div class="'+itefom+'">'+this.generateTextarea(answer, questions)+'</div>');
            case 'file':
                return new handlebars.SafeString('<div class="'+itefom+'">'+this.generateFile(answer, questions)+'</div>');
            case 'tel':
                  return new handlebars.SafeString('<div class="'+itefom+'">'+this.generateTelePhone(answer, questions)+'</div>');
            case 'url':
                  return new handlebars.SafeString('<div class="'+itefom+'">'+this.generateUrl(answer, questions)+'</div>');
            default:
              return '';
                }
        });
        let templateHTML: string =  responseForm?.forms?.template;
        let decodedHTML = base64ToString(templateHTML);
        let template = handlebars.compile(decodedHTML);
        let templateHtmlFinal: string = template(dataTemplate);
        return templateHtmlFinal;
        } catch (error) {
        this.logger.log(`[FormWidgetService - getWidgetForm - Error ] ${JSON.stringify(error)}`);
        throw error;
        }
    }
    private matchQuestionsStage = (stages: any, forms: any): Array<any> => {
      let contentQuestions: Array<any> = [];
      for (const element of stages) {
        const { questions_stage, name_stage, imagen_stage } = element;
        const questionOrder = questions_stage.map((question: any) => question?.id_question);
        const matchingQuestions: Array<any> = [];
        for (const questionId of questionOrder) {
          const question = forms?.elements.find((questionStage: any) => questionStage._id == questionId);
          if (question) {
            matchingQuestions.push(question);
          }
        }
        const objectWithoutId = matchingQuestions.map((item: any) => {
          const { _id, ...rest } = item;
          return rest._doc;
        });
        contentQuestions.push({
          name_stage,
          imagen_stage,
          questions_stage: objectWithoutId
        });
      }
    
      return contentQuestions;
    }
    async updateWidgetFormService(idUpdate: any, body: any): Promise<any> {
      try {
        const response = { code: FormWidgetSuccess.Form_Update_Success, message: 'Formulario Widget actualizado exitosamente.' };
        const { project_name, elements } = body;
        const idProject: any = await this.proyecModel.findOne({ slug: project_name }).exec();
        if (!idProject) { 
          throw { code: FormWidgetError.Project_No_Exists, message: 'Proyecto no existe.' }; 
        }
        const currentForm = await this.widgetFormModel.findById(idUpdate).exec();
        const updateFields: any = {...body,  project_name, updateDate: DateNow() };
        if (elements) {
            updateFields.elements = currentForm.elements.map((element: any, index: any) => {
              if (elements[index]) {
                return { _id: element?._id, question: elements[index].question, answer: elements[index].answer };
              }
              return element;
            });
          }
        const updateResponse = await this.widgetFormModel.findByIdAndUpdate({ _id: idUpdate }, { $set: updateFields }).exec();
        if (!updateResponse) { throw { code :FormWidgetError.Form_Not_Exists, message: 'Formulario no se puedo actualizar' } }
        this.logger.log(`[FormWidgetService - updateWidgetForm] OK`);
        return response;
      } catch (error) {
        this.logger.log(`[FormWidgetService - updateWidgetForm] Error ${JSON.stringify(error)}`);
        throw error;
      }
    }
    async updateGroupQuestionsService(id: any, body: any): Promise<any> {
      if (!validId(id)) {
        throw { code: GroupQuestionstError.Id_not_valid, message: 'ID no valido.' };
      }
      try {
        const response = { code: GroupQuestionsSuccess.Group_Update_Success, message: 'Grupo actualizado exitosamente.'};
        const { project_name } = body;
        this.logger.log(`[FormWidgetService - updateGroupQuestionsService ] OK ${JSON.stringify(project_name)}`);
        const idProject: any = await this.widgetFormModel.findOne({ project_name: project_name }).exec();
        if (!idProject) { throw { code: GroupQuestionstError.Project_No_Exists, message: 'Projecto no existe.'}; }
        const updateRequestGroup = {...body, project_name, updateDate: DateNow() };
        const updateResponse = await this.groupQuestionsModel.findByIdAndUpdate(id, updateRequestGroup).exec();
        if (!updateResponse) { throw { code :GroupQuestionstError.Group_Not_Result_Search, message: 'Grupo no existe.' } }
        this.logger.log(`[FormWidgetService - updateGroupQuestionsService ] OK`);
        return response;
      } catch (error) {
        this.logger.log(`[FormWidgetService - updateGroupQuestionsService ] Error ${JSON.stringify(error)}`);
        throw error;
      }
    }
    async getGroupQuestionsIdService(id: any): Promise<any> {
      const _id: ObjectIdConstructor = id;
      if (!validId(id)) {
        throw { code: GroupQuestionstError.Id_not_valid, message: 'ID no valido.' };
      }
      try {
        const response = await this.groupQuestionsModel.findOne({_id}).exec();
        if (!response) { throw { code: GroupQuestionstError.Group_Not_Result_Search, message: 'Grupo Form no encontrado.' };}
        this.logger.log(`[FormWidgetService - getGroupQuestionsIdService ] OK`);
        return response;
      } catch (error) {
        this.logger.log(`[FormWidgetService - getGroupQuestionsIdService ] Error ${JSON.stringify(error)}`);
        throw error;
      }
    }
        private generateValidationScript(elements: any, keyGeneral: string, dataParams: any, urlExternal: any): string {
          const endpointBff: string = this._configService.get<string>('endpoint_bff');
          const endpointCES: string = this._configService.get<string>('endpoint_CES');
              const dataValidation = {
                endpointApi: endpointBff,
                endpointCES,
                projectForm: elements?.forms?.project_name,
                captcha: keyGeneral,
                urlExternal,
                dataParams
              };
              if (elements?.forms?.project_name?.toUpperCase() === 'VECDIS') {
              return validationScript(dataValidation);
              } else {
                return validationScriptTwo(dataValidation);
              }
        }
      public generateInputHTML(answer: { type: string; options?: string[],  name: string,id: string, class:string,validation:boolean, data_bs_toggle?: string, aria_expanded?: boolean, ul_class?: string, li_class?: string, placeholder?: string, other_input: any }, questions: {class: string, for: string, text: string}): string {
        switch (answer?.type) {
          case 'text':
            return this.generateElementText(answer, questions);
          case 'email':
            return this.generateElemenEmail(answer, questions);
          case 'radio':
            return this.generateRadio(answer, questions);
          case 'checkbox':
            return this.generateCheckbox(answer, questions);
          case 'button':
            return this.generateSelect(answer, questions);
          case 'textarea':
            return this.generateTextarea(answer, questions);
          case 'range':
            return this.generateElementRange(answer, questions);
          case 'file':
            return this.generateFile(answer, questions);
          case 'tel':
            return this.generateTelePhone(answer, questions);
            case 'url':
            return this.generateUrl(answer, questions);
          default:
            return '';
        }
      }
      private generateElementText(answer, questions): string {
        const validationAttribute = answer.validation ? 'required' : '';
        const onBlurAttribute = answer.validation ? `onblur="validateText('${answer.id}')"` : '';
        const textName = `<label for="${questions.for}" class="${questions.class}">${questions.text}</label>
        <input type="${answer.type}" class="${answer.class}" id="${answer.id}" name="${answer.name}" placeholder="${answer.placeholder}" ${ onBlurAttribute } ${ validationAttribute } data-validation="${answer.validation}">
        <span id="${answer.id}Error" class="error-message"></span>`;
        return textName;
      }
      
      private generateElemenEmail(answer, questions): string {
        const validationAttribute = answer.validation ? 'required' : '';
        const onBlurAttribute = answer.validation ? `onblur="validateEmail('${answer.id}')"` : '';
        const textName = `<label for="${questions.for}" class="${questions.class}">${questions.text}</label>
        <input type="${answer.type}" class="${answer.class}" id="${answer.id}" name="${answer.name}" placeholder="${answer.placeholder}"  ${ onBlurAttribute } ${ validationAttribute } data-validation="${answer.validation}">
        <span id="${answer.id}Error" class="error-message"></span>`;
        return textName;
      }
      private generateElementRange(answer,questions): string {
        const textName = `<label for="${questions.for}" class="${questions.class}">${questions.text}</label>
        <input type="${answer.type}" class="${answer.class}" id="${answer.id}" name="${answer.name}" placeholder="${answer.placeholder}" min="${answer.min}" max="${answer.max}" ${ answer.validation ? 'required': ''} onchange="validateRange('${answer.id}')">
        <span id="${answer.id}Error" class="error-message"></span>`;
        return textName;
      }
      private generateRadio(answer: { type: string; options?: string[], name: string, class: string, id: string, validation: boolean },questions: {class: string, for: string, text: string}, divtext?: any, labelCheckRad?: any): string {
        const labelQuestion: string = `<label for="${questions.for}" class="${questions.class}">${questions.text}</label>`;
        const options = answer.options ? answer.options.map(option => `<div class="${divtext}">
        <input type="${answer.type}" class="${answer.class}" id="${answer.id}${option}" name="${answer.name}" value="${option}" class="${answer.name} "data-validation="${answer.validation}"><label for="${questions.for}" class="${labelCheckRad}">${option}</label>
       </div>`).join('') : '';
        return `${labelQuestion}${options}<span class="error-message" data-error-for="${answer.name}"></span>`;
      }
    
      private generateSelect(answer: { type: string; options?: string[], name: string,id: string,class: string,validation: boolean, data_bs_toggle?: string, aria_expanded?: boolean, ul_class?: string, li_class?: string, placeholder?: string},questions: {class: string, for: string, text: string}): string {

      const options = answer.options ? answer.options.map((option: any) => `<li><a class="${answer.li_class}" href="#" data-value="${option}">${option}</a></li>`).join('') : '';
        return `<label for="${questions.for}" class="${questions.class}">${questions.text}</label>
        <${answer.type} type="${answer.type}" id="${answer.id}" class="${answer.class}"  data-bs-toggle="${answer.data_bs_toggle}" name="${answer.name}" aria-expanded="${answer.aria_expanded}">${answer.placeholder}</${answer.type}>
        <ul class="${answer.ul_class}" aria-labelledby="${answer.id}">${options}</ul>
        <span id="${answer.id}Error" class="error-message"></span>`;
      }

      private generateCheckbox(answer: { type: string; options?: string[], name: string,id: string,class: string, validation:boolean, other_input: any },questions: {class: string, for: string, text: string}, divtext?: any, labelCheck?: any): string {
       let otherInput: string = '';
        if (!answer.options || answer.options.length === 0) { return '';}

        if (answer?.other_input?.inputFlag) {
          otherInput = `<div class="itemForm text-Other"><input class="${answer?.other_input?.class}" type="${answer?.other_input?.type}" id="${answer?.other_input?.id}" name="${answer?.other_input?.id}" placeholder="${answer?.other_input?.placeholder}" ${answer?.other_input?.flagdisable}></div>`
        }

        let labelCustom: string = `<label for="${questions.for}" class="${questions.class}">${questions.text}
        <span class="subtitle">Selecciona una o más alternativas</span></label>`;

           const checkboxesHTML = answer.options.map((option: any, index: any) => {
        return `${this.generateCheckValidate(questions, answer, option, index, divtext, labelCheck)}`}).join('');
        return `${labelCustom}${checkboxesHTML}${otherInput}<span id="${answer.id}Error" class="error-message"></span>`;
      }
      private generateCheckValidate(questions: any, answer: any, option:any, ind: any, divtext: any, labelCheck: any): string {
        let labelNormal: string = `<div class="${divtext}"><input type="${answer.type}" id="${answer.id}_${ind}" class="${answer.class}" name="${answer.name}" value="${option} "data-validation="${answer.validation}"><label for="${questions.for}_${ind}" class="${labelCheck}">${option}</label></div>`;
        return `${labelNormal}`;
      }
      private generateTextarea(answer,questions): string {
        return `<label for="${questions.for}" class="${questions.class}">${questions.text}<span class="maxcharacters"  id="caracteresRestantes">0 de 500 caracteres</span></label>
        <${answer.type} id="${answer.id}" maxlength="${answer.maxlength}" class="${answer.class}" name="${answer.name}" placeholder="${answer.placeholder}" cols="${answer.cols}" rows="${answer.rows}" oninput="contarCaracteres('${answer.id}')  "data-validation="${answer.validation}"></${answer.type}>
        <span class="error-message" data-error-for="${answer.name}"></span>`
      }
      private generateFile(answer, questions): string {
        const validationAttribute = answer.validation ? 'required' : '';
        const onChangeAttribute = `onchange="validateFile('${answer.id}', ['${answer.constraints_file?.typeFile.join("','")}'], ${answer.constraints_file?.size})"`;
          const fileName = `<div class="fileContainer">
          <div class="fileContainerNoFile" data-name="${answer.id}">
          <input type="${answer.type}" class="${answer.class}" id="${answer.id}" name="${answer.name}" ${ onChangeAttribute } ${ validationAttribute } data-validation="${answer.validation}">
                        <label class="${questions.class}" for="${questions.for}">
                          <div class="uploadFile-container">
                            <div class="iconUpload noFile" style="display: none;"></div>
                            <div class="iconUpload" data-name="${answer.id}"></div>
                            <div class="textUpload">
                              <p>
                                <span class="noFile">
                                      <span class="firstText">${questions?.text}</span> 
                                      <span class="optionalText">(Opcional)</span>
                                </span>
                                <span class="uploading">Adjuntando documento</span>
                              </p>
                            <p style="display: block;" id="typeFile">${answer?.constraints_file?.typeFile.join(",")} de hasta ${answer?.constraints_file?.size} MB</p>
                            <p class="fileError" style="display: none;">Tu archivo no cumple con el formato, intenta con otro.</p>
                            </div>
                          </div>
                        </label>
                        </div>
                      <div class="fileContainerFileOk" style="display: none;">
                        <div class="uploadFile-container fileOk">
                          <div class="iconUpload"></div>
                          <div class="textUpload">
                            <p>mi_presentacion.pdf</p>
                            <p>Documento adjuntado</p>
                          </div>
                          <button type="button" class="trashbutton" id="trashbutton"></button>
                        </div>
                      </div>
                      </div>
                      <input type="hidden" id="${answer.id}-base64" name="${answer.name}-base64">`;
        return fileName;
    }
    private generateTelePhone(answer, questions): string {
      const validationAttribute = answer.validation ? 'required' : '';
      const patternAttribute = 'pattern="\\d{9}"';
      const inputModeAttribute = 'inputmode="numeric"';
      const onChangeAttribute = `onblur="validateTelePhone('${answer.id}')"`;
      const elementTelephone = `<label for="${questions.for}" class="${questions.class}">${questions.text}</label>
      <input type="${answer.type}" class="${answer.class}" id="${answer.id}" name="${answer.name}"  placeholder="${answer?.placeholder}" ${onChangeAttribute} ${validationAttribute} ${patternAttribute} ${inputModeAttribute} data-validation="${answer.validation}">
      <span id="${answer.id}Error" class="error-message"></span>`;
      return elementTelephone;
  }
  private generateUrl(answer, questions): string {
    const validationAttribute = answer.validation ? 'required' : '';
    const patternAttribute = 'pattern="https?://.*|www\\..*"';
    const onBlurAttribute = `onblur="validateUrl('${answer.id}')"`;
    const elementUrl = `<label for="${questions.for}" class="${questions.class}">${questions.text}</label>
    <input type="${answer.type}" class="${answer.class}" id="${answer.id}" name="${answer.name}" placeholder="${answer?.placeholder}" ${onBlurAttribute} ${validationAttribute} ${patternAttribute} data-validation="${answer.validation}">
    <span id="${answer.id}Error" class="error-message"></span>`;
    return elementUrl;
}
}