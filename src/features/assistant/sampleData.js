/**
 * SAMPLE DATA: the backend has no endpoint for these yet.
 * - Recent chats: the legacy API stores one flat history per profile (no sessions). Real
 *   sessions arrive with backend milestone M8, so this list is clearly labelled as sample.
 * - Quick actions and the welcome message are UI configuration, not data.
 */
import { BookOpen, Lightbulb, MessageCircle, NotebookText } from 'lucide-react'

export const heroChips = ['Get explanations', 'Summarize topics', 'Solve doubts', 'Get study tips']

/** `prompt` pre-fills the composer so the student can edit it before sending. */
export const assistantQuickActions = [
  {
    id: 'ask',
    title: 'Ask a Question',
    description: 'Get instant help',
    icon: MessageCircle,
    tone: 'blue',
    prompt: '',
    focusOnly: true,
  },
  {
    id: 'summarize',
    title: 'Summarize Notes',
    description: 'Key points in seconds',
    icon: NotebookText,
    tone: 'purple',
    prompt: 'Summarize this topic into key points for quick revision: ',
  },
  {
    id: 'tips',
    title: 'Study Tips',
    description: 'Boost your learning',
    icon: Lightbulb,
    tone: 'green',
    prompt: 'Give me practical study tips to learn and remember this topic: ',
  },
  {
    id: 'exam',
    title: 'Exam Help',
    description: 'Prepare with confidence',
    icon: BookOpen,
    tone: 'orange',
    prompt: 'Help me prepare for my exam on this topic. List the most important questions and concepts: ',
  },
]

export const sampleRecentChats = [
  { id: 'rc-1', title: 'Explain recursion in C++', ago: '2h ago' },
  { id: 'rc-2', title: 'Important topics for DSA', ago: '1 day ago' },
  { id: 'rc-3', title: 'Summarize OS unit 1', ago: '2 days ago' },
]
