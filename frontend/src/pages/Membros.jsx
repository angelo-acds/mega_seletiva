import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TbPlus, TbPencil, TbTrash, TbSearch, TbCheck, TbAlertTriangle, TbX } from 'react-icons/tb'
import PageLayout from '../components/PageLayout'
import { loadData, saveData, defaultMembros, defaultProjetos } from '../services/localData'
import './ListPage.css'

const FUNCAO_COR = {
  'Back-end':   '#6366F1',
  'Front-end':  '#F59E0B',
  'Designer':   '#EC4899',
  'DataBase':   '#10B981',
  'Mobile':     '#3B82F6',
  'Gerente de Projeto': '#A78BFA',
}

function Membros() {
  const navigate = useNavigate()
  const [membros, setMembros] = useState([])
  const [totalProjetos, setTotalProjetos] = useState(0)
  const [busca, setBusca] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { carregar() }, [])

  async function carregar() {
    setLoading(true)
    try {
      const membrosData = loadData('membros', defaultMembros)
      const projetosData = loadData('projetos', defaultProjetos)
      setTotalProjetos(projetosData.length || 0)

      const counts = {}
      projetosData.forEach((p) => {
        const seen = new Set()
        const aloc = p.alocacao || {}
        Object.values(aloc).forEach((v) => {
          if (Array.isArray(v)) {
            v.forEach((mid) => {
              if (mid) seen.add(Number(mid))
            })
          } else if (v) {
            seen.add(Number(v))
          }
        })
        seen.forEach((mid) => {
          counts[mid] = (counts[mid] || 0) + 1
        })
      })

      const updated = membrosData.map((m) => ({ ...m, projetos: counts[m.id] || 0 }))
      saveData('membros', updated)
      setMembros(updated)
    } finally {
      setLoading(false)
    }
  }

  const renderCargaBadge = (count) => {
    const total = totalProjetos || 0
    const percent = total === 0 ? 0 : (count / total) * 100
    let color = '#10B981'
    let Icon = TbCheck
    if (percent <= 33) {
      color = '#10B981'
      Icon = TbCheck
    } else if (percent < 66) {
      color = '#F59E0B'
      Icon = TbAlertTriangle
    } else {
      color = '#EF4444'
      Icon = TbX
    }

    const label = String(count).padStart(2, '0')
    return (
      <span
        className="badge"
        style={{ background: color + '22', color, display: 'inline-flex', alignItems: 'center', gap: 8 }}
      >
        <Icon size={14} />
        {label}
      </span>
    )
  }

  async function deletar(id) {
    if (!confirm('Deseja remover este membro?')) return
    try {
      const next = membros.filter((m) => m.id !== id)
      saveData('membros', next)
      setMembros(next)
    } catch {
      alert('Erro ao remover membro.')
    }
  }

  const filtrados = membros.filter((m) =>
    m.nome.toLowerCase().includes(busca.toLowerCase()) ||
    m.funcao.toLowerCase().includes(busca.toLowerCase()) ||
    (m.stacks || []).join(' ').toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <PageLayout>
      <div className="list-page">
        <div className="list-page__header">
          <h1 className="list-page__titulo">Membros</h1>
          <button className="btn-primario" onClick={() => navigate('/membros/novo')}>
            <TbPlus size={20} /> Novo Membro
          </button>
        </div>

        <div className="list-page__busca">
          <TbSearch size={18} className="busca__icone" />
          <input
            type="text"
            placeholder="Buscar membro ou função..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="busca__input"
          />
        </div>

        {loading ? (
          <p className="list-page__loading">Carregando...</p>
        ) : (
          <div className="tabela-wrapper">
            <table className="tabela">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>RGA</th>
                  <th>Função</th>
                  <th>Projetos</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="tabela__vazio">Nenhum membro encontrado.</td>
                  </tr>
                ) : (
                  filtrados.map((m) => (
                    <tr key={m.id} className="tabela__row" onClick={() => navigate(`/membros/${m.id}`)}>
                      <td className="tabela__nome">{m.nome}</td>
                      <td>{m.rga}</td>
                      <td>
                        <div className="badge-group">
                          {(m.stacks && m.stacks.length > 0 ? m.stacks : [m.funcao]).map((stack) => (
                            <span
                              key={stack}
                              className="badge"
                              style={{ background: (FUNCAO_COR[stack] || '#888') + '22', color: FUNCAO_COR[stack] || '#888' }}
                            >
                              {stack}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>{renderCargaBadge(m.projetos)}</td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div className="tabela__acoes">
                          <button className="btn-icone btn-icone--editar" onClick={() => navigate(`/membros/${m.id}/editar`)} title="Editar">
                            <TbPencil size={18} />
                          </button>
                          <button className="btn-icone btn-icone--deletar" onClick={() => deletar(m.id)} title="Remover">
                            <TbTrash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageLayout>
  )
}

export default Membros
