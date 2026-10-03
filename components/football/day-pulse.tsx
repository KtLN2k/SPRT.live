"use client";
import {useEffect,useState,type ReactNode} from "react";
import {Flame,Radio,Swords,Timer,Trophy,Goal,Scale} from "lucide-react";
import {isFinished,isLive,leagueName} from "@/lib/football/types";
import type {Match} from "@/lib/football/types";
import {displayName} from "@/lib/football/names";
import {competitionPriority} from "@/lib/football/competition-order";

type Sport="Soccer"|"Basketball";
const score=(m:Match)=>m.homeScore!=null&&m.awayScore!=null&&m.homeScore!==""&&m.awayScore!==""?[Number(m.homeScore),Number(m.awayScore)] as const:null;
const pick=<T,>(list:T[],value:(x:T)=>number)=>list.reduce<T|undefined>((best,x)=>best===undefined||value(x)>value(best)?x:best,undefined);

const senior=(m:Match)=>!/\bu-?\d{2}\b|under[ -]?\d{2}|women|ladies|youth|reserve/i.test(m.league)&&![m.home,m.away].some(t=>/\s(?:ii|b|u-?\d{2})$|women|youth|עד גיל|נשים|נוער/i.test(t));
// Highlights should name matches people recognise: senior teams, and well-known competitions when there are any.
const notable=(list:Match[])=>{const grown=list.filter(senior),pool=grown.length?grown:list,known=pool.filter(m=>competitionPriority(m)<=6);return known.length?known:pool;};
function useNow(ms:number){const [now,setNow]=useState(()=>Date.now());useEffect(()=>{const t=setInterval(()=>setNow(Date.now()),ms);return()=>clearInterval(t);},[ms]);return now;}
function countdown(target:number,now:number){
 const mins=Math.max(0,Math.round((target-now)/60000));
 if(mins<1)return "מתחיל עכשיו";
 if(mins<60)return `בעוד ${mins} דק׳`;
 const h=Math.floor(mins/60),m=mins%60;
 return h<24?`בעוד ${h}:${String(m).padStart(2,"0")} שע׳`:`בעוד ${Math.round(h/24)} ימים`;
}
const Score=({m}:{m:Match})=><b className="dp-score"><span>{m.homeScore}</span>:<span>{m.awayScore}</span></b>;

function Card({tone,icon,label,children,onClick,title}:{tone:string;icon:ReactNode;label:string;children:ReactNode;onClick?:()=>void;title?:string}){
 return <button type="button" className={`dp-card ${tone}`} onClick={onClick} disabled={!onClick} title={title}><span className="dp-label">{icon}{label}</span>{children}</button>;
}

export function DayPulse({matches,sport,isToday,showLive,openMatch}:{matches:Match[];sport:Sport;isToday:boolean;showLive:()=>void;openMatch:(m:Match)=>void}){
 const now=useNow(30000);
 if(!matches.length)return null;
 const basketball=sport==="Basketball";
 const live=matches.filter(m=>isLive(m.status));
 const scored=matches.filter(m=>(isLive(m.status)||isFinished(m.status))&&score(m));
 const finished=scored.filter(m=>isFinished(m.status));
 const total=scored.reduce((sum,m)=>{const s=score(m)!;return sum+s[0]+s[1];},0);
 const wildest=pick(notable(scored),m=>{const s=score(m)!;return s[0]+s[1];});
 const biggest=pick(notable(finished.filter(m=>m!==wildest)),m=>{const s=score(m)!;return Math.abs(s[0]-s[1]);});
 const closest=pick(notable(finished),m=>{const s=score(m)!;return -Math.abs(s[0]-s[1]);});
 const upcoming=notable(matches.filter(m=>!isLive(m.status)&&!isFinished(m.status)&&Date.parse(m.kickoff)>now-5*60000))
  .sort((a,b)=>competitionPriority(a)-competitionPriority(b)||Date.parse(a.kickoff)-Date.parse(b.kickoff));
 const next=upcoming[0];
 const wildTotal=wildest?score(wildest)!.reduce((a,b)=>a+b,0):0;
 const bigDiff=biggest?Math.abs(score(biggest)![0]-score(biggest)![1]):0;
 const cards:ReactNode[]=[];
 if(isToday)cards.push(<Card key="live" tone={live.length?"live":"calm"} icon={<Radio size={14}/>} label="בלייב עכשיו" onClick={live.length?showLive:undefined}><strong className="dp-big">{live.length}</strong><small>{live.length?`מתוך ${matches.length} משחקים היום`:"אין משחקים חיים כרגע"}</small></Card>);
 if(scored.length)cards.push(<Card key="total" tone="goals" icon={basketball?<Trophy size={14}/>:<Goal size={14}/>} label={basketball?"נקודות היום":"שערים היום"}><strong className="dp-big">{total.toLocaleString("he-IL")}</strong><small>{basketball?`ממוצע ${Math.round(total/scored.length)} למשחק`:`ממוצע ${(total/scored.length).toFixed(1)} למשחק`}</small></Card>);
 if(!basketball&&wildest&&wildTotal>=3)cards.push(<Card key="wild" tone="hot" icon={<Flame size={14}/>} label="המשחק הסוער" onClick={()=>openMatch(wildest)} title="למרכז המשחק"><span className="dp-match">{displayName(wildest.home)} <Score m={wildest}/> {displayName(wildest.away)}</span><small>{wildTotal} שערים · {leagueName(wildest.league)}</small></Card>);
 if(basketball&&closest)cards.push(<Card key="close" tone="hot" icon={<Scale size={14}/>} label="הצמוד ביותר" onClick={()=>openMatch(closest)} title="למרכז המשחק"><span className="dp-match">{displayName(closest.home)} <Score m={closest}/> {displayName(closest.away)}</span><small>הפרש {Math.abs(score(closest)![0]-score(closest)![1])} · {leagueName(closest.league)}</small></Card>);
 if(biggest&&bigDiff>=(basketball?15:3))cards.push(<Card key="big" tone="win" icon={<Swords size={14}/>} label="הניצחון הגדול" onClick={()=>openMatch(biggest)} title="למרכז המשחק"><span className="dp-match">{displayName(biggest.home)} <Score m={biggest}/> {displayName(biggest.away)}</span><small>הפרש {bigDiff} · {leagueName(biggest.league)}</small></Card>);
 if(next)cards.push(<Card key="next" tone="next" icon={<Timer size={14}/>} label="המשחק הבא שלא כדאי לפספס" onClick={()=>openMatch(next)} title="למרכז המשחק"><span className="dp-match">{displayName(next.home)} <i>נגד</i> {displayName(next.away)}</span><small>{isToday?countdown(Date.parse(next.kickoff),now):new Intl.DateTimeFormat("he-IL",{timeZone:"Asia/Jerusalem",hour:"2-digit",minute:"2-digit"}).format(new Date(next.kickoff))} · {leagueName(next.league)}</small></Card>);
 if(cards.length<2)return null;
 return <section className="dp" aria-label="דופק היום"><header className="dp-head"><h2><span className="dp-pulse" aria-hidden="true"/>{isToday?"הדופק של היום":"סיכום היום"}</h2><p>מחושב בזמן אמת מכל המשחקים · בלי פרסומות, בלי הרשמה</p></header><div className="dp-cards">{cards.slice(0,5)}</div></section>;
}
