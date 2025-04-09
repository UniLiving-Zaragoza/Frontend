import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import RegisterInfoPage from './pages/RegisterInfo';
import PrincipalPage from './pages/Principal';
import ProfilePage from './pages/Profile';
import EditProfilePage from './pages/EditProfile';
import BlockedUsers from './pages/BlockedUsers';
import HouseInformation from './pages/HouseInformation';
import ChatList from './pages/ChatList';
import AdminPrincipalPage from './pages/AdminPrincipal';
import AdminSearchUserPage from './pages/AdminSearchUser';
import AdminBannedUserPage from './pages/AdminBannedUsers';
import AnalyticsPage from './pages/Analytics'
import AnalyticsGraphicsPage from './pages/AnalyticsGraphics'
import AnalyticsCommetsPage from './pages/AnalyticsComments'
import SearchPartnerPage from './pages/SearchPartner'
import ChatGlobal from './pages/ChatGlobal';
import ChatIndividual from './pages/ChatIndividual';
// import ProtectedRoute from './protectedRoutes';

function IndexRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />
      <Route path="/registro-info" element={<RegisterInfoPage />} />
      <Route path="/principal" element={<PrincipalPage />} />
      <Route path="/perfil/:id" element={<ProfilePage />} />
      <Route path="/editar-perfil" element={<EditProfilePage />} />
      <Route path="/usuarios-bloqueados" element={<BlockedUsers />} />
      <Route path="/detalles-piso" element={<HouseInformation />} />
      <Route path="/lista-chats" element={<ChatList />} />
      <Route path="/analiticas" element={<AnalyticsPage />} />
      <Route path="/analiticas-graficos" element={<AnalyticsGraphicsPage />} />
      <Route path="/analiticas-comentarios" element={<AnalyticsCommetsPage />} />
      <Route path="/buscar-compañero" element={<SearchPartnerPage />} />
      <Route path="/chat-global/" element={<ChatGlobal />} />
      <Route path="/chat-individual/:id" element={<ChatIndividual />} />

      {/* Páginas admin */}
      {/*<Route element={<ProtectedRoute />}>*/}
      <Route path="/principal-admin" element={<AdminPrincipalPage />} />
      <Route path="/deshabilitados-admin" element={<AdminBannedUserPage />} />
      <Route path="/buscar-usuario-admin" element={<AdminSearchUserPage />} />
      {/*</Route>*/}
    </Routes>
  );
}

export default IndexRoutes;