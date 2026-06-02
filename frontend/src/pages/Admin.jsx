import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TbPlus, TbPencil, TbTrash, TbSearch } from 'react-icons/tb'
import PageLayout from '../components/PageLayout'
import { loadData, saveData, defaultDiretores } from '../services/localData'
import './ListPage.css'

const FUNCAO_COR = {
  'Back-end': '#6366F1',
  'Front-end': '#F59E0B',
  'Designer': '#EC4899',
  'DataBase': '#10B981',
  'Mobile': '#3B82F6',
  'Gerente de Projeto': '#A78BFA',
}

function Admin() {
  const navigate = useNavigate()
  const [diretores, setDiretores] = useState([])
  const [busca, setBusca] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { carregar() }, [])

  async function carregar() {
    setLoading(true)
    try {
      const data = loadData('diretores', defaultDiretores)
      setDiretores(data)
    } finally {
      setLoading(false)
    }
  }

  async function deletar(id) {
    if (!confirm('Deseja remover este diretor?')) return
    try {
      const next = diretores.filter((d) => d.id !== id)
      saveData('diretores', next)
      setDiretores(next)
    } catch {
      alert('Erro ao remover diretor.')
    }
  }

  const filtrados = diretores.filter((d) =>
    d.nome.toLowerCase().includes(busca.toLowerCase()) ||
    (d.stacks || []).join(' ').toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <PageLayout>
      <div className="list-page">
        <div className="list-page__header">
          <h1 className="list-page__titulo">Diretores</h1>
          <button className="btn-primario" onClick={() => navigate('/admin/novo')}>
            <TbPlus size={20} /> Novo Diretor
          </button>
        </div>

        <div className="list-page__busca">
          <TbSearch size={18} className="busca__icone" />
          <input
            type="text"
            placeholder="Buscar diretor..."
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
                  <th>Cargo</th>
                  <th>Função</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="tabela__vazio">Nenhum diretor encontrado.</td>
                  </tr>
                ) : (
                  filtrados.map((d) => (
                    <tr key={d.id} className="tabela__row">
                      <td className="tabela__nome">{d.nome}</td>
                      <td>{d.rga}</td>
                      <td>
                        <span className="badge" style={{ background: 'rgba(167,139,250,0.15)', color: 'var(--roxo-claro)' }}>
                          {d.funcao}
                        </span>
                      </td>
                      <td>
                        <div className="badge-group">
                          {(d.stacks && d.stacks.length > 0 ? d.stacks : ['Nenhuma']).map((stack) => (
                            <span
                              key={stack}
                              className="badge"
                              style={{
                                background: (FUNCAO_COR[stack] ? FUNCAO_COR[stack] + '22' : 'rgba(167,139,250,0.15)'),
                                color: FUNCAO_COR[stack] || 'var(--roxo-claro)',
                              }}
                            >
                              {stack}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <div className="tabela__acoes">
                          <button className="btn-icone btn-icone--editar" onClick={() => navigate(`/admin/${d.id}/editar`)} title="Editar">
                            <TbPencil size={18} />
                          </button>
                          <button className="btn-icone btn-icone--deletar" onClick={() => deletar(d.id)} title="Remover">
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

export default Admin
