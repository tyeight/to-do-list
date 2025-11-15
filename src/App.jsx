import { useEffect, useState } from 'react'
import './App.css'
import TodoItem from './components/TodoItem.jsx'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const parseDueToTime = (s) => {
  if (!s) return Infinity
  if (s.includes('/')) {
    const [dd, mm, yyyy] = s.split('/')
    const y = Number(yyyy)
    const m = Number(mm) - 1
    const d = Number(dd)
    const dt = new Date(y, m, d)
    return dt.getTime()
  }
  const [yStr, mStr, dStr] = s.split('-')
  const y = Number(yStr)
  const m = Number(mStr) - 1
  const d = Number(dStr)
  const dt = new Date(y, m, d)
  return dt.getTime()
}

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos')
    return saved ? JSON.parse(saved) : []
  })
  const [text, setText] = useState('')
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('manual')
  const [newPriority, setNewPriority] = useState('media')
  const [newDue, setNewDue] = useState('')
  const [draggedId, setDraggedId] = useState(null)

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])



  useEffect(() => {
    const handler = (e) => {
      if (e.defaultPrevented) return
      const btn = e.target.closest('button')
      if (!btn) return
      if (btn.disabled || btn.getAttribute('disabled') !== null || btn.getAttribute('aria-disabled') === 'true') return
      if (btn.classList.contains('Toastify__close-button')) return
      if (e.target.closest('.Toastify__toast-container')) return
      const label = (btn.textContent || '').trim() || 'Botão'
      const cls = btn.classList
      let notify = toast.info
      if (cls.contains('addBtn') || cls.contains('saveBtn')) notify = toast.success
      else if (cls.contains('deleteBtn')) notify = toast.error
      else if (cls.contains('clearBtn')) notify = toast.warning
      notify(`${label}`)
    }
    document.addEventListener('click', handler, true)
    return () => document.removeEventListener('click', handler, true)
  }, [])

  const addTodo = () => {
    const value = text.trim()
    if (!value) return
    setTodos((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: value,
        completed: false,
        priority: newPriority,
        due: newDue || ''
      }
    ])
    setText('')
    setNewDue('')
  }

  const toggleTodo = (id) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  const updateTodoFields = (id, patch) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)))
  }

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((t) => !t.completed))
  }

  const remaining = todos.filter((t) => !t.completed).length
  const filteredTodosRaw = todos.filter((t) => {
    if (filter === 'active') return !t.completed
    if (filter === 'completed') return t.completed
    return true
  })
  const priorityOrder = { alta: 0, media: 1, baixa: 2 }
  const filteredTodos =
    sort === 'manual'
      ? filteredTodosRaw
      : [...filteredTodosRaw].sort((a, b) => {
          if (sort === 'due') {
            const da = a.due ? parseDueToTime(a.due) : Infinity
            const db = b.due ? parseDueToTime(b.due) : Infinity
            return da - db
          }
          if (sort === 'priority') {
            const pa = priorityOrder[a.priority || 'media']
            const pb = priorityOrder[b.priority || 'media']
            return pa - pb
          }
          if (sort === 'text') {
            return a.text.localeCompare(b.text)
          }
          if (sort === 'status') {
            return Number(a.completed) - Number(b.completed)
          }
          return 0
        })

  const onDragStart = (id) => {
    if (sort !== 'manual') return
    setDraggedId(id)
  }

  const onDrop = (targetId) => {
    if (sort !== 'manual' || draggedId === null) return
    const srcIdx = todos.findIndex((t) => t.id === draggedId)
    const tgtIdx = todos.findIndex((t) => t.id === targetId)
    if (srcIdx === -1 || tgtIdx === -1) return
    const next = [...todos]
    const [moved] = next.splice(srcIdx, 1)
    next.splice(tgtIdx, 0, moved)
    setDraggedId(null)
    setTodos(next)
  }

  return (
    <div className="app">
      <ToastContainer position="bottom-right" theme="dark" />
      <h1 className="title">To‑Do List</h1>
      <div className="inputRow">
        <input
          className="input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') addTodo()
          }}
          placeholder="Adicionar tarefa"
        />
        <select className="input" value={newPriority} onChange={(e) => setNewPriority(e.target.value)}>
          <option value="alta">Alta</option>
          <option value="media">Média</option>
          <option value="baixa">Baixa</option>
        </select>

        <input
          className="input"
          type="date"
          value={newDue}
          onChange={(e) => setNewDue(e.target.value)}
        />
        <button className="addBtn" onClick={addTodo}>Adicionar</button>
      </div>
      {todos.length > 0 && (
        <div className="toolbar">
          <div className="filters">
            <button
              className={`filterBtn ${filter === 'all' ? 'selected' : ''}`}
              onClick={() => setFilter('all')}
            >
              Todas
            </button>
            <button
              className={`filterBtn ${filter === 'active' ? 'selected' : ''}`}
              onClick={() => setFilter('active')}
            >
              Ativas
            </button>
            <button
              className={`filterBtn ${filter === 'completed' ? 'selected' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Concluídas
            </button>
          </div>

          <div className="sort">
            <span>Ordenar:</span>
            <select className="input" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="manual">Manual</option>
              <option value="due">Data</option>
              <option value="priority">Prioridade</option>
              <option value="text">Texto</option>
              <option value="status">Status</option>
            </select>
          </div>
          <span>{remaining} restantes</span>
          <button className="clearBtn" onClick={clearCompleted}>Limpar concluídas</button>
        </div>
      )}
      <ul className="list">
        {filteredTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={() => toggleTodo(todo.id)}
            onUpdateFields={(patch) => updateTodoFields(todo.id, patch)}
            onDelete={() => deleteTodo(todo.id)}
            draggable={sort === 'manual'}
            onDragStart={() => onDragStart(todo.id)}
            onDrop={() => onDrop(todo.id)}
          />
        ))}
      </ul>
    </div>
  )
}

export default App
