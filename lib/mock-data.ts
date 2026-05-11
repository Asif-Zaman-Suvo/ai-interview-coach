import {
  InterviewSession,
  SessionSummary,
  DashboardStats,
  ScoreDataPoint,
  Question,
  JobRole,
  Difficulty,
  QuestionFeedback,
  CompetencyScore,
} from "./types";

export const jobRoles: JobRole[] = [
  "Frontend Developer",
  "Backend Developer",
  "Product Manager",
  "Data Scientist",
  "DevOps Engineer",
];

export const difficulties: Difficulty[] = ["Easy", "Medium", "Hard"];

export const mockQuestions: Question[] = [
  {
    id: "q1",
    text: "Explain the difference between state props and explain when you would use each.",
    category: "Technical",
    difficulty: "Easy",
  },
  {
    id: "q2",
    text: "Describe a time you had to make a difficult technical decision with limited information.",
    category: "Behavioral",
    difficulty: "Medium",
  },
  {
    id: "q3",
    text: "How would you design a scalable real-time notification system?",
    category: "System Design",
    difficulty: "Hard",
  },
  {
    id: "q4",
    text: "Tell me about a time you disagreed with a team member. How did you resolve it?",
    category: "Behavioral",
    difficulty: "Medium",
  },
  {
    id: "q5",
    text: "Explain how you would optimize a slow-loading web page.",
    category: "Technical",
    difficulty: "Medium",
  },
];

export const mockSessionSummaries: SessionSummary[] = [
  {
    id: "sess-1",
    role: "Frontend Developer",
    date: new Date("2026-05-10T14:30:00"),
    score: 85,
    duration: 24,
    status: "completed",
  },
  {
    id: "sess-2",
    role: "Backend Developer",
    date: new Date("2026-05-08T10:15:00"),
    score: 72,
    duration: 31,
    status: "completed",
  },
  {
    id: "sess-3",
    role: "Frontend Developer",
    date: new Date("2026-05-05T16:45:00"),
    score: 91,
    duration: 22,
    status: "completed",
  },
  {
    id: "sess-4",
    role: "Product Manager",
    date: new Date("2026-05-02T09:00:00"),
    score: 68,
    duration: 28,
    status: "completed",
  },
];

export const mockScoreData: ScoreDataPoint[] = [
  { sessionId: "sess-1", date: new Date("2026-05-10"), score: 85, role: "Frontend Developer" },
  { sessionId: "sess-2", date: new Date("2026-05-08"), score: 72, role: "Backend Developer" },
  { sessionId: "sess-3", date: new Date("2026-05-05"), score: 91, role: "Frontend Developer" },
  { sessionId: "sess-4", date: new Date("2026-05-02"), score: 68, role: "Product Manager" },
  { sessionId: "sess-5", date: new Date("2026-04-28"), score: 79, role: "Frontend Developer" },
  { sessionId: "sess-6", date: new Date("2026-04-24"), score: 83, role: "Backend Developer" },
  { sessionId: "sess-7", date: new Date("2026-04-20"), score: 74, role: "Product Manager" },
];

export const mockDashboardStats: DashboardStats = {
  totalSessions: 12,
  averageScore: 78,
  bestRole: "Frontend Developer",
  currentStreak: 4,
};

export const mockCompetencyScores: CompetencyScore[] = [
  { name: "Technical Knowledge", score: 85 },
  { name: "Communication", score: 72 },
  { name: "Problem Solving", score: 88 },
  { name: "System Design", score: 65 },
  { name: "Leadership", score: 70 },
];

export const mockQuestionFeedback: QuestionFeedback[] = [
  {
    questionId: "q1",
    question: "Explain the difference between state props and explain when you would use each.",
    transcript:
      "So state is managed within a component and can change over time, while props are passed down from parent components and are immutable. I would use state for data that needs to change within the component, like form inputs or toggle states, and props for passing configuration or data down to child components.",
    feedback:
      "Your explanation is accurate. You correctly identified the key differences and provided good examples. To improve, you could mention the concept of lifting state up when multiple components need to share state.",
    score: 85,
    strengths: [
      "Clear distinction between state and props",
      "Good use of examples",
      "Confident delivery",
    ],
    improvements: [
      "Could mention state management patterns",
      "Discuss prop drilling and alternatives",
      "Add more context on when to lift state",
    ],
  },
  {
    questionId: "q2",
    question:
      "Describe a time you had to make a difficult technical decision with limited information.",
    transcript:
      "In my last project, we had to choose between two database solutions with incomplete performance data. I created a proof of concept to test both options under realistic load, documented the trade-offs, and presented findings to the team with a recommendation based on our specific needs.",
    feedback:
      "Excellent use of structured problem-solving. You showed good judgment by gathering data rather than guessing. The situation could benefit from more detail about how you managed stakeholder expectations during this uncertainty.",
    score: 78,
    strengths: [
      "Structured approach to uncertainty",
      "Data-driven decision making",
      "Team collaboration",
    ],
    improvements: [
      "Add more detail about stakeholder communication",
      "Discuss what trade-offs you considered",
      "Mention the outcome of the decision",
    ],
  },
  {
    questionId: "q3",
    question: "How would you design a scalable real-time notification system?",
    transcript:
      "I would use a message queue like RabbitMQ or Kafka to handle incoming notification requests. Then have a pool of workers processing these and sending to a WebSocket service. For the WebSocket layer, I'd use something like Socket.io with Redis for scaling across servers. The frontend would maintain connections and receive push notifications.",
    feedback:
      "You have a good high-level understanding of the components needed. The architecture is sound. To strengthen your answer, consider discussing message delivery guarantees, handling failures, and how you would monitor the system health.",
    score: 70,
    strengths: [
      "Identified key components",
      "Considered scaling with Redis",
      "Clear architectural flow",
    ],
    improvements: [
      "Discuss message delivery guarantees",
      "Cover failure scenarios and retries",
      "Add monitoring and observability considerations",
    ],
  },
];

export const mockInterviewSession: InterviewSession = {
  id: "sess-1",
  role: "Frontend Developer",
  difficulty: "Medium",
  status: "completed",
  startedAt: new Date("2026-05-10T14:30:00"),
  completedAt: new Date("2026-05-10T14:54:00"),
  overallScore: 78,
  questions: mockQuestions,
  answers: mockQuestions.map((q) => ({
    questionId: q.id,
    transcript:
      "This is a sample answer that would be recorded during the interview session.",
    audioDuration: 45,
    submittedAt: new Date(),
  })),
  feedback: mockQuestionFeedback,
  competencyScores: mockCompetencyScores,
};

export const sessionsPerWeekData = [
  { week: "Apr 20", sessions: 2 },
  { week: "Apr 27", sessions: 3 },
  { week: "May 4", sessions: 4 },
  { week: "May 11", sessions: 3 },
];

export const roleBreakdownData = [
  { role: "Frontend Developer", count: 5, avgScore: 82 },
  { role: "Backend Developer", count: 3, avgScore: 75 },
  { role: "Product Manager", count: 2, avgScore: 70 },
  { role: "Data Scientist", count: 1, avgScore: 68 },
  { role: "DevOps Engineer", count: 1, avgScore: 73 },
];
