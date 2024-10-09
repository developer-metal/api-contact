import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ListProject, Create, Update, Read } from "./pages/projects";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { ListForms, ReadForms } from "./pages/forms";
import { useEffect, useState } from "react";
import { signOut } from './services/bff/backendService';
import Login from "./pages/login/login";
import NavbarCont from "./pages/menu/navbar";
import { decryptData, encryptData, removetData } from "./services/localStorage/storageEncryptService";
import Profile from "./pages/authorizations/Profile";
import GroupCreate from "./pages/authorizations/groupProjects/GroupCreate";
import GroupList from "./pages/authorizations/groupProjects/GroupList";
import GroupEdit from "./pages/authorizations/groupProjects/EditGroup";
import GroupRead from "./pages/authorizations/groupProjects/GroupRead";
//import UsersCreate from "./pages/authorizations/users/CreateUsers";

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  const handleLogin = () => {
    setAuthenticated(true);
    const data = { status: true };
    encryptData('authenticatedLocal', data);
  };
  const handleLogout = async () => {
    try {
      const dataUser: any = decryptData('data-user');
      const response: any = await signOut(dataUser);
      console.log("cerrar sesión --- handleLogout ", response);
      if (response === "SUCCESS_SIGN_OUT" || response === "ERROR_SIGN_OUT") {
        setAuthenticated(false);
        removetData('authenticatedLocal');
        removetData('data-user');
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };
  useEffect(() => {
    const checkAuthentication = () => {
      try {
      const authenticatedStorag2e: any = decryptData('authenticatedLocal') ? decryptData('authenticatedLocal') :{ status: false };
      setAuthenticated(authenticatedStorag2e.status);
      } catch (error) {
        console.log('error',error);
      }
    };
    checkAuthentication();
  }, []);
  return (
    <BrowserRouter basename="/backOffice">
      <Routes>
        {authenticated ? (
          <>
            <Route path="project" element={<ListProject />} />
            <Route path="project-create" element={<Create />} />
            <Route path="project-update/:id" element={<Update />} />
            <Route path="project-read/:id" element={<Read />} />
            <Route path="forms" element={<ListForms />} />
            <Route path="forms-read/:id" element={<ReadForms />} />
            <Route path="group-projects" element={<GroupCreate />} />
            <Route path="group-edit/:id" element={<GroupEdit />} />
            <Route path="group-read/:id" element={<GroupRead />} />
            <Route path="group-list" element={<GroupList />} />
            <Route path="users-profile" element={<Profile />} />
          </>
        ) : (
          <Route path="/" element={<Login onLogin={handleLogin} />} />
        )}
      </Routes>
      {authenticated && <NavbarCont onLogout={() => handleLogout()}  />}
    </BrowserRouter>
  );
}

export default App;