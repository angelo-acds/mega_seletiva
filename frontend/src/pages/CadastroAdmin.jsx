import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { TbArrowLeft } from 'react-icons/tb'
import PageLayout from '../components/PageLayout'
import { diretoresService } from '../services/api'
import './Form.css'

const CARGOS = [
  'Diretor de Projetos',
  'Diretora de Pessoas',
  'Diretor Financeiro',
  'Diretor de Marketing',
  'Presidente',
]

const STACKS = ['Back-end', 'Front-end', 'Designer', 'DataBase', 'Mobile', 'Gerente de Projeto']

function CadastroAdmin() {
  const { id } = useParams()
  const navigate = useNavigate()
  const editando = Boolean(id)

  const [form, setForm] = useState({ nome: '', rga: '', funcao: 'Diretor de Projetos', stacks: [], senha: '' })
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    if (editando) carregarDiretor()
  }, [id])

  async function carregarDiretor() {
    try {
      const resposta = await diretoresService.buscar(id)
      
      // Garante a captura dos dados tanto se vier direto em resposta.data quanto em resposta.data.dados
      const diretor = resposta.data?.dados || resposta.data || resposta;
      
      if (diretor) {
        setForm({
          nome: diretor.nome || '',
          rga: diretor.rga || '',
          // Se o back mandar 'funcao' ele lê, se mandar 'cargo' serve de fallback
          funcao: diretor.funcao || diretor.cargo || 'Diretor de Projetos',
          // Mapeia corretamente as stacks técnicas ou o array antigo 'funcoes'
          stacks: diretor.stacks || diretor.funcoes || [],
          senha: '',
        })
      }
    } catch (err) {
      console.error('Erro ao carregar diretor:', err)
      setErro('Não foi possível carregar os dados do diretor para edição.')
    }
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

    if (!form.nome.trim()) { setErro('O nome é obrigatório.'); return }
    if (!form.rga.trim())  { setErro('O RGA é obrigatório.'); return }
    if (!editando && !form.senha) { setErro('A senha é obrigatória.'); return }

    setLoading(true)
    try {
      const payload = {
        nome: form.nome,
        rga: form.rga,
        funcao: form.funcao,
        stacks: form.stacks || [],
      }
      if (form.senha) payload.senha = form.senha

      if (editando) {
        await diretoresService.editar(id, payload)
      } else {
        await diretoresService.criar(payload)
      }

      navigate('/admin')
    } catch (err) {
      setErro(err.response?.data?.error || 'Erro ao salvar diretor.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout>
      <div className="form-page">
        <div className="form-page__header">
          <button className="btn-voltar" onClick={() => navigate('/admin')}>
            <TbArrowLeft size={20} /> Voltar
          </button>
          <h1 className="form-page__titulo">
            {editando ? 'Editar Diretor' : 'Novo Diretor'}
          </h1>
        </div>

        <form className="form-card" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-grupo">
              <label className="form-label">Nome Completo *</label>
              <input className="form-input" name="nome" value={form.nome} onChange={handleChange} placeholder="Ex: Rafael Costa" />
            </div>

            <div className="form-grupo">
              <label className="form-label">RGA *</label>
              <input className="form-input" name="rga" value={form.rga} onChange={handleChange} placeholder="Ex: 202210001" />
            </div>

            <div className="form-grupo">
              <label className="form-label">Cargo *</label>
              <select className="form-input form-select" name="funcao" value={form.funcao} onChange={handleChange}>
                {CARGOS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="form-grupo form-grupo--full">
              <label className="form-label">Stacks</label>
              <div className="form-checkbox-grid">
                {STACKS.map((stack) => {
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
            <button type="button" className="btn-secundario" onClick={() => navigate('/admin')}>
              Cancelar
            </button>
            <button type="submit" className="btn-primario" disabled={loading}>
              {loading ? 'Salvando...' : editando ? 'Salvar Alterações' : 'Cadastrar Diretor'}
            </button>
          </div>
        </form>
      </div>
    </PageLayout>
  )
}

export default CadastroAdmin
