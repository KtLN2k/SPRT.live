"use client";
import {useEffect,useId,useMemo,useRef,useState,type ReactNode} from "react";
import {Search,X,Trophy,Shield,CalendarClock,CornerDownLeft} from "lucide-react";
import {IoFootballOutline,IoBasketballOutline} from "react-icons/io5";
import {useFootball,clock} from "@/lib/football/client";
import {countryName,isLive,isFinished,leagueName} from "@/lib/football/types";
import type {League,Match} from "@/lib/football/types";
import {hebrewTeam} from "@/lib/football/names";
import {TABLE_GROUPS,TOP_LEAGUES} from "@/lib/football/competition-order";
import {Emblem} from "./ui";
import type {Panel} from "./details";

type Sport="Soccer"|"Basketball";
type RemoteTeam={id:string;name:string;english?:string;country:string;league:string;badge?:string;sport?:Sport};
type Item=
 |{kind:"league";key:string;league:League;sport:Sport}
 |{kind:"team";key:string;team:RemoteTeam;sport:Sport}
 |{kind:"match";key:string;match:Match};

const fold=(s:string)=>s.toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[׳״'"`.\-־]/g,"").replace(/\s+/g," ").trim();
const rank=(q:string,...labels:string[])=>{let best=-1;for(const raw of labels){const s=fold(raw);const r=s===q?4:s.startsWith(q)?3:s.split(" ").some(w=>w.startsWith(q))?2:s.includes(q)?1:-1;if(r>best)best=r;}return best;};
const priorityIds=[...TOP_LEAGUES.Soccer,...TABLE_GROUPS.flatMap(g=>g.ids),...TOP_LEAGUES.Basketball];
const leaguePriority=(id:string)=>{const i=priorityIds.indexOf(id);return i<0?999:i;};

function Highlight({text,query}:{text:string;query:string}){
 const i=query?text.toLocaleLowerCase().indexOf(query.toLocaleLowerCase()):-1;
 return i<0?<>{text}</>:<>{text.slice(0,i)}<mark>{text.slice(i,i+query.length)}</mark>{text.slice(i+query.length)}</>;
}
const SportIcon=({sport}:{sport:Sport})=>sport==="Basketball"?<IoBasketballOutline aria-label="כדורסל"/>:<IoFootballOutline aria-label="כדורגל"/>;

export function SmartSearch({value,onChange,sport,matches,footballLeagues,featured,openPanel,openMatch}:{value:string;onChange:(v:string)=>void;sport:Sport;matches:Match[];footballLeagues:League[];featured:League[];openPanel:(p:Panel)=>void;openMatch:(m:Match)=>void}){
 const [open,setOpen]=useState(false),[active,setActive]=useState(0),[debounced,setDebounced]=useState("");
 const root=useRef<HTMLDivElement>(null),input=useRef<HTMLInputElement>(null),listId=useId();
 const query=value.trim(),q=fold(query);
 useEffect(()=>{const t=setTimeout(()=>setDebounced(query),320);return()=>clearTimeout(t);},[query]);
 useEffect(()=>{if(!open)return;const close=(e:PointerEvent)=>{if(!root.current?.contains(e.target as Node))setOpen(false);};document.addEventListener("pointerdown",close);return()=>document.removeEventListener("pointerdown",close);},[open]);
 useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.key==="/"&&!/input|textarea|select/i.test((e.target as HTMLElement)?.tagName||"")){e.preventDefault();input.current?.focus();setOpen(true);}};window.addEventListener("keydown",key);return()=>window.removeEventListener("keydown",key);},[]);
 const basketballCatalog=useFootball<{leagues:League[]}>(open?{view:"leagues",sport:"Basketball"}:null);
 const remote=useFootball<{teams:RemoteTeam[]}>(open&&debounced.length>=2?{view:"search",q:debounced}:null);
 const searching=open&&query.length>=2&&(debounced!==query||remote.loading);

 const items=useMemo<Item[]>(()=>{
  if(q.length<2)return featured.slice(0,6).map(l=>({kind:"league",key:`l-${l.id}`,league:l,sport:(l.sport as Sport)||sport}));
  const catalog:[League,Sport][]=[...footballLeagues.map(l=>[l,"Soccer"] as [League,Sport]),...(basketballCatalog.data?.leagues||[]).map(l=>[l,"Basketball"] as [League,Sport])];
  const leagues=catalog.map(([l,s])=>({l,s,r:rank(q,leagueName(l.name),l.name,countryName(l.country))})).filter(x=>x.r>0)
   .sort((a,b)=>b.r-a.r||leaguePriority(a.l.id)-leaguePriority(b.l.id)||(a.s===sport?-1:0)-(b.s===sport?-1:0)).slice(0,5)
   .map(x=>({kind:"league",key:`l-${x.l.id}`,league:x.l,sport:x.s} as Item));
  const teams=new Map<string,Item>();
  for(const m of matches)for(const [id,name] of [[m.homeId,m.home],[m.awayId,m.away]] as const){
   if(id&&!teams.has(id)&&rank(q,hebrewTeam(name),name)>0)teams.set(id,{kind:"team",key:`t-${id}`,team:{id,name,country:m.country,league:m.league,badge:id===m.homeId?m.homeBadge:m.awayBadge},sport:(m.sport as Sport)||sport});
  }
  if(debounced===query){
   const scoredTeams=(remote.data?.teams||[]).filter(t=>!teams.has(t.id)).map(t=>({t,r:rank(q,hebrewTeam(t.name),t.english||"")-(/^_|youth|reserves|women|u\d\d/i.test(`${t.league} ${t.english}`)?4:0)}));
   const relevant=scoredTeams.filter(x=>x.r>0);
   for(const {t} of (relevant.length?relevant:scoredTeams.slice(0,3)).sort((a,b)=>b.r-a.r||(a.t.sport===sport?-1:0)-(b.t.sport===sport?-1:0)))teams.set(t.id,{kind:"team",key:`t-${t.id}`,team:t,sport:t.sport||"Soccer"});
  }
  const teamList=[...teams.values()].slice(0,7);
  const games=matches.filter(m=>rank(q,hebrewTeam(m.home),hebrewTeam(m.away),m.home,m.away)>0).slice(0,3).map(m=>({kind:"match",key:`m-${m.id}`,match:m} as Item));
  return [...leagues,...teamList,...games];
 },[q,query,debounced,featured,footballLeagues,basketballCatalog.data,matches,remote.data,sport]);
 const safeActive=Math.min(active,Math.max(items.length-1,0));

 const choose=(item:Item)=>{
  setOpen(false);input.current?.blur();
  if(item.kind==="league")openPanel({kind:"league",id:item.league.id,name:item.league.name,sport:item.sport});
  else if(item.kind==="team")openPanel({kind:"team",id:item.team.id,name:item.team.english||item.team.name,sport:item.sport});
  else openMatch(item.match);
 };
 const onKey=(e:React.KeyboardEvent)=>{
  if(e.key==="ArrowDown"){e.preventDefault();setOpen(true);setActive(i=>(i+1)%Math.max(items.length,1));}
  else if(e.key==="ArrowUp"){e.preventDefault();setActive(i=>(i-1+items.length)%Math.max(items.length,1));}
  else if(e.key==="Enter"&&open&&items[safeActive]){e.preventDefault();choose(items[safeActive]);}
  else if(e.key==="Escape"){if(value)onChange("");else{setOpen(false);input.current?.blur();}}
 };

 const sections:[string,ReactNode,Item["kind"]][]=[[q.length<2?"ליגות פופולריות":"ליגות ותחרויות",<Trophy key="l" size={13}/>,"league"],["קבוצות",<Shield key="t" size={13}/>,"team"],["משחקים היום",<CalendarClock key="m" size={13}/>,"match"]];
 let index=-1;
 return <div className={`ss ${open?"open":""}`} ref={root}>
  <label className="ss-field">
   <Search size={17} aria-hidden="true"/>
   <input ref={input} value={value} role="combobox" aria-expanded={open} aria-controls={listId} aria-autocomplete="list" aria-activedescendant={open&&items[safeActive]?`${listId}-${items[safeActive].key}`:undefined}
    onChange={e=>{onChange(e.target.value);setOpen(true);setActive(0);}} onFocus={()=>setOpen(true)} onKeyDown={onKey}
    placeholder="חיפוש קבוצה, ליגה או משחק..." aria-label="חיפוש קבוצות, ליגות ומשחקים"/>
   {value?<button type="button" className="ss-clear" onClick={()=>{onChange("");input.current?.focus();}} aria-label="ניקוי החיפוש"><X size={14}/></button>:<kbd aria-hidden="true">/</kbd>}
  </label>
  {open&&<div className="ss-pop" id={listId} role="listbox" aria-label="תוצאות חיפוש">
   {sections.map(([title,icon,kind])=>{
    const list=items.filter(i=>i.kind===kind);
    if(!list.length)return null;
    return <section key={kind} className="ss-section"><h3>{icon}{title}</h3>{list.map(item=>{index++;const i=index;return <button type="button" role="option" id={`${listId}-${item.key}`} aria-selected={i===safeActive} key={item.key} className={`ss-item ${i===safeActive?"active":""}`} onMouseEnter={()=>setActive(i)} onClick={()=>choose(item)}>
     {item.kind==="league"?<><Emblem name={item.league.name} id={item.league.id} src={item.league.badge} kind="league" small/><span className="ss-main"><b><Highlight text={leagueName(item.league.name)} query={query}/></b><small>{[item.sport==="Basketball"?"כדורסל":"כדורגל",countryName(item.league.country)].filter(Boolean).join(" · ")}</small></span><SportIcon sport={item.sport}/></>
     :item.kind==="team"?<><Emblem name={item.team.english||item.team.name} id={item.team.id} src={item.team.badge} small/><span className="ss-main"><b><Highlight text={hebrewTeam(item.team.name)} query={query}/></b><small>{[leagueName(item.team.league),countryName(item.team.country)].filter(Boolean).join(" · ")}</small></span><SportIcon sport={item.sport}/></>
     :<><span className={`ss-when ${isLive(item.match.status)?"live":""}`}>{isLive(item.match.status)?"LIVE":isFinished(item.match.status)?<><span>{item.match.homeScore}</span>:<span>{item.match.awayScore}</span></>:clock(item.match.kickoff)}</span><span className="ss-main"><b><Highlight text={hebrewTeam(item.match.home)} query={query}/> – <Highlight text={hebrewTeam(item.match.away)} query={query}/></b><small>{leagueName(item.match.league)}</small></span></>}
     <CornerDownLeft className="ss-enter" size={14} aria-hidden="true"/>
    </button>})}</section>;
   })}
   {searching&&<div className="ss-loading"><i/><i/><i/>מחפש קבוצות בכדורגל ובכדורסל…</div>}
   {!searching&&q.length>=2&&!items.length&&<div className="ss-empty">לא מצאנו תוצאות ל״{query}״. נסו שם אחר, בעברית או באנגלית.</div>}
   <footer className="ss-foot"><span><kbd>↑</kbd><kbd>↓</kbd> ניווט</span><span><kbd>Enter</kbd> פתיחה</span><span><kbd>Esc</kbd> סגירה</span></footer>
  </div>}
 </div>;
}
