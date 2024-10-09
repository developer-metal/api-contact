
import DataTable from 'react-data-table-component';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { allProject } from "../../services/projectService";
import './index.css';
import ModalConfirt from '../../components/ModalsConfirt';
import { listProject } from '../../utils/helpers/projects/validProjectUpdate';
function ListProject() {
  const [records, setRecords] = useState<any>([]);
  const [originalRecords, setOriginalRecords] = useState<any>([]);
  const [search, setSearch] = useState<any>('');
  const [flagLoading, setIsLoading] = useState<any>(true);
  const [showModal, setShowModal] = useState(false);
  const [idDelete, setId] = useState('');
  const [tablaActualizada, setTablaActualizada] = useState(false);
  let contentModal: any = { description: '¿Está seguro que desea eliminar el proyecto?', titleButton: [{variant: 'secondary', name: 'Cerrar' }, { variant: 'primary', name: 'Confirma Eliminacion' }], showParam: showModal};
  const handleDelete = async (id: string) => {
    setId(id);
    setShowModal(true);
  };
  const updateTable = () => {
    setTablaActualizada(true);
  };
  const customStyles = { cells: { style: { fontSize: '15px' }}, rows: { style: { minHeight: '50px' }}}
  const columns: any = [{ name: 'Id', selector: (row: any) => row.id, sortable: true },
     { name: 'Nombre Proyecto',
        selector: (row: any) => row.name,
        sortable: true,
        center: true
     },
     {
        name: 'Correo Destinos',
        selector: (row: any) => row.templateEmails.mailsTo?.length > 0 ? row.templateEmails.mailsTo?.map((val: any) => (val.name)).join(', '): 'N/A',
        sortable: true,
        center: true
     },
     {
      name: 'Cant. Form',
      selector: (row: any) => row.count,
      sortable: true,
      center: true
    },
     {
        name: 'Acciones',
        sortable: false,
        center: true,
        cell: (row: any) => ( <div className={`d-grid gap-2 d-md-flex justify-content-md-end`}>
    <Link to={`/project-read/${row._id}`} className={`btn btn-xs btn-info btn-sm`} >Read </Link>
    <Link to={`/project-update/${row._id}`} className={`btn btn-xs btn-primary btn-sm`} >Edit</Link>
     <Link to="#" onClick={() => handleDelete(row._id)} className={`btn btn-xs btn-danger btn-sm`} >Delete</Link>
  </div>)}];
useEffect(() => {
    (async () => {
          try {
              const payload = await allProject();
              if (payload) {
                  setIsLoading(false);
                  const formatData = payload.map((val: any,index: any) => ({...val, id: (index + 1),
                  name: val.name, mailsTo: val.templateEmails.mailsTo,
                  count: val.formulario_count
              }));
              setRecords(formatData);
              setOriginalRecords(formatData);
              if (tablaActualizada) { setTablaActualizada(false); }
            }
          } catch (error) { console.log('error Projecto',error);}
    })();
  }, [tablaActualizada]);
  useEffect(() => {
    listProject(records, search, setOriginalRecords);
  }, [search]);
return ( <> <div className={`d-flex flex-column justify-content-center align-items-center bg-light vh-100`}>
  <div className={`w-75 rounded bg-white border shadow p-5 mt-5 `}>
    <h1 className={`text-center`}>Proyectos</h1>
        <div className={`d-flex justify-content-end m-3`}>
            <Link to="/project-create" className={`btn btn-sm btn-success`}>Crear Proyecto</Link>
        </div>
    <DataTable 
    columns={columns} 
    data={originalRecords} 
    fixedHeader={true}
    fixedHeaderScrollHeight={`300px`}
    pagination
    highlightOnHover
  pointerOnHover
  progressPending={flagLoading}
  customStyles={customStyles}
  className={`align-left-table`}
    noDataComponent={<div className={`d-flex flex-column justify-content-center align-items-center`}>No existen registros.</div>}
    subHeader
    subHeaderComponent={
      <input type="text" className={`w-25 ms-auto form-control`} placeholder={`Buscar`} value={search} onChange={(e: any) => setSearch(e.target.value)}/>
    }
    ></DataTable>
</div></div>
{showModal && ( <ModalConfirt dataModal={contentModal} id={idDelete} onClose={() => setShowModal(false)} onSave={() => updateTable() } />
)}
</>)};
export default ListProject;