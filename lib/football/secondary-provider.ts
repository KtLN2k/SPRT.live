import {hebrewTeam} from './names';
import type {EventData,Match} from './types';

// API-Football is an optional, on-demand detail source. TheSportsDB remains the
// source of event identity, scores, fixtures, leagues and badges.
type Rec=Record<string,unknown>;
const object=(value:unknown):Rec=>value&&typeof value==='object'&&!Array.isArray(value)?value as Rec:{};
const rows=(value:unknown):Rec[]=>Array.isArray(value)?value.map(object):[];
const value=(input:unknown)=>input==null?'':String(input);
const canonical=(input:string)=>input.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’'".,-]/g,'').replace(/\s+/g,' ').trim();
const sameTeam=(a:string,b:string)=>canonical(hebrewTeam(a))===canonical(hebrewTeam(b));
const cache=new Map<string,{until:number;data:Rec[]}>();
let remaining=100;
async function fetchRows(path:string,ttl:number):Promise<Rec[]> {
 const saved=cache.get(path);if(saved&&saved.until>Date.now())return saved.data;
 const key=process.env.API_FOOTBALL_KEY?.trim();if(!key||remaining<8)return [];
 const response=await fetch(`https://v3.football.api-sports.io/${path}`,{headers:{'x-apisports-key':key},signal:AbortSignal.timeout(7000)});
 if(!response.ok)throw new Error(`API-Football HTTP ${response.status}`);
 const quota=response.headers.get('x-ratelimit-requests-remaining');const left=Number(quota);if(quota!==null&&Number.isFinite(left))remaining=left;
 const body=object(await response.json());if(rows(body.errors).length||Object.keys(object(body.errors)).length)throw new Error('API-Football response error');
 const data=rows(body.response);if(cache.size>=250)cache.delete(cache.keys().next().value!);
 cache.set(path,{until:Date.now()+ttl,data});return data;
}
function fixtureFor(match:Match,fixtures:Rec[]):Rec|undefined {
 return fixtures.find(item=>{
  const teams=object(item.teams),home=object(teams.home),away=object(teams.away),fixture=object(item.fixture);
  if(!sameTeam(value(home.name),match.home)||!sameTeam(value(away.name),match.away))return false;
  if(!match.kickoff||!fixture.date)return true;
  const delta=Math.abs(Date.parse(match.kickoff)-Date.parse(value(fixture.date)));
  return Number.isFinite(delta)&&delta<=4*60*60*1000;
 });
}
function penaltyOf(item:Rec):Pick<Match,'penaltyHome'|'penaltyAway'> {
 const p=object(object(item.score).penalty);
 return p.home==null||p.away==null?{}:{penaltyHome:value(p.home),penaltyAway:value(p.away)};
}
export async function enrichMatchDetails(base:EventData):Promise<EventData> {
 const match=base.match;
 if(!process.env.API_FOOTBALL_KEY?.trim()||match.sport==='Basketball'||(!match.date&&!match.kickoff))return base;
 if(base.stats.length&&base.timeline.length&&base.lineup.length&&(match.penaltyHome!=null||!/^PEN$/i.test(match.status)))return base;
 try {
  const day=match.date||match.kickoff.slice(0,10);
  if(!/^\d{4}-\d{2}-\d{2}$/.test(day))return base;
  const ttl=isFinishedStatus(match.status)?3600000:60000;
  // TheSportsDB sometimes provides API-Football's fixture ID directly.
  // Verify the date before trusting it; otherwise search by both teams and kickoff.
  let fixture:Rec|undefined;
  if(/^\d{1,12}$/.test(match.apiFootballId||'')) {
   const direct=await fetchRows(`fixtures?id=${match.apiFootballId}`,ttl);
   const candidate=direct[0],stamp=value(object(candidate?.fixture).date);
   if(candidate&&(!stamp||!match.kickoff||Math.abs(Date.parse(stamp)-Date.parse(match.kickoff))<=6*3600000))fixture=candidate;
  }
  if(!fixture)fixture=fixtureFor(match,await fetchRows(`fixtures?date=${encodeURIComponent(day)}`,ttl));
  if(!fixture)return base;
  const fixtureId=value(object(fixture.fixture).id);if(!/^\d+$/.test(fixtureId))return base;
  const beforeKickoff=match.kickoff?Date.parse(match.kickoff)>Date.now():false;
  const embedded={stats:fixture.statistics,events:fixture.events,lineups:fixture.lineups};
  const missing=[!beforeKickoff&&!base.stats.length?'stats':'',!beforeKickoff&&!base.timeline.length?'events':'',!base.lineup.length?'lineups':''].filter(Boolean);
  const absent=missing.filter(kind=>!Array.isArray(embedded[kind as keyof typeof embedded]));
  const fetched=await Promise.allSettled(absent.map(kind=>fetchRows(`fixtures/${kind==='stats'?'statistics':kind}?fixture=${fixtureId}`,ttl)));
  const found=new Map(missing.map(kind=>[kind,rows(embedded[kind as keyof typeof embedded])]));
  absent.forEach((kind,i)=>found.set(kind,fetched[i].status==='fulfilled'?(fetched[i] as PromiseFulfilledResult<Rec[]>).value:[]));
  const teamIds=object(fixture.teams);const homeId=value(object(teamIds.home).id);
  const statSides=found.get('stats')||[];
  const homeStats=rows(statSides.find(side=>value(object(side.team).id)===homeId)?.statistics);
  const awayStats=rows(statSides.find(side=>value(object(side.team).id)!==homeId)?.statistics);
  const stats=homeStats.map(row=>{const label=value(row.type);const away=awayStats.find(other=>value(other.type)===label);return {name:label,home:value(row.value),away:value(away?.value)}}).filter(row=>row.home||row.away);
  const timeline=(found.get('events')||[]).map((entry,i)=>{const time=object(entry.time),player=object(entry.player),related=object(entry.assist),team=object(entry.team);return {id:`api-football-${fixtureId}-${i}`,minute:`${value(time.elapsed)}${time.extra?`+${value(time.extra)}`:''}`,kind:value(entry.type),detail:value(entry.detail),player:value(player.name),relatedPlayer:value(related.name),team:hebrewTeam(value(team.name)),home:value(team.id)===homeId}});
  const lineup=(found.get('lineups')||[]).flatMap(side=>{const isHome=value(object(side.team).id)===homeId;return [...rows(side.startXI).map(x=>({player:x.player,substitute:false})),...rows(side.substitutes).map(x=>({player:x.player,substitute:true}))].map(x=>{const p=object(x.player);return {id:value(p.id),name:value(p.name),home:isHome,substitute:Boolean(x.substitute),position:({G:'Goalkeeper',D:'Defender',M:'Midfielder',F:'Forward'} as Record<string,string>)[value(p.pos)]||value(p.pos),number:value(p.number)}}).filter(x=>x.name)});
  const result={...base,match:{...match,...penaltyOf(fixture)},stats:base.stats.length?base.stats:stats,timeline:base.timeline.length?base.timeline:timeline,lineup:base.lineup.length?base.lineup:lineup};
  return {...result,supplementedBy:(result.stats.length>base.stats.length||result.timeline.length>base.timeline.length||result.lineup.length>base.lineup.length)?'API-Football':undefined,unavailable:base.unavailable.filter(label=>!(label==='סטטיסטיקות'&&result.stats.length||label==='אירועים'&&result.timeline.length||label==='הרכבים'&&result.lineup.length))};
 }catch(error){console.warn('secondary_details_unavailable',{message:error instanceof Error?error.message:'Unknown'});return base}
}
function isFinishedStatus(status:string){return /^(FT|AET|PEN|Finished|Match Finished|After Penalties|After Extra Time)$/i.test(status)}
