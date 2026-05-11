// Core domain types for AI Interview Coach

export type JobRole =
  | "Frontend Developer"
  | "Backend Developer"
  | "Product Manager"
  | "Data Scientist"
  | "DevOps Engineer";

export type Difficulty = "Easy" | "Medium" | "Hard";

export type InterviewStatus = "pending" | "in_progress" | "completed";

export type Category =
  | "Technical"
  | "Behavioral"
  | "System Design"
  | "Situational";

export interface Question {
  id: string;
  text: string;
  category: Category;
  difficulty: Difficulty;
}

export interface Answer {
  questionId: string;
  transcript: string;
  audioDuration: number;
  submittedAt: Date;
}

export interface QuestionFeedback {
  questionId: string;
  question: string;
  transcript: string;
  feedback: string;
  score: number;
  strengths: string[];
  improvements: string[];
}

export interface CompetencyScore {
  name: string;
  score: number;
}

export interface InterviewSession {
  id: string;
  role: JobRole;
  difficulty: Difficulty;
  status: InterviewStatus;
  startedAt: Date;
  completedAt?: Date;
  overallScore?: number;
  questions: Question[];
  answers: Answer[];
  feedback?: QuestionFeedback[];
  competencyScores: CompetencyScore[];
}

export interface SessionSummary {
  id: string;
  role: JobRole;
  date: Date;
  score: number;
  duration: number;
  status: InterviewStatus;
}

export interface DashboardStats {
  totalSessions: number;
  averageScore: number;
  bestRole: JobRole | null;
  currentStreak: number;
}

export interface ScoreDataPoint {
  sessionId: string;
  date: Date;
  score: number;
  role: JobRole;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
