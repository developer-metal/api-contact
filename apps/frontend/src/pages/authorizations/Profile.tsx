import { Card, ListGroup } from "react-bootstrap";
import { decryptData } from "../../services/localStorage/storageEncryptService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faClose } from "@fortawesome/free-solid-svg-icons";

function Profile() {
    console.log('decryptData ',decryptData('data-user'));
    const {name_person, email_verified, username}: any = decryptData('data-user');
    return (
        <div className={`container-fluid d-flex w-100 p-5 mt-5 justify-content-center align-items-center bg-light`}>
            <Card style={{ width: '30rem' }}>
            <Card.Header className={`text-center`}>Perfil</Card.Header>
            <ListGroup className="list-group-flush">
                <ListGroup.Item>
                <span style={{ fontWeight: 'bold', padding: '05px'}}>Usuario: </span> {username}
                </ListGroup.Item>
                <ListGroup.Item>
                <span style={{ fontWeight: 'bold', padding: '05px'}}>Nombre: </span> {name_person}
                </ListGroup.Item>
                <ListGroup.Item>
                <span style={{ fontWeight: 'bold', padding: '05px'}}>Activacion: </span> <FontAwesomeIcon style={{paddingLeft:'08px'}} icon={email_verified ? faCheck: faClose} size="lg"/>
                </ListGroup.Item>
            </ListGroup>
            </Card>
            </div>
    )
}
export default Profile;