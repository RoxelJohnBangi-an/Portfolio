import { createBrowserRouter } from 'react-router';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Skills } from './pages/Skills';
import { Projects } from './pages/Projects';
import { Certificates } from './pages/Certificates';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { ProfileManagement } from './pages/admin/ProfileManagement';
import { ProjectsManagement } from './pages/admin/ProjectsManagement';
import { SkillsManagement } from './pages/admin/SkillsManagement';
import { CertificatesManagement } from './pages/admin/CertificatesManagement';
import { MessagesManagement } from './pages/admin/MessagesManagement';
import { RootLayout } from './components/RootLayout';
import { NotFound } from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { path: 'about', Component: About },
      { path: 'skills', Component: Skills },
      { path: 'projects', Component: Projects },
      { path: 'certificates', Component: Certificates },
      { path: 'contact', Component: Contact },
      { path: 'login', Component: Login },
      { path: 'admin', Component: Dashboard },
      { path: 'admin/profile', Component: ProfileManagement },
      { path: 'admin/projects', Component: ProjectsManagement },
      { path: 'admin/skills', Component: SkillsManagement },
      { path: 'admin/certificates', Component: CertificatesManagement },
      { path: 'admin/messages', Component: MessagesManagement },
      { path: '*', Component: NotFound },
    ],
  },
]);