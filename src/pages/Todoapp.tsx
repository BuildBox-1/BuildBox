// src/pages/TodoApp.tsx
// Built by: your-name
// Branch: your-name/todo-app

import { useState } from 'react'
import { Link } from 'react-router'

interface Todo {
    id: number
    text: string
    done: boolean
}

export default function TodoApp() {
    const [todos, setTodos] = useState<Todo[]>([])
    const [input, setInput] = useState('')

    const add = () => {
        if (!input.trim()) return
        setTodos((prev) => [...prev, { id: Date.now(), text: input.trim(), done: false }])
        setInput('')
    }

    const toggle = (id: number) =>
        setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))

    const remove = (id: number) =>
        setTodos((prev) => prev.filter((t) => t.id !== id))

    return (
        <div className="flex flex-col flex-1 px-6 py-10 max-w-lg mx-auto w-full">
            <Link to="/" className="font-mono text-xs text-(--text) hover:text-(--accent) transition-colors mb-8">
                ← Back
            </Link>

            <h1 className="text-2xl font-bold text-(--text-h) tracking-tight mb-6">✓ Todo App</h1>

            <div className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && add()}
                    placeholder="Add a task…"
                    className="flex-1 font-mono text-sm bg-(--code-bg) border border-(--border) rounded-lg px-4 py-2.5 text-(--text-h) placeholder:text-(--text) outline-none focus:border-(--accent) transition-colors"
                />
                <button
                    onClick={add}
                    className="font-mono text-sm bg-(--accent) text-white px-4 py-2.5 rounded-lg hover:opacity-85 transition-opacity"
                >
                    Add
                </button>
            </div>

            <ul className="flex flex-col gap-2">
                {todos.length === 0 && (
                    <li className="font-mono text-sm text-(--text) text-center py-8">
                        No tasks yet. Add one above.
                    </li>
                )}
                {todos.map((todo) => (
                    <li
                        key={todo.id}
                        className="flex items-center gap-3 p-3 rounded-xl border border-(--border) bg-(--code-bg)"
                    >
                        <input
                            type="checkbox"
                            checked={todo.done}
                            onChange={() => toggle(todo.id)}
                            className="accent-(--accent) w-4 h-4 cursor-pointer"
                        />
                        <span className={`flex-1 text-sm text-(--text-h) ${todo.done ? 'line-through opacity-40' : ''}`}>
                            {todo.text}
                        </span>
                        <button
                            onClick={() => remove(todo.id)}
                            className="font-mono text-xs text-(--text) hover:text-red-400 transition-colors"
                        >
                            ✕
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}