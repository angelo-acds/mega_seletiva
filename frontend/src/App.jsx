import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Projetos from './pages/Projetos'
import ProjetoDetalhes from './pages/ProjetoDetalhes'
import CadastroProjeto from './pages/CadastroProjeto'
import Membros from './pages/Membros'
import MembroDetalhes from './pages/MembroDetalhes'
import CadastroMembro from './pages/CadastroMembro'
import Admin from './pages/Admin'
import CadastroAdmin from './pages/CadastroAdmin'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Projetos */}
        <Route path="/projetos" element={<Projetos />} />
        <Route path="/projetos/novo" element={<CadastroProjeto />} />
        <Route path="/projetos/:id" element={<ProjetoDetalhes />} />
        <Route path="/projetos/:id/editar" element={<CadastroProjeto />} />

        {/* Membros */}
        <Route path="/membros" element={<Membros />} />
        <Route path="/membros/novo" element={<CadastroMembro />} />
        <Route path="/membros/:id" element={<MembroDetalhes />} />
        <Route path="/membros/:id/editar" element={<CadastroMembro />} />

        {/* Diretores */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/novo" element={<CadastroAdmin />} />
        <Route path="/admin/:id/editar" element={<CadastroAdmin />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
