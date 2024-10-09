import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function ModalCustom({ dataModalAlert, onCloseAlert, onSaveAlert }: {dataModalAlert: any, onCloseAlert: () => void, onSaveAlert: () => void }): any {
  return (
    <Modal
      show={dataModalAlert?.showParam}
      onHide={() => onCloseAlert}
      backdrop="static"
      keyboard={false}
      animation={true}
      style={{overflowY:'hidden', marginTop:'200px'}}
      >
      <Modal.Header>
        <Modal.Title>{dataModalAlert?.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
       {dataModalAlert?.description}
      </Modal.Body>
      <Modal.Footer>
        {dataModalAlert && dataModalAlert?.titleButton[0] != undefined  && (
      <Button variant={dataModalAlert?.titleButton[0]?.variant} onClick={onCloseAlert}>
            {dataModalAlert?.titleButton[0]?.name}
          </Button>
          )}
        {dataModalAlert && dataModalAlert?.titleButton[1] != undefined && (
          <Button variant={dataModalAlert?.titleButton[1]?.variant} onClick={onSaveAlert}>
          {dataModalAlert?.titleButton[1]?.name}
          </Button>
              )}
      </Modal.Footer>
    </Modal>
  );
}

export default ModalCustom;