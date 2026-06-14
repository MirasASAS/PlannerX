export type DayId =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday'

export type CategoryColor = 'red' | 'yellow' | 'green' | 'blue' | 'purple'

export interface Category {
  id: CategoryColor
  label: string
  color: string
  glow: string
}

export interface Task {
  id: string
  title: string
  description: string
  category: CategoryColor
  day: DayId
  tags: string[]
  createdAt: string
  order: number
}

export type GoalType = 'weekly' | 'monthly' | 'yearly'

export interface Subtask {
  id: string
  title: string
  completed: boolean
}

export interface Goal {
  id: string
  title: string
  description: string
  progress: number
  subtasks: Subtask[]
  deadline: string
  type: GoalType
  color: string
  createdAt: string
}

export const DAYS: { id: DayId; label: string }[] = [
  { id: 'monday', label: 'Monday' },
  { id: 'tuesday', label: 'Tuesday' },
  { id: 'wednesday', label: 'Wednesday' },
  { id: 'thursday', label: 'Thursday' },
  { id: 'friday', label: 'Friday' },
  { id: 'saturday', label: 'Saturday' },
  { id: 'sunday', label: 'Sunday' },
]

export const CATEGORIES: Category[] = [
  { id: 'red', label: 'Urgent', color: '#ff5f57', glow: 'rgba(255,95,87,0.5)' },
  { id: 'yellow', label: 'In Progress', color: '#febc2e', glow: 'rgba(254,188,46,0.5)' },
  { id: 'green', label: 'Done', color: '#28c840', glow: 'rgba(40,200,64,0.5)' },
  { id: 'blue', label: 'Info', color: '#4f9fff', glow: 'rgba(79,159,255,0.5)' },
  { id: 'purple', label: 'Feature', color: '#8b5cf6', glow: 'rgba(139,92,246,0.5)' },
]

export const GOAL_COLORS = [
  '#4f9fff',
  '#8b5cf6',
  '#06b6d4',
  '#ec4899',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#6366f1',
]
