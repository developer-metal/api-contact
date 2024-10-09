import { Injectable, Logger } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { ErrorCode, ErrorGeneral } from 'src/common/enums/error.class';
@Injectable()
export class ExportExcelService {
  private readonly logger = new Logger();
  async generateExcel(data: any): Promise<any> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('CES');
    try {
      worksheet.columns = [
        { header: 'PROYECTO', key: 'project', width: 25 },
        { header: 'RESPUESTA', key: 'actions', width: 25 },
        { header: 'EMAIL', key: 'email', width: 25 },
        { header: 'NOMBRE', key: 'name', width: 25 },
        { header: 'DISPOSITIVO', key: 'dispositive', width: 25 },
        { header: 'FECHA', key: 'creation_date', width: 25 },
        { header: 'PROMEDIO', key: 'resultados', width: 25 }
      ];
      worksheet.mergeCells('A1:G1');
      const titleCell = worksheet.getCell('A1');
      titleCell.value = 'CES';
      titleCell.font = { name: 'Arial', size: 16, bold: true };
      titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
      titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'CFCFCF' }};
      titleCell.border = { top: { style: 'thin', color: { argb: '000000' } },
        left: { style: 'thin', color: { argb: '000000' } },
        bottom: { style: 'thin', color: { argb: '000000' } },
        right: { style: 'thin', color: { argb: '000000' } }
      };
      const headerRow = worksheet.addRow([ 'PROYECTO', 'RESPUESTA', 'EMAIL', 'NOMBRE', 'DISPOSITIVO', 'FECHA', 'RESULTADOS'
      ]);
      headerRow.eachCell(cell => {
        cell.font = { bold: true, size: 12 };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'CFCFCF' } };
        cell.border = {
          top: { style: 'thin', color: { argb: '000000' } },
          left: { style: 'thin', color: { argb: '000000' } },
          bottom: { style: 'thin', color: { argb: '000000' } },
          right: { style: 'thin', color: { argb: '000000' } }
        };
      });
      const mergeMap = new Map<string, { startRow: number, endRow: number, resultados: string }>();
      if (Array.isArray(data as any)) {
        data.forEach((item, index) => {
          const rowIndex = index + 3;
          worksheet.addRow({
            project: item?.project?.name,
            actions: item?.actions,
            email: item?.email,
            name: item?.name,
            dispositive: item?.dispositive,
            creation_date: item?.creation_date,
            resultados: ''
          });
          const key = item?.actions;
          if (mergeMap.has(key)) { mergeMap.get(key).endRow = rowIndex;
          } else { mergeMap.set(key, { startRow: rowIndex, endRow: rowIndex, resultados: item?.resultados[key] });
          }
        });
      }
      mergeMap.forEach(({ startRow, endRow, resultados }, key) => {
        if (startRow !== endRow) { worksheet.mergeCells(`G${startRow}:G${endRow}`);}
        const mergedCell = worksheet.getCell(`G${startRow}`);
        mergedCell.value = resultados;
        mergedCell.alignment = { vertical: 'middle', horizontal: 'center' };
        mergedCell.border = { top: { style: 'thin', color: { argb: '000000' } },
          left: { style: 'thin', color: { argb: '000000' } },
          bottom: { style: 'thin', color: { argb: '000000' } },
          right: { style: 'thin', color: { argb: '000000' } }
        };
        mergedCell.font = { size: 10 };
      });
      worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber > 2) {
          row.height = 25;
          row.eachCell(cell => {
            cell.font = { size: 10 };
            cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
            cell.border = {
              top: { style: 'thin', color: { argb: '000000' } },
              left: { style: 'thin', color: { argb: '000000' } },
              bottom: { style: 'thin', color: { argb: '000000' } },
              right: { style: 'thin', color: { argb: '000000' } }
            };
          });
        }
      });
      const buffer = await workbook.xlsx.writeBuffer();
      this.logger.log('[service - generateExcel ] Ok');
      return buffer;
    } catch (error) {
      this.logger.error(`Error generating Excel file: ${JSON.stringify(error)}`);
      throw new ErrorGeneral(ErrorCode.Error_export_excel, 'Error generating Excel file');
    }
  }
}