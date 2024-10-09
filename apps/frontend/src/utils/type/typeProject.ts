export type Project = {
    slug: string;
    name: string;
    sender?: string;
    pocImage?: string;
    templateEmails?: templateEmails;
  };
type TitleEmail = {
    name: string;
};
export type templateEmails = {
    titleClient: string;
    messageTemplate: string;
    titleExecutive: string;
    documentTemplate: string;
    mailsTo: TitleEmail[];
};