import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Res,
  Logger,
  Query
} from '@nestjs/common';
import { FormProjectService } from '../services/form-project.service';
import { FormProjecAll, FormProjectDto } from '../dto/create-project.dto';
import { UpdateFormProjectDto } from '../dto/update-form-project.dto';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('form-project')
@ApiTags('Proyecto')
@ApiBearerAuth('authorization')
@ApiHeader({name: 'CSRF-Token', description: 'CSRF-Token', required: true })
export class FormProjectController {
  private readonly logger = new Logger();
  private readonly formProjectService: FormProjectService;
  constructor(_formProjectService: FormProjectService) {
    this.formProjectService = _formProjectService;
  }

  @Post()
  @ApiOperation({ summary: 'Crear un proyecto' })
  async create(
    @Res() response: any,
    @Body() createFormProjectDto: FormProjectDto
  ): Promise<void> {
    try {
      const responseProject = await this.formProjectService.create(
        createFormProjectDto
      );
      this.logger.log(`[FormProjectController - create ] Ok ${JSON.stringify(responseProject)}`);
      return response
        .status(HttpStatus.CREATED)
        .send({ code: HttpStatus.CREATED, payload: responseProject });
    } catch (error) {
      this.logger.log(`[FormProjectController - create ] Error ${error}`);
      return response.status(error.response.status).send({
        time: new Date().toISOString(),
        error: {
          code: error.response.status,
          message: error.response.message
        }
      });
    }
  }

  @Get()
  @ApiOperation({ summary: 'Listar un proyecto' })
  async findAll(
    @Res() response: any,
    @Query() body: FormProjecAll
  ): Promise<any> {
    try {
      this.logger.log(`[FormProjectController - findAll ] Ok`);
      const responAll = await this.formProjectService.findAll(body);
      return response
        .status(HttpStatus.OK)
        .send({ code: HttpStatus.OK, payload: responAll });
    } catch (error) {
      this.logger.error(`[FormProjectController - findAll ] Error ${error} `);
      return response.status(error.response.status).send({
        time: new Date().toISOString(),
        error: {
          code: error.response.status,
          message: error.response.message
        }
      });
    }
  }

  @Patch(':idupdate')
  @ApiOperation({ summary: 'Actualizar un proyecto' })
  async update(
    @Res() response: any,
    @Param('idupdate') id: string,
    @Body() updateFormProjectDto: UpdateFormProjectDto
  ): Promise<any> {
    try {
      this.logger.log(`[FormProjectController - updateProyect ] Ok`);
      const responseUpdate = await this.formProjectService.update(
        id,
        updateFormProjectDto
      );
      return response
        .status(HttpStatus.OK)
        .send({ code: HttpStatus.OK, payload: responseUpdate });
    } catch (error) {
      this.logger.error(
        `[FormProjectController - updateProyect ] Error ${error} `
      );
      return response.status(error.response.status).send({
        time: new Date().toISOString(),
        error: {
          code: error.response.status,
          message: error.response.message
        }
      });
    }
  }

  @Delete(':idelete')
  @ApiOperation({ summary: 'Eliminar un proyecto',  description: 'Elimina un proyecto por id'})
  async remove(
    @Res() response: any,
    @Param('idelete') id: string
  ): Promise<any> {
    try {
      const deleteProject = await this.formProjectService.remove(id);
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
}
