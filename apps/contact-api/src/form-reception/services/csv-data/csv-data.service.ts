import { Injectable, Logger } from '@nestjs/common';
import path from 'path';
import { createObjectCsvWriter } from 'csv-writer';
@Injectable()
export class CsvDataService {
  private readonly logger = new Logger();
  public fecha: Date;
  pathCustom: string = path.join('./apps/contact-api/src/public/Formulario.csv');
  async exportCsv(data: any): Promise<any> {
    const jsonData: Array<any> = [];
    let dataCsv: any = {};
    for (const element of data) {
      const {
        project,
        contactName,
        contactEmail,
        fields,
        sendDate,
        requestNumber
      } = element;
      this.fecha = new Date(sendDate);
      let formulario = fields.fieldsContainer?.map((item: any) => [
        `${item.statement}: ${item.response}`
      ]);
      dataCsv = {
        numero_solicitud: requestNumber,
        proyecto: project?.name,
        fecha: this.fecha.toISOString().split('T')[0],
        nombre_contacto: contactName,
        email_contacto: contactEmail,
        reporte: fields.reportIdentification,
        form: formulario?.join('\r\n\n\n'),
        token: fields.fieldsContainer.find((item: any) => item.statement === 'Token')?.response ?? 'N/A'
      };
      jsonData.push(dataCsv);
    }

    const csvWriter = createObjectCsvWriter({
      path: this.pathCustom,
      header: [
        { id: 'numero_solicitud', title: 'Numero de Solicitud asignado' },
        { id: 'proyecto', title: 'Nombre Proyecto' },
        { id: 'fecha', title: 'Fecha Envio' },
        { id: 'nombre_contacto', title: 'Nombre Contacto' },
        { id: 'email_contacto', title: 'Email Contacto' },
        { id: 'reporte', title: 'Reporte'},
        { id: 'form', title: 'Formulario' },
        { id: 'token', title: 'Token Cyber'}
      ]
    });
    try {
      await csvWriter.writeRecords(jsonData);
      return this.pathCustom;
    } catch (error) {
      this.logger.error(`[service - exportCsv ] Error ${error} `);
      throw new Error('Error al exportar el archivo CSV.');
    }
  }
}
