import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TbPlus, TbPencil, TbTrash, TbSearch } from 'react-icons/tb'
import PageLayout from '../components/PageLayout'
import { projetosService } from '../services/api'
import './ListPage.css'

const STATUS_COR = {
  'Em progresso': '#F59E0B',
  'Concluído':    '#10B981',
  'Criado':       '#A78BFA',
}

function Projetos() {
  const navigate = useNavigate()
  const [projetos, setProjetos] = useState([])
  const [busca, setBusca] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    carregar()
  }, [])

  async function carregar() {
    setLoading(true)
    try {
      const { data } = await projetosService.listar()
      setProjetos(data)
    } catch (err) {
      console.error('Erro ao carregar projetos:', err)
      alert('Não foi possível carregar os projetos do servidor.')
    } finally {
      setLoading(false)
    }
  }

  async function deletar(id) {
    if (!confirm('Tem certeza que deseja remover este projeto?')) return
    try {
      await projetosService.deletar(id)
      const next = projetos.filter((p) => p.id !== id)
      setProjetos(next)
    } catch (err) {
      console.error('Erro ao remover projeto:', err)
      alert('Erro ao remover projeto.')
    }
  }

  const filtrados = projetos.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <PageLayout>
      <div className="list-page">
        <div className="list-page__header">
          <h1 className="list-page__titulo">Projetos</h1>
          <button className="btn-primario" onClick={() => navigate('/projetos/novo')}>
            <TbPlus size={20} /> Novo Projeto
          </button>
        </div>

        <div className="list-page__busca">
          <TbSearch size={18} className="busca__icone" />
          <input
            type="text"
            placeholder="Buscar projeto..."
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
                  <th>Status</th>
                  <th>Data Limite</th>
                  <th>Membros</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="tabela__vazio">
                      Nenhum projeto encontrado.
                    </td>
                  </tr>
                ) : (
                  filtrados.map((p) => (
                    <tr key={p.id} onClick={() => navigate(`/projetos/${p.id}`)} className="tabela__row">
                      <td className="tabela__nome">{p.nome}</td>
                      <td>
                        <span
                          className="badge"
                          style={{ background: STATUS_COR[p.status] + '22', color: STATUS_COR[p.status] }}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td>{new Date(p.dataLimite).toLocaleDateString('pt-BR')}</td>
                      <td>{p.membros}</td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div className="tabela__acoes">
                          <button
                            className="btn-icone btn-icone--editar"
                            onClick={() => navigate(`/projetos/${p.id}/editar`)}
                            title="Editar"
                          >
                            <TbPencil size={18} />
                          </button>
                          <button
                            className="btn-icone btn-icone--deletar"
                            onClick={() => deletar(p.id)}
                            title="Remover"
                          >
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

export default Projetos
