import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { TbPencil, TbArrowLeft, TbBrandAsana } from 'react-icons/tb'
import PageLayout from '../components/PageLayout'
import { membrosService, projetosService } from '../services/api'
import './Detalhes.css'

const FUNCAO_COR = {
  'Back-end':   '#6366F1',
  'Front-end':  '#F59E0B',
  'Designer':   '#EC4899',
  'DataBase':   '#10B981',
  'Mobile':     '#3B82F6',
  'Gerente de Projeto': '#A78BFA',
}

function MembroDetalhes() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [membro, setMembro] = useState(null)
  const [projetosAlocados, setProjetosAlocados] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { carregar() }, [id])

  async function carregar() {
    setLoading(true)
    try {
      const [{ data: membroData }, { data: projetosData }] = await Promise.all([
        membrosService.buscar(id),
        projetosService.listar(),
      ])

      if (!membroData) {
        setMembro(null)
        setProjetosAlocados([])
        return
      }

      const membroProjetos = projetosData.filter((projeto) => {
        const aloc = projeto.alocacoes || projeto.alocacao || []
        if (Array.isArray(aloc)) {
          return aloc.some((a) => String(a.membroId) === String(id) || String(a.diretorId) === String(id))
        }
        // legacy object shape
        return Object.values(aloc).flatMap((item) => Array.isArray(item) ? item : item ? [item] : []).some((mid) => String(mid) === String(id))
      }).map((p) => ({ id: p.id, nome: p.nome, status: p.status }))

      setMembro(membroData)
      setProjetosAlocados(membroProjetos)
    } catch (err) {
      console.error('Erro ao carregar membro:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <PageLayout><p className="detalhes__loading">Carregando...</p></PageLayout>
  if (!membro) return <PageLayout><p className="detalhes__loading">Membro não encontrado.</p></PageLayout>

  const primaryFunc = (membro.stacks && membro.stacks.length > 0) ? membro.stacks[0] : membro.funcao
  const cor = FUNCAO_COR[primaryFunc] || '#888'

  return (
    <PageLayout>
      <div className="detalhes">
        <div className="detalhes__header">
          <button className="btn-voltar" onClick={() => navigate('/membros')}>
            <TbArrowLeft size={20} /> Voltar
          </button>
          <button className="btn-primario" onClick={() => navigate(`/membros/${id}/editar`)}>
            <TbPencil size={18} /> Editar
          </button>
        </div>

        <div className="detalhes__card">
          <h1 className="detalhes__titulo">{membro.nome}</h1>
          <div className="detalhes__meta">
            <div className="detalhes__meta-item">
              <span className="detalhes__meta-label">RGA</span>
              <span className="detalhes__meta-valor">{membro.rga}</span>
            </div>
            <div className="detalhes__meta-item">
              <span className="detalhes__meta-label">Função</span>
              <span className="badge" style={{ background: cor + '22', color: cor, fontSize: 14, padding: '5px 14px', borderRadius: 99 }}>
                {primaryFunc}
              </span>
            </div>
            {membro.stacks?.length > 0 && (
              <div className="detalhes__meta-item">
                <span className="detalhes__meta-label">Stacks</span>
                <span className="detalhes__meta-valor">{membro.stacks.join(', ')}</span>
              </div>
            )}
            <div className="detalhes__meta-item">
              <span className="detalhes__meta-label">Projetos aceitos</span>
              <span className="detalhes__meta-valor">{projetosAlocados.length}</span>
            </div>
          </div>
        </div>

        <div className="detalhes__card">
          <h2 className="detalhes__subtitulo">Projetos Alocados</h2>
          {projetosAlocados.length === 0 ? (
            <p className="alocacao-grupo__vazio">Membro não está alocado em nenhum projeto.</p>
          ) : (
            <ul className="projetos-membro">
              {projetosAlocados.map((p) => (
                <li key={p.id} className="projetos-membro__item" onClick={() => navigate(`/projetos/${p.id}`)}>
                  <TbBrandAsana size={16} color="var(--roxo-claro)" />
                  {p.nome}
                  <span className="badge badge--status" style={{ marginLeft: 'auto' }}>{p.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </PageLayout>
  )
}

export default MembroDetalhes
