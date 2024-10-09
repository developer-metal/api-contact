
import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { allForms} from "../../services/formsService";
import 'react-datepicker/dist/react-datepicker.css';
import es from 'date-fns/locale/es';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import ExportData from "../../components/ExportData";
import ModalFormConfirt from "../../components/ModalsFormConfirt";
import { EndDate, StartDate } from "../../components/projects/listForms";
import { registerLocale } from "react-datepicker";
registerLocale('es', es)
function ListForms() {
  const [dataForms, setForms] = useState<any>([]);
  const [originalRecords, setOriginalRecords] = useState<any>([]);
  const [flagLoading, setIsLoading] = useState<any>(true);
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [idDelete, setId] = useState('');
  const [tablaActualizada, setTablaActualizada] = useState(false);
  let contentModal: any = { description: '¿Está seguro que desea eliminar el formulario?', titleButton: [{variant: 'secondary', name: 'Cerrar' }, {variant: 'primary', name: 'Confirmo Eliminacion' }], showParam: showModal};
  const handleDelete = async (id: string) => { setId(id);setShowModal(true);};
  const updateTable = () => { setTablaActualizada(true);};
  const customStyles = { cells: { style: { fontSize: '15px' } }, rows: { style: { minHeight: '50px'}}};
  const columns: any = [{ name: 'Id', selector: (row: any) => `${row.id}`, sortable: true, center: true}, 
     { name: 'Nombre Proyecto', selector: (row: any) => `${row.name}`, sortable: true, center: true },
     { name: 'Formularios', selector: (row: any) => row.contactEmail, sortable: true, center: true},
     { name: 'Fecha registro', selector: (row: any) => row.fecha.split('T')[0], sortable: true},
     { name: 'Acciones', sortable: false, center: true,
      cell: (row: any) => ( <div className={`d-grid gap-2 d-md-flex justify-content-md-end`}>
    <Link to={`/forms-read/${row._id}`} className={`btn btn-xs btn-info btn-sm`}>Read</Link>
    <Link to="#"  className={`btn btn-xs btn-danger btn-sm`} onClick={() => handleDelete(row._id) }>Delete</Link></div>)}];
useEffect(() => {
    (async () => {
          try {
              const payload = await allForms();
              if (payload) { setIsLoading(false);
              const formatData = payload.map((val: any,index: any) => ({...val, id: (index + 1), name: val.projectSlug,
                contactEmail: val.contactEmail, fecha: val.sendDate }));
              setForms(formatData);
              setOriginalRecords(formatData);
            if (tablaActualizada) { setTablaActualizada(false);}
          }
          } catch (error) { console.log('error Projecto',error);}
    })();
  }, [tablaActualizada]);
  const isSearchDate = async () => {
    const startDateForm = dayjs(startDate).format('YYYY-MM-DD');
    const endDateForm = dayjs(endDate).format('YYYY-MM-DD');
   if (startDateForm && endDateForm) {
        try { const parameters: any = (startDateForm != 'Invalid Date' && endDateForm != 'Invalid Date') ? `startDate=${startDateForm}&endDate=${endDateForm}`: null;
        const dataOptions = await allForms(parameters);
          if (dataOptions.hasOwnProperty('message')) { setForms([]); }
          if (dataOptions.length > 0) {
          const responseOptions: any = dataOptions.map((val: any,index: any) => ({...val, 
            id: (index + 1), name: val.projectSlug, contactEmail: val.contactEmail, fecha: val.sendDate
        }));
        setForms(responseOptions);
      } else { setForms([]); }
      } catch (error) { console.log('error Projecto',error);}
    }
  }
const hadleStartDate = (date: any) => { setStartDate(date);}
const hadledEndDate = (date: any) => {  setEndDate(date);}
const dateFormt = {stard: dayjs(startDate).format('YYYY-MM-DD')  != 'Invalid Date'? dayjs(startDate).format('YYYY-MM-DD') : null, end: dayjs(endDate).format('YYYY-MM-DD')  != 'Invalid Date' ? dayjs(endDate).format('YYYY-MM-DD') : null};
const actionsMemo = <ExportData export={dataForms} rangeDate={dateFormt} />;
return (
  <>
<div className={`d-flex flex-column justify-content-center align-items-center bg-light vh-100`}>
  <div className={`w-75 rounded bg-white border shadow p-5`}>
    <h1 className={`text-center`}>Formularios</h1>
      <div className={`d-grid gap-1  d-flex justify-content-center align-items-center`}>
    <StartDate startDate={startDate} hadleStartDate={hadleStartDate} endDate={endDate} es={es}  />
    <EndDate endDate={endDate} hadledEndDate={hadledEndDate} startDate={startDate} es={es} />
       <div className={`d-grid gap-2 d-md-flex justify-content-md-end`}>
          <button className={`btn btn-xs btn-info btn-sm`} onClick={() => { isSearchDate()}} >Filtrar</button>
          <button className={`btn btn-xs btn-danger btn-sm`} onClick={() => { setStartDate(null), setEndDate(null), setForms(originalRecords)}}>Borrar</button>
          </div></div><div className={`w-25 d-flex mb-2 ms-auto`}></div>
    <DataTable 
    columns={columns} 
    data={dataForms} 
    actions={actionsMemo}
    fixedHeader={true}
    fixedHeaderScrollHeight={`300px`}
    pagination
    highlightOnHover
  pointerOnHover
  progressPending={flagLoading}
  customStyles={customStyles}
    noDataComponent={<div className={`d-flex flex-column justify-content-center align-items-center`}>No existen registros.</div>}
    ></DataTable>
</div></div>
{showModal && (<ModalFormConfirt dataModal={contentModal} id={idDelete} onClose={() => setShowModal(false)} onSave={() => updateTable() } />)}
</>);}
export default ListForms;