import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { deleteForm } from '../services/formsService';

function ModalFormConfirt({ dataModal, id, onClose, onSave }: {dataModal: any,id: any, onClose: () => void, onSave: () => void}): any {
  const [isButtonActive, setisButtonActive] = useState(false);  
  const handleDelete = async () => {
    try {
      setisButtonActive(true);
      const response: any = await deleteForm(id);
 
      if (String(response.message).toUpperCase() === "FORMULARIO HA SIDO ELIMINADO.") {
        console.log('error',response);
        setisButtonActive(false);
        onClose();
        onSave();
      }
    } catch (error) {
        console.error("Error al eliminar proyecto:", error);
        onClose();
    }
  }
  return (
    <Modal
      show={dataModal?.showParam}
      onHide={() => onClose}
      backdrop="static"
      keyboard={false}
      animation={true}
      style={{overflowY:'hidden', marginTop:'200px'}}
      >
      <Modal.Header hidden>
      </Modal.Header>
      <Modal.Body>
       {dataModal?.description}
      </Modal.Body>
      <Modal.Footer>
        {dataModal?.titleButton[0] != undefined && (
      <Button variant={dataModal?.titleButton[0]?.variant} onClick={onClose}>
            {dataModal?.titleButton[0]?.name}
          </Button>
          )}
        {dataModal?.titleButton[1] != undefined && (
          <Button variant={dataModal?.titleButton[1]?.variant} onClick={handleDelete} disabled={isButtonActive}>
          {dataModal?.titleButton[1]?.name}
          </Button>
              )}
      </Modal.Footer>
    </Modal>
  );
}

export default ModalFormConfirt;