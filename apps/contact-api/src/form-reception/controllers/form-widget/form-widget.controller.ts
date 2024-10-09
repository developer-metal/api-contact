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
    Patch,
    Query
  } from '@nestjs/common';
  import { ApiBearerAuth, ApiOperation, ApiTags,ApiHeader } from '@nestjs/swagger';
import { FormWidget, SearchFormDto, UpdateFormDto } from '../../../form-reception/dto/form-widget.dto';
import { FormWidgetService } from '../../../form-reception/services/form-widget/form-widget.service';
@Controller('form-widget')
@ApiTags('Widget Formulario')
@ApiHeader({name: 'CSRF-Token', description: 'CSRF-Token', required: true })
export class FormWidgetController {
    private readonly logger = new Logger();
    private _createWidgetService: FormWidgetService;
    constructor(_createWidgetService: FormWidgetService) {
        this._createWidgetService = _createWidgetService;
    }
    @Post()
    @ApiBearerAuth('authorization')
    @ApiOperation({ summary: 'creacion de template HTML dinamico', operationId: 'createWidget' })
    async createWidget(@Res() response: any, @Body() body: FormWidget): Promise<any> {
        try {
          this.logger.log(`[controller - createWidget ] Ok`);
          const responseSave = await this._createWidgetService.saveWidgetFormService(body);
          return response.status(HttpStatus.OK).send({payload: responseSave});
        } catch (error) {
          this.logger.error(`[controller - createWidget ] Error ${JSON.stringify(error)}`);
          return response.status(500).send({
            code: error.code,
            error: {
              message: error.message
            }
          });
        }
      }
    @Get('generator/:id')
    @Header('Content-Type', 'text/html')
    @ApiOperation({ summary: 'consulta template HTML', operationId: 'idWidget' })
    async getWidgetForm(@Res() response: any, @Param('id') idForm: string, @Query() data: any): Promise<any> {
        try {
          this.logger.log(`[controller - getWidgetForm ] Ok`);
          const payloadHtml = await this._createWidgetService.getWidgetFormService(idForm, data);
          return response.status(HttpStatus.OK).send(payloadHtml);
        } catch (error) {
          this.logger.error(`[controller - getWidgetForm - Error ] `);
          return response.status(500).type('application/json').send({
            code: error.code,
            error: {
              message: error.message
            }
          });
        }
      }
      @Delete(':id')
      @ApiBearerAuth('authorization')
      @ApiOperation({ summary: 'eliminacion de formulario dinamico', operationId: 'deleteWidget' })
      async deleteWidgetForm(@Res() response: any, @Param('id') idDelete: string): Promise<any> {
          try {
            this.logger.log(`[controller - deleteWidgetForm ] Ok`);
            const payloadHtml = await this._createWidgetService.deleteWidgetFormService(idDelete);
            return response.status(HttpStatus.OK).send({
              payload: payloadHtml
            });
          } catch (error) {
            this.logger.error(`[controller - createWidget ] Error`);
            return response.status(500).send({
              code: error.code,
              error: {
                message: error.message
              }
            });
          }
        }
    @Get('search')
    @ApiBearerAuth('authorization')
    @ApiOperation({ summary: 'buscar formulario creado', operationId: 'idWidget' })
    async searchWidgetForm(@Res() response: any, @Body() body: SearchFormDto): Promise<any> {
        try {
          this.logger.log(`[controller - searchWidgetForm - DATA ] Ok`);
          const responseForms = await this._createWidgetService.searchWidgetFormService(body);
          return response.status(HttpStatus.OK).send({ payload: responseForms });
        } catch (error) {
          this.logger.error(`[controller - searchWidgetForm ] Error`);
          return response.status(500).send({
            code: error.code,
            error: {
              message: error.message
            }
          });
        }
      }

      @Patch(':idUpdate')
      @ApiBearerAuth('authorization')
      @ApiOperation({ summary: 'actualizar formulario creado', operationId: 'idUpdate' })
      async updateWidgetForm(@Res() response: any, @Body() body: UpdateFormDto,  @Param('idUpdate') id: string): Promise<any> {
          try {
            this.logger.log(`[controller - updateWidgetForm - DATA ] Ok`);
            const responseForms = await this._createWidgetService.updateWidgetFormService(id, body);
            return response.status(HttpStatus.OK).send({ payload: responseForms });
          } catch (error) {
            this.logger.error(`[controller - updateWidgetForm ] Error`);
            return response.status(500).send({
              code: error.code,
              error: {
                message: error.message
              }
            });
          }
        }
}