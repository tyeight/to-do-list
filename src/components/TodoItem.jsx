import { useState } from 'react'

const toISO = (d) => {
  if (!d) return ''
  if (d.includes('/')) {
    const [dd, mm, yyyy] = d.split('/')
    const ddP = String(dd || '').padStart(2, '0')
    const mmP = String(mm || '').padStart(2, '0')
    return yyyy && mmP && ddP ? `${yyyy}-${mmP}-${ddP}` : ''
  }
  return d
}
const formatBR = (d) => {
  if (!d) return ''
  if (d.includes('-')) {
    const [yyyy, mm, dd] = d.split('-')
    return `${String(dd || '').padStart(2, '0')}/${String(mm || '').padStart(2, '0')}/${yyyy}`
  }
  if (d.includes('/')) return d
  return d
}

function TodoItem({ todo, onToggle, onUpdateFields, onDelete, draggable, onDragStart, onDrop }) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(todo.text)
  const [priority, setPriority] = useState(todo.priority || 'media')
const [category, setCategory] = useState(todo.category || '')
const [due, setDue] = useState(toISO(todo.due || ''))

  const save = () => {
    const next = {}
    if (value.trim()) next.text = value.trim()
    next.priority = priority
    next.category = category.trim()
    next.due = due || ''
    onUpdateFields(next)
    setEditing(false)
  }

  return (
    <li
      className={`item ${todo.completed ? 'completed' : ''}`}
      draggable={draggable}
      onDragStart={() => onDragStart && onDragStart()}
      onDragOver={(e) => {
        if (!draggable) return
        e.preventDefault()
      }}
      onDrop={() => onDrop && onDrop()}
    >
      <label className="left">
        <input type="checkbox" checked={todo.completed} onChange={onToggle} />
      </label>
      <div className="middle">
        {editing ? (
          <input
            className="editInput"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') save()
              if (e.key === 'Escape') {
                setValue(todo.text)
                setEditing(false)
              }
            }}
            autoFocus
          />
        ) : (
          <div className="textRow" onDoubleClick={() => setEditing(true)}>
            <span>{todo.text}</span>
            <div className="badges">
              {todo.priority && <span className={`badge priority-${todo.priority}`}>{todo.priority}</span>}
{todo.category && <span className="badge category">{todo.category}</span>}
{todo.due && <span className="badge due">{formatBR(todo.due)}</span>}
            </div>
          </div>
        )}
      </div>
      <div className="right">
        {editing ? (
          <>
            <select className="editInput" value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="alta">Alta</option>
              <option value="media">Média</option>
              <option value="baixa">Baixa</option>
            </select>
            <input className="editInput" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Categoria" />
            <input className="editInput" type="date" value={due} onChange={(e) => setDue(e.target.value)} />
            <button className="saveBtn" onClick={save}>Salvar</button>
          </>
        ) : (
          <button className="editBtn" onClick={() => setEditing(true)}>Editar</button>
        )}
        <button className="deleteBtn" onClick={onDelete}>Excluir</button>
      </div>
    </li>
  )
}

export default TodoItem