import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import RegisterInfoPage from './pages/RegisterInfo';
import ProfilePage from './pages/Perfil';
import EditProfilePage from './pages/EditProfile';

function IndexRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />
      <Route path="/registro-info" element={<RegisterInfoPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/edit-profile" element={<EditProfilePage />} />
    </Routes>
  );
}

export default IndexRoutes;