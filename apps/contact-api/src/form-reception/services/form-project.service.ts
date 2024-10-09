import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { FormProjectDto } from '../dto/create-project.dto';
import { UpdateFormProjectDto } from '../dto/update-form-project.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from '../interface/project.interface';
import { ProjectProviders } from '../model/project.providers';
import { SavedForm } from '../dto/form.dto';
import { formsProviders } from '../model/form.providers';
import { ObjectIdConstructor } from '../types/objectId.type';

@Injectable()
export class FormProjectService {
  private readonly logger = new Logger();
  private projectModel: Model<Project>;
  private formModel: Model<SavedForm>;

  constructor(
    @InjectModel(ProjectProviders.name) projectModel: Model<Project>,
    @InjectModel(formsProviders.name) formModel: Model<SavedForm>,
  ) {
    this.projectModel = projectModel;
    this.formModel = formModel;
  }

  async create(createFormProjectDto: FormProjectDto): Promise<any> {
    try {
      this.logger.log(`[service - FormProjectService - create ] Ok`);
      const respnse = { message: 'Proyecto creado correctamente.' };
      this.logger.log(
        `[service - FormProjectService - create ] Ok`
      );
      const formatBody = {...createFormProjectDto, active: true};
      const createdProject = new this.projectModel(formatBody);
      await createdProject.save();
      return respnse;
    } catch (error) {
      this.logger.error(`[service - create ] Error ${error} `);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Error al crear el proyecto.'
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async findAll(query: object): Promise<any> {
    try {
      this.logger.log(`[service - FormProjectService - findAll ] Ok`);
      const format = await this.formatFindProject(query);
      return format;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Error al listar el proyecto.'
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async update(
    id: string,
    updateFormProjectDto: UpdateFormProjectDto,
  ): Promise<any> {
    try {
      this.logger.log(`[service - FormProjectService - update ] Ok`);
      const response = { message: 'Proyecto actualizado correctamente.' };
      await this.projectModel
        .findByIdAndUpdate(id, updateFormProjectDto)
        .exec();
      return response;
    } catch (error) {
      this.logger.error(`[service - FormProjectService - update ] aquiiii  Error ${error}`);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Error al actualizar el proyecto.'
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async remove(_id: any): Promise<any> {
    try {
      this.logger.log(`[service - FormProjectService - remove ] Ok`);
      const responseDelete: any = { message: 'Projecto ha sido eliminado.' };
      const validExistForm = await this.formModel.find({project: _id}).populate({ path: 'project' }).exec();
      if (validExistForm.length > 0) {
        responseDelete.message = 'Proyecto posee formularios asociados.';
        return responseDelete.message;
      }  
      const updateProject = await this.projectModel.findByIdAndDelete(_id).exec();
      if (!updateProject) {
        responseDelete.message = 'Proyecto no eliminado';
        return responseDelete.message;
      }
      return responseDelete;
    } catch (error) {
      this.logger.log(
        `[service - FormProjectService - remove ] Error ${error}`,
      );
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Error al eliminar el proyecto.'
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async formatFindProject(data: any): Promise<object> {
    let $regex: object = {};
    const queryCustom: Array<object> = [];
    if (data.hasOwnProperty('_id') && data._id !== '') {
      const _id: ObjectIdConstructor = data._id;
      queryCustom.push({ _id });
      const responseId = await this.projectModel.find({ $and: queryCustom }).exec();
      return await this.projectCustomGeneral(responseId);
    }
    for (const key in data) {
      $regex = data[key];
      queryCustom.push({ [key]: { $regex, $options: 'i' } });
    }
    if (queryCustom.length === 0) {
      const projects: any = await this.projectModel.find({}).exec();
      return await this.projectCustomGeneral(projects);
    }
    const responseCustom = await this.projectModel.find({ $and: queryCustom }).exec();
    if (responseCustom.length === 0) {
      return {
        message: 'No se encontraron resultados asociados a la busqueda.'
      };
    }
    return await this.projectCustomGeneral(responseCustom);
  }
  async projectCustomGeneral(dataProject: any): Promise<any> {
    try {
      const formatProjects = dataProject.map(async (item) => {
        const countForms: any = await this.formModel.countDocuments({ project: item._id }).exec();
        return {
          ...item.toObject(),
          formulario_count: countForms
        }
      });
      return Promise.all(formatProjects);
    } catch (error) {
      this.logger.error(`[service - projectCustomGeneral ] Error ${error}`);
      throw new Error('Error al listar los proyectos.');
    }
  }
}