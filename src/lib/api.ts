const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

// sessionStorage is per-tab — two browser windows can hold different accounts
const TOKEN_KEY = "token";
const store = () =>
  typeof window !== "undefined" ? window.sessionStorage : null;

function getToken(): string | null {
  return store()?.getItem(TOKEN_KEY) ?? null;
}

function saveToken(token: string): void {
  store()?.setItem(TOKEN_KEY, token);
}

function clearToken(): void {
  store()?.removeItem(TOKEN_KEY);
  if (typeof window !== "undefined")
    window.dispatchEvent(new Event("sf:auth-expired")); // UserContext listens for this
}

// Carries HTTP status so callers can branch on 429 vs other errors without string-matching
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
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

  let response: Response;
  let data: Record<string, unknown>;

  try {
    response = await fetch(`${BASE_URL}${path}`, { ...options, headers });
    data = await response.json();
  } catch {
    throw new ApiError(0, "Connection error, try again");
  }

  if (typeof data.token === "string") {
    saveToken(data.token);
  }

  if (!response.ok) {
    const msg =
      (data.error as string) ||
      (data.message as string) ||
      `HTTP ${response.status}`;
    if (response.status === 401) clearToken(); // clears token + fires sf:auth-expired
    throw new ApiError(response.status, msg);
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

// ── Helpers ───────────────────────────────────────────────────────────────────

/** USDT values contain at most one decimal place. */
export function usdtToNum(value: string | number | undefined | null): number {
  if (value === undefined || value === null || value === "" || value === "0") return 0;
  const n = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(n)) return 0;
  return Math.round(n * 10) / 10;
}

export function formatUsdt(value: string | number | undefined | null): string {
  if (value === undefined || value === null || value === "" || value === "0") return "0";
  const amount = usdtToNum(value);
  return amount.toFixed(1).replace(/\.0$/, "");
}

// ── Shared types ──────────────────────────────────────────────────────────────

export interface BoardCell {
  id: number;
  openedBy: string | null;
  value?: string; // at most one decimal place — absent for closed cells
}

export interface Match {
  matchId: string;
  status: "waiting" | "active" | "finished";
  players: string[];
  bid: string;
  fee: string;
  total: string;
  currentTurn: string | null;
  balances: { [playerId: string]: string };
  turnStartedAt: number; // Unix ms, reset by backend on every move
  boardHash: string | null;
  lastMoveId: string | null;
  board: BoardCell[];
}

export interface AuthResponse {
  token: string;
  player: {
    playerId: string;
    games: number;
    wins: number;
    points: number;
    balance: string;
    inviteCode: string | null;
    inviteLink: string | null;
    referrerId: string | null;
  };
}

export interface CancelResponse {
  message: string;
  refunded: boolean;
  token: string;
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

export interface MeResponse {
  token: string;
  player: {
    playerId: string;
    points: number;
    balance: string;
  };
}

export interface ClaimPointsResponse {
  message: string;
  points: number;
  isFirstLogin: boolean;
}

export interface FaucetResponse {
  message: string;
  balance: string;
  points?: number;
  isFirstLogin: boolean;
}

export interface LeaderboardPlayer {
  rank: number;
  playerId: string;
  points: number;
  games: number;
  wins: number;
}

export interface LeaderboardResponse {
  players: LeaderboardPlayer[];
  total: number;
  page: number;
  limit: number;
  myRank: LeaderboardPlayer & { rank: number | null } | null;
}
