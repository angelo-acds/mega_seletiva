import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import { loadData, defaultProjetos, defaultMembros } from '../services/localData'
import './Dashboard.css'

function StatCard({ label, valor, cor }) {
  return (
    <div className="stat-card">
      <div className="stat-card__numero" style={{ color: cor || '#111' }}>
        {valor ?? '—'}
      </div>
      <div className="stat-card__label">{label}</div>
    </div>
  )
}

function Dashboard() {
  const navigate = useNavigate()
  const [dados, setDados] = useState(null)
  const [projetos, setProjetos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    carregar()
    const handleFocus = () => carregar()
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  function carregar() {
    setLoading(true)
    const projetosAtuais = loadData('projetos', defaultProjetos)
    const membrosAtuais = loadData('membros', defaultMembros)

    const alocacoes = projetosAtuais.flatMap((projeto) => Object.values(projeto.alocacao || []).filter(Boolean))
    const membrosTrabalhando = new Set(alocacoes).size

    setDados({
      membros: {
        cadastrados: membrosAtuais.length,
        trabalhando: membrosTrabalhando,
        esperando: Math.max(0, membrosAtuais.length - membrosTrabalhando),
      },
      projetos: {
        criados: projetosAtuais.length,
        emProgresso: projetosAtuais.filter((p) => p.status === 'Em progresso').length,
        concluidos: projetosAtuais.filter((p) => p.status === 'Concluído').length,
      },
    })
    setProjetos(projetosAtuais)
    setLoading(false)
  }

  return (
    <PageLayout>
      <div className="dashboard">
        <h1 className="dashboard__titulo">Dashboard</h1>

        {loading ? (
          <p className="dashboard__loading">Carregando...</p>
        ) : (
          <div className="dashboard__grid">

            {/* Lista de projetos */}
            <div className="dashboard__card dashboard__card--lista">
              <h2 className="dashboard__card-titulo">Lista de Projetos</h2>
              <ul className="lista-projetos">
                {projetos.map((p) => (
                  <li
                    key={p.id}
                    className="lista-projetos__item"
                    onClick={() => navigate(`/projetos/${p.id}`)}
                  >
                    {p.nome}
                  </li>
                ))}
              </ul>
            </div>

            <div className="dashboard__coluna-direita">
              {/* Card projetos */}
              <div className="dashboard__card">
                <div className="dashboard__card-header">
                  <span className="dashboard__card-icone">🗂️</span>
                  <h2 className="dashboard__card-titulo">Projetos</h2>
                </div>
                <div className="dashboard__stats">
                  <StatCard label="Criados"     valor={dados.projetos.criados} />
                  <StatCard label="Progresso"   valor={dados.projetos.emProgresso} />
                  <StatCard label="Concluídos"  valor={dados.projetos.concluidos} />
                </div>
              </div>

              {/* Card membros */}
              <div className="dashboard__card">
                <div className="dashboard__card-header">
                  <span className="dashboard__card-icone">👤</span>
                  <h2 className="dashboard__card-titulo">Desenvolvedores</h2>
                </div>
                <div className="dashboard__stats">
                  <StatCard label="Cadastrados" valor={dados.membros.cadastrados} />
                  <StatCard label="Trabalhando" valor={dados.membros.trabalhando} />
                  <StatCard label="Esperando"   valor={dados.membros.esperando} />
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </PageLayout>
  )
}

export default Dashboard
