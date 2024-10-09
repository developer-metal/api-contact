import { Controller, Get, Post, Logger, Res, Req, HttpStatus, Body, Query } from '@nestjs/common';
import { SatisfactionSurveyService } from '../services/satisfaction-survey.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import validationGeneral from '../validations/validation-general';
import { SurveyErrorDto } from '../../common/enums/codes-error.enum';
import { UpdateSatisfactionSurveyDto } from '../dto/update-satisfaction-survey.dto';
import { CreateSatisfactionSurveyDto } from '../dto/create-satisfaction-survey.dto';
@ApiBearerAuth('authorization')
@ApiTags('CES - Encuesta de Satisfacción')
@Controller('survey')
export class SatisfactionSurveyController {
  private readonly satisfactionSurveyService: SatisfactionSurveyService;
  private readonly logger = new Logger();
  constructor(satisfactionSurveyService: SatisfactionSurveyService) {
    this.satisfactionSurveyService = satisfactionSurveyService;
  }
  @Post()
  @ApiOperation({ summary: 'creacion de CES', description: 'Permite guardar el nivel de satisfaccion asociado al envio del formulario'})
 async createCes(@Req() request: any, @Res() response: any): Promise<any> {
    try {
      this.logger.log(`[controller - createCes ] Ok`);
      const { body, headers } = request;
      if (await validationGeneral(request, CreateSatisfactionSurveyDto) === false) {
        return response.status(HttpStatus.BAD_REQUEST).send({ code: 400, message: SurveyErrorDto.Error_dto_create});
      }
       const payloadResponse = await this.satisfactionSurveyService.createCesService(body, headers);
      return response.status(HttpStatus.CREATED).send({payload: payloadResponse});
    } catch (error) {
      this.logger.error(`[controller - createCes ] Error ${JSON.stringify(error)}`);
      return response.status(500).send({
        time: new Date().toISOString(),
        error: {
          code: error.code,
          message: error.message
        }
      });
  }
}
  @Get()
  async findEmail(@Req() request: any, @Res() response: any, @Query() params: any): Promise<any> {
    try {
      this.logger.log(`[controller - findEmail ] Ok`);
      const { report } = params;
      if (params.hasOwnProperty('report') && report.toUpperCase() === 'G') {
        const typeHeader: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        response.header('Content-Disposition', 'attachment; filename=CES.xlsx');
        response.header('Content-Type', typeHeader);
        const responseInfo = await this.satisfactionSurveyService.findAndExport();
        return response.type(typeHeader).send(responseInfo);
      }
      if (await validationGeneral(request, UpdateSatisfactionSurveyDto) === false) {
        return response.status(HttpStatus.BAD_REQUEST).send({ code: 400, message: SurveyErrorDto.Error_not_result_search});
      }
      const responseInfo = await this.satisfactionSurveyService.findGeneral();
      return response.status(HttpStatus.OK).send(responseInfo);
    } catch (error) {
      this.logger.error(`[controller - findEmail ] Error ${JSON.stringify(error)}`);
      return response.status(500).send({
        time: new Date().toISOString(),
        error: {
          code: error.code,
          message: error.message
        }
      });
    }
  }
}