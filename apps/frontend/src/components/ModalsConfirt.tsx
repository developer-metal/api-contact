import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { deleteProject } from '../services/projectService';
import ModalCustom from './ModalsAlert';

function ModalConfirt({ dataModal,id, onClose, onSave }: {dataModal: any,id: any, onClose: () => void, onSave: () => void}): any {
  const [isButtonActive, setisButtonActive] = useState(false);
  const [isModalAlert, setisModalAlert] = useState(false);
  const contentAlert: any = {
    title: "Aviso!",
    description: 'Proyecto posee formularios asociados.',
    titleButton: [{variant: 'secondary', name: 'Cerrar' }],
    showParam: isModalAlert
  };
  const onCloseCustom = () => {
      setisModalAlert(false)
      onClose();
  }
  
  const handleDelete = async () => {
    try {
      setisButtonActive(true);
      const {payload}: any = await deleteProject(id);
      console.log('error',payload);
      if (String(payload.message).toUpperCase() === "PROJECTO HA SIDO ELIMINADO.") {
        setisButtonActive(false);
        onClose();
        onSave();
      } else if (String(payload).toUpperCase() === "PROYECTO POSEE FORMULARIOS ASOCIADOS.") {
        setisButtonActive(false);
        setisModalAlert(true);
      }
    } catch (error) {
        console.error("Error al eliminar proyecto:", error);
        onClose();
    }
  }
  return (
    <>
    <Modal
      show={dataModal?.showParam}
      onHide={() => onCloseCustom}
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
    { isModalAlert && (
    <ModalCustom dataModalAlert={contentAlert} onCloseAlert={() => onCloseCustom()} onSaveAlert={() => onCloseCustom()} />
    )}
   </>
  );
}

export default ModalConfirt;