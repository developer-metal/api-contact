import ExcelJS from 'exceljs';
const downloadCSV = async (data: any, dataDate: any) => {
  const formaDateStart = (dataDate?.start && dataDate?.end) ? `_${dataDate?.start}` : '';
  const formattedData = csvDataFormat(data);
  const workbook = new ExcelJS.Workbook();
  formattedData.forEach((project: any) => {
    let sheetName = project['Proyecto'];
    let worksheet = workbook.getWorksheet(sheetName);
    if (!worksheet) {
      worksheet = workbook.addWorksheet(sheetName);
      const keys = Object.keys(project);
      worksheet.columns = keys.map((key) => ({
        header: key,
        key: key,
        width: 30
      }));
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'CFCFCF' }
      };
      cell.font = {
        bold: true,
        color: { argb: '000000' },
        size: 13
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle'};
      cell.border = {
        top: { style: 'thin', color: { argb: '000000' } },
        left: { style: 'thin', color: { argb: '000000' } },
        bottom: { style: 'thin', color: { argb: '000000' } },
        right: { style: 'thin', color: { argb: '000000' } }
      };
    });
  }
  worksheet.addRow(project);
    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      if (rowNumber === 1) return;
      row.height = 40;
      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.font = {
          color: { argb: '000000' },
          size: 12
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true};
        cell.border = {
          top: { style: 'thin', color: { argb: '000000' } },
          left: { style: 'thin', color: { argb: '000000' } },
          bottom: { style: 'thin', color: { argb: '000000' } },
          right: { style: 'thin', color: { argb: '000000' } }
        };
      });
    });
  });
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `Formularios${formaDateStart}.xlsx`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
const csvDataFormat = (data: any): any[] => {
  const isBase64 = 'ADJUNTA';
  return data.map((item: any) => {
    let formulario: { [key: string]: any } = {};
    const validFields = item.fields.fieldsContainer.filter((field: any) => !field?.statement.toUpperCase().includes(isBase64));
    validFields.forEach((field: any) => {
      formulario[field.statement] = field.response;
    });
    return {
      "Proyecto": item?.name,
      "Nombre contacto": item?.contactName,
      "Fecha": String(item?.fecha).split('T')[0],
      "Dispositivo": item?.user_agent,
      ...formulario
    };
  });
};

export default downloadCSV;
