import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/Login';
import RegisterFlow from './pages/RegisterFlow';
import GoogleCallbackHandler from './pages/GoogleCallbackHandler';
import RegisterGoogle from './pages/RegisterGoogle';
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
import ChatReports from './pages/AdminReports';
import NotFound from './pages/NotFound';
import { PrivateRoute, AdminRoute } from './protectedRoutes';

function IndexRoutes() {
  return (
    <Routes>

      {/* Páginas sin login necesario */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterFlow />} />
      <Route path="/auth/google/callback" element={<GoogleCallbackHandler />} />
      <Route path="/registro-google" element={<RegisterGoogle />} />
      <Route path="/principal" element={<PrincipalPage />} />
      <Route path="/detalles-piso" element={<HouseInformation />} />
      <Route path="/analiticas" element={<AnalyticsPage />} />
      <Route path="/analiticas-graficos" element={<AnalyticsGraphicsPage />} />
      <Route path="/analiticas-comentarios" element={<AnalyticsCommetsPage />} /> {/* Igual no hay que protegerla para admin ya que cambia en función del rol guardado */}

      {/* Páginas con login necesario */}
      <Route path="/perfil" element={
        <PrivateRoute>
          <ProfilePage />
        </PrivateRoute>
      } />
      <Route path="/perfil/:id" element={
        <PrivateRoute>
          <ProfilePage />
        </PrivateRoute>
      } />
      <Route path="/editar-perfil" element={ 
        <PrivateRoute>
          <EditProfilePage />
        </PrivateRoute>
      } />
      <Route path="/usuarios-bloqueados" element={ 
        <PrivateRoute>
          <BlockedUsers />
        </PrivateRoute>
      } />
      <Route path="/lista-chats" element={ 
        <PrivateRoute>
          <ChatList />
        </PrivateRoute>
      } />
      <Route path="/chat-global/" element={ //***************
        <PrivateRoute>
          <ChatGlobal />  {/* Igual no hay que protegerla para admin ya que cambia en función del rol guardado */}
        </PrivateRoute>
      } />
      <Route path="/chat-individual/:id" element={ 
        <PrivateRoute>
          <ChatIndividual />
        </PrivateRoute>
      } />
      <Route path="/buscar-compañero" element={ 
        <PrivateRoute>
          <SearchPartnerPage />
        </PrivateRoute>
      } />

      {/* Páginas admin */}
      <Route path="/principal-admin" element={
        <AdminRoute>
          <AdminPrincipalPage />
        </AdminRoute>
      } />
      <Route path="/deshabilitados-admin" element={
        <AdminRoute>
          <AdminBannedUserPage />
        </AdminRoute>
      } />
      <Route path="/buscar-usuario-admin" element={
        <AdminRoute>
          <AdminSearchUserPage />
        </AdminRoute>
      } />
      <Route path="/reportes-admin" element={
        <AdminRoute>
          <ChatReports />
        </AdminRoute>
      } />

      {/* Página no encontrada (404) */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}

export default IndexRoutes;