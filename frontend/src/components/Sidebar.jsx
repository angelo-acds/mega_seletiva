import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  TbLayoutDashboard,
  TbBrandAsana,
  TbUsers,
  TbUserPlus,
  TbLogout2,
} from 'react-icons/tb'
import './Sidebar.css'
import LOGO_IMAGE from '../assets/logo.svg'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', Icon: TbLayoutDashboard },
  { to: '/projetos',  label: 'Projetos',  Icon: TbBrandAsana },
  { to: '/membros',   label: 'Membros',   Icon: TbUsers },
  { to: '/admin',     label: 'Diretor',   Icon: TbUserPlus },
]

function Sidebar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <img src={LOGO_IMAGE} alt="Mega Jr." />
      </div>

      <nav className="sidebar__nav">
        {NAV_ITEMS.map(({ to, label, Icon }) => {
          const ativo = pathname.startsWith(to)
          return (
            <Link
              key={to}
              to={to}
              className={`sidebar__link ${ativo ? 'sidebar__link--ativo' : ''}`}
            >
              <Icon size={26} />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      <button className="sidebar__logout" onClick={handleLogout}>
        <TbLogout2 size={26} />
        <span>Sair</span>
      </button>
    </aside>
  )
}

export default Sidebar
