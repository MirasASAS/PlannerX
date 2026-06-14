import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import type { Task, DayId, CategoryColor } from '../types'

const SAMPLE_TASKS: Task[] = [
  {
    id: '1',
    title: 'Design new landing page',
    description: 'Create wireframes and mockups for the new product landing page',
    category: 'blue',
    day: 'monday',
    tags: ['design', 'ui'],
    createdAt: new Date().toISOString(),
    order: 0,
  },
  {
    id: '2',
    title: 'Fix authentication bug',
    description: 'Users cannot log in with Google OAuth on mobile',
    category: 'red',
    day: 'monday',
    tags: ['bug', 'auth'],
    createdAt: new Date().toISOString(),
    order: 1,
  },
  {
    id: '3',
    title: 'Write unit tests',
    description: 'Add tests for the payment module',
    category: 'yellow',
    day: 'tuesday',
    tags: ['testing'],
    createdAt: new Date().toISOString(),
    order: 0,
  },
  {
    id: '4',
    title: 'Team standup',
    description: 'Daily sync with the engineering team',
    category: 'green',
    day: 'wednesday',
    tags: ['meeting'],
    createdAt: new Date().toISOString(),
    order: 0,
  },
  {
    id: '5',
    title: 'Review pull requests',
    description: 'Review and merge pending PRs from the team',
    category: 'purple',
    day: 'thursday',
    tags: ['code-review'],
    createdAt: new Date().toISOString(),
    order: 0,
  },
]

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('planner-tasks', SAMPLE_TASKS)

  const addTask = useCallback(
    (data: Omit<Task, 'id' | 'createdAt' | 'order'>) => {
      const dayTasks = tasks.filter((t) => t.day === data.day)
      const newTask: Task = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        order: dayTasks.length,
      }
      setTasks((prev) => [...prev, newTask])
      return newTask
    },
    [tasks, setTasks],
  )

  const updateTask = useCallback(
    (id: string, data: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)))
    },
    [setTasks],
  )

  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== id))
    },
    [setTasks],
  )

  const moveTask = useCallback(
    (taskId: string, newDay: DayId) => {
      setTasks((prev) => {
        const task = prev.find((t) => t.id === taskId)
        if (!task || task.day === newDay) return prev
        const dayTasks = prev.filter((t) => t.day === newDay && t.id !== taskId)
        return prev.map((t) =>
          t.id === taskId ? { ...t, day: newDay, order: dayTasks.length } : t,
        )
      })
    },
    [setTasks],
  )

  const reorderTasks = useCallback(
    (day: DayId, orderedIds: string[]) => {
      setTasks((prev) => {
        const orderMap = new Map(orderedIds.map((id, i) => [id, i]))
        return prev.map((t) => (t.day === day && orderMap.has(t.id) ? { ...t, order: orderMap.get(t.id)! } : t))
      })
    },
    [setTasks],
  )

  const getTasksByDay = useCallback(
    (day: DayId) => tasks.filter((t) => t.day === day).sort((a, b) => a.order - b.order),
    [tasks],
  )

  const searchTasks = useCallback(
    (query: string): Task[] => {
      if (!query.trim()) return []
      const q = query.toLowerCase()
      return tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q)),
      )
    },
    [tasks],
  )

  const getStats = useCallback(() => {
    const total = tasks.length
    const byCategory = tasks.reduce(
      (acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + 1
        return acc
      },
      {} as Record<CategoryColor, number>,
    )
    const byDay = tasks.reduce(
      (acc, t) => {
        acc[t.day] = (acc[t.day] || 0) + 1
        return acc
      },
      {} as Record<DayId, number>,
    )
    return { total, byCategory, byDay }
  }, [tasks])

  return { tasks, addTask, updateTask, deleteTask, moveTask, reorderTasks, getTasksByDay, searchTasks, getStats }
}
