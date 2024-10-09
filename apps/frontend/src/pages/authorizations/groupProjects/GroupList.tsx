import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import './index.css';
import { faCheck, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ModalConfirmGeneral from "../../../components/ModalConfirmGen";
import { listUpdate, modalSend, validaModalDelete, validaModalStatus } from "../../../utils/helpers/groupCategory/groupList";
function GroupList() {
  const [flagLoading, setIsLoading] = useState<any>(true);
  const [search, setSearch] = useState<any>('');
  const [dataGroup, setGroup] = useState<any>([]);
  const [dataGroupOrignal, setFilter] = useState<any>([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalAlert, setShowModalAlert] = useState(false);
  const [dataModal, setContentModal] = useState<any>({});
  const [isButtonStatus, setButtonStatus] = useState<any>(false); 
  const [isFlagRoute, setFlagRoute] = useState<any>(false); 
  const [dataId, setId] = useState<any>('');
  const [isStatusValid, setStatus] = useState<any>(false); 
  const customStyles = { cells: { style: { fontSize: '15px', padding: '05px'} }, rows: { style: { minHeight: '50px' }}}
      const columns: any = [ {name: 'Id', selector: (row: any) => `${row.id}`, sortable: true, center: true},
         { name: 'Name',
            selector: (row: any) => `${row.name}`,
            sortable: true,
            center: true
         },
         {name: 'Projects',
          selector: (row: any) => row.projects.map((val: any) => (val.name)).join(', '),
          sortable: true,
          center: true
          
       },
       {name: 'Status',
        selector: (row: any) => `${ row.active ? 'Activo' : 'Desactivado'}`,
        sortable: true,
        center: true
        },
         {name: 'Acciones',
            sortable: false,
            center: true,
            cell: (row: any) => (
              <div className={`d-grid gap-2 d-flex justify-content-end`} style={{ width: '100%' }}>
        <Link to={`/group-read/${row._id}`} className={`btn btn-info btn-sm`}>
          Read
          </Link>
          <Link to={`/group-edit/${row._id}`} className={`btn btn-primary btn-sm`}>
          Edit
          </Link>
          <Link to="#" className={`btn btn-${row.active ? 'success': 'danger'} btn-sm`} onClick={() => validaModalStatus(row._id, row.active, setFlagRoute, setId, setStatus, setButtonStatus, setShowModal, setShowModalAlert)}>
          <FontAwesomeIcon style={{ paddingLeft: '03px' }}  icon={row.active ? faCheck: faClose } size="lg"/>
          </Link>
          <Link to="#" onClick={() => validaModalDelete(row._id, setFlagRoute, setId, setButtonStatus, setShowModal, setShowModalAlert)} className={`btn btn-danger btn-sm`}>
          Delete
          </Link>
       </div>
              )}];
    useEffect(() => {
        (async () => {
          await listUpdate(setIsLoading, isFlagRoute, isStatusValid, setContentModal, showModal, setGroup, setFilter);
        })();
      }, [showModal]);
      useEffect(() => {
        (async () => {
          const filteredData = dataGroup.filter(({ name }: { name: string }) => {
            let searhPattern = search.toUpperCase();
            return name.toUpperCase().match(searhPattern);
          });
          setFilter(filteredData);
        })();
      }, [search]);
    return (
<div className={`d-flex flex-column justify-content-center align-items-center bg-light vh-100`}>
  <div className={`rounded bg-white border shadow p-5 mt-5`} style={{width:'86%'}}>
    <h1 className={`text-center`}>Grupos Projectos</h1>
        <div className={`d-flex justify-content-end m-3`}>
            <Link to="/group-projects" className={`btn btn-sm btn-success`}>Crear Grupo</Link>
        </div>
          <DataTable 
          columns={columns} 
          data={dataGroupOrignal} 
          fixedHeader={true}
          fixedHeaderScrollHeight={`300px`}
          pagination
          highlightOnHover
        pointerOnHover
        progressPending={flagLoading}
        customStyles={customStyles}
          noDataComponent={<div className={`d-flex flex-column justify-content-center align-items-center`}>No existen registros.</div>}
          subHeader
          subHeaderComponent={
            <input type="text" className={`w-25 ms-auto form-control`} placeholder={`Buscar`} value={search} onChange={(e: any) => setSearch(e.target.value)}/>
          }
          ></DataTable>
      </div>
      {showModal && (
  <ModalConfirmGeneral dataModal={dataModal} buttonValid={isButtonStatus} isModal={showModalAlert} onClose={() => setShowModal(false)} onSave={() => modalSend(isFlagRoute, setButtonStatus, dataId, setShowModal, setShowModalAlert, isStatusValid) } />
  )}</div>);
}
export default GroupList;