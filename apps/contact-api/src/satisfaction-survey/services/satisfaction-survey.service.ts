import { Injectable, Logger } from '@nestjs/common';
import { CreateSatisfactionSurveyDto } from '../dto/create-satisfaction-survey.dto';
import { Model } from 'mongoose';
import { Project } from '../../form-reception/interface/project.interface';
import { InjectModel } from '@nestjs/mongoose';
import { ProjectProviders } from '../../form-reception/model/project.providers';
import { SurveyProviders } from '../model/survey.providers';
import { Survey } from '../interfaces/survey.interface';
import { DateNow } from '../../common/helpers/validateDate';
import { userAgent } from '../../common/helpers/userAgetData';
import { SurveyGeneralSuccess } from 'src/common/enums/codes-success.enum';
import { ErrorCode, ErrorGeneral } from 'src/common/enums/error.class';
import { levelActions, nivelValores } from '../validations/level-actions';
import { ExportExcelService } from './export-excel/export-excel.service';

@Injectable()
export class SatisfactionSurveyService {
  private readonly logger = new Logger();
  private proyecModel: Model<Project>;
  private surveyModel: Model<Survey>;
  private _exportExcelService: ExportExcelService;
  constructor(@InjectModel(ProjectProviders.name) proyecModel: Model<Project>,
  @InjectModel(SurveyProviders.name) surveyModel: Model<Survey>, exportExcelService: ExportExcelService
  
) {
    this.proyecModel = proyecModel;
    this.surveyModel = surveyModel;
    this._exportExcelService = exportExcelService;
  }
  async createCesService(body: CreateSatisfactionSurveyDto, headers: any): Promise<any> {
   try {
    this.logger.log(`[service - createCesService ] Ok`);
    const { project } = body;
    let actioForm: string = '';
    let actionCustom: string = '';
    const existProject =  await this.proyecModel.findOne({ slug: project }).exec();
    if (!existProject) { 
      this.logger.warn(`[service - createCesService ] - Proyecto no encontrado`);
      throw new ErrorGeneral(ErrorCode.Project_No_Exists, 'Project no exists');
     }
    const emailToFind: string = body?.email.toLowerCase();
    const existSurvey =  await this.surveyModel.findOne({ email: emailToFind }).exec();
    if (existSurvey) {
      actioForm = levelActions(body?.level);
      actionCustom = actioForm?.toUpperCase();
      await this.surveyModel.findByIdAndUpdate({_id: existSurvey?._id}, { $set: { ...body, actions: actionCustom, project: existProject?._id, update_date: DateNow() } });
      this.logger.log(`[service - createCesService ] - Encuesta Actualizada`);
      return { code: SurveyGeneralSuccess.Survey_Update_Success, message: 'Survey update' };
    }
    actioForm = levelActions(body?.level);
    actionCustom = actioForm?.toUpperCase();
    const dispositive = userAgent(headers['user-agent']);
    const formaBody = { ...body, actions: actionCustom, project: existProject?._id, dispositive, creation_date: DateNow(), update_date: DateNow()};
    await new this.surveyModel(formaBody).save();
    return { code: SurveyGeneralSuccess.Survey_Update_Success, message: 'Survey success' };
   } catch (error) {
    this.logger.error(`[service - createCesService ] Error ${JSON.stringify(error)}`);
    throw new ErrorGeneral(ErrorCode.Error_general_survey, 'Error general survey');
   }
  }
 async findGeneral(): Promise<any> {
    try {
      this.logger.log(`[service - findEmail ] Ok`);
      const existSurvey =  await this.surveyModel.find().populate({ path: 'project', select: 'name' }).sort({level: 1}).exec();
      if (existSurvey.length === 0) {
        this.logger.warn(`[service - findEmail ] - No existe registros`);
        throw new ErrorGeneral(ErrorCode.Email_no_exists, 'No exists registers');
      }
      const prom = await this.calcularPromedioPorNivel(existSurvey);
      const formData = {...existSurvey, resultados: prom };
      return { code: SurveyGeneralSuccess.Survey_Get_Success, payload: formData};
    } catch (error) {
      this.logger.error(`[service - findEmail ] Error ${JSON.stringify(error)}`);
      throw new ErrorGeneral(ErrorCode.Error_general_survey, 'Error general survey');
    }
  }
  async findAndExport(): Promise<any> {
    try {
    this.logger.log(`[service - findAndExport ] Ok`);
    const existSurvey: any =  await this.surveyModel.find().populate({ path: 'project', select: 'name' }).sort({level: 1}).exec();
      if (existSurvey.length === 0)  {this.logger.warn(`[service - findAndExport ] - Email no encontrado`);
        throw new ErrorGeneral(ErrorCode.Email_no_exists, 'No exists registers');
      }
      const dataFormat = existSurvey.map((survey: any): any => {
        return {
          level: survey?.level,
          actions: survey?.actions,
          email: survey?.email,
          name: survey?.name,
          dispositive: survey?.dispositive,
          creation_date: survey?.creation_date,
          project: survey?.project
        }
      });
      const prom = await this.calcularPromedioPorNivel(dataFormat);
      const formData = dataFormat.map(item => { return { ...item, resultados: prom }});
      const dataExport = await this._exportExcelService.generateExcel(formData);
      return dataExport;
    } catch (error) {
      this.logger.error(`[service - findAndExport ] Error ${JSON.stringify(error)}`);
      throw new ErrorGeneral(ErrorCode.Error_general_survey, 'Error general survey');
    }
  }
  async calcularPromedioPorNivel(surveys: any[]): Promise<{ [key: string]: string }> {
    const conteoPorNivel: { [key: string]: number } = {};
    surveys.forEach(survey => {
      const nivel: string = survey?.actions;
      const nivelKey = nivel.toUpperCase();
      if (nivelValores.hasOwnProperty(nivelKey)) {
        conteoPorNivel[nivelKey] = (conteoPorNivel[nivelKey] || 0) + 1;
      }
    });
    const totalConteos = Object.values(conteoPorNivel).reduce((sum, count) => sum + count, 0);
    const porcentajesPorNivel: { [key: string]: string } = {};
    for (const nivel in conteoPorNivel) {
      if (totalConteos > 0) {
        const porcentaje = (conteoPorNivel[nivel] / totalConteos) * 100;
        porcentajesPorNivel[nivel] = `${porcentaje.toFixed(2)}%`;
      }
    }
    return porcentajesPorNivel;
  }
}