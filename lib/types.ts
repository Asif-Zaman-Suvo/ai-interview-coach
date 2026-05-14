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
  /** Same as transcript; explicit for API/DB clarity */
  userAnswer?: string;
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
  role: JobRole | string;
  date: Date | string;
  score: number;
  /** Total session length (seconds); matches `GET /sessions/:id` `duration`. */
  duration: number;
  status?: InterviewStatus;
  difficulty?: Difficulty;
}

export interface DashboardStats {
  totalSessions: number;
  averageScore: number;
  bestRole: JobRole | string | null;
  currentStreak: number;
}

export interface ScoreDataPoint {
  sessionId?: string;
  date: Date | string;
  score: number;
  role?: JobRole | string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt?: string;
}

/** Published homepage testimonial row from `GET /api/testimonials/public` */
export interface PublicTestimonial {
  id: string;
  rating: number;
  quote: string;
  name: string;
  role: string;
}

// API Role types (from backend)
export interface Role {
  id: string;
  name: string;
  icon: string;
  description: string;
  /** Present only when roles API adds grouping metadata */
  category?: string;
}

// Extended session types for API
export interface Session {
  id: string;
  userId?: string;
  role: string;
  roleId: string;
  difficulty: Difficulty;
  score: number;
  /** Elapsed seconds (createdAt → completion or now). */
  duration: number;
  status: 'active' | 'completed';
  startedAt: string | Date;
  completedAt?: string;
  summary?: string;
  topImprovements?: string[];
  questions: Question[];
  answers?: Answer[];
  feedback?: QuestionFeedback[];
  resumeText?: string;
}

// Answer submission
export interface AnswerSubmission {
  questionId: string;
  transcript: string;
  audioDuration?: number;
}

// Answer feedback from API
export interface AnswerFeedback {
  questionId: string;
  transcript: string;
  feedback: string;
  score: number;
  strengths: string[];
  improvements: string[];
  nextQuestion?: Question;
}

// Interview setup payload
export interface InterviewSetup {
  roleId: string;
  difficulty: Difficulty;
  resumeText?: string;
}

// Session start response
export interface SessionStartResponse {
  sessionId: string;
  questions: Question[];
}

// Admin stats
export interface AdminStats {
  totalUsers: number;
  totalSessions: number;
  averageScore: number;
  activeToday: number;
}

// Admin user management
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  sessionsCount?: number;
}

// Question bank management
export interface QuestionBankItem {
  id: string;
  roleId: string;
  text: string;
  type: 'technical' | 'behavioral';
  difficulty: Difficulty;
  /** Display name resolved server-side */
  role: string;
  idealAnswer: string;
  createdAt?: string;
}

// History pagination
export interface PaginatedSessions {
  sessions: SessionSummary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
