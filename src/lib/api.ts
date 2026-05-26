const BASE_URL = "http://localhost:3000";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

function saveToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("token", token);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (data.token) {
    saveToken(data.token);
  }

  if (!response.ok) {
    throw new Error(data.message || `HTTP ${response.status}`);
  }

  return data as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
};

// ── Shared types ──────────────────────────────────────────────────────────────

export interface BoardCell {
  id: number;
  openedBy: string | null;
  value?: number;
}

export interface Match {
  matchId: string;
  status: "waiting" | "active" | "finished";
  players: string[];
  currentTurn: string | null;
  balances: { [playerId: string]: number };
  turnStartedAt: string;
  boardHash: string | null;
  lastMoveId: string | null;
  board: BoardCell[];
}

export interface AuthResponse {
  token: string;
  player: { playerId: string; games: number; wins: number; points: number };
}

export interface JoinResponse {
  message: string;
  token: string;
  match: Match;
}

export interface MatchResponse {
  token: string;
  match: Match;
}

export interface MoveResponse {
  message: string;
  token: string;
  match: Match;
}

export interface ResumeResponse {
  message: string;
  token: string;
  match: Match;
}

export interface ClaimPointsResponse {
  message: string;
  points: number;
  isFirstLogin: boolean;
}
