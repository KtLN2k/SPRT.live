import roster from '@/lib/football/legionnaires-roster.json';
import { legionnaire } from '@/lib/football/legionnaires-provider';
import { hebrewTeam, searchCandidates, searchTeamQuery } from "@/lib/football/names";
import { NextRequest, NextResponse } from "next/server";
import { array, text, configured, provider, normalizeLeague, normalizeMatch, normalizeStanding, uniqueMatches, localDate, mergeLive } from "@/lib/football/provider";
import type { LiveState, Match } from "@/lib/football/types";
const validId = (id: string) => /^\d{1,12}$/.test(id);
const bad = () => NextResponse.json({ error: "בקשה לא תקינה" }, { status: 400 });
type DetailKind="lineup"|"stats"|"timeline";
type DetailPart={rows:Record<string,unknown>[];failed:boolean;version:"v1"|"v2"|null};
function detailArray(data:unknown,keys:string[],depth=0):{rows:Record<string,unknown>[];recognized:boolean}{
  if(Array.isArray(data))return {rows:data.filter(v=>v&&typeof v==="object") as Record<string,unknown>[],recognized:true};
  if(!data||typeof data!=="object")return {rows:[],recognized:false};
  const obj=data as Record<string,unknown>;
  for(const key of keys){
    if(!(key in obj))continue;
    const value=obj[key];
    if(Array.isArray(value))return {rows:value.filter(v=>v&&typeof v==="object") as Record<string,unknown>[],recognized:true};
    if(value==null)return {rows:[],recognized:true};
  }
  if(depth<2){
    for(const value of Object.values(obj)){
      if(!value||typeof value!=="object")continue;
      const nested=detailArray(value,keys,depth+1);
      if(nested.recognized)return nested;
    }
  }
  return {rows:[],recognized:false};
}
async function eventPart(kind:DetailKind,id:string,enabled:boolean):Promise<DetailPart>{
  if(!enabled)return {rows:[],failed:false,version:null};
  const specs={
    lineup:{v2:`lookup/event_lineup/${id}`,v1:`lookuplineup.php?id=${id}`,keys:["lineup","event_lineup","players"]},
    stats:{v2:`lookup/event_stats/${id}`,v1:`lookupeventstats.php?id=${id}`,keys:["eventstats","stats","statistics"]},
    timeline:{v2:`lookup/event_timeline/${id}`,v1:`lookuptimeline.php?id=${id}`,keys:["timeline","event_timeline","events"]}
  } as const;
  const spec=specs[kind];
  if(configured()){
    try{
      const result=await provider(spec.v2,20,true);
      const parsed=detailArray(result.data,[...spec.keys]);
      if(parsed.recognized)return {rows:parsed.rows,failed:false,version:"v2"};
    }catch{/* fall back to the mature v1 endpoint */}
  }
  try{
    const result=await provider(spec.v1,20);
    return {rows:detailArray(result.data,[...spec.keys]).rows,failed:false,version:"v1"};
  }catch{return {rows:[],failed:true,version:null}}
}
const pick=(row:Record<string,unknown>,...keys:string[])=>{
  for(const key of keys){const value=text(row[key]);if(value)return value;}
  return "";
};
async function hydratePenaltyScores(matches:Match[]) {
  const targets=matches.filter(m=>/^PEN$/i.test(m.status)&&(m.penaltyHome==null||m.penaltyAway==null));
  if(!targets.length)return matches;
  const results=await Promise.allSettled(targets.map(m=>provider(`lookupevent.php?id=${m.id}`,30)));
  const extras=new Map<string,Match>();
  results.forEach((result,index)=>{
    if(result.status!=="fulfilled")return;
    const raw=array(result.value.data,"events")[0];
    if(!raw)return;
    extras.set(targets[index].id,normalizeMatch(raw));
  });
  return matches.map(m=>{
    const extra=extras.get(m.id);
    if(!extra)return m;
    return {...m,penaltyHome:extra.penaltyHome??m.penaltyHome,penaltyAway:extra.penaltyAway??m.penaltyAway,status:extra.status||m.status};
  });
}
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
      const matches=await hydratePenaltyScores(uniqueMatches(array(result.data, "livescore", "events").filter(r=>text(r.strSport).toLowerCase()===sport.toLowerCase())));
      return NextResponse.json({ matches, liveState: "connected", fetchedAt: result.at });
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
      matches=await hydratePenaltyScores(matches);
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
      const statsPart=await eventPart("stats",id,true);
      const count=(name:string,side:"home"|"away")=>{const row=statsPart.rows.find(r=>pick(r,"strStat","strStatistic","strName","name").toLowerCase()===name);const value=side==="home"?pick(row||{},"intHome","strHome","home"):pick(row||{},"intAway","strAway","away");return /^\d+$/.test(value)?Number(value):null;};
      return NextResponse.json({cards:{homeYellow:count("yellow cards","home"),awayYellow:count("yellow cards","away"),homeRed:count("red cards","home"),awayRed:count("red cards","away")},fetchedAt:new Date().toISOString()});
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
      const wants=(name:DetailKind)=>section==="all"||section===name;
      const [info,lineupPart,statsPart,timelinePart,live]=await Promise.all([
        provider(`lookupevent.php?id=${id}`,20).catch(()=>null),
        eventPart("lineup",id,wants("lineup")),
        eventPart("stats",id,wants("stats")),
        eventPart("timeline",id,wants("timeline")),
        configured()?provider(sport==="Basketball"?"livescore/all":"livescore/soccer",20,true).catch(()=>null):Promise.resolve(null)
      ]);
      const base=info?array(info.data,"events")[0]:null;
      const liveEvent=live?array(live.data,"livescore","events").find(r=>text(r.idEvent)===id&&text(r.strSport).toLowerCase()===sport.toLowerCase()):null;
      const event=base||liveEvent?{...base,...Object.fromEntries(Object.entries(liveEvent||{}).filter(([,v])=>v!==""&&v!=null))}:null;
      if(!event||(text(event.strSport)&&text(event.strSport).toLowerCase()!==sport.toLowerCase()))throw new Error("Event unavailable");
      const normalizedMatch=normalizeMatch(event);
      const isHomeRow=(row:Record<string,unknown>)=>{
        const teamId=pick(row,"idTeam","idClub","idSide");
        const team=hebrewTeam(pick(row,"strTeam","strTeamName","team"));
        const flag=pick(row,"strHome","isHome","home");
        if(teamId&&normalizedMatch.homeId)return teamId===normalizedMatch.homeId;
        if(team)return team===normalizedMatch.home;
        return /^(yes|true|home|1)$/i.test(flag);
      };
      const lineup=lineupPart.rows.map(r=>({
        id:pick(r,"idLineup","idPlayer","id"),
        name:pick(r,"strPlayer","strPlayerName","name"),
        home:isHomeRow(r),
        substitute:/^(yes|true|1|sub|substitute)$/i.test(pick(r,"strSubstitute","isSubstitute","substitute")),
        position:pick(r,"strPosition","strPos","position"),
        number:pick(r,"intSquadNumber","intNumber","number")
      })).filter(r=>r.name);
      const stats=statsPart.rows.map(r=>({
        name:pick(r,"strStat","strStatistic","strName","name"),
        home:pick(r,"intHome","strHome","home"),
        away:pick(r,"intAway","strAway","away")
      })).filter(r=>r.name&&(r.home!==""||r.away!==""));
      const timeline=timelinePart.rows.map((r,index)=>{
        const team=hebrewTeam(pick(r,"strTeam","strTeamName","team"));
        return {
          id:pick(r,"idTimeline","idEventTimeline","id")||`${id}-timeline-${index}`,
          minute:pick(r,"intTime","intMinute","strTime","minute"),
          kind:pick(r,"strTimeline","strType","strEvent","type"),
          detail:pick(r,"strTimelineDetail","strDetail","detail"),
          player:pick(r,"strPlayer","strPlayerName","player"),
          relatedPlayer:pick(r,"strAssist","strPlayer2","strPlayerSub","strRelatedPlayer","assist"),
          team,
          home:isHomeRow(r)
        };
      }).filter(r=>r.kind||r.detail||r.player).sort((a,b)=>(parseFloat(a.minute)||0)-(parseFloat(b.minute)||0));
      const goalCount=timeline.filter(r=>/goal/i.test(`${r.kind} ${r.detail}`)&&!/missed/i.test(r.detail)).length;
      const scoreTotal=Number(normalizedMatch.homeScore||0)+Number(normalizedMatch.awayScore||0);
      const timelineComplete=sport==="Soccer"&&Number.isFinite(scoreTotal)&&!/^P(?:EN)?$/i.test(normalizedMatch.status)&&scoreTotal>0?goalCount===scoreTotal:null;
      const versions=[lineupPart.version,statsPart.version,timelinePart.version].filter(Boolean);
      const apiVersion=versions.length&&!versions.every(v=>v===versions[0])?"mixed":versions[0]||"v1";
      const availability=(rows:unknown[],kind:DetailKind)=>rows.length?"available":sport==="Basketball"&&(kind==="timeline"||kind==="stats")?"limited":"missing";
      return NextResponse.json({
        match:normalizedMatch,
        limited,
        lineup,
        stats,
        timeline,
        coverage:{
          source:"TheSportsDB",
          apiVersion,
          timeline:availability(timeline,"timeline"),
          stats:availability(stats,"stats"),
          lineup:availability(lineup,"lineup"),
          timelineComplete
        },
        unavailable:[
          lineupPart.failed?"הרכבים":"",
          statsPart.failed?"סטטיסטיקות":"",
          timelinePart.failed?"אירועים":""
        ].filter(Boolean)
      });
    }
    return bad();
  } catch { return NextResponse.json({ error: "לא הצלחנו לקבל נתונים כרגע. אפשר לנסות שוב בעוד רגע." }, { status: 502, headers: { "Cache-Control": "no-store" } }); }
}
