import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
})

// Interceptor: injeta token JWT automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Interceptor: redireciona para login se token expirar
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

/* ─── Auth ─────────────────────────────────────────────── */
export const authService = {
  login: (credentials) => api.post('/diretores/login', credentials),
  logout: () => localStorage.removeItem('token'),
}

/* ─── Membros ───────────────────────────────────────────── */
export const membrosService = {
  listar:  ()      => api.get('/membros'),
  buscar:  (id)    => api.get(`/membros/${id}`),
  criar:   (data)  => api.post('/membros', data),
  editar:  (id, data) => api.put(`/membros/${id}`, data),
  deletar: (id)    => api.delete(`/membros/${id}`),
}

/* ─── Projetos ──────────────────────────────────────────── */
export const projetosService = {
  listar:  ()      => api.get('/projetos'),
  buscar:  (id)    => api.get(`/projetos/${id}`),
  criar:   (data)  => api.post('/projetos', data),
  editar:  (id, data) => api.put(`/projetos/${id}`, data),
  deletar: (id)    => api.delete(`/projetos/${id}`),
}

/* ─── Alocação ──────────────────────────────────────────── */
export const alocacaoService = {
  alocar:     (projetoId, data) => api.post(`/projetos/${projetoId}/alocar`, data),
  desalocar:  (projetoId, membroId) => api.delete(`/projetos/${projetoId}/alocar/${membroId}`),
}

/* ─── Diretores ─────────────────────────────────────────── */
export const diretoresService = {
  listar:  ()      => api.get('/diretores'),
  buscar:  (id)    => api.get(`/diretores/${id}`),
  criar:   (data)  => api.post('/diretores', data),
  editar:  (id, data) => api.put(`/diretores/${id}`, data),
  deletar: (id)    => api.delete(`/diretores/${id}`),
}

/* ─── Dashboard ─────────────────────────────────────────── */
export const dashboardService = {
  resumo: () => api.get('/dashboard'),
}

export default api
