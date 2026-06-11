import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { TbArrowLeft } from 'react-icons/tb'
import PageLayout from '../components/PageLayout'
import { projetosService, membrosService, diretoresService } from '../services/api'
import './Form.css'

const FUNCOES = ['Back-end', 'Front-end', 'Designer', 'DataBase', 'Mobile', 'Gerente de Projeto']
const STATUS_OPCOES = ['Criado', 'Em progresso', 'Concluído']

const getStacks = (person) => Array.isArray(person.stacks) && person.stacks.length > 0 ? person.stacks : [person.funcao]

function CadastroProjeto() {
  const { id } = useParams()
  const navigate = useNavigate()
  const editando = Boolean(id)

  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    status: 'Criado',
    dataLimite: '',
  })
  const [alocacao, setAlocacao] = useState({}) // { funcao: membroId }
  const [membros, setMembros] = useState([])
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    carregarMembros()
    if (editando) carregarProjeto()
  }, [id])

  async function carregarMembros() {
    try {
      const [{ data: membrosData }, { data: diretoresData }] = await Promise.all([
        membrosService.listar(),
        diretoresService.listar(),
      ])
      const pessoas = [
        ...membrosData,
        ...diretoresData.map((d) => ({ ...d, isDiretor: true })),
      ]
      setMembros(pessoas)
    } catch (err) {
      console.error('Erro ao carregar membros e diretores:', err)
    }
  }

  async function carregarProjeto() {
    try {
      const { data: projeto } = await projetosService.buscar(id)
      if (projeto) {
        setForm({ nome: projeto.nome, descricao: projeto.descricao || '', status: projeto.status, dataLimite: projeto.dataLimite ? projeto.dataLimite.split('T')[0] : '' })
        const normalized = {}
        FUNCOES.forEach((f) => {
          // keep ids as strings (UUID) and include diretorId when present
          normalized[f] = projeto.alocacoes
            .filter((aloc) => aloc.funcaoNoProjeto === f)
            .map((aloc) => (aloc.membroId || aloc.diretorId))
        })
        setAlocacao(normalized)
      }
    } catch (err) {
      console.error('Erro ao carregar projeto:', err)
    }
  }

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleAlocacao = (funcao, membroIds) =>
    setAlocacao((prev) => ({ ...prev, [funcao]: membroIds }))

  const handleSlotChange = (funcao, index, memberId) => {
    setAlocacao((prev) => {
      const arr = prev[funcao] ? [...prev[funcao]] : []
      // store the selected id as string (matches backend UUIDs)
      arr[index] = memberId ? String(memberId) : null
      return { ...prev, [funcao]: arr }
    })
  }

  const addSlot = (funcao) => {
    setAlocacao((prev) => ({ ...prev, [funcao]: [...(prev[funcao] || []), null] }))
  }

  const removeSlot = (funcao, index) => {
    setAlocacao((prev) => {
      const arr = prev[funcao] ? [...prev[funcao]] : []
      arr.splice(index, 1)
      return { ...prev, [funcao]: arr }
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')

    if (!form.nome.trim()) { setErro('O nome do projeto é obrigatório.'); return }
    if (!form.dataLimite)  { setErro('Informe a data limite.'); return }

    setLoading(true)
    try {
      const alocacoes = Object.entries(alocacao).flatMap(([funcao, membrosIds]) =>
        (Array.isArray(membrosIds) ? membrosIds : [membrosIds]).
          filter(Boolean).
          map((selectedId) => {
            const pessoa = membros.find((m) => String(m.id) === String(selectedId))
            if (pessoa?.isDiretor) {
              return { diretorId: selectedId, funcaoNoProjeto: funcao }
            }
            return { membroId: selectedId, funcaoNoProjeto: funcao }
          })
      )

      const payload = {
        nome: form.nome,
        descricao: form.descricao,
        status: form.status,
        dataLimite: form.dataLimite,
        alocacoes,
      }

      if (editando) {
        await projetosService.editar(id, payload)
      } else {
        await projetosService.criar(payload)
      }

      navigate('/projetos')
    } catch (err) {
      setErro(err.response?.data?.error || 'Erro ao salvar projeto.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout>
      <div className="form-page">
        <div className="form-page__header">
          <button className="btn-voltar" onClick={() => navigate('/projetos')}>
            <TbArrowLeft size={20} /> Voltar
          </button>
          <h1 className="form-page__titulo">
            {editando ? 'Editar Projeto' : 'Novo Projeto'}
          </h1>
        </div>

        <form className="form-card" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-grupo form-grupo--full">
              <label className="form-label">Nome do Projeto *</label>
              <input
                className="form-input"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                placeholder="Ex: Sistema de Gestão"
              />
            </div>

            <div className="form-grupo form-grupo--full">
              <label className="form-label">Descrição</label>
              <textarea
                className="form-input form-textarea"
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                placeholder="Descreva o projeto..."
                rows={4}
              />
            </div>

            <div className="form-grupo">
              <label className="form-label">Status</label>
              <select className="form-input form-select" name="status" value={form.status} onChange={handleChange}>
                {STATUS_OPCOES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="form-grupo">
              <label className="form-label">Data Limite *</label>
              <input
                className="form-input"
                type="date"
                name="dataLimite"
                value={form.dataLimite}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Alocação de membros por função */}
          <div className="form-secao">
            <h2 className="form-secao__titulo">Alocação de Membros</h2>
            <div className="form-grid">
              {FUNCOES.map((funcao) => {
                const disponiveis = membros.filter((m) => getStacks(m).includes(funcao))
                const slots = (alocacao[funcao] && alocacao[funcao].length > 0) ? alocacao[funcao] : [null]
                return (
                  <div key={funcao} className="form-grupo">
                    <label className="form-label">{funcao}</label>
                    {slots.map((sel, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                        <select
                          className="form-input form-select"
                          value={sel ?? ''}
                          onChange={(e) => handleSlotChange(funcao, idx, e.target.value)}
                        >
                          <option value="">— Nenhum —</option>
                          {disponiveis.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.nome}{m.isDiretor ? ' (Diretor)' : ''}
                            </option>
                          ))}
                        </select>
                        <div className="slot-controls">
                          <button type="button" className="btn-add-slot" onClick={() => addSlot(funcao)} title="Adicionar">
                            +
                          </button>
                          {slots.length > 1 && (
                            <button type="button" className="btn-remove-slot" onClick={() => removeSlot(funcao, idx)} title="Remover">
                              –
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>

          {erro && <p className="form-erro">{erro}</p>}

          <div className="form-acoes">
            <button type="button" className="btn-secundario" onClick={() => navigate('/projetos')}>
              Cancelar
            </button>
            <button type="submit" className="btn-primario" disabled={loading}>
              {loading ? 'Salvando...' : editando ? 'Salvar Alterações' : 'Criar Projeto'}
            </button>
          </div>
        </form>
      </div>
    </PageLayout>
  )
}

export default CadastroProjeto
