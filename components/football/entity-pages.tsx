"use client";
import { useState, type ReactNode } from "react";
import { CalendarDays, Flag, MapPin, Trophy, ChevronLeft } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import type { Match, Standing, LeagueData, SeasonData, TeamData } from "@/lib/football/types";
import { isLive, isFinished, liveMinute, leagueName, countryName } from "@/lib/football/types";
import { clock, dayLabel, useFootball } from "@/lib/football/client";
import { Emblem, FavoriteButton, MatchRow, LoadingRows, EmptyState, CoverageNote } from "./ui";
import { TeamName } from "./team-name";
import { UnderlineTabs } from "./underline-tabs";
import { Tournament, type DetailProps, type Panel } from "./details";

type Outcome = "W" | "D" | "L";
type Sport = "Soccer" | "Basketball" | undefined;
const outcomeLabel: Record<Outcome, string> = { W: "ניצחון", D: "תיקו", L: "הפסד" };
const outcomeLetter: Record<Outcome, string> = { W: "נ", D: "ת", L: "ה" };
const byKickoff = (a: Match, b: Match) => a.kickoff.localeCompare(b.kickoff);
const parseForm = (form: string) => [...form.toUpperCase()].filter((c): c is Outcome => c === "W" || c === "D" || c === "L").slice(-5);
const roundLabel = (m: Match) => m.group || (/^\d+$/.test(m.round) ? `מחזור ${m.round}` : m.round);
const monthLabel = (month: string) => new Intl.DateTimeFormat("he-IL", { month: "long", year: "numeric" }).format(new Date(`${month}-15T12:00:00Z`));
const matchOpener = (open: (p: Panel) => void) => (m: Match) => open({ kind: "match", id: m.id, name: `${m.home} – ${m.away}`, match: m, sport: m.sport === "Basketball" ? "Basketball" : "Soccer" });

function outcomeFor(m: Match, teamId: string): Outcome | null {
  if (m.homeScore == null || m.awayScore == null) return null;
  const home = Number(m.homeScore), away = Number(m.awayScore);
  if (Number.isNaN(home) || Number.isNaN(away)) return null;
  const mine = m.homeId === teamId ? home : away, theirs = m.homeId === teamId ? away : home;
  return mine > theirs ? "W" : mine < theirs ? "L" : "D";
}

function groupBy(matches: Match[], key: (m: Match) => string): [string, Match[]][] {
  const groups: [string, Match[]][] = [];
  for (const m of matches) {
    const k = key(m), last = groups[groups.length - 1];
    if (last && last[0] === k) last[1].push(m); else groups.push([k, [m]]);
  }
  return groups;
}

function FormChips({ results }: { results: Outcome[] }) {
  return <span className="ed-form">{results.map((r, i) => <i key={i} className={r} title={outcomeLabel[r]}>{outcomeLetter[r]}</i>)}</span>;
}

function EntityHero({ kind, id, name, badge, title, action, children }: { kind: "team" | "league"; id: string; name: string; badge?: string; title: ReactNode; action: ReactNode; children?: ReactNode }) {
  return <header className="ed-hero" data-kind={kind}>
    <span className="ed-hero-glow" aria-hidden="true"><Emblem name={name} id={id} src={badge} kind={kind} large/></span>
    <span className="ed-hero-mark" aria-hidden="true"><Emblem name={name} id={id} src={badge} kind={kind} large/></span>
    <Emblem name={name} id={id} src={badge} kind={kind} large/>
    <div className="ed-hero-copy"><h2>{title}</h2>{children && <div className="ed-hero-meta">{children}</div>}</div>
    {action}
  </header>;
}

function MatchList({ matches, open }: { matches: Match[]; open: (m: Match) => void }) {
  return <div className="ed-list">{matches.map(m => <MatchRow key={m.id} match={m} showDate open={open}/>)}</div>;
}

function StandingsTable({ rows, highlight, open, sport }: { rows: Standing[]; highlight?: string; open: (p: Panel) => void; sport: Sport }) {
  const showDraws = rows.some(r => Number(r.draws) > 0), showForm = rows.some(r => r.form);
  return <table className="ed-table">
    <thead><tr><th>#</th><th>קבוצה</th><th title="משחקים">מש׳</th><th title="ניצחונות">נ׳</th>{showDraws && <th title="תיקו">ת׳</th>}<th title="הפסדים">ה׳</th><th title="הפרש">+/-</th><th title="נקודות">נק׳</th>{showForm && <th>כושר</th>}</tr></thead>
    <tbody>{rows.map((r, i) => <tr key={r.id || i} className={r.id && r.id === highlight ? "mine" : ""}>
      <td>{r.rank || i + 1}</td>
      <td className="team"><button type="button" className="ed-team" onClick={() => r.id && open({ kind: "team", id: r.id, name: r.name, sport })}><Emblem name={r.name} id={r.id} src={r.badge} small/><TeamName value={r.name}/></button></td>
      <td>{r.played}</td><td>{r.wins}</td>{showDraws && <td>{r.draws}</td>}<td>{r.losses}</td><td dir="ltr">{r.difference}</td><td className="pts">{r.points}</td>
      {showForm && <td><FormChips results={parseForm(r.form)}/></td>}
    </tr>)}</tbody>
  </table>;
}

function NextMatch({ match: m, open }: { match: Match; open: (m: Match) => void }) {
  const live = isLive(m.status);
  return <button type="button" className={`ed-next ${live ? "live" : ""}`} onClick={() => open(m)}>
    <span className="ed-next-team"><Emblem name={m.home} id={m.homeId} src={m.homeBadge} large/><TeamName value={m.home}/></span>
    <span className="ed-next-center">{live
      ? <><b className="ed-live">LIVE</b><strong dir="rtl">{m.homeScore ?? "–"} : {m.awayScore ?? "–"}</strong><small>{liveMinute(m)}</small></>
      : <><small>{m.date ? dayLabel(m.date, true) : "מועד יפורסם"}</small><strong>{clock(m.kickoff)}</strong><small>{leagueName(m.league)}</small></>}</span>
    <span className="ed-next-team"><Emblem name={m.away} id={m.awayId} src={m.awayBadge} large/><TeamName value={m.away}/></span>
  </button>;
}

function TeamTable({ leagueId, teamId, open, sport }: { leagueId: string; teamId: string; open: (p: Panel) => void; sport: Sport }) {
  const info = useFootball<LeagueData>({ view: "league", id: leagueId });
  const season = info.data?.league.season || info.data?.seasons[0] || "";
  const table = useFootball<SeasonData>(season ? { view: "season", id: leagueId, season } : null);
  if (info.loading || table.loading) return <LoadingRows/>;
  if (info.error || table.error) return <EmptyState title="הטבלה לא נטענה" error description={info.error || table.error} retry={info.error ? info.retry : table.retry}/>;
  return table.data?.rows.length ? <StandingsTable rows={table.data.rows} highlight={teamId} open={open} sport={sport}/> : <EmptyState title="אין טבלה זמינה לליגה הזו"/>;
}

export function TeamDetail({ panel, open, has, toggle }: DetailProps) {
  const resource = useFootball<TeamData>({ view: "team", id: panel.id });
  const [tab, setTab] = useState(panel.history ? "history" : "matches");
  const [openedAt] = useState(() => Date.now());
  const data = resource.data, name = data?.name || panel.name, basketball = panel.sport === "Basketball";
  const openGame = matchOpener(open);
  const openLeague = () => data?.leagueId && open({ kind: "league", id: data.leagueId, name: leagueName(data.league), sport: panel.sport });
  const matches = data?.matches || [];
  const past = matches.filter(m => isFinished(m.status)).sort(byKickoff).reverse();
  const upcoming = matches.filter(m => !isFinished(m.status) && m.status !== "CANC" && (isLive(m.status) || !m.kickoff || Date.parse(m.kickoff) > openedAt - 3 * 3600000)).sort(byKickoff);
  const results = past.map(m => outcomeFor(m, panel.id)).filter((r): r is Outcome => r !== null);
  const count = (o: Outcome) => results.filter(r => r === o).length;
  const scored = past.reduce((sum, m) => sum + (Number(m.homeId === panel.id ? m.homeScore : m.awayScore) || 0), 0);
  const conceded = past.reduce((sum, m) => sum + (Number(m.homeId === panel.id ? m.awayScore : m.homeScore) || 0), 0);
  const tabs = [{ id: "matches", label: "משחקים", count: upcoming.length || undefined }, { id: "history", label: "היסטוריה", count: past.length || undefined }, ...(data?.leagueId ? [{ id: "table", label: "טבלה" }] : [])];
  const body = resource.loading ? <LoadingRows/> : resource.error ? <EmptyState title="פרטי הקבוצה לא נטענו" description={resource.error} error retry={resource.retry}/> : tab === "table" && data?.leagueId ? <>
    <TeamTable leagueId={data.leagueId} teamId={panel.id} open={open} sport={panel.sport}/>
    <button type="button" className="ed-link" onClick={openLeague}>לעמוד {leagueName(data.league)}<ChevronLeft size={15}/></button>
  </> : tab === "history" ? <>
    {past.length > 0 && <div className="ed-summary">
      <div><b>{past.length}</b><span>משחקים</span></div>
      <div className="win"><b>{count("W")}</b><span>ניצחונות</span></div>
      {!basketball && <div className="draw"><b>{count("D")}</b><span>תיקו</span></div>}
      <div className="loss"><b>{count("L")}</b><span>הפסדים</span></div>
      <div><b dir="ltr">{scored}–{conceded}</b><span>{basketball ? "נקודות" : "שערים"}</span></div>
    </div>}
    {groupBy(past, m => m.date.slice(0, 7)).map(([month, games]) => <section className="ed-section" key={month}>
      <h3 className="ed-heading">{month ? monthLabel(month) : "ללא תאריך"}<FormChips results={games.map(m => outcomeFor(m, panel.id)).filter((r): r is Outcome => r !== null).reverse()}/></h3>
      <MatchList matches={games} open={openGame}/>
    </section>)}
    {!past.length && <EmptyState title="אין תוצאות קודמות במקור הנתונים"/>}
  </> : <>
    <section className="ed-section">
      <h3 className="ed-heading">{upcoming[0] && isLive(upcoming[0].status) ? "משחק חי" : "המשחק הבא"}</h3>
      {upcoming[0] ? <NextMatch match={upcoming[0]} open={openGame}/> : <EmptyState title="טרם פורסם המשחק הבא"/>}
    </section>
    {upcoming.length > 1 && <section className="ed-section"><h3 className="ed-heading">בהמשך<small>{upcoming.length - 1} משחקים</small></h3><MatchList matches={upcoming.slice(1, 6)} open={openGame}/></section>}
    <section className="ed-section">
      <h3 className="ed-heading">משחקים אחרונים{results.length > 0 && <FormChips results={results.slice(0, 5).reverse()}/>}</h3>
      {past.length ? <MatchList matches={past.slice(0, 5)} open={openGame}/> : <EmptyState title="אין משחקים אחרונים זמינים"/>}
    </section>
  </>;
  return <div className="ed-page">
    <EntityHero kind="team" id={panel.id} name={name} badge={data?.badge} title={<TeamName value={name}/>} action={<FavoriteButton item={{ kind: "team", id: panel.id, name, sport: panel.sport }} saved={has("team", panel.id)} toggle={toggle}/>}>
      {data?.country && <span><Flag size={14}/>{countryName(data.country)}</span>}
      {data?.league && <button type="button" onClick={openLeague}><Trophy size={14}/>{leagueName(data.league)}</button>}
      {data?.venue && <span><MapPin size={14}/>{data.venue}</span>}
    </EntityHero>
    <UnderlineTabs tabs={tabs} value={tab} onChange={setTab} label="פרטי הקבוצה"/>
    <div key={tab} className="ed-panel" role="tabpanel">
      {body}
      {data?.limited && <CoverageNote>מוצגים המשחקים הזמינים בחיבור הציבורי; זו אינה היסטוריה מלאה.</CoverageNote>}
      {data?.partial && <CoverageNote>חלק מפרטי הקבוצה לא נטענו.</CoverageNote>}
    </div>
  </div>;
}

export function LeagueDetail({ panel, open, has, toggle }: DetailProps) {
  const info = useFootball<LeagueData>({ view: "league", id: panel.id });
  const [selected, setSelected] = useState("");
  const [tab, setTab] = useState("table");
  const [phase, setPhase] = useState<"" | "upcoming" | "results">("");
  const [pageSize, setPageSize] = useState(40);
  const league = info.data?.league, name = league?.name || panel.name;
  const season = selected || league?.season || info.data?.seasons[0] || "";
  const seasons = [...new Set([league?.season, ...(info.data?.seasons || [])].filter(Boolean) as string[])].sort().reverse();
  const data = useFootball<SeasonData>(season ? { view: "season", id: panel.id, season } : null);
  const rows = data.data?.rows || [], all = data.data?.matches || [];
  const upcoming = all.filter(m => !isFinished(m.status)), results = all.filter(m => isFinished(m.status)).reverse();
  const activePhase = phase || (upcoming.length ? "upcoming" : "results");
  const list = activePhase === "upcoming" ? upcoming : results;
  const knockout = !rows.length || all.some(m => Number(m.round) >= 100 || /\D/.test(m.round));
  const tabs = [{ id: "table", label: "טבלה", count: rows.length || undefined }, { id: "matches", label: "משחקים", count: all.length || undefined }, ...(knockout ? [{ id: "bracket", label: "שלבי הכרעה" }] : [])];
  const activeTab = tabs.some(t => t.id === tab) ? tab : "table";
  const chooseSeason = (value: string) => { setSelected(value); setPageSize(40); setPhase(""); };
  const body = info.loading ? <LoadingRows/> : info.error ? <EmptyState title="לא ניתן לטעון את התחרות" description={info.error} error retry={info.retry}/> : !season ? <EmptyState title="אין עונות זמינות לתחרות"/> : data.loading ? <LoadingRows/> : data.error ? <EmptyState title="נתוני העונה אינם זמינים" error description={data.error} retry={data.retry}/> : !data.data ? null : activeTab === "table" ? (
    rows.length ? <StandingsTable rows={rows} open={open} sport={panel.sport}/> : <EmptyState title={data.data.tableError ? "הטבלה לא נטענה" : "אין טבלה זמינה לעונה הזו"} description="בתחרויות גביע אפשר לעקוב אחרי השלבים בלשונית המשחקים." retry={data.data.tableError ? data.retry : undefined}/>
  ) : activeTab === "matches" ? (all.length ? <>
    <div className="ed-segment" role="group" aria-label="סינון משחקים">
      <button type="button" className={activePhase === "upcoming" ? "active" : ""} aria-pressed={activePhase === "upcoming"} onClick={() => { setPhase("upcoming"); setPageSize(40); }}>קרובים<small>{upcoming.length}</small></button>
      <button type="button" className={activePhase === "results" ? "active" : ""} aria-pressed={activePhase === "results"} onClick={() => { setPhase("results"); setPageSize(40); }}>תוצאות<small>{results.length}</small></button>
    </div>
    {groupBy(list.slice(0, pageSize), roundLabel).map(([round, games], i) => <section className="ed-section" key={`${round}-${i}`}>
      {round && <h3 className="ed-heading">{round}</h3>}
      <MatchList matches={games} open={matchOpener(open)}/>
    </section>)}
    {!list.length && <EmptyState title={activePhase === "upcoming" ? "אין משחקים קרובים בעונה הזו" : "עדיין אין תוצאות בעונה הזו"}/>}
    {list.length > pageSize && <button type="button" className="ed-more" onClick={() => setPageSize(p => p + 40)}>הצג משחקים נוספים</button>}
  </> : <EmptyState title={data.data.matchesError ? "רשימת המשחקים לא נטענה" : "אין משחקים זמינים לעונה הזו"} retry={data.data.matchesError ? data.retry : undefined}/>) : <Tournament matches={all} open={open}/>;
  return <div className="ed-page">
    <EntityHero kind="league" id={panel.id} name={name} badge={league?.badge} title={leagueName(name)} action={<FavoriteButton item={{ kind: "league", id: panel.id, name: panel.name, sport: panel.sport }} saved={has("league", panel.id)} toggle={toggle}/>}>
      {league?.country && <span><Flag size={14}/>{countryName(league.country)}</span>}
      {seasons.length > 0 && <span><CalendarDays size={14}/><Select value={season} onValueChange={chooseSeason} dir="rtl"><SelectTrigger className="ed-season" aria-label="בחירת עונה"><SelectValue/></SelectTrigger><SelectContent className="competition-season-menu">{seasons.map(s => <SelectItem value={s} key={s}>עונת {s}</SelectItem>)}</SelectContent></Select></span>}
      {rows.length > 0 && <span>{rows.length} קבוצות</span>}
    </EntityHero>
    <UnderlineTabs tabs={tabs} value={activeTab} onChange={setTab} label="פרטי הליגה"/>
    <div key={activeTab} className="ed-panel" role="tabpanel">
      {body}
      {data.data?.limited && <CoverageNote/>}
    </div>
  </div>;
}
