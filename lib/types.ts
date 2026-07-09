// Core domain types for AI Interview Coach

export type JobRole =
  | "Frontend Developer"
  | "Backend Developer"
  | "Product Manager"
  | "Data Scientist"
  | "DevOps Engineer";

export type Difficulty = "Easy" | "Medium" | "Hard";

export type UserPlan = "free" | "pack_10" | "pack_30";

/** Session caps per plan (must match backend `SESSION_LIMIT_BY_PLAN`). */
export const PLAN_SESSION_CAP: Record<UserPlan, number> = {
  free: 3,
  pack_10: 10,
  pack_30: 30,
};

/** Short labels for dashboards / admin. */
export const PLAN_LABEL: Record<UserPlan, string> = {
  free: "Free · 3 interviews",
  pack_10: "৳300 · 10 interviews",
  pack_30: "৳2,000 · 30 interviews",
};

/** Compact chip text (nav / sidebars). */
export const PLAN_TITLE: Record<UserPlan, string> = {
  free: "Free",
  pack_10: "৳300 pack",
  pack_30: "৳2k pack",
};

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

/** Admin `GET /admin/interviews` row (every user’s interviews). */
export interface AdminInterviewSessionRow extends SessionSummary {
  participantUserId: string;
  participantEmail: string | null;
  participantName: string | null;
}

export interface PaginatedAdminInterviews {
  sessions: AdminInterviewSessionRow[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type AdminNotificationKind = "pack_purchase" | "user_signup";

/** Row from `GET /admin/notifications` (pack purchase + signup alerts). */
export interface AdminPackPurchaseNotification {
  id: string;
  kind: AdminNotificationKind;
  purchaserEmail: string;
  purchaserName?: string;
  previousPlan: string;
  newPlan: string;
  read: boolean;
  createdAt: string;
}

/** Alias — same DTO shape for all admin notification kinds. */
export type AdminNotificationItem = AdminPackPurchaseNotification;

export interface AdminNotificationsResponse {
  items: AdminPackPurchaseNotification[];
  unreadCount: number;
}

export type AdminSessionDetail = Session & {
  participantEmail?: string | null;
  participantName?: string | null;
};

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

/** Anonymous marketing hero stats from `GET /api/marketing/dashboard-preview` */
export interface LandingDashboardPreview {
  totals: {
    totalSessions: number;
    avgScore: number;
    bestRole: string | null;
  };
  recent: Array<{
    role: string;
    score: number;
    duration: number;
    date: string;
  }>;
}

/** `GET /sessions/quota` */
export interface SessionQuota {
  plan: UserPlan;
  sessionsUsed: number;
  sessionLimit: number;
  canStartNewSession: boolean;
  /** Present when the profile role is admin — interview caps are bypassed. */
  adminUnlimited?: boolean;
}

/** `GET/PATCH /settings` */
export interface AppUserSettings {
  email: string;
  name: string;
  plan: UserPlan;
  weeklyDigest: boolean;
  sessionReminders: boolean;
  productTips: boolean;
  interviewDefaultRole: string | null;
  interviewDefaultDifficulty: string | null;
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
  role: "user" | "admin";
  /** Learners only; `null` for administrators (no billing plan). */
  plan: UserPlan | null;
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
