import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TbPlus, TbPencil, TbTrash, TbSearch, TbCheck, TbAlertTriangle, TbX } from 'react-icons/tb'
import PageLayout from '../components/PageLayout'
import { membrosService } from '../services/api'
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
  const [busca, setBusca] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { carregar() }, [])

  async function carregar() {
    setLoading(true)
    try {
      const { data } = await membrosService.listar()
      
      // Mapeia garantindo o preenchimento correto das propriedades vindas do back-end
      const normalizados = data.map((m) => ({
        id: m.id,
        nome: m.nome || m.name,
        rga: m.rga,
        funcao: m.funcao || 'Membro',
        stacks: m.stacks || m.funcoes || [],
        // Coleta o número real enviado de forma segura pelo back-end
        projetosCount: m.projetos !== undefined ? m.projetos : (m.totalProjetos || 0)
      }))

      setMembros(normalizados)
    } catch (err) {
      console.error('Erro ao carregar membros:', err)
      alert('Não foi possível carregar os membros do servidor.')
    } finally {
      setLoading(false)
    }
  }

  const renderCargaBadge = (count) => {
    // Escala visual baseada no número absoluto de alocações ativas do desenvolvedor
    let color = '#10B981'
    let Icon = TbCheck

    if (count <= 1) {
      color = '#10B981' // Verde: Carga tranquila ou livre
      Icon = TbCheck
    } else if (count === 2) {
      color = '#F59E0B' // Amarelo: Carga moderada (2 projetos)
      Icon = TbAlertTriangle
    } else {
      color = '#EF4444' // Vermelho: Carga alta/Sobrecarga (3 ou mais projetos)
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
      await membrosService.deletar(id)
      const next = membros.filter((m) => m.id !== id)
      setMembros(next)
    } catch (err) {
      console.error('Erro ao deletar membro:', err)
      alert('Erro ao remover membro.')
    }
  }

  const filtrados = membros.filter((m) =>
    (m.nome || '').toLowerCase().includes(busca.toLowerCase()) ||
    (m.funcao || '').toLowerCase().includes(busca.toLowerCase()) ||
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
            placeholder="Buscar membro por nome ou stack..."
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
                      <td>{renderCargaBadge(m.projetosCount)}</td>
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