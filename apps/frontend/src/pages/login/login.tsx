import React, { useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import "./login.css";
import { login } from '../../services/bff/backendService';
import { useNavigate } from 'react-router-dom';
import type { Login } from '../../utils/type/typeLogin';
import { encryptData } from '../../services/localStorage/storageEncryptService';
const Login = ({ onLogin }: any) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [validated, setValidated] = useState(false);
    const [isProced, setProcess] = useState(false);
    const [isError, setError] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setValidated(true);
        if (event.currentTarget.checkValidity()) {
            setError(false);
            setProcess(true);
            try { //Login
                const dataLogin: Login = { email, password};
                const response: any = await login(dataLogin);
                if (response?.hasOwnProperty('accessToken') && response?.accessToken !== '') {
                    setProcess(false);
                    onLogin();
                    encryptData('data-user',response.dataUser); //storage data user
                    navigate('/forms');
                }
            } catch (error: any) {
                console.log('error login');
                if (error.code === 'USER_NOT_AUTHORIZE') {
                    setError(true);
                    setProcess(false);
                }
                setError(true);
                setProcess(false);
            }
        }
    };
    return (
        <Container>
        <Row className="vh-100 d-flex justify-content-center align-items-center">
          <Col md={8} lg={4} xs={12}>
            <Card className="shadow">
              <Card.Body>
                <div className="mb-3 mt-4">
                  <h2 className="fw-bold mb-2 text-center">Login</h2>
                  <Form className="mb-3" noValidate validated={validated} onSubmit={handleSubmit} >
                    <Form.Group className="mb-3" controlId="email">
					     { isError && (
					  <div className={`alert alert-danger d-flex flex-column align-items-center`} role="alert">
						Error al iniciar sesión.
					  </div>
						)}
                      <Form.Label className="text-center">
                        Email
                      </Form.Label>
                      <Form.Control type="email" placeholder="Enter email"  required onChange={(e) => setEmail(e.target.value)}/>
					        <Form.Control.Feedback type="invalid">
						  formato Email incorrecto.
						</Form.Control.Feedback>
                    </Form.Group>
  
                    <Form.Group className="mb-3" controlId="password">
                      <Form.Label>Password</Form.Label>
                      <Form.Control type="password" placeholder="Password"  required onChange={(e) => setPassword(e.target.value)}/>
					    <Form.Control.Feedback type="invalid">
						password requerido.
					</Form.Control.Feedback>
                    </Form.Group>
                     {/*<div className="mb-3">
                      <p className="small">
                        <a className="text-primary" href="#">
                          Recuperar clave ?
                        </a>
                      </p>
               </div>*/}
                    <div className="d-grid">
                      <Button variant="primary" type="submit" disabled={isProced}>
                        Login
                      </Button>
                    </div>
                  </Form>
                  {/* <div className="mt-3">
                    <p className="mb-0  text-center">
                      Crear cuenta ?{" "}
                      <a href="#" className="text-primary fw-bold">
                        Sign In
                      </a>
                    </p>
               </div>*/}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
};
export default Login;