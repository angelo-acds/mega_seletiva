import Sidebar from './Sidebar'
import './PageLayout.css'

function PageLayout({ children }) {
  return (
    <div className="page-layout">
      <Sidebar />
      <main className="page-layout__main">
        {children}
      </main>
    </div>
  )
}

export default PageLayout
