import { Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavDropdown } from 'react-bootstrap';
import { faUserLarge } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './navbar.css';
const NavbarCont = ({ onLogout }: any) => {
    const navigate = useNavigate()
    const handleLogout = () => {
      onLogout();
      navigate('/', { replace: true});
    };
  return (
    <>
   <Navbar expand="lg" className="bg-body-tertiary" fixed='top'  bg="primary" data-bs-theme="dark">
      <Container>
        <Navbar.Brand>BackOffice</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        

          <Nav className={`me-auto`}>
            <Nav.Link as={Link} to="/forms">Formulario</Nav.Link>
            <Nav.Link as={Link} to="/project">Proyecto</Nav.Link>
            { /*<Nav.Link as={Link} to="/users-create">Usuarios</Nav.Link>*/}
          </Nav>
          <Nav className={`d-md-flex justify-content-md-end`} >
          <NavDropdown
              id="nav-dropdown-light-users"
              title={<FontAwesomeIcon icon={faUserLarge} />}
              active={true}
              align={'end'}
              color='white'
            >
              <NavDropdown.Item as={Link} to="/users-profile">Perfil</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/group-list">Grupo Projectos</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#">
              <Nav.Link  as={Link} to="/" onClick={() => handleLogout()} style={{textAlign:'center'}}>Cerrar Sesión</Nav.Link>
              </NavDropdown.Item>
            </NavDropdown>
            </Nav>
      </Container>
    </Navbar>
    </>

  );
};

export default NavbarCont;