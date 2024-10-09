import { useEffect, useState } from "react";
import { readGroupProjects } from "../../../services/bff/backendService";
import { Link, useParams } from "react-router-dom";
import { Card, ListGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faClose } from "@fortawesome/free-solid-svg-icons";
function GroupRead() {
    const { id }: any = useParams(); 
    const [isLoadingAll, seLoadingAll] = useState<any>(false); 
    const [dataRead, setDataRead] = useState<any>('');
    useEffect(() => {
        (async () => {
              try {
                  const { payload } = await readGroupProjects(id); 
                  if (payload) {
                    seLoadingAll(true);   
                    const dataGroup = {
                        name: payload.name,
                        activeGroup: payload.active,
                        projects: payload.projects.map((data: any) => data.name).join(', ')
                        };
                    console.log('payload ',dataGroup);
                  setDataRead(dataGroup);
                  }
              } catch (error) {
                  console.log('error consultando grupo',error);
              }
        })();
      }, []);
      if (!isLoadingAll) { return (  <div className={`container-fluid d-flex w-100 p-5 justify-content-center align-items-center bg-light`}><div className={`d-grid gap-2 d-md-flex justify-content-md-center font-weight-bold w-50 rounded bg-white border px-5 mt-5 pb-5 h2`}>Cargando...</div></div> ) }
    return (
        <div className={`container-fluid d-flex w-100 p-5 mt-5 justify-content-center align-items-center bg-light`}>
  <Card style={{ width: '30rem' }}>
    <Card.Header className={`text-center`}>Detalle de Grupo</Card.Header>
    <ListGroup className={`list-group-flush`}>
          <ListGroup.Item>
            <span style={{ fontWeight: 'bold', padding: '05px'}}>Grupo: </span> {dataRead?.name}
          </ListGroup.Item>
    </ListGroup>
    <ListGroup className={`list-group-flush flus`}>
                <ListGroup.Item>
                    <span style={{ fontWeight: 'bold', padding: '05px'}}>Projectos</span> { dataRead?.projects}
                </ListGroup.Item>
        <ListGroup.Item>
                <span style={{ fontWeight: 'bold', padding: '05px'}}>Status </span> <FontAwesomeIcon style={{ paddingLeft: '08px' }}  icon={dataRead?.activeGroup ? faCheck: faClose} size="lg"/>
        </ListGroup.Item>
    </ListGroup>
    <ListGroup.Item style={{ paddingTop: '20px', textAlign:'center', padding:'10px'}}>
      <Link to="/group-list" className={`btn btn-primary ms-2`}>Volver</Link>
      </ListGroup.Item>
  </Card>
</div>
    )
}
export default GroupRead;