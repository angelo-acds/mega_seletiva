import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { TbPencil, TbArrowLeft, TbUser } from 'react-icons/tb'
import { loadData, defaultProjetos, defaultMembros, defaultDiretores } from '../services/localData'
import PageLayout from '../components/PageLayout'
import './Detalhes.css'

const FUNCOES = ['Back-end', 'Front-end', 'Designer', 'DataBase', 'Mobile', 'Gerente de Projeto']

function ProjetoDetalhes() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [projeto, setProjeto] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    carregar()
  }, [id])

  async function carregar() {
    setLoading(true)
    try {
      const projetos = loadData('projetos', defaultProjetos)
      const encontrado = projetos.find((p) => p.id === Number(id))
      if (encontrado) {
        // Build members per function from saved alocacao (funcao -> membroId)
        const membrosData = loadData('membros', defaultMembros)
        const diretoresData = loadData('diretores', defaultDiretores)
        const pessoasData = [
          ...membrosData,
          ...diretoresData.map((d) => ({ ...d, isDiretor: true })),
        ]
        const aloc = encontrado.alocacao || {}
        const membrosPorFuncao = {}
        FUNCOES.forEach((funcao) => {
          const v = aloc[funcao]
          if (!v) {
            membrosPorFuncao[funcao] = []
          } else if (Array.isArray(v)) {
            membrosPorFuncao[funcao] = v.map((mid) => pessoasData.find((m) => m.id === Number(mid))).filter(Boolean)
          } else {
            const membro = pessoasData.find((m) => m.id === Number(v))
            membrosPorFuncao[funcao] = membro ? [membro] : []
          }
        })

        setProjeto({ ...encontrado, membros: membrosPorFuncao })
      } else {
        setProjeto(null)
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <PageLayout><p className="detalhes__loading">Carregando...</p></PageLayout>
  if (!projeto) return <PageLayout><p className="detalhes__loading">Projeto não encontrado.</p></PageLayout>

  return (
    <PageLayout>
      <div className="detalhes">
        <div className="detalhes__header">
          <button className="btn-voltar" onClick={() => navigate('/projetos')}>
            <TbArrowLeft size={20} /> Voltar
          </button>
          <button className="btn-primario" onClick={() => navigate(`/projetos/${id}/editar`)}>
            <TbPencil size={18} /> Editar
          </button>
        </div>

        <div className="detalhes__card">
          <h1 className="detalhes__titulo">{projeto.nome}</h1>
          <p className="detalhes__descricao">{projeto.descricao}</p>

          <div className="detalhes__meta">
            <div className="detalhes__meta-item">
              <span className="detalhes__meta-label">Status</span>
              <span className="badge badge--status">{projeto.status}</span>
            </div>
            <div className="detalhes__meta-item">
              <span className="detalhes__meta-label">Data Limite</span>
              <span className="detalhes__meta-valor">
                {new Date(projeto.dataLimite).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
        </div>

        <div className="detalhes__card">
          <h2 className="detalhes__subtitulo">Membros Alocados</h2>
          <div className="alocacao-grid">
            {FUNCOES.map((funcao) => (
              <div key={funcao} className="alocacao-grupo">
                <h3 className="alocacao-grupo__titulo">{funcao}</h3>
                {projeto.membros[funcao]?.length > 0 ? (
                  <ul className="alocacao-grupo__lista">
                    {projeto.membros[funcao].map((m) => (
                      <li key={m.id} className="alocacao-grupo__membro">
                        <TbUser size={15} />
                        {m.nome}{m.isDiretor ? ' (Diretor)' : ''}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="alocacao-grupo__vazio">Nenhum alocado</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default ProjetoDetalhes
