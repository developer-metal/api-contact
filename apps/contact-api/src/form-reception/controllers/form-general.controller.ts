import {
  Body,
  Controller,
  Post,
  Res,
  Logger,
  HttpStatus,
  Get,
  Delete,
  Param,
  Header,
  Query,
  Req
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags,ApiHeader, ApiHeaders, ApiExcludeEndpoint, ApiConsumes } from '@nestjs/swagger';
import { FormGeneralService } from '../services/form-general.service';
import { AllForm, RetrieveForm, ValidationForm } from '../dto/form.dto';
import * as fs from 'fs';
import { ParseTemplateService } from '../services/parse-template/parse-template.service';
@Controller('form-general')
@ApiBearerAuth('authorization')
@ApiTags('Formulario contacto')
@ApiHeader({name: 'CSRF-Token', description: 'CSRF-Token', required: true })
export class FormGeneralController {
  private _formGeneralService: FormGeneralService;
  private readonly logger = new Logger();
  private _parseTemplateService: ParseTemplateService;
  constructor(_formGeneralService: FormGeneralService, ParseTemplateService: ParseTemplateService) {
    this._formGeneralService = _formGeneralService;
    this._parseTemplateService = ParseTemplateService;
  }
  @Post()
  @ApiOperation({ summary: 'creacion de formulario', description: 'Permite registro de formulario y envio de Emails (Agradecimiento y Cuestionario de preguntas)', operationId: 'createForm' })
  async submitForm(
    @Res() response: any,
    @Req() request: any
  ): Promise<any> {
    this.logger.log(`[controller - submitForm ] Ok`);
    try {
      const { body, headers } = request;
      const responseCustom = { message: 'Formulario enviado correctamente.' };
      await this._formGeneralService.submitForm(body, headers);
      return response.status(HttpStatus.CREATED).send({
        code: HttpStatus.CREATED,
        payload: responseCustom
      });
    } catch (error) {
      this.logger.error(`[controller - submitForm ] Error ${JSON.stringify(error)}`);
      return response.status(error.response.status).send({
        time: new Date().toISOString(),
        error: {
          code: error.response.status,
          message: error.response.message
        }
      });
    }
  }
  @Post('validadtionForm')
  @ApiOperation({ summary: 'Limite Top Formularios', description: 'Permite validar limite de formularios por proyecto)'})
  async validationForm(
    @Res() response: any,
    @Body() body: ValidationForm
  ): Promise<any> {
    this.logger.log(`[controller - validationForm ] Ok`);
    try {
      const responseValidation = await this._formGeneralService.validationForm(body);
      return response.status(HttpStatus.OK).send({
        code: HttpStatus.OK,
        payload: responseValidation
      });
    } catch (error) {
      this.logger.error(`[controller - validationForm ] Error ${JSON.stringify(error)}`);
      return response.status(error.status).send({
        time: new Date().toISOString(),
        error: {
          code: error.status,
          message: error.message
        }
      });
    }
  }
  @Get()
  @ApiOperation({ summary: 'listar de formularios', description: 'Permite listar formularios', operationId: 'allForm' })
  async allForm(
    @Res() response: any,
    @Query() query: AllForm
  ): Promise<any> {
    this.logger.log(`[controller - allForm ] Ok`);
    try {
      const responseAll = await this._formGeneralService.allForm(query);
      return response.status(HttpStatus.OK).send({
        code: HttpStatus.OK,
        payload: responseAll
      });
    } catch (error) {
      this.logger.error(`[controller - allForm ] Error`);
      return response.status(error.response.status).send({
        time: new Date().toISOString(),
        error: {
          code: error.response.status,
          message: error.response.message
        }
      });
    }
  }
  @Post('retrieve')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename=Formulario.csv')
  @ApiConsumes('attachment; filename=Formulario.csv')
  @ApiOperation({
    summary: 'Exportar Formularios a Formato CSV', description: 'Permite exportar el formulario registrado en formato CSV', operationId: 'retrieveForm'
  })
  async retrieveForm(
    @Res() response: any,
    @Body() body: RetrieveForm
  ): Promise<any> {
    this.logger.log(`[controller - retrieve ] Ok`);
    try {
      const { responseCsv } = await this._formGeneralService.retrieveForm(body);
      const fileStream = fs.createReadStream(responseCsv);
      fileStream.pipe(response);
    } catch (error) {
      this.logger.error(
        `[controller - retrieve ] Error ${JSON.stringify(error)}`
      );
      return response.status(error.response.status).send({
        time: new Date().toISOString(),
        error: {
          code: error.response.status,
          error: error.response.error
        }
      });
    }
  }

  @Delete(':idform')
  @ApiOperation({ summary: 'Eliminacion de formulario', description: 'Permite eliminar contenido de formaulario de contacto', operationId: 'remove' })
  async remove(
    @Res() response: any,
    @Param('idform') id: string
  ): Promise<any> {
    try {
      const deleteProject = await this._formGeneralService.remove(id);
      return response
        .status(HttpStatus.OK)
        .send({ code: HttpStatus.OK, payload: deleteProject });
    } catch (error) {
      this.logger.error(`[FormProjectController - remove ] Error ${error} `);
      return response.status(error.response.status).send({
        time: new Date().toISOString(),
        error: {
          code: error.response.status,
          message: error.response.message
        }
      });
    }
  }
  @Get('mailing/:id')
  @Header('Content-Type', 'text/html')
  @ApiOperation({ summary: 'consulta Template Email', operationId: 'idForm' })
  async getTemplateEmail(@Res() response: any, @Param('id') idForm: string): Promise<any> {
      try {
        this.logger.log(`[controller - getTemplateEmail ] Ok`);
        const payloadHtml = await this._parseTemplateService.getTemplateEmail(idForm);
        return response.status(HttpStatus.OK).send(payloadHtml);
      } catch (error) {
        this.logger.error(`[controller - getTemplateEmail - Error ] `);
        return response.status(500).type('application/json').send({
          code: error.code,
          error: {
            message: error.message
          }
        });
      }
    }
}
