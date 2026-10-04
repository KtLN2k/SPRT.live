"use client";
import {TeamName} from "./team-name";
import { MatchAlertMenu } from "./match-alert-menu";
import { useState } from "react";
import { MapPin, CalendarDays, ArrowLeftRight, CircleDot, RectangleVertical, Circle, Star, Clock3, Trophy, Flag, ChevronLeft, Users } from "lucide-react";
import { IoFootballOutline } from "react-icons/io5";
import type { Match, Favorite, EventData } from "@/lib/football/types";
import { teamLabel } from "@/lib/football/identity";
import { isLive, isFinished, statusText, liveMinute, leagueName } from "@/lib/football/types";
import { clock, dayLabel, useFootball, useGoalLog } from "@/lib/football/client";
import { CardBadges, Emblem, LoadingRows, EmptyState, CoverageNote } from "./ui";
import { UnderlineTabs } from "./underline-tabs";
export type Panel = { kind: "match" | "league" | "team"; id: string; name: string; match?: Match; sport?:"Soccer"|"Basketball"; history?: boolean } | { kind: "alerts"; tab?: "feed" | "settings" };
export type DetailProps = { panel: Exclude<Panel, { kind: "alerts" }>; open: (p: Panel) => void; has: (kind: Favorite["kind"], id: string) => boolean; toggle: (f: Favorite) => void };
type Timeline = EventData["timeline"][number];
const statNames: Record<string, string> = { "field goal percentage":"אחוזי קליעה מהשדה", "3 point percentage":"אחוזי שלשות", "free throw percentage":"אחוזי עונשין", rebounds:"ריבאונדים", assists:"אסיסטים", steals:"חטיפות", blocks:"חסימות", turnovers:"איבודים", "3-point field goals":"שלשות", "shots on goal": "בעיטות למסגרת", "shots off goal": "בעיטות מחוץ למסגרת", "total shots": "סך בעיטות", "blocked shots": "בעיטות שנחסמו", "shots insidebox": "בעיטות מתוך הרחבה", "shots outsidebox": "בעיטות מחוץ לרחבה", "ball possession": "החזקת כדור", "corner kicks": "קרנות", "yellow cards": "כרטיסים צהובים", "red cards": "כרטיסים אדומים", "goalkeeper saves": "הצלות שוער", "total passes": "מסירות", "passes accurate": "מסירות מדויקות", "passes %": "אחוז דיוק במסירות", fouls: "עבירות", offsides: "נבדלים", offside: "נבדלים", expected_goals: "שערים צפויים (xG)" };
const statLabel = (name: string) => statNames[name.toLowerCase()] || name;
const positions: Record<string, string> = { Goalkeeper: "שוער", Defender: "הגנה", Midfielder: "קישור", Forward: "התקפה", Striker: "חלוץ", "Right Wing": "כנף ימין", "Left Wing": "כנף שמאל", "Attacking Midfielder": "קשר התקפי", "Defensive Midfielder": "קשר אחורי" };
const eventLabel = (e: Timeline) => e.kind === "subst" ? "חילוף" : e.detail === "Yellow Card" ? "כרטיס צהוב" : e.detail === "Red Card" ? "כרטיס אדום" : e.detail === "Own Goal" ? "שער עצמי" : e.detail === "Penalty" ? "שער מפנדל" : e.kind.toLowerCase() === "goal" ? "שער" : e.detail === "Var" || e.kind === "Var" ? "VAR" : "אירוע";
const eventType = (e: Timeline) => e.kind === "subst" ? "sub" : e.detail === "Yellow Card" ? "yellow" : e.detail === "Red Card" ? "red" : e.kind.toLowerCase() === "goal" ? "goal" : "other";
function EventIcon({ e }: { e: Timeline }) { const t = eventType(e); return t === "sub" ? <ArrowLeftRight size={14}/> : t === "yellow" || t === "red" ? <RectangleVertical size={15} fill="currentColor"/> : t === "goal" ? <IoFootballOutline size={18}/> : <Circle size={10}/>; }
const sortEvents = (list: Timeline[]) => [...list].sort((a, b) => (parseFloat(a.minute) || 0) - (parseFloat(b.minute) || 0));

function StatLine({ name, home, away }: { name: string; home: string; away: string }) {
  const a = parseFloat(home) || 0, b = parseFloat(away) || 0, total = a + b, lowBetter = /card|foul|offside|turnover/i.test(name);
  const lead = a === b ? "" : (a > b) !== lowBetter ? "home" : "away";
  return <div className="md-stat">
    <b className={lead === "home" ? "lead" : ""}>{home || "—"}</b><span>{statLabel(name)}</span><b className={lead === "away" ? "lead" : ""}>{away || "—"}</b>
    <div className="md-stat-bar home"><i style={{ width: `${total ? (a / total) * 100 : 0}%` }}/></div>
    <div className="md-stat-bar away"><i style={{ width: `${total ? (b / total) * 100 : 0}%` }}/></div>
  </div>;
}

function Possession({ home, away }: { home: string; away: string }) {
  const a = parseFloat(home) || 0, b = parseFloat(away) || 0, total = a + b || 1;
  return <div className="md-possession">
    <div className="md-possession-head"><b>{Math.round((a / total) * 100)}%</b><span>החזקת כדור</span><b>{Math.round((b / total) * 100)}%</b></div>
    <div className="md-possession-bar"><i className="home" style={{ flex: a / total }}/><i className="away" style={{ flex: b / total }}/></div>
  </div>;
}

const eventIsHome = (e: Timeline, match: Match) => e.team ? e.team === match.home ? true : e.team === match.away ? false : e.home : e.home;
function EventCopy({e,inferred,missingCount}:{e:Timeline;inferred:boolean;missingCount:number}) {
  const type=eventType(e), label=eventLabel(e);
  if(inferred)return <span><strong>{missingCount > 1 ? `${missingCount} שערים ללא פירוט` : "מבקיע לא דווח"}</strong><small>{e.detail === "Seen" ? "שער שנקלט בעדכון הלייב" : "שער ללא פרטי שחקן או דקה"}</small></span>;
  if(type==="sub"&&e.relatedPlayer)return <span><strong>נכנס: {e.relatedPlayer}</strong><small>{e.player ? `יצא: ${e.player}` : "חילוף"}</small></span>;
  if(type==="goal")return <span><strong>{e.player || "מבקיע לא דווח"}</strong><small>{e.relatedPlayer ? `${label} · בישול: ${e.relatedPlayer}` : label}</small></span>;
  if(type==="yellow"||type==="red")return <span><strong>{e.player || "שחקן לא דווח"}</strong><small>{label}</small></span>;
  return <span><strong>{e.player || e.relatedPlayer || label}</strong><small>{label}</small></span>;
}
function EventsList({ events, match, compact = false }: { events: Timeline[]; match: Match; compact?: boolean }) {
  return <ol className={`md-timeline ${compact ? "compact" : ""}`}>{events.map((e, i) => {
    const inferred=e.detail==="Seen"||e.detail.startsWith("Unreported"), missingCount=Number(e.detail.split(":")[1])||1, home=eventIsHome(e,match);
    return <li key={e.id || i} className={`${home ? "home" : "away"} ${eventType(e)} ${inferred ? "inferred" : ""}`}>
      <div className="md-event"><span className="md-event-icon"><EventIcon e={e}/></span><EventCopy e={e} inferred={inferred} missingCount={missingCount}/></div>
      <time className={e.minute ? "" : "missing"}>{e.minute ? `${e.minute}′` : "—"}</time>
    </li>;
  })}</ol>;
}

function EventsLegend() {
  return <div className="md-event-legend" aria-label="מקרא אירועים">
    <span className="goal"><CircleDot size={12}/>שער</span>
    <span className="yellow"><RectangleVertical size={12} fill="currentColor"/>כרטיס</span>
    <span className="sub"><ArrowLeftRight size={12}/>חילוף</span>
    <span className="other"><Circle size={8}/>אירוע</span>
  </div>;
}

export function MatchDetail({ panel, open, has, toggle }: DetailProps) {
  const [lineupHome,setLineupHome]=useState(true);
  const [tab,setTab]=useState("overview");
  // One request per refresh: share the match, stats and timeline across tabs.
  const resource = useFootball<EventData>({view:"event",id:panel.id,sport:(panel.sport||panel.match?.sport)==="Basketball"?"Basketball":"Soccer"},60000);
  const data=resource.data;
  const match=data?.match||panel.match;
  const isBasketball=(panel.sport||match?.sport)==="Basketball", sport=isBasketball?"Basketball":"Soccer";
  const live=match?isLive(match.status):false;
  const phase=match?(live?(isBasketball?statusText(match.status)||match.progress:liveMinute(match)):isFinished(match.status)||["PST","CANC","ABD","SUSP"].includes(match.status)?statusText(match.status):clock(match.kickoff)):"";
  const penalty=match?.penaltyHome!=null&&match?.penaltyAway!=null?`פנדלים ${match.penaltyHome}:${match.penaltyAway}`:"";
  const cardCount=(name:string,home:boolean)=>{
    const stat=data?.stats.find(s=>s.name.toLowerCase()===name);
    const value=stat?.[home?"home":"away"];
    if(value!=null&&/^\d+$/.test(value))return Number(value);
    return match?.cards?.[name==="yellow cards"?(home?"homeYellow":"awayYellow"):(home?"homeRed":"awayRed")]??null;
  };
  const openTeam = (id: string, name: string) => { if (id) open({ kind: "team", id, name, sport }); };
  const openLeague = () => match?.leagueId && open({ kind: "league", id: match.leagueId, name: leagueName(match.league), sport });
  const reported = data?.timeline || [];
  const seenGoals = useGoalLog().log[panel.id] || [];
  const goalsFor = (list: Timeline[], home: boolean) => list.filter(e => eventType(e) === "goal" && e.home === home).length;
  const seen: Timeline[] = !isBasketball && !reported.some(e => eventType(e) === "goal") ? seenGoals.map(g => ({ id: `seen-${g.score}`, minute: g.minute, kind: "Goal", detail: "Seen", player: "", team: "", home: g.home })) : [];
  const scored = (home: boolean) => Number((home ? match?.homeScore : match?.awayScore) || 0);
  const missing: Timeline[] = !isBasketball && match && data && (live || isFinished(match.status)) ? [true, false].flatMap(home => {
    const count=Math.max(0,scored(home)-goalsFor([...reported,...seen],home));
    return count?[{id:`missing-${home?"h":"a"}`,minute:"",kind:"Goal",detail:`Unreported:${count}`,player:"",team:"",home}]:[];
  }) : [];
  const events = [...missing, ...sortEvents([...reported, ...seen])];
  const goalsNote = missing.length || seen.length ? <p className="md-source-note">{missing.length ? "ספק הנתונים לא פירט את כל השערים במשחק הזה. המבקיעים יתווספו כאן אם יפורסמו." : "השערים נקלטו מעדכוני הלייב. המבקיעים יתווספו כאן אם יפורסמו."}</p> : null;
  const stats = (data?.stats || []).filter(s => s.home !== "" || s.away !== "");
  const possession = stats.find(s => s.name.toLowerCase() === "ball possession");
  const keyStats = stats.filter(s => (isBasketball ? ["rebounds","assists","3-point field goals","field goal percentage"] : ["total shots","shots on goal","corner kicks","fouls"]).includes(s.name.toLowerCase()));
  const lineup = data?.lineup || [];
  const upcoming = match && !live && !isFinished(match.status);
  const tabs = [{ id: "overview", label: "סקירה" }, { id: "timeline", label: "מהלך המשחק", count: events.length || undefined }, ...(!isBasketball ? [{ id: "lineup", label: "הרכבים" }] : []), { id: "stats", label: "סטטיסטיקות", count: stats.length || undefined }];
  const round = match?.round && match.round !== "0" ? (/^\d+$/.test(match.round) ? `מחזור ${match.round}` : match.round) : "";
  const pending = resource.loading && !data ? <LoadingRows/> : null;
  const failed = resource.error && !data ? <EmptyState title="המידע לא נטען" description={resource.error} error retry={resource.retry}/> : null;
  const facts = match ? [{ icon: CalendarDays, label: "מועד", value: match.date ? dayLabel(match.date) : "" }, { icon: Clock3, label: "שעת פתיחה", value: match.kickoff ? `${clock(match.kickoff)} (שעון ישראל)` : "" }, { icon: MapPin, label: "אצטדיון", value: match.venue }, { icon: Trophy, label: "תחרות", value: leagueName(match.league) }, { icon: Flag, label: "עונה ומחזור", value: [match.season, round].filter(Boolean).join(" · ") }].filter(f => f.value) : [];

  const body = tab === "overview" ? (match && <>
    <section className="ed-section md-overview-section">
      <h3 className="ed-heading">תמונת המשחק{stats.length > 0 && <button type="button" className="md-more" onClick={() => setTab("stats")}>כל הנתונים<ChevronLeft size={14}/></button>}</h3>
      {pending || (possession || keyStats.length ? <div className="md-stats">{possession && <Possession home={possession.home} away={possession.away}/>}{keyStats.map(s => <StatLine key={s.name} {...s}/>)}</div> : <p className="md-muted">{upcoming ? "הנתונים יופיעו עם שריקת הפתיחה." : live ? "התוצאה חיה. פירוט הנתונים עדיין לא התקבל מהספק." : "אין נתונים מפורטים למשחק הזה."}</p>)}
    </section>
    <section className="ed-section md-moments-section">
      <h3 className="ed-heading">רגעי מפתח{events.length > 0 && <button type="button" className="md-more" onClick={() => setTab("timeline")}>למהלך המלא<ChevronLeft size={14}/></button>}</h3>
      {pending || (events.some(e => eventType(e) === "goal" || eventType(e) === "red") ? <><EventsList events={events.filter(e => eventType(e) === "goal" || eventType(e) === "red")} match={match} compact/>{goalsNote}</> : <p className="md-muted">{upcoming ? "שערים וכרטיסים אדומים יופיעו כאן במהלך המשחק." : "לא נרשמו שערים או כרטיסים אדומים במקור הנתונים."}</p>)}
    </section>
    <section className="ed-section md-facts-section">
      <h3 className="ed-heading">פרטי המשחק<small>{live ? "משחק חי" : statusText(match.status)}</small></h3>
      <dl className="md-facts">{facts.map(({ icon: Icon, label, value }) => <div key={label}><dt><Icon size={15}/>{label}</dt><dd>{value}</dd></div>)}</dl>
      {!isBasketball && <button type="button" className="ed-link md-lineup-link" onClick={() => setTab("lineup")}><Users size={16}/>מי על המגרש? להרכבים<ChevronLeft size={15}/></button>}
    </section>
  </>) : tab === "timeline" ? (pending || failed || (events.length && match ? <div className="md-timeline-view"><EventsLegend/><EventsList events={events} match={match}/>{goalsNote}</div> : <EmptyState title={upcoming ? "מהלך המשחק יופיע לאחר תחילתו" : "טרם התקבל פירוט אירועים למשחק הזה"} description={upcoming ? "שערים, כרטיסים וחילופים יוצגו כאן כשהספק יפרסם אותם." : "תוצאה חיה אינה מבטיחה פירוט אירועים. נבדוק שוב אוטומטית."}/>))
  : tab === "stats" ? (pending || failed || (stats.length && data ? <>
    <div className="md-stats-head"><span><Emblem name={data.match.home} id={data.match.homeId} src={data.match.homeBadge} small/><TeamName value={data.match.home}/></span><span><TeamName value={data.match.away}/><Emblem name={data.match.away} id={data.match.awayId} src={data.match.awayBadge} small/></span></div>
    <div className="md-stats">{possession && <Possession home={possession.home} away={possession.away}/>}{stats.filter(s => s !== possession).map((s, i) => <StatLine key={`${s.name}-${i}`} {...s}/>)}</div>
  </> : <EmptyState title="הסטטיסטיקות עדיין אינן זמינות" description="זמינות הנתונים משתנה בין תחרויות ומשחקים."/>))
  : (pending || failed || (lineup.length && data ? <>
    <div className="ed-segment" role="group" aria-label="בחירת קבוצה">{[true,false].map(home=><button key={String(home)} type="button" className={home===lineupHome?"active":""} aria-pressed={home===lineupHome} onClick={()=>setLineupHome(home)}><Emblem name={home?data.match.home:data.match.away} id={home?data.match.homeId:data.match.awayId} src={home?data.match.homeBadge:data.match.awayBadge} small/>{teamLabel(home?data.match.home:data.match.away)}</button>)}</div>
    <div className="pitch md-pitch" aria-label="הרכב לפי עמדות"><svg className="pitch-markings" viewBox="0 0 320 420" preserveAspectRatio="none" aria-hidden="true"><path d="M12 12H308V408H12Z M12 210H308 M85 12V72H235V12 M120 12V37H200V12 M85 408V348H235V408 M120 408V383H200V408"/><circle cx="160" cy="210" r="40"/><circle cx="160" cy="210" r="2"/></svg><div className="pitch-line">{lineup.filter(p=>p.home===lineupHome&&!p.substitute&&p.position==="Goalkeeper").map(p=><div className="pitch-player" key={p.id}><span className="shirt">{p.number}</span><span>{p.name}</span></div>)}</div>{["Defender","Midfielder","Forward"].map(position=><div className="pitch-line" key={position}>{lineup.filter(p=>p.home===lineupHome&&!p.substitute&&(p.position===position||(position==="Forward"&&p.position==="Striker"))).map(p=><div className="pitch-player" key={p.id}><span className="shirt">{p.number}</span><span>{p.name}</span></div>)}</div>)}</div>
    <p className="md-muted md-note">סידור לפי עמדות השחקנים שסופקו, לא מערך טקטי מאומת.</p>
    {[false, true].map(sub => { const players = lineup.filter(p => p.home === lineupHome && p.substitute === sub); return players.length ? <section className="ed-section" key={String(sub)}><h3 className="ed-heading">{sub ? "ספסל" : "הרכב פותח"}<small>{players.length} שחקנים</small></h3><div className="md-players">{players.map((p, i) => <div className="md-player" key={p.id || i}><span>{p.number || "—"}</span><strong>{p.name}</strong><small>{positions[p.position] || p.position}</small></div>)}</div></section> : null; })}
  </> : <EmptyState title="ההרכבים עדיין אינם זמינים" description="הרכבים שפורסמו אצל הספק יופיעו כאן אוטומטית."/>));

  return <div className="ed-page md-page" data-sport={sport}>
    <header className={`md-hero ${live ? "live" : ""}`}>
      {match && <><span className="md-hero-glow home" aria-hidden="true"><Emblem name={match.home} id={match.homeId} src={match.homeBadge} large/></span><span className="md-hero-glow away" aria-hidden="true"><Emblem name={match.away} id={match.awayId} src={match.awayBadge} large/></span></>}
      <div className="md-top">
        {match && <button type="button" className="md-league" onClick={openLeague}><Emblem name={leagueName(match.league)} id={match.leagueId} kind="league" src={match.leagueBadge} small/><span>{leagueName(match.league)}</span>{round && <small>{round}</small>}</button>}
        {match && <div className="md-actions"><button type="button" className="match-action match-star" aria-label={has("match",match.id)?"הסר משחק מהמעקב":"עקוב אחרי המשחק"} aria-pressed={has("match",match.id)} onClick={()=>toggle({kind:"match",id:match.id,name:`${match.home} – ${match.away}`,homeId:match.homeId,awayId:match.awayId,leagueId:match.leagueId,sport})}><Star size={20} fill={has("match",match.id)?"currentColor":"none"}/></button><MatchAlertMenu match={match}/></div>}
      </div>
      {match ? <div className="md-score">
        <button type="button" className="md-team home" onClick={() => openTeam(match.homeId, match.home)}><Emblem name={match.home} id={match.homeId} src={match.homeBadge} large/><strong><TeamName value={match.home}/></strong><small>בית</small><CardBadges yellow={cardCount("yellow cards",true)} red={cardCount("red cards",true)}/></button>
        <div className="md-center">
          {live && <span className="md-live">LIVE</span>}
          {upcoming ? <b className="pending" dir="ltr">{clock(match.kickoff)}</b> : <b key={`${match.homeScore}-${match.awayScore}`} className="md-scoreline"><span>{match.homeScore ?? "–"}</span><i>:</i><span>{match.awayScore ?? "–"}</span></b>}
          <span className={live ? "playing" : ""}>{upcoming ? (match.date ? dayLabel(match.date, true) : "טרם התחיל") : phase}</span>
          {penalty && <small>{penalty}</small>}
        </div>
        <button type="button" className="md-team away" onClick={() => openTeam(match.awayId, match.away)}><Emblem name={match.away} id={match.awayId} src={match.awayBadge} large/><strong><TeamName value={match.away}/></strong><small>חוץ</small><CardBadges yellow={cardCount("yellow cards",false)} red={cardCount("red cards",false)}/></button>
      </div> : <LoadingRows/>}
      {match && (match.venue || match.date) && <div className="md-meta">{match.date && <span><CalendarDays size={13}/>{dayLabel(match.date, true)}{match.kickoff && ` · ${clock(match.kickoff)}`}</span>}{match.venue && <span><MapPin size={13}/>{match.venue}</span>}</div>}
    </header>
    {resource.error && data && <div className="md-warning">עדכון פרטי המשחק מתעכב. מוצג המידע האחרון שהתקבל.</div>}
    <UnderlineTabs tabs={tabs} value={tab} onChange={setTab} label="מרכז המשחק"/>
    <div key={tab} className="ed-panel" role="tabpanel">
      {body}
      {data?.limited && <CoverageNote/>}
      {data && data.unavailable.length > 0 && <CoverageNote>חלק מהמידע לא נטען: {data.unavailable.join(", ")}. אפשר לנסות שוב.</CoverageNote>}
    </div>
  </div>;
}
export function Tournament({matches,open}:{matches:Match[];open:(p:Panel)=>void}) { const order=["שמינית גמר","רבע גמר","חצי גמר","גמר"]; const rounds=[...new Set(matches.map(m=>m.round).filter(Boolean))].sort((a,b)=>order.indexOf(a)-order.indexOf(b)); return rounds.length ? <div className="bracket">{rounds.map(round=><section className="bracket-stage" key={round}><h3>{round}</h3>{matches.filter(m=>m.round===round).map(m=><div className="bracket-game" key={m.id}><button onClick={()=>open({kind:"match",id:m.id,name:`${m.home} – ${m.away}`,match:m,sport:m.sport==="Basketball"?"Basketball":"Soccer"})}><Emblem name={m.home} id={m.homeId} src={m.homeBadge} small/><TeamName value={m.home}/><b>{m.homeScore??"–"}</b></button><button onClick={()=>open({kind:"match",id:m.id,name:`${m.home} – ${m.away}`,match:m,sport:m.sport==="Basketball"?"Basketball":"Soccer"})}><Emblem name={m.away} id={m.awayId} src={m.awayBadge} small/><TeamName value={m.away}/><b>{m.awayScore??"–"}</b></button></div>)}</section>)}</div> : <EmptyState title="שלבי התחרות עדיין אינם זמינים"/>; }
