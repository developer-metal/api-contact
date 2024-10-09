export enum ErrorCode {
    Error_dto_create = "ERROR_DTO_CREATE",
    Project_No_Exists = "PROJECT_NO_EXISTS",
    register_exist_in_database = "REGISTER_EXIST_IN_DATABASE",
    Email_no_exists = "EMAIL_NO_EXISTS",
    Error_general_survey = "ERROR_GENERAL_SURVEY",
    Error_export_excel = "ERROR_EXPORT_EXCEL"
}
export class ErrorGeneral extends Error {
    code: ErrorCode;
    constructor(code: ErrorCode, message: string) {
        super(message);
        this.name = "ErrorGeneral";
        this.code = code;
    }
}