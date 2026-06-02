const STORAGE_KEYS = {
  diretores: 'mega-jr-diretores',
  membros:   'mega-jr-membros',
  projetos:  'mega-jr-projetos',
}

function parse(value) {
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

export function loadData(key, fallback = []) {
  const stored = localStorage.getItem(STORAGE_KEYS[key])
  if (stored) {
    const parsed = parse(stored)
    if (Array.isArray(parsed)) return parsed
  }
  localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(fallback))
  return fallback
}

export function saveData(key, items) {
  localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(items))
}

export function getNextId(items) {
  return items.length === 0 ? 1 : Math.max(...items.map((item) => item.id)) + 1
}

export const defaultDiretores = [
  { id: 1001, nome: 'Rafael Costa',   rga: '202210001', funcao: 'Diretor de Projetos', stacks: ['Gerente de Projeto'] },
  { id: 1002, nome: 'Mariana Alves',  rga: '202210002', funcao: 'Diretora de Pessoas', stacks: ['Gerente de Projeto'] },
]

export const defaultMembros = [
  { id: 1, nome: 'João Silva',     rga: '202310001', funcao: 'Back-end',   projetos: 2, stacks: ['Back-end'] },
  { id: 2, nome: 'Ana Paula',      rga: '202310002', funcao: 'Back-end',   projetos: 1, stacks: ['Back-end'] },
  { id: 3, nome: 'Carlos Lima',    rga: '202310003', funcao: 'Front-end',  projetos: 3, stacks: ['Front-end'] },
  { id: 4, nome: 'Fernanda Souza', rga: '202310004', funcao: 'Designer',   projetos: 2, stacks: ['Designer'] },
  { id: 5, nome: 'Rafael Costa',   rga: '202310005', funcao: 'Gerente de Projeto', projetos: 5, stacks: ['Gerente de Projeto'] },
]

export const defaultProjetos = [
  { id: 1, nome: 'Projeto tal',        status: 'Em progresso', dataLimite: '2025-09-30', membros: 3 },
  { id: 2, nome: 'Projeto MAGALU',     status: 'Concluído',    dataLimite: '2025-07-15', membros: 5 },
  { id: 3, nome: 'Projeto tal 2',      status: 'Criado',       dataLimite: '2025-10-10', membros: 0 },
  { id: 4, nome: 'Projeto 5',          status: 'Em progresso', dataLimite: '2025-08-20', membros: 2 },
  { id: 5, nome: 'Sistema Interno',    status: 'Criado',       dataLimite: '2025-11-01', membros: 1 },
]
