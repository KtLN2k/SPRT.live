import { hebrewTeam } from "./names";
import type { Match, League, Standing } from "./types";
const root = "https://www.thesportsdb.com/api";
type RecordData = Record<string, unknown>;
export const text = (v: unknown): string => v == null ? "" : String(v);
export const array = (data: unknown, ...keys: string[]): RecordData[] => {
  if (!data || typeof data !== "object") return [];
  for (const k of keys) { const value = (data as RecordData)[k]; if (Array.isArray(value)) return value.filter(v => v && typeof v === "object") as RecordData[]; }
  return [];
};
export const configured = () => Boolean(process.env.THESPORTSDB_API_KEY?.trim());
// Cache only settled JSON. In-flight I/O must never be shared between Worker request contexts.
const memory = new Map<string, { expires: number; data: unknown; at: string }>();
export async function provider(path: string, ttl = 300, premium = false): Promise<{ data: unknown; at: string }> {
  const key = process.env.THESPORTSDB_API_KEY?.trim();
  if (premium && !key) throw new Error("Premium connection required");
  const cacheId = `${key ? "premium" : "free"}:${premium ? "v2" : "v1"}:${path}`;
  const cached = memory.get(cacheId);
  if (cached && cached.expires > Date.now()) return cached;
  const job = (async () => {
    const url = premium ? `${root}/v2/json/${path}` : `${root}/v1/json/${encodeURIComponent(key || "123")}/${path}`;
    const response = await fetch(url, { headers: premium && key ? { "X-API-KEY": key } : {}, signal: AbortSignal.timeout(14000) });
    if (!response.ok) throw new Error(`Football provider HTTP ${response.status}`);
    const data: unknown = await response.json();
    if (!data || typeof data !== "object" || "error" in data) throw new Error("Invalid provider response");
    const result = { data, at: new Date().toISOString(), expires: Date.now() + ttl * 1000 };
    if (memory.size >= 1200) memory.delete(memory.keys().next().value!);
    memory.set(cacheId, result);
    return result;
  })();
  try { return await job; } catch(error) {
    const message=error instanceof Error?error.message:"Unknown provider failure";
    console.error("football_provider_failure", {endpoint:path.split("?")[0],version:premium?2:1,message:message.replace(/https?:\/\/[^\s]+/g,"[provider-url]").replaceAll(key||"__no_key__","[secret]")});
    throw error;
  }
}
export function kickoff(m: RecordData) {
  const stamp = text(m.strTimestamp);
  if (stamp) return /(?:Z|[+-]\d\d:\d\d)$/.test(stamp) ? stamp : `${stamp}Z`;
  const date = text(m.dateEvent), time = text(m.strTime);
  if (!date || !time) return "";
  return `${date}T${time}${/(?:Z|[+-]\d\d:\d\d)$/.test(time) ? "" : "Z"}`;
}
export function normalizeMatch(m: RecordData): Match {
  return { sport:text(m.strSport), homeBadge: text(m.strHomeTeamBadge), awayBadge: text(m.strAwayTeamBadge), leagueBadge: text(m.strLeagueBadge), apiFootballId:text(m.idAPIfootball || m.idApiFootball), id: text(m.idEvent), leagueId: text(m.idLeague), league: text(m.strLeague), country: text(m.strCountry), home: hebrewTeam(text(m.strHomeTeam)), away: hebrewTeam(text(m.strAwayTeam)), homeId: text(m.idHomeTeam), awayId: text(m.idAwayTeam), homeScore: m.intHomeScore == null || m.intHomeScore === "" ? null : text(m.intHomeScore), awayScore: m.intAwayScore == null || m.intAwayScore === "" ? null : text(m.intAwayScore), penaltyHome: m.intHomeScorePenalties == null && m.intHomeScorePenalty == null ? null : text(m.intHomeScorePenalties ?? m.intHomeScorePenalty), penaltyAway: m.intAwayScorePenalties == null && m.intAwayScorePenalty == null ? null : text(m.intAwayScorePenalties ?? m.intAwayScorePenalty), kickoff: kickoff(m), date: text(m.dateEvent), status: text(m.strStatus || "NS"), progress: text(m.strProgress), round: text(m.intRound), group: text(m.strGroup), venue: text(m.strVenue), season: text(m.strSeason) };
}
export const normalizeLeague = (l: RecordData): League => ({ sport:text(l.strSport), badge: text(l.strBadge), id: text(l.idLeague), name: text(l.strLeague), country: text(l.strCountry), season: text(l.strCurrentSeason), format: text(l.strLeagueType || l.strSport) });
export const normalizeStanding = (r: RecordData): Standing => ({ badge: text(r.strBadge || r.strTeamBadge), id: text(r.idTeam), name: hebrewTeam(text(r.strTeam)), rank: Number(r.intRank) || 0, played: text(r.intPlayed), wins: text(r.intWin), draws: text(r.intDraw), losses: text(r.intLoss), difference: text(r.intGoalDifference), points: text(r.intPoints), form: text(r.strForm) });
export function uniqueMatches(rows: RecordData[]) { return [...new Map(rows.map(normalizeMatch).filter(m => m.id && m.home && m.away).map(m => [m.id, m])).values()].sort((a, b) => a.kickoff.localeCompare(b.kickoff)); }
export function localDate(timestamp: string, tz: string): string { try { return new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(timestamp)); } catch { return ""; } }
export function mergeLive(base: Match[], updates: Match[], date: string, tz: string): Match[] {
  const all = new Map(base.map(m => [m.id, m]));
  for (const update of updates) {
    const existing = all.get(update.id);
    if (!existing && localDate(update.kickoff, tz) !== date) continue;
    // Live records can omit descriptive fields. Retain known schedule values.
    const merged = { ...existing, ...Object.fromEntries(Object.entries(update).filter(([, value]) => value !== "" && value != null)) } as Match;
    if (!existing && (!merged.id || !merged.home || !merged.away)) continue;
    all.set(update.id, merged);
  }
  return [...all.values()].sort((a, b) => a.kickoff.localeCompare(b.kickoff));
}
