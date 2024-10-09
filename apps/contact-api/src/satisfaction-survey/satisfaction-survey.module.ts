import { Module } from '@nestjs/common';
import { SatisfactionSurveyService } from './services/satisfaction-survey.service';
import { SatisfactionSurveyController } from './controllers/satisfaction-survey.controller';
import { FormProjectModule } from '../form-reception/form-project.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SurveyProviders } from './model/survey.providers';
import { ProjectProviders } from '../form-reception/model/project.providers';
import { HttpModule } from '@nestjs/axios';
import { ExportExcelService } from './services/export-excel/export-excel.service';

@Module({
  imports: [
    HttpModule,
    FormProjectModule,
    MongooseModule.forFeatureAsync([ProjectProviders,SurveyProviders])
  ],
  controllers: [SatisfactionSurveyController],
  providers: [SatisfactionSurveyService, ExportExcelService]
})
export class SatisfactionSurveyModule {}
