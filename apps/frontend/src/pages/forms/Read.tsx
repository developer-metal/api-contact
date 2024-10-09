import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { allForms } from "../../services/formsService";
import { Card, ListGroup } from "react-bootstrap";
import { Forms } from "../../utils/type/typeForms";
import DownloadFile from "../../components/DowloanFile";

function ReadForms() {
  const [dataRead, setDataRead] = useState<any>([]);
  const [isLoadingAll, seLoadingAll] = useState<any>(false);
  const { id } = useParams();  
  useEffect(() => {
    (async () => {
          try {
              const params = `_id=${id}`;
              const payload = await allForms(params); 
              if (payload) {
                seLoadingAll(true);
                console.log('payload ',payload);
                const dataForms = payload.map((val: any) => ({...val,
                  nameProject: val.project.name,
                  contactEmail: val.contactEmail,
                  contactName: val.contactName,
                  fieldsContainer: val.fields.fieldsContainer
                }) as Forms);
            setDataRead(dataForms[0]);
            console.log('error consultando project',dataForms);
              }
    
          } catch (error) {
              console.log('error consultando project',error);
          }
    })();
  }, []);
  if (!isLoadingAll) { return (  <div className={`container-fluid d-flex w-100 p-5 justify-content-center align-items-center bg-light`}><div className={`d-grid gap-2 d-md-flex justify-content-md-center font-weight-bold w-50 rounded bg-white border px-5 mt-5 pb-5 h2`}>Loading...</div></div> ) }
 return (
    <div className={`container-fluid d-flex w-100 p-5 mt-5 justify-content-center align-items-center bg-light`}>
  <Card style={{ width: '30rem' }}>
    <Card.Header className={`text-center`}>Detalle de Formulario</Card.Header>
    <ListGroup className="list-group-flush">
          <ListGroup.Item>
            <span style={{ fontWeight: 'bold', padding: '05px'}}>Proyecto:</span> {dataRead?.nameProject}
          </ListGroup.Item>
    </ListGroup>
    <Card.Header className={`text-center`}>Contacto</Card.Header>
    <ListGroup className="list-group-flush">
  {dataRead?.fieldsContainer?.map((data: any, index: number) => { 
    return (
      <ListGroup.Item key={index}>
        {data?.statement && String(data?.statement).toUpperCase().includes('ADJUNTA') ? (
          <>
            <span style={{ fontWeight: 'bold', padding: '05px' }}>
              {data?.statement} :
            </span>
            <DownloadFile base64={data?.response} />
          </>
        ) : (
          <>
            <span style={{ fontWeight: 'bold', padding: '05px' }}>
              {data?.statement} :
            </span>
            {data?.response}
          </>
        )}
      </ListGroup.Item>
    );
  })}
  <ListGroup.Item>
    <span style={{ fontWeight: 'bold', padding: '05px' }}>
      Dispositivo : 
    </span>
    {dataRead?.user_agent}
  </ListGroup.Item>
</ListGroup>
    <ListGroup.Item style={{ paddingTop: '20px', textAlign:'center', padding:'10px'}}>
      <Link to="/forms" className={`btn btn-primary ms-2`}>Volver</Link>
      </ListGroup.Item>

  </Card>
</div>
)
}
export default ReadForms;