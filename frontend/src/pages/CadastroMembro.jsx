import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { TbArrowLeft } from 'react-icons/tb'
import PageLayout from '../components/PageLayout'
import { loadData, saveData, getNextId, defaultMembros } from '../services/localData'
import './Form.css'

const FUNCOES = ['Back-end', 'Front-end', 'Designer', 'DataBase', 'Mobile', 'Gerente de Projeto']

function CadastroMembro() {
  const { id } = useParams()
  const navigate = useNavigate()
  const editando = Boolean(id)

  const [form, setForm] = useState({ nome: '', rga: '', funcao: 'Back-end', stacks: ['Back-end'], senha: '' })
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    if (editando) carregarMembro()
  }, [id])

  async function carregarMembro() {
    try {
      const membros = loadData('membros', defaultMembros)
      const membro = membros.find((m) => m.id === Number(id))
      if (membro) {
        setForm({
          nome: membro.nome,
          rga: membro.rga,
          funcao: membro.funcao,
          stacks: membro.stacks || [membro.funcao],
          senha: '',
        })
      }
    } catch { /* silencioso */ }
  }

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleStackChange = (stack) => {
    setForm((prev) => {
      const nextStacks = prev.stacks || []
      const hasStack = nextStacks.includes(stack)
      if (hasStack) {
        return { ...prev, stacks: nextStacks.filter((s) => s !== stack) }
      }
      if (nextStacks.length >= 2) {
        return prev
      }
      return { ...prev, stacks: [...nextStacks, stack] }
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')

    if (!form.nome.trim())  { setErro('O nome é obrigatório.'); return }
    if (!form.rga.trim())   { setErro('O RGA é obrigatório.'); return }
    if (!editando && !form.senha) { setErro('A senha é obrigatória.'); return }

    setLoading(true)
    try {
      const payload = {
        nome: form.nome,
        rga: form.rga,
        funcao: form.funcao,
        stacks: form.stacks && form.stacks.length > 0 ? form.stacks : [form.funcao],
      }
      if (form.senha) payload.senha = form.senha

      const membros = loadData('membros', defaultMembros)
      if (editando) {
        const updated = membros.map((m) => m.id === Number(id) ? { ...m, ...payload } : m)
        saveData('membros', updated)
      } else {
        const novo = { id: getNextId(membros), ...payload, projetos: 0 }
        saveData('membros', [...membros, novo])
      }

      navigate('/membros')
    } catch (err) {
      setErro(err.response?.data?.message || 'Erro ao salvar membro.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout>
      <div className="form-page">
        <div className="form-page__header">
          <button className="btn-voltar" onClick={() => navigate('/membros')}>
            <TbArrowLeft size={20} /> Voltar
          </button>
          <h1 className="form-page__titulo">
            {editando ? 'Editar Membro' : 'Novo Membro'}
          </h1>
        </div>

        <form className="form-card" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-grupo">
              <label className="form-label">Nome Completo *</label>
              <input className="form-input" name="nome" value={form.nome} onChange={handleChange} placeholder="Ex: João Silva" />
            </div>

            <div className="form-grupo">
              <label className="form-label">RGA *</label>
              <input className="form-input" name="rga" value={form.rga} onChange={handleChange} placeholder="Ex: 202310001" />
            </div>

            <div className="form-grupo">
              <label className="form-label">Função *</label>
              <select className="form-input form-select" name="funcao" value={form.funcao} onChange={handleChange}>
                {FUNCOES.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            <div className="form-grupo form-grupo--full">
              <label className="form-label">Stacks</label>
              <div className="form-checkbox-grid">
                {FUNCOES.map((stack) => {
                  const selected = (form.stacks || []).includes(stack)
                  const disabled = !selected && (form.stacks || []).length >= 2
                  return (
                    <label key={stack} className="form-checkbox-label" style={{ opacity: disabled ? 0.65 : 1 }}>
                      <input
                        type="checkbox"
                        checked={selected}
                        disabled={disabled}
                        onChange={() => handleStackChange(stack)}
                      />
                      {stack}
                    </label>
                  )
                })}
              </div>
              <p className="form-helper">Máximo 2 stacks por pessoa.</p>
            </div>

            <div className="form-grupo">
              <label className="form-label">{editando ? 'Nova Senha (opcional)' : 'Senha *'}</label>
              <input
                className="form-input"
                type="password"
                name="senha"
                value={form.senha}
                onChange={handleChange}
                placeholder={editando ? 'Deixe em branco para manter' : 'Mínimo 6 caracteres'}
                autoComplete="new-password"
              />
            </div>
          </div>

          {erro && <p className="form-erro">{erro}</p>}

          <div className="form-acoes">
            <button type="button" className="btn-secundario" onClick={() => navigate('/membros')}>
              Cancelar
            </button>
            <button type="submit" className="btn-primario" disabled={loading}>
              {loading ? 'Salvando...' : editando ? 'Salvar Alterações' : 'Cadastrar Membro'}
            </button>
          </div>
        </form>
      </div>
    </PageLayout>
  )
}

export default CadastroMembro
