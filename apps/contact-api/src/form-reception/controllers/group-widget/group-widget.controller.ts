import { Body, Controller, Delete, Get, HttpStatus, Logger, Param, Patch, Post, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IDGroupQuestDto, RangeDate, StageQuestionsData, UpdateGroupQuestDto } from '../../../form-reception/dto/form-widget.dto';
import { FormWidgetService } from '../../../form-reception/services/form-widget/form-widget.service';

@Controller('group-widget')
export class GroupWidgetController {
    private readonly logger = new Logger();
    private _createWidgetService: FormWidgetService;
    constructor(_createWidgetService: FormWidgetService) {
        this._createWidgetService = _createWidgetService;
    }
    @Patch(':id')
    @ApiBearerAuth('authorization')
    @ApiOperation({ summary: 'actualizar Grupo formulario', operationId: 'id' })
    async updateGroupQuestions(@Res() response: any, @Body() body: UpdateGroupQuestDto,  @Param('id') id: string): Promise<any> {
        try {
          this.logger.log(`[controller - updateGroupQuestions ] Ok`);
          const responseForms = await this._createWidgetService.updateGroupQuestionsService(id, body);
          return response.status(HttpStatus.OK).send({ payload: responseForms });
        } catch (error) {
          this.logger.error(`[controller - updateGroupQuestions ] Error`);
          return response.status(500).send({
            code: error.code,
            error: {
              message: error.message
            }
          });
        }
      }
      @Post()
      @ApiBearerAuth('authorization')
      @ApiOperation({ summary: 'Agrupacion preguntas por Etapa' })
      async saveGroupQuestions(@Res() response: any, @Body() body: StageQuestionsData): Promise<any> {
        try {
          this.logger.log(`[controller - saveGroupQuestions ] Ok`);
          const responseSave = await this._createWidgetService.saveGroupQuestionsService(body);
          return response.status(HttpStatus.OK).send({payload :responseSave});
        } catch (error) {
          this.logger.error(`[controller - saveGroupQuestions ] Error ${JSON.stringify(error)}`);
          return response.status(500).send({
            code: error.code,
            error: {
              message: error.message
            }
          });
        }
      }
      @Get('group/:id')
      @ApiBearerAuth('authorization')
      @ApiOperation({ summary: 'obtener Agrupacion preguntas por ID' })
      async getGroupQuestions(@Res() response: any,  @Param('id') id: IDGroupQuestDto): Promise<any> {
        try {
          this.logger.log(`[controller - getGroupQuestions ] Ok`);
          const responseGroup = await this._createWidgetService.getGroupQuestionsIdService(id);
          return response.status(HttpStatus.OK).send({payload :responseGroup});
        } catch (error) {
          this.logger.error(`[controller - getGroupQuestions ] Error ${JSON.stringify(error)}`);
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
      @ApiOperation({ summary: 'buscar grupo formulario' })
      async searchWidgetGroup(@Res() response: any, @Body() body: RangeDate): Promise<any> {
          try {
            this.logger.log(`[controller - searchWidgetForm ] Ok`);
            const responseGroups = await this._createWidgetService.searchWidgetGroupService(body);
            return response.status(HttpStatus.OK).send({ payload: responseGroups });
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
     @Delete(':id')
        @ApiBearerAuth('authorization')
        @ApiOperation({ summary: 'eliminacion de grupo formulario'})
        async deleteWidgetGroup(@Res() response: any, @Param('id') idDelete: string): Promise<any> {
            try {
              this.logger.log(`[controller - deleteWidgetGroup ] Ok`);
              const resposeDelete = await this._createWidgetService.deleteWidgetGroupService(idDelete);
              return response.status(HttpStatus.OK).send({
                payload: resposeDelete
              });
            } catch (error) {
              this.logger.error(`[controller - deleteWidgetGroup ] Error`);
              return response.status(500).send({
                code: error.code,
                error: {
                  message: error.message
                }
              });
            }
          }
}