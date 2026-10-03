export type MatchCards = { homeYellow:number|null; awayYellow:number|null; homeRed:number|null; awayRed:number|null };
export type Match = { sport?:string; cards?:MatchCards; homeBadge?: string; awayBadge?: string; leagueBadge?: string; apiFootballId?: string; id: string; leagueId: string; league: string; country: string; home: string; away: string; homeId: string; awayId: string; homeScore: string | null; awayScore: string | null; penaltyHome?: string | null; penaltyAway?: string | null; kickoff: string; date: string; status: string; progress: string; round: string; group: string; venue: string; season: string };
export type League = { sport?:string; badge?: string; id: string; name: string; country: string; season?: string; format?: string };
export type Standing = { badge?: string; id: string; name: string; rank: number; played: string; wins: string; draws: string; losses: string; difference: string; points: string; form: string };
export type Favorite = { sport?:"Soccer"|"Basketball"; id: string; name: string; kind: "league" | "team" | "match"; leagueId?: string; homeId?: string; awayId?: string };
export type LiveState = "connected" | "unconfigured" | "unavailable";
export type DayData = { partial?: boolean; matches: Match[]; limited: boolean; liveState: LiveState; fetchedAt: string };
export type LeagueData = { league: League; seasons: string[]; limited: boolean };
export type SeasonData = { rows: Standing[]; matches: Match[]; limited: boolean; tableError: boolean; matchesError: boolean; tableSeason: string };
export type TeamData = { badge?: string; name: string; country: string; venue: string; leagueId: string; league: string; season?: string; matches: Match[]; limited: boolean; partial: boolean };
export type EventData = { match: Match; lineup: { id: string; name: string; home: boolean; substitute: boolean; position: string; number: string }[]; stats: { name: string; home: string; away: string }[]; timeline: { id: string; minute: string; kind: string; detail: string; player: string; team: string; home: boolean }[]; limited: boolean; unavailable: string[]; supplementedBy?: string };
export type AlertItem = { sport?:"Soccer"|"Basketball"; id: string; matchId: string; title: string; body: string; at: string; read: boolean };
export type AlertSettings = { goals: boolean; kickoff: boolean; fulltime: boolean; desktop: boolean; quiet?: boolean; quietFrom?: string; quietTo?: string };
export const isLive = (s: string) => /^(1H|2H|HT|ET|P|LIVE|In Progress|Halftime|BT|Q[1-4]|OT|Half)$/i.test(s);
export const isFinished = (s: string) => /^(FT|AET|AOT|PEN|AWD|Finished|Match Finished|After Penalties|After Extra Time)$/i.test(s);
export const statusText = (s: string) => ({ NS: "טרם התחיל", "Not Started": "טרם התחיל", FT: "הסתיים", Q1: "רבע ראשון", Q2: "רבע שני", Q3: "רבע שלישי", Q4: "רבע רביעי", OT: "הארכה", "Match Finished": "הסתיים", HT: "מחצית", "1H": "מחצית ראשונה", "2H": "מחצית שנייה", ET: "הארכה", AET: "לאחר הארכה", AOT: "לאחר הארכה", AWD: "ניצחון טכני", PEN: "הסתיים בפנדלים", P: "פנדלים", PST: "נדחה", CANC: "בוטל", ABD: "הופסק", SUSP: "הושהה", INT: "הופסק זמנית", BT: "הפסקה", LIVE: "בשידור חי" }[s] || s);
export function follows(m: Match, favorites: Favorite[]) { return favorites.some(f => f.kind === "match" ? f.id === m.id : f.kind === "league" ? f.id === m.leagueId : f.id === m.homeId || f.id === m.awayId); }
export { leagueName, countryName, leagueLabels } from "./league-names";

export function liveMinute(m: Pick<Match,"status"|"progress">) { if(/^(HT|Halftime|BT)$/i.test(m.status))return "מחצית"; if(m.status==="P")return "פנדלים"; const raw=m.progress.trim().replace(/[’′']/g,""); if(/^\d{1,3}(?:\+\d{1,2})?$/.test(raw))return `${raw}′`; if(/^\d{1,3}:\d{2}$/.test(raw))return raw; return statusText(m.status); }
