import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import type { Goal, GoalType, Subtask } from '../types'

const SAMPLE_GOALS: Goal[] = [
  {
    id: '1',
    title: 'Complete project MVP',
    description: 'Finish all core features for the minimum viable product',
    progress: 65,
    subtasks: [
      { id: 's1', title: 'Set up backend API', completed: true },
      { id: 's2', title: 'Build authentication', completed: true },
      { id: 's3', title: 'Create dashboard UI', completed: false },
      { id: 's4', title: 'Write documentation', completed: false },
    ],
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'weekly',
    color: '#4f9fff',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Learn TypeScript advanced patterns',
    description: 'Master generics, decorators, and advanced type manipulation',
    progress: 40,
    subtasks: [
      { id: 's5', title: 'Read official handbook', completed: true },
      { id: 's6', title: 'Practice generics', completed: false },
      { id: 's7', title: 'Build a typed ORM', completed: false },
    ],
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'monthly',
    color: '#8b5cf6',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Launch SaaS product',
    description: 'Go from idea to paying customers with a fully operational SaaS',
    progress: 20,
    subtasks: [
      { id: 's8', title: 'Market research', completed: true },
      { id: 's9', title: 'Build MVP', completed: false },
      { id: 's10', title: 'Beta launch', completed: false },
      { id: 's11', title: 'Marketing campaign', completed: false },
      { id: 's12', title: 'Public launch', completed: false },
    ],
    deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'yearly',
    color: '#06b6d4',
    createdAt: new Date().toISOString(),
  },
]

export function useGoals() {
  const [goals, setGoals] = useLocalStorage<Goal[]>('planner-goals', SAMPLE_GOALS)

  const addGoal = useCallback(
    (data: Omit<Goal, 'id' | 'createdAt'>) => {
      const newGoal: Goal = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      }
      setGoals((prev) => [...prev, newGoal])
      return newGoal
    },
    [setGoals],
  )

  const updateGoal = useCallback(
    (id: string, data: Partial<Omit<Goal, 'id' | 'createdAt'>>) => {
      setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...data } : g)))
    },
    [setGoals],
  )

  const deleteGoal = useCallback(
    (id: string) => {
      setGoals((prev) => prev.filter((g) => g.id !== id))
    },
    [setGoals],
  )

  const toggleSubtask = useCallback(
    (goalId: string, subtaskId: string) => {
      setGoals((prev) =>
        prev.map((g) => {
          if (g.id !== goalId) return g
          const updatedSubtasks = g.subtasks.map((s) =>
            s.id === subtaskId ? { ...s, completed: !s.completed } : s,
          )
          const completed = updatedSubtasks.filter((s) => s.completed).length
          const progress = updatedSubtasks.length > 0 ? Math.round((completed / updatedSubtasks.length) * 100) : 0
          return { ...g, subtasks: updatedSubtasks, progress }
        }),
      )
    },
    [setGoals],
  )

  const addSubtask = useCallback(
    (goalId: string, title: string) => {
      setGoals((prev) =>
        prev.map((g) => {
          if (g.id !== goalId) return g
          const newSubtask: Subtask = { id: crypto.randomUUID(), title, completed: false }
          const updatedSubtasks = [...g.subtasks, newSubtask]
          const completed = updatedSubtasks.filter((s) => s.completed).length
          const progress = updatedSubtasks.length > 0 ? Math.round((completed / updatedSubtasks.length) * 100) : 0
          return { ...g, subtasks: updatedSubtasks, progress }
        }),
      )
    },
    [setGoals],
  )

  const deleteSubtask = useCallback(
    (goalId: string, subtaskId: string) => {
      setGoals((prev) =>
        prev.map((g) => {
          if (g.id !== goalId) return g
          const updatedSubtasks = g.subtasks.filter((s) => s.id !== subtaskId)
          const completed = updatedSubtasks.filter((s) => s.completed).length
          const progress = updatedSubtasks.length > 0 ? Math.round((completed / updatedSubtasks.length) * 100) : 0
          return { ...g, subtasks: updatedSubtasks, progress }
        }),
      )
    },
    [setGoals],
  )

  const getGoalsByType = useCallback(
    (type: GoalType) => goals.filter((g) => g.type === type),
    [goals],
  )

  const getGoalStats = useCallback(() => {
    const total = goals.length
    const avgProgress = total > 0 ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / total) : 0
    const completed = goals.filter((g) => g.progress === 100).length
    const byType = {
      weekly: goals.filter((g) => g.type === 'weekly').length,
      monthly: goals.filter((g) => g.type === 'monthly').length,
      yearly: goals.filter((g) => g.type === 'yearly').length,
    }
    return { total, avgProgress, completed, byType }
  }, [goals])

  return { goals, addGoal, updateGoal, deleteGoal, toggleSubtask, addSubtask, deleteSubtask, getGoalsByType, getGoalStats }
}
