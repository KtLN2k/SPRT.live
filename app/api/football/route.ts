import roster from '@/lib/football/legionnaires-roster.json';
import { legionnaire } from '@/lib/football/legionnaires-provider';
import { hebrewTeam, searchCandidates, searchTeamQuery } from "@/lib/football/names";
import { NextRequest, NextResponse } from "next/server";
import { array, text, configured, provider, normalizeLeague, normalizeMatch, normalizeStanding, uniqueMatches, localDate, mergeLive } from "@/lib/football/provider";
import type { LiveState } from "@/lib/football/types";
const validId = (id: string) => /^\d{1,12}$/.test(id);
const bad = () => NextResponse.json({ error: "בקשה לא תקינה" }, { status: 400 });
export async function GET(request: NextRequest) {
  const p = request.nextUrl.searchParams, view = p.get("view"), id = p.get("id") || "";
  const limited = !configured();
  const sport=p.get("sport")==="Basketball"?"Basketball":"Soccer";
  if(p.has("sport")&&! ["Soccer","Basketball"].includes(p.get("sport")||""))return bad();
  try {
    if(view === "legionnaires") return NextResponse.json({players:roster,checkedAt:"2026-09-26",complete:false});
    if(view === "legionnaire-search") {
      const q=(p.get("q")||"").trim();if(q.length<2||q.length>80)return bad();
      const known=roster.find(player=>player.name===q);
      const result=await provider(`searchplayers.php?p=${encodeURIComponent(known?.english||q)}`,3600);
      return NextResponse.json({players:array(result.data,"player","players").filter(r=>r.strNationality==="Israel"&&r.strSport==="Soccer"&&r.strStatus==="Active").map(r=>({id:text(r.idPlayer),name:roster.find(x=>x.id===text(r.idPlayer))?.name||text(r.strPlayer)}))});
    }
    if (view === "live") {
      if (limited) return NextResponse.json({ matches: [], liveState: "unconfigured", fetchedAt: null });
      const result = await provider(sport==="Basketball"?"livescore/all":"livescore/soccer", 30, true);
      return NextResponse.json({ matches: uniqueMatches(array(result.data, "livescore", "events").filter(r=>text(r.strSport).toLowerCase()===sport.toLowerCase())), liveState: "connected", fetchedAt: result.at });
    }
    if (view === "day") {
      const date = p.get("date") || "", tz = p.get("tz") || "Asia/Jerusalem";
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date) return bad();
      try { new Intl.DateTimeFormat("en", { timeZone: tz }).format(); } catch { return bad(); }
      // The provider indexes schedules by UTC date. Fetch neighboring days and filter in the viewer's zone.
      const dates = [-1, 0, 1].map(offset => { const d = new Date(`${date}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + offset); return d.toISOString().slice(0, 10); });
      const liveRequest = !limited && date === localDate(new Date().toISOString(), tz) ? provider(sport==="Basketball"?"livescore/all":"livescore/soccer", 30, true).catch(()=>null) : Promise.resolve(null);
      const results = await Promise.allSettled(dates.map(d => provider(`eventsday.php?d=${d}&s=${sport}`, 110)));
      const central = results[1];
      const liveResult = await liveRequest;
      if (central.status !== "fulfilled" && !liveResult) throw new Error("Schedule unavailable");
      let matches = uniqueMatches(results.flatMap(r => r.status === "fulfilled" ? array(r.value.data, "events").filter(m => !m.strSport || text(m.strSport).toLowerCase() === sport.toLowerCase()) : [])).filter(m => (m.kickoff ? localDate(m.kickoff, tz) : m.date) === date);
      let liveState: LiveState = limited ? "unconfigured" : "unavailable";
      let fetchedAt = central.status === "fulfilled" ? central.value.at : liveResult!.at;
      if (!limited && date === localDate(new Date().toISOString(), tz)) {
        try { const result = liveResult; if(!result) throw new Error("Live unavailable"); matches = mergeLive(matches, uniqueMatches(array(result.data, "livescore", "events").filter(r=>text(r.strSport).toLowerCase()===sport.toLowerCase())), date, tz); liveState = "connected"; fetchedAt = result.at; } catch { /* explicit degraded status */ }
      }
      return NextResponse.json({ matches, limited, liveState, fetchedAt, partial: results.some(r => r.status === "rejected") });
    }
    if (view === "leagues") {
      const result = await provider("all_leagues.php", 86400);
      const leagues = array(result.data, "leagues").filter(l => text(l.strSport).toLowerCase() === sport.toLowerCase()).map(normalizeLeague).filter(l => l.id && l.name);
      return NextResponse.json({ leagues, limited });
    }
    if (view === "search") {
      const query = (p.get("q") || "").trim();
      if (query.length < 2 || query.length > 80) return bad();
      const terms = [...new Set([searchTeamQuery(query), ...searchCandidates(query)])].slice(0, 4);
      const results = await Promise.all(terms.map(term => provider(`searchteams.php?t=${encodeURIComponent(term)}`, 3600).catch(() => null)));
      const anySport = !p.has("sport");
      const teams = [...new Map(results.flatMap(result => result ? array(result.data, "teams") : [])
        .filter(t => anySport ? ["soccer", "basketball"].includes(text(t.strSport).toLowerCase()) : text(t.strSport).toLowerCase() === sport.toLowerCase())
        .map(t => [text(t.idTeam), { badge: text(t.strBadge || t.strTeamBadge), id: text(t.idTeam), name: hebrewTeam(text(t.strTeam)), english: text(t.strTeam), country: text(t.strCountry), league: text(t.strLeague), sport: text(t.strSport).toLowerCase() === "basketball" ? "Basketball" : "Soccer" }] as const)).values()];
      return NextResponse.json({ teams: teams.slice(0, 20), limited });
    }
    if (!validId(id)) return bad();
    if(view === "legionnaire") return NextResponse.json(await legionnaire(id));
    if (view === "cards") {
      const result=await provider(`lookupeventstats.php?id=${id}`,30);
      const rows=array(result.data,"eventstats");
      const count=(name:string,side:string)=>{const row=rows.find(r=>text(r.strStat).toLowerCase()===name);const value=row?.[side];return value!=null&&/^\d+$/.test(text(value))?Number(value):null;};
      return NextResponse.json({cards:{homeYellow:count("yellow cards","intHome"),awayYellow:count("yellow cards","intAway"),homeRed:count("red cards","intHome"),awayRed:count("red cards","intAway")},fetchedAt:result.at});
    }
    if (view === "badge") {
      const kind=p.get("kind"); if(kind!=="team"&&kind!=="league")return bad();
      const result=await provider(`${kind==="team"?"lookupteam":"lookupleague"}.php?id=${id}`,86400);
      const item=array(result.data,kind==="team"?"teams":"leagues")[0];
      return NextResponse.json({badge:text(item?.strBadge||item?.strTeamBadge)}, {headers:{"Cache-Control":"public, max-age=3600"}});
    }
    if (view === "league") {
      const [info, seasons] = await Promise.all([provider(`lookupleague.php?id=${id}`, 3600), provider(`search_all_seasons.php?id=${id}`, 86400)]);
      const item = array(info.data, "leagues")[0];
      if (!item) return NextResponse.json({ error: "התחרות אינה זמינה" }, { status: 404 });
      return NextResponse.json({ league: normalizeLeague(item), seasons: array(seasons.data, "seasons").map(s => text(s.strSeason)).filter(Boolean).sort().reverse(), limited });
    }
    if (view === "season") {
      const season = p.get("season") || "";
      if (!/^\d{4}(?:-\d{2,4})?$/.test(season)) return bad();
      const [table, schedule] = await Promise.allSettled([provider(`lookuptable.php?l=${id}&s=${season}`, 600), provider(`eventsseason.php?id=${id}&s=${season}`, 300)]);
      if (table.status === "rejected" && schedule.status === "rejected") throw new Error("Season unavailable");
      const rawTable = table.status === "fulfilled" ? array(table.value.data, "table") : [];
      return NextResponse.json({ rows: rawTable.map(normalizeStanding).sort((a, b) => a.rank - b.rank), matches: schedule.status === "fulfilled" ? uniqueMatches(array(schedule.value.data, "events")) : [], limited, tableError: table.status === "rejected", matchesError: schedule.status === "rejected", tableSeason: text(rawTable[0]?.strSeason) || season });
    }
    if (view === "team") {
      const [info, past, next] = await Promise.allSettled([provider(`lookupteam.php?id=${id}`, 3600), provider(`eventslast.php?id=${id}`, 300), provider(`eventsnext.php?id=${id}`, 300)]);
      if ([info, past, next].every(x => x.status === "rejected")) throw new Error("Team unavailable");
      const detail = info.status === "fulfilled" ? array(info.value.data, "teams")[0] || {} : {};
      const leagueId = text(detail.idLeague);
      let season = "", seasonGames: ReturnType<typeof array> = [];
      if (validId(leagueId)) {
        try {
          season = text(array((await provider(`lookupleague.php?id=${leagueId}`, 3600)).data, "leagues")[0]?.strCurrentSeason);
          if (season) seasonGames = array((await provider(`eventsseason.php?id=${leagueId}&s=${encodeURIComponent(season)}`, 300)).data, "events").filter(e => text(e.idHomeTeam) === id || text(e.idAwayTeam) === id);
        } catch { /* last/next fixtures still describe the team */ }
      }
      return NextResponse.json({ badge: text(detail.strBadge || detail.strTeamBadge), name: hebrewTeam(text(detail.strTeam)), country: text(detail.strCountry), venue: text(detail.strStadium), leagueId, league: text(detail.strLeague), season, matches: uniqueMatches([...seasonGames, ...(past.status === "fulfilled" ? array(past.value.data, "results", "events") : []), ...(next.status === "fulfilled" ? array(next.value.data, "events") : [])]), limited, partial: [info, past, next].some(x => x.status === "rejected") });
    }
    if (view === "event") {
      const section=p.get("section")||"all";
      if(!["all","info","timeline","lineup","stats"].includes(section))return bad();
      const part=(name:string,path:string)=>section==="all"||section===name?provider(path,30):Promise.resolve({data:{},at:""});
      const [info, lineup, stats, timeline, live] = await Promise.allSettled([
        provider(`lookupevent.php?id=${id}`,30),
        part("lineup",`lookuplineup.php?id=${id}`),
        part("stats",`lookupeventstats.php?id=${id}`),
        part("timeline",`lookuptimeline.php?id=${id}`),
        configured()?provider(sport==="Basketball"?"livescore/all":"livescore/soccer",30,true):Promise.resolve({data:{},at:""})
      ]);
      const base = info.status === "fulfilled" ? array(info.value.data, "events")[0] : null;
      const liveEvent=live.status==="fulfilled"?array(live.value.data,"livescore","events").find(r=>text(r.idEvent)===id && text(r.strSport).toLowerCase()===sport.toLowerCase()):null;
      const event=base||liveEvent?{...base,...Object.fromEntries(Object.entries(liveEvent||{}).filter(([,v])=>v!==""&&v!=null))}:null;
      if (!event || (text(event.strSport)&&text(event.strSport).toLowerCase()!==sport.toLowerCase())) throw new Error("Event unavailable");
      const normalizedMatch=normalizeMatch(event);
      return NextResponse.json({ match: normalizedMatch, limited, lineup: lineup.status === "fulfilled" ? array(lineup.value.data, "lineup").map(r => ({ id: text(r.idLineup || r.idPlayer), name: text(r.strPlayer), home: /^(yes|true|home|1)$/i.test(text(r.strHome)) || hebrewTeam(text(r.strTeam)) === normalizedMatch.home, substitute: r.strSubstitute === "Yes", position: text(r.strPosition), number: text(r.intSquadNumber) })) : [], stats: stats.status === "fulfilled" ? array(stats.value.data, "eventstats").map(r => ({ name: text(r.strStat), home: text(r.intHome), away: text(r.intAway) })) : [], timeline: timeline.status === "fulfilled" ? array(timeline.value.data, "timeline").map(r => { const team=hebrewTeam(text(r.strTeam)); return { id: text(r.idTimeline), minute: text(r.intTime), kind: text(r.strTimeline), detail: text(r.strTimelineDetail), player: text(r.strPlayer), relatedPlayer: text(r.strAssist || r.strPlayer2 || r.strPlayerSub), team, home: /^(yes|true|home|1)$/i.test(text(r.strHome)) || (!!team && team === normalizedMatch.home) }; }).sort((a, b) => parseInt(a.minute) - parseInt(b.minute)) : [], unavailable: [lineup.status === "rejected" ? "הרכבים" : "", stats.status === "rejected" ? "סטטיסטיקות" : "", timeline.status === "rejected" ? "אירועים" : ""].filter(Boolean) });
    }
    return bad();
  } catch { return NextResponse.json({ error: "לא הצלחנו לקבל נתונים כרגע. אפשר לנסות שוב בעוד רגע." }, { status: 502, headers: { "Cache-Control": "no-store" } }); }
}
