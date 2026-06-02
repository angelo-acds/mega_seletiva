import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/api'
import MASCOT_IMAGE from '../assets/mascot.png'
import LOGO_IMAGE from '../assets/logo.svg'
import './Login.css'

function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ login: '', senha: '' })
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')

    if (!form.login || !form.senha) {
      setErro('Preencha todos os campos.')
      return
    }

    setLoading(true)
    try {
      // TODO: integrar com o backend real
      // const { data } = await authService.login(form)
      // localStorage.setItem('token', data.token)
      navigate('/dashboard')
    } catch (err) {
      setErro(err.response?.data?.message || 'Credenciais inválidas.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login">
      <div className="login__left">
        <img className="login__logo" src={LOGO_IMAGE} alt="Mega Jr." />

        <form className="login__form" onSubmit={handleSubmit}>
          <input
            className="login__input"
            type="text"
            name="login"
            placeholder="Login"
            value={form.login}
            onChange={handleChange}
            autoComplete="username"
          />
          <input
            className="login__input"
            type="password"
            name="senha"
            placeholder="Senha"
            value={form.senha}
            onChange={handleChange}
            autoComplete="current-password"
          />

          {erro && <p className="login__erro">{erro}</p>}

          <button className="login__btn" type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>

      <div className="login__right">
        <img className="login__mascot" src={MASCOT_IMAGE} alt="Mascote Mega Jr." />
      </div>
    </div>
  )
}

export default Login
