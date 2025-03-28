import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import RegisterInfoPage from './pages/RegisterInfo';
import PrincipalPage from './pages/Principal';
import ProfilePage from './pages/Profile';
import EditProfilePage from './pages/EditProfile';
import BlockedUSers from './pages/BlockedUsers';

function IndexRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />
      <Route path="/registro-info" element={<RegisterInfoPage />} />
      <Route path="/principal" element={<PrincipalPage />} />
      <Route path="/perfil" element={<ProfilePage />} />
      <Route path="/editar-perfil" element={<EditProfilePage />} />
      <Route path="/usuarios-bloqueados" element={<BlockedUSers />} />
    </Routes>
  );
}

export default IndexRoutes;