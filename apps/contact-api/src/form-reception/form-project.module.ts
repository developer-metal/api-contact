import { Module } from '@nestjs/common';
import { FormProjectService } from './services/form-project.service';
import { FormProjectController } from './controllers/form-project.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { formsProviders } from './model/form.providers';
import { ProjectProviders } from './model/project.providers';
import { FormGeneralService } from './services/form-general.service';
import { FormGeneralController } from './controllers/form-general.controller';
import { ParseTemplateService } from './services/parse-template/parse-template.service';
import { SesEmailService } from './services/ses-email/ses-email.service';
import { CsvDataService } from './services/csv-data/csv-data.service';
//import { SendEmailProcessor } from './services/ses-email/processor/sendEmail.processor';
import { FormWidgetController } from './controllers/form-widget/form-widget.controller';
import { FormWidgetService } from './services/form-widget/form-widget.service';
import { ConfigService } from '@nestjs/config';
import { widgetFormsProviders } from './model/widgetForm.providers';
import { GroupQuestionsProviders } from './model/group-questions.providers';
import { GroupWidgetController } from './controllers/group-widget/group-widget.controller';
import { LogTemplatesProviders } from './model/logTemplate.providers';
@Module({
  imports: [
    MongooseModule.forFeatureAsync([formsProviders, ProjectProviders, widgetFormsProviders, GroupQuestionsProviders, LogTemplatesProviders])
  ],
  controllers: [FormProjectController, FormGeneralController, FormWidgetController, GroupWidgetController],
  providers: [
    FormProjectService,
    FormGeneralService,
    ParseTemplateService,
    SesEmailService,
    ParseTemplateService,
    CsvDataService,
    FormWidgetService,
    ConfigService
  ]
})
export class FormProjectModule {}
