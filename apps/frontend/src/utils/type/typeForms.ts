export type Forms = {
    nameProject: string;
    contactEmail: string;
    contactName?: string;
    fieldsContainer: fieldsData[];
  };
type fieldsData = {
    statement: string;
    response: string;
};
