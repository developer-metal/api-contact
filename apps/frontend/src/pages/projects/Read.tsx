
import { Link, useParams } from "react-router-dom";
import { allProject } from "../../services/projectService";
import { useEffect, useState } from "react";
import { Card, ListGroup } from "react-bootstrap";
import { templateEmails } from "../../utils/type/typeProject";
import { decodeBase64 } from "../../utils/helpers/formatHtml";
import ModalTemplate from "../../components/ModalsTemplate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope} from "@fortawesome/free-solid-svg-icons";
import './index.css';
function Read() {
  const [dataRead, setDataRead] = useState<any>([]);
  const [isLoadingAll, seLoadingAll] = useState<any>(false);
  const [imageData, setImageClient] = useState<any>();
  const [imageDataExecute, setImageExecute] = useState<any>({});
  const [isFlagTemplate, setFlagTemplate] = useState<any>(0);
  const [showModal, setShowModal] = useState(false);
  const { id } = useParams();  
  let contentModal: any = {
    titleButton: [{variant: 'secondary', name: 'Cerrar'}, { variant: 'primary', name: 'Descargar' }],
    showParam: showModal
  };
  const hadlenModal = (data: any) => {
    setFlagTemplate(data);
    setShowModal(true);
  };
  useEffect(() => {
    (async () => {
          try {
              const params = `_id=${id}`;
              const payload = await allProject(params); 
              if (payload) {
                seLoadingAll(true);
                const dataProject = payload.map((val: any) => ({...val,
                nameProject: val.name,
                senderEmail: val.sender,
                cant_forms: val.formulario_count,
                  templateEmails: {
                    titleClient: val.templateEmails.titleClient,
                    messageTemplate: decodeBase64(val.templateEmails.messageTemplate),
                    titleExecutive: val.templateEmails.titleExecutive,
                    documentTemplate: decodeBase64(val.templateEmails.documentTemplate),
                    mailsTo: val.templateEmails.mailsTo.map((val: any) => val.name).join(', ')
                  } as templateEmails
            }));
            setImageClient({template: dataProject[0]?.templateEmails?.messageTemplate, title: dataProject[0]?.templateEmails?.titleClient});
            setImageExecute({template: dataProject[0]?.templateEmails?.documentTemplate, title: dataProject[0]?.templateEmails?.titleExecutive});
            setDataRead(dataProject[0]);
            
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
    <Card.Header className={`text-center`}>Detalle de Proyecto</Card.Header>
    <ListGroup className="list-group-flush">
      <ListGroup.Item>
        <span style={{ fontWeight: 'bold', padding: '05px'}}>Proyecto:</span> {dataRead?.nameProject}
      </ListGroup.Item>
      { (dataRead?.templateEmails?.messageTemplate != '' || dataRead?.templateEmails?.documentTemplate != '') && (
      <ListGroup.Item>
        <span style={{ fontWeight: 'bold', padding: '05px'}}>Destinatario:</span> {dataRead?.senderEmail}
      </ListGroup.Item>
      )}
      <ListGroup.Item>
        <span style={{ fontWeight: 'bold', padding: '05px'}}>Cant.Form:</span> {dataRead?.cant_forms} 
      </ListGroup.Item>
    </ListGroup>
    
    { dataRead?.templateEmails?.messageTemplate && (
    <ListGroup className="list-group-flush">
    <Card.Header className={`text-center`}>Email Cliente</Card.Header>
      <ListGroup.Item style={{ paddingTop: '20px'}}>
        <span style={{ fontWeight: 'bold', padding: '05px'}}>Titulo:</span> {dataRead?.templateEmails?.titleClient}
      </ListGroup.Item>
      <ListGroup.Item style={{ paddingTop: '20px'}}>
        <span style={{ fontWeight: 'bold', padding: '05px'}}>Template#1:</span>   <FontAwesomeIcon icon={faEnvelope} onClick={() =>  hadlenModal(1)}/>
      </ListGroup.Item>
    </ListGroup>
  )}
    { dataRead?.templateEmails?.documentTemplate && (
    <ListGroup className="list-group-flush">
      <Card.Header className={`text-center`}>Email Ejecutivo</Card.Header>
      <ListGroup.Item style={{ paddingTop: '20px'}}>
        <span style={{ fontWeight: 'bold', padding: '05px'}}>Titulo:</span> {dataRead?.templateEmails?.titleExecutive}
      </ListGroup.Item>
      <ListGroup.Item style={{ paddingTop: '20px'}}>
        <span style={{ fontWeight: 'bold', padding: '05px'}}>Emails Ejecutivos:</span> {dataRead?.templateEmails?.mailsTo}
      </ListGroup.Item>
      <ListGroup.Item style={{ paddingTop: '20px'}}>
      <span style={{ fontWeight: 'bold', padding: '05px'}}>Template#2:</span>
      <FontAwesomeIcon style={{ paddingLeft:'10px', cursor: 'pointer'}} icon={faEnvelope} onClick={() =>  hadlenModal(2)} size="lg" />
      </ListGroup.Item>
    </ListGroup>
    )}
     <ListGroup className="list-group-flush">
        <ListGroup.Item style={{ paddingTop: '30px', textAlign:'center'}}>
              <Link to="/project" className={`btn btn-primary ms-2`}>Volver</Link>
          </ListGroup.Item>
      </ListGroup>
  </Card>
  {showModal && (
<ModalTemplate dataModal={contentModal} flagTemplate={isFlagTemplate} templateExecute={imageDataExecute} templateClient={imageData} onClose={() => setShowModal(false)} />
)}
  </div>
);
}
export default Read;