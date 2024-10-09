import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ModalCustom from './ModalsAlert';

function ModalConfirmGeneral({ dataModal, buttonValid, isModal, onClose, onSave }: {dataModal: any,buttonValid: boolean,isModal: boolean, onClose: () => void, onSave: () => void}): any {
    const [isContentAlert, setContetAlert] = useState({});
    const onCloseCustom = () => {
        onClose();
    }
    useEffect(() => {
        (async () => {
      setContetAlert({
        title: "Aviso!",
        description: 'El grupo esta activo, no se puede eliminar.',
        titleButton: [{variant: 'secondary', name: 'Cerrar' }],
        showParam: isModal
      });
    })();
}, [isModal]);
  return (
    <>
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
          <Button variant={dataModal?.titleButton[1]?.variant} onClick={onSave} disabled={buttonValid}>
          {dataModal?.titleButton[1]?.name}
          </Button>
              )}
      </Modal.Footer>
    </Modal>
        { isModal && (
            <ModalCustom dataModalAlert={isContentAlert} onCloseAlert={() => onCloseCustom()} onSaveAlert={() => onCloseCustom()} />
    )}
    </>
  );
}
export default ModalConfirmGeneral;