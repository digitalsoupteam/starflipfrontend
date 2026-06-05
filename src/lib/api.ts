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

/** Float for arithmetic — loses precision beyond ~9 ETH but that's acceptable here */
export function weiToNum(wei: string | number | undefined | null): number {
  if (wei === undefined || wei === null || wei === "" || wei === "0") return 0;
  const n = typeof wei === "number" ? wei : Number(wei);
  if (Number.isNaN(n)) return 0;
  return n / 1e18;
}

/** BigInt arithmetic avoids float precision issues; shows up to 4 significant decimals */
export function weiToEth(wei: string | number | undefined | null): string {
  if (wei === undefined || wei === null || wei === "" || wei === "0") return "0.0";
  const WEI_PER_ETH = BigInt("1000000000000000000");
  const weiBI = BigInt(wei);
  const whole = weiBI / WEI_PER_ETH;
  const remainder = weiBI % WEI_PER_ETH;
  const decimals = remainder.toString().padStart(18, "0").slice(0, 4).replace(/0+$/, "") || "0";
  return `${whole}.${decimals}`;
}

// ── Shared types ──────────────────────────────────────────────────────────────

export interface BoardCell {
  id: number;
  openedBy: string | null;
  value?: string; // WEI string — absent for closed cells
}

export interface Match {
  matchId: string;
  status: "waiting" | "active" | "finished";
  players: string[];
  currentTurn: string | null;
  balances: { [playerId: string]: number };
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
