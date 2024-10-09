import { useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './index.css';
function ModalTemplate({ dataModal, templateClient, templateExecute,flagTemplate, onClose }: {dataModal: any,templateClient: any, templateExecute: any,flagTemplate: any, onClose: () => void}): any {
  const htmlContentRef = useRef(null);
  return (
    <Modal
      show={dataModal?.showParam}
      onHide={() => onClose()}
      backdrop="static"
      keyboard={false}
      animation={true}
      size='lg'
      style={{overflowY:'hidden', marginTop:'30px',display:'flex', maxWidth: '650px', margin: '0px' ,marginLeft:'400px',width:'100%'}}
      >
      <Modal.Header closeButton>
        <Modal.Title style={{fontSize: '18px'}}>{flagTemplate == 1 ? templateClient?.title: templateExecute?.title}</Modal.Title>
      </Modal.Header>
      <div ref={htmlContentRef}>
        <div  style={{overflowY:'scroll', maxWidth: '750px', maxHeight:'500px', display:'flex', paddingLeft:'10px',  marginTop:'10px', marginBottom:'10px'}} dangerouslySetInnerHTML={{ __html: flagTemplate == 1 ? templateClient?.template: templateExecute.template}}/>
        </div>
      <Modal.Footer>
        {dataModal && dataModal?.titleButton[0] != undefined  && (
      <Button variant={dataModal?.titleButton[0]?.variant} onClick={() => onClose()}>
            {dataModal?.titleButton[0]?.name}
          </Button>
          )}
      </Modal.Footer>
    </Modal>
  );
}

export default ModalTemplate;