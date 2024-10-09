import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Logger } from "@nestjs/common";
const validationGeneral = async (data: any,dto: any): Promise<boolean> => {
const createSurveyDto = plainToInstance(dto, data?.body);
const errors = await validate(createSurveyDto);
    if (errors.length > 0) {
     new Logger().debug(`[validationGeneral] Error: ${JSON.stringify(errors[0]?.constraints)}`);
    return false
    }
    return true;
}
export default validationGeneral;

