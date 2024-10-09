import {
  ApiProperty, IntersectionType, OmitType, PartialType
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  ArrayNotEmpty,
  IsOptional,
  IsObject,
  IsNotEmptyObject,
  IsBoolean,
  IsIn,
  ArrayMinSize,
  ArrayMaxSize,
  Min,
  Max,
  IsNumber
} from 'class-validator';
import { SanitizeHtml } from '../validators/sanitizeHtml.constraint';

export class OtherInput {
  @ApiProperty({ description: 'inputFlag', required: true })
  @IsNotEmpty({ message: 'inputFlag es requerido.' })
  @IsBoolean({ message: 'inputFlag debe ser un boolean.' })
  inputFlag: boolean;
  @ApiProperty({ description: 'type', required: true })
  @IsNotEmpty({ message: 'type es requerido.' })
  @IsString({ message: 'type debe ser un string.' })
  type: string;
  @ApiProperty({ description: 'id', required: true })
  @IsNotEmpty({ message: 'id es requerido.' })
  @IsString({ message: 'id debe ser un string.' })
  id: string;
  @ApiProperty({ description: 'class', required: true })
  @IsNotEmpty({ message: 'class es requerido.' })
  @IsString({ message: 'class debe ser un string.' })
  class: string;
  @ApiProperty({ description: 'placeholder', required: true })
  @IsNotEmpty({ message: 'placeholder es requerido.' })
  @IsString({ message: 'placeholder debe ser un string.' })
  placeholder: string;
  @ApiProperty({ description: 'flagdisable', required: true })
  @IsNotEmpty({ message: 'flagdisable es requerido.' })
  @IsString({ message: 'flagdisable debe ser un string.' })
  flagdisable: string;
}
export class ConstraintFile {
  @ApiProperty({ description: 'size', required: true })
  @IsNotEmpty({ message: 'size es requerido.' })
  @IsNumber({}, { message: 'size debe ser un número.' })
  @Min(1, { message: 'size debe ser mayor a 1 MB.' })
  @Max(10, { message: 'size debe ser menor o igual a 10 MB.' })
  size: number;
  @ApiProperty({ description: 'typeFile', required: true })
  @IsArray({ message: 'typeFile debe ser un array.' })
  @ArrayNotEmpty({ message: 'typefile no debe estar vacío.' })
  @ArrayMinSize(1, { message: 'Debe haber al menos un tipo de archivo permitido.' })
  @IsIn(['PDF', 'PPTX','DOCX', 'XLS','XLSX','JPG','JPEG','PNG'], { each: true, message: 'tipo de archivo no permitido.' })
  typeFile: string[];
}
export class AnswerData {
    @ApiProperty({ description: 'description_initial_stage', required: true })
    @IsOptional({ message: 'description_initial_stage es opcional.' })
    @IsNotEmpty({ message: 'description_initial_stage es requerido.' })
    @IsString({ message: 'description_initial_stage debe ser un string.' })
    description_initial_stage: string;
    @ApiProperty({ description: 'type elements', example: 'tipo de elemento a obtener', required: true })
    @IsOptional({ message: 'type es opcional.' })
    @IsNotEmpty({ message: 'type es requerido.' })
    @IsString({ message: 'type debe ser un string.' })
    @IsIn(['text','email', 'radio', 'checkbox','select','textarea','range','button','file','tel','url'], { message: 'tipo de element no permitido.' })
    type: string
    @ApiProperty({ description: 'options elements', example: 'options (checkbox,select,radio)', required: true })
    @IsOptional({ message: 'options es opcional.' })
    @IsArray({ message: 'options deben ser un array.' })
    @ArrayNotEmpty({ message: 'options no pueden estar vacios.'})
    options?: string[];
    @ApiProperty({ description: 'min cant', example: 'inicio de rango', required: true })
    @IsOptional({ message: 'min es opcional.' })
    @IsNotEmpty({ message: 'min es requerido.' })
    @IsString({ message: 'min debe ser un string.' })
    min?: string;
    @ApiProperty({ description: 'max cant', example: 'max de rango', required: true })
    @IsOptional({ message: 'max es opcional.' })
    @IsNotEmpty({ message: 'max es requerido.' })
    @IsString({ message: 'max debe ser un string.' })
    max?: string;
    @ApiProperty({ description: 'cols text area', example: 'cols attribute textarea', required: true })
    @IsOptional({ message: 'cols es opcional.' })
    @IsNotEmpty({ message: 'cols es requerido.' })
    @IsString({ message: 'cols debe ser un string.' })
    cols?: string;
    @ApiProperty({ description: 'rows text area', example: 'rows attribute textarea', required: true })
    @IsOptional({ message: 'rows es opcional.' })
    @IsNotEmpty({ message: 'rows es requerido.' })
    @IsString({ message: 'rows debe ser un string.' })
    rows?: string;
    @ApiProperty({ description: 'id required', example: 'id elements', required: true })
    @IsOptional({ message: 'id es opcional.' })
    @IsNotEmpty({ message: 'id es requerido.' })
    @IsString({ message: 'id debe ser un string.' })
    id: string;
    @ApiProperty({ description: 'name required', example: 'name elements', required: true })
    @IsOptional({ message: 'name es opcional.' })
    @IsNotEmpty({ message: 'name es requerido.' })
    @IsString({ message: 'name debe ser un string.' })
    name: string;
    @ApiProperty({ description: 'placeholder required', example: 'placeholder elements', required: true })
    @IsOptional({ message: 'placeholder es opcional.' })
    @IsNotEmpty({ message: 'placeholder es requerido.' })
    @IsString({ message: 'placeholder debe ser un string.' })
    placeholder: string;
    @ApiProperty({ description: 'class elements', required: true })
    @IsOptional({ message: 'class es opcional.' })
    @IsNotEmpty({ message: 'class es requerido.' })
    @IsString({ message: 'class debe ser un string.' })
    class: string;
    @ApiProperty({ description: 'validation elements', example: 'elemento obligatorio o no', required: true })
    @IsNotEmpty({ message: 'validation es requerido.' })
    @IsBoolean({ message: 'validation debe ser un boolean.' })
    validation: boolean;
    @ApiProperty({ description: 'data-bs-toggle elements', example: 'data-bs-toggle', required: true })
    @IsOptional({ message: 'data_bs_toggle es opcional.' })
    @IsNotEmpty({ message: 'data_bs_toggle es requerido.' })
    @IsString({ message: 'data_bs_toggle debe ser un string.' })
    data_bs_toggle:string;
    @ApiProperty({ description: 'aria_expanded', example: 'data-bs-toggle', required: true })
    @IsOptional({ message: 'aria_expanded es opcional.' })
    @IsNotEmpty({ message: 'aria_expanded es requerido.' })
    @IsBoolean({ message: 'aria_expanded debe ser un boolean.'})
    aria_expanded: boolean;
    @ApiProperty({ description: 'aria_controls', example: 'aria-controls', required: true })
    @IsOptional({ message: 'aria_controls es opcional.' })
    @IsNotEmpty({ message: 'aria_controls es requerido.' })
    @IsString({ message: 'aria_controls debe ser un string.' })
    aria_labelledby: string;
    @ApiProperty({ description: 'ul_class', example: 'aria-labelledby', required: true })
    @IsOptional({ message: 'ul_class es opcional.' })
    @IsNotEmpty({ message: 'ul_class es requerido.' })
    @IsString({ message: 'ul_class debe ser un string.' })
    ul_class: string;
    @ApiProperty({ description: 'li_class', example: 'li_class', required: true })
    @IsOptional({ message: 'li_class es opcional.' })
    @IsNotEmpty({ message: 'li_class es requerido.' })
    @IsString({ message: 'li_class debe ser un string.' })
    li_class: string;
    @ApiProperty({ description: 'maxlength', example: 'maxlength', required: true })
    @IsOptional({ message: 'maxlength es opcional.' })
    @IsNotEmpty({ message: 'maxlength es requerido.' })
    @IsString({ message: 'maxlength debe ser un string.' })
    maxlength: string;
    @ApiProperty({ description: 'other_input', example: 'other_input object', required: true })
    @IsOptional({ message: 'other_input es opcional.' })
    @IsNotEmptyObject({}, { message: 'other_input es requerido.'})
    @IsObject({ message: 'other_input debe ser un object.' })
    @ValidateNested({ each: true })
    @Type(() => OtherInput)
    other_input: OtherInput;
    @ApiProperty({ description: 'Reglas de validacion fichero', required: false })
    @IsOptional({ message: 'constraints_file es opcional.' })
    @IsNotEmpty({ message: 'constraints_file es requerido.' })
    @IsObject({ message: 'constraints_file debe ser un object.' })
    @ValidateNested({ each: true })
    @Type(() => ConstraintFile)
    constraints_file: ConstraintFile;
}

export class LabelQuestion {
  @ApiProperty({ description: 'class label', example: 'form-label', required: true })
  @IsOptional({ message: 'class es opcional.' })
  @IsNotEmpty({ message: 'class es requerido.' })
  @IsString({ message: 'class debe ser un string.' })
  class: string;
  @ApiProperty({ description: 'for label', example: 'id', required: true })
  @IsOptional({ message: 'for es opcional.' })
  @IsNotEmpty({ message: 'for es requerido.' })
  @IsString({ message: 'for debe ser un string.' })
  for: string;
  @ApiProperty({ description: 'text label', example: 'Nombre', required: true })
  @IsOptional({ message: 'text es opcional.' })
  @IsNotEmpty({ message: 'text es requerido.' })
  @IsString({ message: 'text debe ser un string.' })
  text: string;
  @ApiProperty({ description: 'title_initial_stage label', example: 'title', required: false })
  @IsOptional({ message: 'title_initial_stage es opcional.' })
  @IsNotEmpty({ message: 'title_initial_stage es requerido.' })
  @IsString({ message: 'title_initial_stage debe ser un string.' })
  title_initial_stage: string;
}
export class QuestionData {
    @ApiProperty({ description: 'question elements', example: 'first name', required: true })
    @IsNotEmptyObject({}, { message: 'question es requerido.'})
    @IsObject({ message: 'question debe ser un object.' })
    @ValidateNested({ each: true })
    @Type(() => LabelQuestion)
    question: LabelQuestion;
    @ApiProperty({ description: 'answer elements', example: 'last name', required: true })
    @IsNotEmptyObject({}, { message: 'answer es requerido.'})
    @IsObject({ message: 'answer debe ser un object.' })
    @ValidateNested({ each: true })
    @Type(() => AnswerData)
    answer: AnswerData;
}
export class NotificationsData {
  @ApiProperty({ description: 'Message success', required: true })
  @IsNotEmpty({ message: 'message_success es requerido.' })
  @IsString({ message: 'message_success debe ser un string.' })
  message_success: string;
  @ApiProperty({ description: 'Message Error', required: true })
  @IsNotEmpty({ message: 'message_error es requerido.' })
  @IsString({ message: 'message_error debe ser un string.' })
  message_error: string;
}
export class TitleData {
  @ApiProperty({ description: 'name', required: true })
  @IsNotEmpty({ message: 'title es requerido.' })
  @IsString({ message: 'title debe ser un string.' })
  name: string;
  @ApiProperty({ description: 'position', required: true })
  @IsNotEmpty({ message: 'position es requerido.' })
  @IsNumber({}, { message: 'position debe ser un número.' })
  position: number;
}
export class FormWidget {
    @ApiProperty({ description: 'Name Project Form - Widget', example: 'Name Project (create the project first)', required: true })
    @IsNotEmpty({ message: 'El project_name es requerido.' })
    @IsString({ message: 'El project_name debe ser un string.' })
    @SanitizeHtml({ message: 'HTML no permitido.'})
    project_name: string;
    @ApiProperty({ description: 'Title Form - Widget', example: 'Ideas', required: true })
    @IsNotEmpty({ message: 'El Title es requerido.' })
    @IsString({ message: 'El Title debe ser un string.' })
    @SanitizeHtml({ message: 'HTML no permitido.'})
    title: string;
    @ApiProperty({ description: 'Title stage Form - Widget', required: true })
    @IsOptional({ message: 'title_position es opcional.' })
    @IsArray({ message: 'title_position deben ser un array.' })
    @ArrayMinSize(1, { message: 'Debe tener al menos 1 title' })
    @ArrayMaxSize(10, { message: 'No puede tener más de 10 title' })
    @ValidateNested({ each: true })
    @ArrayNotEmpty({ message: 'title son requeridos.' })
    @Type(() => TitleData)
    title_position: TitleData[];
    @ApiProperty({ description: 'Description Form - Widget', example: 'Obtener informacion sobre posible ideas', required: true })
    @IsNotEmpty({ message: 'La description es requerido.' })
    @IsString({ message: 'La description debe ser un string.' })
    @SanitizeHtml({ message: 'HTML no permitido.'})
    description: string;
    @ApiProperty({ description: 'image Header', example: 'Imagen Cabecera Formulario', required: false })
    @IsOptional({ message: 'header_images es opcional.' })
    @IsNotEmpty({ message: 'La header_image es requerido.' })
    @IsString({ message: 'La header_image debe ser un string.' })
    header_image: string;
    @ApiProperty({ description: 'URL asociada al boton de Salir formulario', example: 'https://publico.transbank.cl', required: false })
    @IsOptional({ message: 'url_external es opcional.' })
    @IsNotEmpty({ message: 'La url_external es requerido.' })
    @IsString({ message: 'La url_external debe ser un string.' })
    url_external: string;
    @ApiProperty({ description: 'template Form - Widget', example: 'Maqueta HTML', required: true })
    @IsNotEmpty({ message: 'El template es requerido.' })
    @IsString({ message: 'El template debe ser un string.' })
    @SanitizeHtml({ message: 'HTML no permitido.'})
    template: string;
    @ApiProperty({ description: 'notifications Form - Widget', example: 'susscess form', required: true })
    @IsObject({ message: 'notifications debe ser un object.' })
    @IsNotEmptyObject({}, { message: 'notifications es requerido.'})
    @ValidateNested({ each: true })
    @Type(() => NotificationsData)
    notifications: NotificationsData;
    @ApiProperty({ description: 'elements Form - Widget', example: 'elementos del formulario', required: true })
    @IsArray({ message: 'elements deben ser un array.' })
    @ArrayMinSize(5, { message: 'Debe tener al menos 3 elementos' })
    @ArrayMaxSize(25, { message: 'No puede tener más de 25 elementos' })
    @ValidateNested({ each: true })
    @ArrayNotEmpty({ message: 'elements son requeridos.' })
    @Type(() => QuestionData)
    elements: QuestionData[];
}
export class QuestionsElements {
  @ApiProperty({ description: 'id question', required: true })
  @IsNotEmpty({ message: 'id_question es requerido.' })
  @IsString({ message: 'id_question debe ser un string.' })
  id_question: string;
}

export class QuestionStages {
  @ApiProperty({ description: 'name stage', example: 'Etapa 1', required: true })
  @IsNotEmpty({ message: 'name_stage es requerido.' })
  @IsString({ message: 'name_stage debe ser un string.' })
  name_stage: string;
  @ApiProperty({ description: 'imagen_stage', example: 'Descripcion de la etapa', required: true })
  @IsOptional({ message: 'imagen_stage es opcional.' })
  @IsNotEmpty({ message: 'imagen_stage es requerido.' })
  @IsString({ message: 'imagen_stage debe ser un string.' })
  @SanitizeHtml({ message: 'HTML no permitido.'})
  imagen_stage: string;
  @ApiProperty({ description: 'questions_stage', example: 'elementos del formulario por etapa', required: true })
  @IsArray({ message: 'questions_stage debe ser un Array.' })
  @ArrayNotEmpty({ message: 'questions_stage es requerido.'})
  @ValidateNested({ each: true })
  @Type(() => QuestionsElements)
  questions_stage: QuestionsElements[];
}
export class ImagenNotifications {
  @ApiProperty({ description: 'success_image', required: true })
  @IsNotEmpty({ message: 'success_image es requerido.' })
  @IsString({ message: 'success_image debe ser un string.' })
  @SanitizeHtml({ message: 'HTML no permitido.'})
  success_image: string;
  @ApiProperty({ description: 'error_image', required: true })
  @IsNotEmpty({ message: 'error_image es requerido.' })
  @IsString({ message: 'error_image debe ser un string.' })
  @SanitizeHtml({ message: 'HTML no permitido.'})
  error_image: string;
}
export class StageQuestionsData {
  @ApiProperty({ description: 'Name Project', required: true })
  @IsNotEmpty({ message: 'project_name es requerido.' })
  @IsString({ message: 'project_name debe ser un string.' })
  project_name: string;
  @ApiProperty({ description: 'Name Stage', required: true })
  @IsArray({ message: 'stages deben ser un array.' })
  @ArrayMinSize(2, { message: 'Debe tener (MIN) 2 ETAPA.' })
  @ArrayMaxSize(10, { message: 'No puede (MAX) 10 ETAPAS.' })
  @ValidateNested({ each: true })
  @ArrayNotEmpty({ message: 'stages son requeridos.' })
  @Type(() => QuestionStages)
  stages: QuestionStages[];
  @ApiProperty({ description: 'image_notifications', required: true })
  @IsObject({ message: 'image_notifications deben ser un objecto.' })
  @IsNotEmptyObject({}, { message: 'image_notifications es requerido.'})
  @ValidateNested({ each: true })
  @Type(() => ImagenNotifications)
  image_notifications: ImagenNotifications;
}
export class RangeDate {
  @ApiProperty({ description: 'Fecha de inicio', required: true })
  @IsNotEmpty({ message: 'La Fecha de inicio es requerida.' })
  @IsOptional({ message: 'Fecha de inicio es opcional.' })
  readonly startDate: string;
  @ApiProperty()
  @ApiProperty({ description: 'Fecha de fin', required: true })
  @IsNotEmpty({ message: 'La Fecha de fin es requerida.' })
  @IsOptional({ message: 'Fecha de fin es opcional.' })
  readonly endDate: string;
}
/*
export class DataParams {
  @ApiProperty({ description: 'Nombre del contacto', required: true })
  @IsOptional({ message: 'name es opcional.' })
  @IsNotEmpty({ message: 'name es requerido.' })
  @IsString({ message: 'name debe ser un string.' })
  @SanitizeHtml({ message: 'HTML no permitido.'})
  name: string;
  @ApiProperty({ description: 'Email del contacto', required: true })
  @IsOptional({ message: 'email es opcional.' })
  @IsNotEmpty({ message: 'email es requerido.' })
  @IsString({ message: 'email debe ser un string.' })
  @SanitizeHtml({ message: 'HTML no permitido.'})
  email: string;
}
*/
export class SearchFormDto extends IntersectionType(PartialType(FormWidget),RangeDate) {}
export class UpdateFormDto extends PartialType(FormWidget) {}
export class UpdateGroupQuestDto extends PartialType(StageQuestionsData) {}
export class IDGroupQuestDto extends PartialType(StageQuestionsData) {}