"use client";
import { useMemo, useState, type ReactNode } from "react";
import { ChevronLeft, Shield, Swords, Home, Plane, Flame, Lock, Trophy, TrendingUp } from "lucide-react";
import type { League, LeagueData, Match, SeasonData, Standing } from "@/lib/football/types";
import { isFinished, leagueName } from "@/lib/football/types";
import { dayLabel, useFootball } from "@/lib/football/client";
import { TABLE_GROUPS, TOP_LEAGUES } from "@/lib/football/competition-order";
import { Emblem } from "./ui";
import { TeamName } from "./team-name";
import { LeaguePicker } from "./league-picker";
import type { Panel } from "./details";

type Sport = "Soccer" | "Basketball";
type Split = { p: number; w: number; d: number; l: number; gf: number; ga: number };
type Game = { match: Match; home: boolean; gf: number; ga: number; result: "W" | "D" | "L"; opponent: string; opponentId: string; opponentBadge?: string };
type TeamStats = { id: string; all: Split; home: Split; away: Split; clean: number; blank: number; games: Game[]; form: number };

const empty = (): Split => ({ p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0 });
const points = (s: Split, basketball: boolean) => basketball ? s.w : s.w * 3 + s.d;
const perGame = (value: number, games: number) => games ? (value / games).toFixed(games < 10 ? 1 : 2) : "0";
const letter = { W: "נ", D: "ת", L: "ה" } as const;

function seasonStats(matches: Match[]) {
  const map = new Map<string, TeamStats>();
  const get = (id: string) => { let s = map.get(id); if (!s) { s = { id, all: empty(), home: empty(), away: empty(), clean: 0, blank: 0, games: [], form: 0 }; map.set(id, s); } return s; };
  const done = matches.filter(m => isFinished(m.status) && m.homeScore != null && m.awayScore != null && m.homeId && m.awayId).sort((a, b) => a.kickoff.localeCompare(b.kickoff));
  for (const m of done) {
    const hs = Number(m.homeScore), as = Number(m.awayScore);
    if (Number.isNaN(hs) || Number.isNaN(as)) continue;
    for (const home of [true, false]) {
      const s = get(home ? m.homeId : m.awayId), gf = home ? hs : as, ga = home ? as : hs;
      const result = gf > ga ? "W" : gf < ga ? "L" : "D";
      for (const split of [s.all, home ? s.home : s.away]) { split.p++; split.gf += gf; split.ga += ga; split[result === "W" ? "w" : result === "D" ? "d" : "l"]++; }
      if (ga === 0) s.clean++;
      if (gf === 0) s.blank++;
      s.games.push({ match: m, home, gf, ga, result, opponent: home ? m.away : m.home, opponentId: home ? m.awayId : m.homeId, opponentBadge: home ? m.awayBadge : m.homeBadge });
    }
  }
  for (const s of map.values()) s.form = s.games.slice(-5).reduce((sum, g) => sum + (g.result === "W" ? 3 : g.result === "D" ? 1 : 0), 0);
  return map;
}

function PointsChart({ team, leader, basketball }: { team: TeamStats; leader?: TeamStats; basketball: boolean }) {
  const series = (s: TeamStats) => s.games.reduce<number[]>((acc, g) => [...acc, (acc.at(-1) || 0) + (basketball ? Number(g.result === "W") : g.result === "W" ? 3 : g.result === "D" ? 1 : 0)], [0]);
  const mine = series(team), top = leader && leader.id !== team.id ? series(leader) : null;
  const n = Math.max(mine.length, top?.length || 0) - 1, max = Math.max(...mine, ...(top || []), 3);
  const W = 640, H = 220, pad = 28;
  const x = (i: number) => pad + (n ? i / n : 0) * (W - pad * 2), y = (v: number) => H - pad - (v / max) * (H - pad * 2);
  const path = (s: number[]) => s.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join("");
  const ticks = [0, Math.round(max / 2), max];
  return <svg className="st-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="התקדמות הנקודות לאורך העונה">
    <defs><linearGradient id="st-area" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#2fe68c" stopOpacity=".35"/><stop offset="1" stopColor="#2fe68c" stopOpacity="0"/></linearGradient></defs>
    {ticks.map(t => <g key={t}><line x1={pad} x2={W - pad} y1={y(t)} y2={y(t)} className="st-grid"/><text x={W - pad + 6} y={y(t) + 4} className="st-tick">{t}</text></g>)}
    {top && <path d={path(top)} className="st-line-leader"/>}
    <path d={`${path(mine)}L${x(mine.length - 1)},${y(0)}L${x(0)},${y(0)}Z`} fill="url(#st-area)"/>
    <path d={path(mine)} className="st-line"/>
    {mine.map((v, i) => i > 0 && <circle key={i} cx={x(i)} cy={y(v)} r="3.5" className={`st-dot ${team.games[i - 1].result}`}><title>{`מחזור ${i}: ${v} ${basketball ? "ניצחונות" : "נק׳"}`}</title></circle>)}
  </svg>;
}

function GoalsChart({ games, basketball }: { games: Game[]; basketball: boolean }) {
  const max = Math.max(...games.flatMap(g => [g.gf, g.ga]), 1);
  return <div className="st-goals" style={{ gridTemplateColumns: `repeat(${games.length},minmax(0,1fr))` }}>
    {games.map((g, i) => <div key={i} className="st-goal-col" title={`${g.home ? "בית" : "חוץ"} מול ${g.opponent} · ${g.gf}:${g.ga}`}>
      <span className="for" style={{ height: `${(g.gf / max) * 100}%` }}/>
      <span className="against" style={{ height: `${(g.ga / max) * 100}%` }}/>
    </div>)}
    <small className="st-goals-legend"><i className="for"/>{basketball ? "נקודות זכות" : "שערי זכות"}<i className="against"/>{basketball ? "נקודות חובה" : "שערי חובה"}</small>
  </div>;
}

function ResultsRing({ s, basketball }: { s: Split; basketball: boolean }) {
  const total = s.p || 1, r = 52, c = 2 * Math.PI * r;
  const parts = [{ key: "W", v: s.w, label: "ניצחונות" }, ...(basketball ? [] : [{ key: "D", v: s.d, label: "תיקו" }]), { key: "L", v: s.l, label: "הפסדים" }];
  let offset = 0;
  return <div className="st-ring">
    <svg viewBox="0 0 140 140" aria-hidden="true"><circle cx="70" cy="70" r={r} className="st-ring-base"/>{parts.map(p => { const len = (p.v / total) * c, el = <circle key={p.key} cx="70" cy="70" r={r} className={`st-ring-part ${p.key}`} strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offset}/>; offset += len; return el; })}</svg>
    <div className="st-ring-center"><b>{Math.round((s.w / total) * 100)}%</b><small>ניצחונות</small></div>
    <ul>{parts.map(p => <li key={p.key} className={p.key}><i/>{p.label}<b>{p.v}</b></li>)}</ul>
  </div>;
}

function Compare({ label, home, away, better = "high" }: { label: string; home: number; away: number; better?: "high" | "low" }) {
  const total = home + away || 1, homeWins = better === "high" ? home > away : home < away, awayWins = better === "high" ? away > home : away < home;
  return <div className="st-compare">
    <b className={homeWins ? "lead" : ""}>{Number.isInteger(home) ? home : home.toFixed(2)}</b>
    <div className="st-compare-bars"><span className="home" style={{ width: `${(home / total) * 100}%` }}/><span className="away" style={{ width: `${(away / total) * 100}%` }}/></div>
    <b className={awayWins ? "lead" : ""}>{Number.isInteger(away) ? away : away.toFixed(2)}</b>
    <small>{label}</small>
  </div>;
}

function Leaders({ title, icon, rows, value, pick, unit }: { title: string; icon: ReactNode; rows: Standing[]; value: (r: Standing) => number; pick: (id: string) => void; unit: string }) {
  const list = rows.map(r => ({ r, v: value(r) })).filter(x => Number.isFinite(x.v)).slice(0, 5);
  return <section className="st-leaders">
    <h3>{icon}{title}</h3>
    <ol>{list.map(({ r, v }, i) => <li key={r.id}><button type="button" onClick={() => pick(r.id)}><span className="st-leader-rank">{i + 1}</span><Emblem name={r.name} id={r.id} src={r.badge} small/><TeamName value={r.name}/><b>{v}<small>{unit}</small></b></button></li>)}</ol>
  </section>;
}

export function StatsPage({ sport, leagues, openPanel }: { sport: Sport; leagues: League[]; openPanel: (p: Panel) => void }) {
  const basketball = sport === "Basketball";
  const groups = basketball ? [{ label: "ליגות כדורסל", ids: TOP_LEAGUES.Basketball }] : TABLE_GROUPS;
  const [choice, setChoice] = useState({ league: "", team: "" });
  const leagueId = choice.league || groups[0].ids[0];
  const info = useFootball<LeagueData>({ view: "league", id: leagueId });
  const season = info.data?.league.season || info.data?.seasons[0] || "";
  const data = useFootball<SeasonData>(season ? { view: "season", id: leagueId, season } : null);
  const rows = useMemo(() => data.data?.rows || [], [data.data]);
  const stats = useMemo(() => seasonStats(data.data?.matches || []), [data.data]);
  const teamId = rows.some(r => r.id === choice.team) ? choice.team : rows[0]?.id || "";
  const row = rows.find(r => r.id === teamId), team = stats.get(teamId), leader = stats.get(rows[0]?.id || "");
  const leagueLabel = leagueName(info.data?.league.name || leagues.find(l => l.id === leagueId)?.name || "");
  const pickTeam = (id: string) => setChoice(c => ({ ...c, team: id }));
  const openTeam = () => row && openPanel({ kind: "team", id: row.id, name: row.name, sport });
  const unit = basketball ? "נק׳" : "שערים";
  const ranked = (fn: (s: TeamStats) => number, dir: 1 | -1 = -1) => [...rows].filter(r => stats.get(r.id)?.all.p).sort((a, b) => dir * (fn(stats.get(a.id)!) - fn(stats.get(b.id)!)));
  const metric = (fn: (s: TeamStats) => number) => (r: Standing) => fn(stats.get(r.id)!);

  const loading = info.loading || data.loading;
  const failed = info.error || data.error;
  return <div className="st-page">
    <div className="st-toolbar">
      <div><h1><TrendingUp size={22}/>מרכז הסטטיסטיקות</h1><p>כל המספרים של הקבוצה לאורך העונה, מחושבים מכל משחקי הליגה.</p></div>
      <LeaguePicker leagues={leagues} groups={groups} value={leagueId} onChange={id => setChoice({ league: id, team: "" })} className="st-league"/>
    </div>
    {rows.length > 0 && <div className="st-teams" role="listbox" aria-label="בחירת קבוצה">{rows.map(r => <button key={r.id} type="button" role="option" aria-selected={r.id === teamId} className={r.id === teamId ? "active" : ""} onClick={() => pickTeam(r.id)} title={r.name}><Emblem name={r.name} id={r.id} src={r.badge} small/><span>{r.rank}</span></button>)}</div>}
    {loading ? <div className="st-state">טוען את נתוני העונה...</div> : failed ? <div className="st-state">הנתונים לא נטענו כרגע. <button type="button" onClick={info.error ? info.retry : data.retry}>נסה שוב</button></div> : !row ? <div className="st-state">אין טבלה זמינה לליגה הזו בעונה הנוכחית.</div> : <div key={teamId} className="st-body">
      <header className="st-hero">
        <span className="st-hero-glow" aria-hidden="true"><Emblem name={row.name} id={row.id} src={row.badge} large/></span>
        <span className="st-hero-mark" aria-hidden="true"><Emblem name={row.name} id={row.id} src={row.badge} large/></span>
        <Emblem name={row.name} id={row.id} src={row.badge} large/>
        <div className="st-hero-copy">
          <small>{leagueLabel}{season && ` · עונת ${season}`}</small>
          <h2><TeamName value={row.name}/></h2>
          <div className="st-hero-meta">
            <span className="st-rank"><Trophy size={14}/>מקום {row.rank}</span>
            <span>{row.points} נק׳</span>
            {team && <span className="st-form">{team.games.slice(-5).map((g, i) => <i key={i} className={g.result} title={`${g.gf}:${g.ga} מול ${g.opponent}`}>{letter[g.result]}</i>)}</span>}
          </div>
        </div>
        <button type="button" className="st-open" onClick={openTeam}>לעמוד הקבוצה<ChevronLeft size={16}/></button>
      </header>

      {team && team.all.p > 0 ? <>
        <div className="st-kpis">
          <div><small>משחקים</small><b>{team.all.p}</b><span>{team.all.w}–{team.all.d}–{team.all.l}</span></div>
          <div><small>אחוז ניצחונות</small><b>{Math.round((team.all.w / team.all.p) * 100)}%</b><span>{team.all.w} ניצחונות</span></div>
          <div><small>{basketball ? "נקודות למשחק" : "שערים למשחק"}</small><b>{perGame(team.all.gf, team.all.p)}</b><span>{team.all.gf} בסך הכול</span></div>
          <div><small>{basketball ? "ספיגה למשחק" : "ספיגות למשחק"}</small><b>{perGame(team.all.ga, team.all.p)}</b><span>{team.all.ga} בסך הכול</span></div>
          {basketball ? <div><small>הפרש ממוצע</small><b dir="ltr">{(team.all.gf - team.all.ga) / team.all.p > 0 ? "+" : ""}{perGame(team.all.gf - team.all.ga, team.all.p)}</b><span>למשחק</span></div> : <div><small>שערים נקיים</small><b>{team.clean}</b><span>{Math.round((team.clean / team.all.p) * 100)}% מהמשחקים</span></div>}
          <div><small>{basketball ? "ניצחונות ב־5 אחרונים" : "נקודות ב־5 אחרונים"}</small><b>{basketball ? team.games.slice(-5).filter(g => g.result === "W").length : team.form}</b><span>מתוך {basketball ? Math.min(5, team.games.length) : Math.min(5, team.games.length) * 3}</span></div>
        </div>

        <div className="st-grid">
          <section className="st-card st-wide">
            <header><h3>{basketball ? "ניצחונות מצטברים" : "צבירת נקודות"}</h3>{leader && leader.id !== team.id && <small><i className="st-key mine"/>הקבוצה<i className="st-key leader"/>המקום הראשון</small>}</header>
            <PointsChart team={team} leader={leader} basketball={basketball}/>
          </section>
          <section className="st-card">
            <header><h3>מאזן תוצאות</h3></header>
            <ResultsRing s={team.all} basketball={basketball}/>
          </section>
          <section className="st-card st-wide">
            <header><h3>{basketball ? "נקודות בכל משחק" : "שערים בכל משחק"}</h3><small>מהמשחק הראשון לאחרון</small></header>
            <GoalsChart games={team.games} basketball={basketball}/>
          </section>
          <section className="st-card">
            <header><h3>בית מול חוץ</h3><small><Home size={13}/>בית<Plane size={13}/>חוץ</small></header>
            <Compare label={basketball ? "ניצחונות" : "נקודות"} home={points(team.home, basketball)} away={points(team.away, basketball)}/>
            <Compare label={`${unit} זכות`} home={team.home.gf} away={team.away.gf}/>
            <Compare label={`${unit} חובה`} home={team.home.ga} away={team.away.ga} better="low"/>
            <Compare label="ניצחונות" home={team.home.w} away={team.away.w}/>
          </section>
          <section className="st-card st-full">
            <header><h3>משחקים אחרונים</h3><small>{team.games.length} משחקים בעונה</small></header>
            <div className="st-recent">{team.games.slice(-6).reverse().map((g, i) => <button key={i} type="button" className={`st-recent-game ${g.result}`} onClick={() => openPanel({ kind: "match", id: g.match.id, name: `${g.match.home} – ${g.match.away}`, match: g.match, sport })}>
              <i>{letter[g.result]}</i>
              <span className="st-recent-opp"><Emblem name={g.opponent} id={g.opponentId} src={g.opponentBadge} small/><TeamName value={g.opponent}/></span>
              <b className="st-score"><span>{g.gf}</span>:<span>{g.ga}</span></b>
              <small>{g.home ? "בית" : "חוץ"} · {g.match.date ? dayLabel(g.match.date, true) : ""}</small>
            </button>)}</div>
          </section>
        </div>
      </> : <div className="st-state">עדיין אין משחקים שהסתיימו לקבוצה הזו העונה.</div>}

      {stats.size > 0 && <div className="st-leaders-grid">
        <Leaders title="ההתקפה החזקה" icon={<Swords size={16}/>} rows={ranked(s => s.all.gf)} value={metric(s => s.all.gf)} pick={pickTeam} unit={unit}/>
        <Leaders title="ההגנה הטובה" icon={<Shield size={16}/>} rows={ranked(s => s.all.ga, 1)} value={metric(s => s.all.ga)} pick={pickTeam} unit={unit}/>
        {!basketball && <Leaders title="שערים נקיים" icon={<Lock size={16}/>} rows={ranked(s => s.clean)} value={metric(s => s.clean)} pick={pickTeam} unit="משחקים"/>}
        <Leaders title="הבית החזק" icon={<Home size={16}/>} rows={ranked(s => points(s.home, basketball))} value={metric(s => points(s.home, basketball))} pick={pickTeam} unit={basketball ? "נצ׳" : "נק׳"}/>
        <Leaders title="החוץ החזק" icon={<Plane size={16}/>} rows={ranked(s => points(s.away, basketball))} value={metric(s => points(s.away, basketball))} pick={pickTeam} unit={basketball ? "נצ׳" : "נק׳"}/>
        <Leaders title="בכושר שיא" icon={<Flame size={16}/>} rows={ranked(s => s.form)} value={metric(s => s.form)} pick={pickTeam} unit="ב־5 אחרונים"/>
      </div>}
    </div>}
  </div>;
}
