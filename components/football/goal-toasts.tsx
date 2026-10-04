"use client";
import {useCallback,useEffect,useRef,useState} from "react";
import {ArrowLeft,ArrowRight,Settings2,X} from "lucide-react";
import {IoFootballOutline} from "react-icons/io5";
import {useFavorites,useGoalLog,useGoalToastSettings} from "@/lib/football/client";
import {follows,isFinished,isLive,leagueName,liveMinute} from "@/lib/football/types";
import type {Match} from "@/lib/football/types";
import {hebrewTeam} from "@/lib/football/names";
import {competitionPriority} from "@/lib/football/competition-order";
import {Emblem} from "./ui";

type Toast={key:string;match:Match;home:boolean;minute:string;score:[number,number];scorer?:string};
const DURATION=9000,MAX=3;
export const GOAL_PREVIEW_EVENT="kickoff:goal-preview";

const goals=(m:Match)=>m.homeScore==null||m.awayScore==null||m.homeScore===""||m.awayScore===""?null:[Number(m.homeScore),Number(m.awayScore)] as [number,number];
const senior=(m:Match)=>!/\bu-?\d{2}\b|under[ -]?\d{2}|women|youth|reserve/i.test(m.league)&&![m.home,m.away].some(t=>/\s(?:ii|b|u-?\d{2})$|women|youth|עד גיל|נשים/i.test(t));

function GoalToast({toast,onClose,onOpen,onSettings}:{toast:Toast;onClose:()=>void;onOpen:()=>void;onSettings:()=>void}){
 const {match:m,home,minute,score,scorer}=toast;
 const [paused,setPaused]=useState(false);
 const [exiting,setExiting]=useState(false);
 const left=useRef(DURATION),started=useRef(0);
 const closeRef=useRef(onClose);
 closeRef.current=onClose;
 const beginClose=useCallback(()=>{
  setExiting(true);
  window.setTimeout(()=>closeRef.current(),360);
 },[]);
 const activate=()=>{setExiting(true);window.setTimeout(onOpen,280);};
 useEffect(()=>{
  if(paused||exiting)return;
  started.current=Date.now();
  const t=setTimeout(beginClose,left.current);
  return()=>{clearTimeout(t);left.current-=Date.now()-started.current;};
 },[paused,exiting,beginClose]);
 const Arrow=home?ArrowRight:ArrowLeft;
 const scorerTeam=hebrewTeam(home?m.home:m.away);
 return <article className={`gt ${home?"home":"away"} ${paused?"paused":""} ${exiting?"leaving":""}`} role="status" aria-live="polite" aria-label={`גול ל${scorerTeam}, ${hebrewTeam(m.home)} ${score[0]} ${hebrewTeam(m.away)} ${score[1]}`}
  onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)} style={{"--gt-life":`${DURATION}ms`} as React.CSSProperties}>
  <header className="gt-head">
   <span className="gt-flash"><IoFootballOutline aria-hidden="true"/>שער</span>
   {minute&&<span className="gt-minute">{minute}</span>}
   <span className="gt-league">{leagueName(m.league)}</span>
   <button type="button" className="gt-icon" onClick={onSettings} aria-label="הגדרות התראות גול" title="הגדרות"><Settings2 size={14}/></button>
   <button type="button" className="gt-icon" onClick={beginClose} aria-label="סגירה" title="סגירה"><X size={15}/></button>
  </header>
  <button type="button" className="gt-body" onClick={activate} title="למרכז המשחק">
   <span className={`gt-team ${home?"scored":""}`}><Emblem name={m.home} id={m.homeId} src={m.homeBadge} small/><b>{hebrewTeam(m.home)}</b></span>
   <span className="gt-center">
    <span className="gt-score"><span className={home?"hit":""}>{score[0]}</span><i>:</i><span className={home?"":"hit"}>{score[1]}</span></span>
    <span className="gt-arrow" aria-hidden="true"><Arrow size={16}/></span>
   </span>
   <span className={`gt-team ${home?"":"scored"}`}><b>{hebrewTeam(m.away)}</b><Emblem name={m.away} id={m.awayId} src={m.awayBadge} small/></span>
  </button>
  <footer className="gt-foot">{scorer?<><span>מבקיע</span><b>{scorer}</b></>:<span>השער של <b>{scorerTeam}</b></span>}</footer>
  <IoFootballOutline className="gt-watermark" aria-hidden="true"/>
  <i className="gt-life" aria-hidden="true"/>
 </article>;
}

export function GoalToasts({matches,openMatch,openSettings}:{matches:Match[]|undefined;openMatch:(m:Match)=>void;openSettings:()=>void}){
 const {settings}=useGoalToastSettings();
 const {favorites}=useFavorites();
 const goalLog=useGoalLog();
 const [toasts,setToasts]=useState<Toast[]>([]);
 const previous=useRef<Map<string,[number,number]>|null>(null);
 const resumed=useRef(false);
 const latest=useRef({settings,favorites,goalLog});
 latest.current={settings,favorites,goalLog};
 useEffect(()=>{const onVisibility=()=>{if(document.visibilityState==="hidden"){resumed.current=true;setToasts([]);}};document.addEventListener("visibilitychange",onVisibility);return()=>document.removeEventListener("visibilitychange",onVisibility);},[]);

 const push=(items:Toast[])=>{
  if(!items.length)return;
  setToasts(list=>[...items,...list].slice(0,MAX));
  const {settings:s}=latest.current;
  if(s.desktop&&document.hidden&&"Notification" in window&&Notification.permission==="granted")for(const t of items){
   try{new Notification(`גול! ${hebrewTeam(t.home?t.match.home:t.match.away)}`,{body:`${hebrewTeam(t.match.home)} ${t.score[0]} : ${t.score[1]} ${hebrewTeam(t.match.away)}${t.minute?` · ${t.minute}`:""}`,tag:t.key,icon:"/favicon.svg"});}catch{/* the on-page toast is still shown */}
  }
  for(const t of items)void findScorer(t);
 };
 const findScorer=async(t:Toast)=>{
  await new Promise(r=>setTimeout(r,2500));
  try{
   const res=await fetch(`/api/football?view=event&id=${t.match.id}&sport=Soccer&section=timeline`);
   if(!res.ok)return;
   const data=await res.json() as {timeline?:{kind:string;player:string;home:boolean;minute:string}[]};
   const goal=(data.timeline||[]).filter(e=>e.kind.toLowerCase()==="goal"&&e.home===t.home&&e.player).sort((a,b)=>parseFloat(b.minute)-parseFloat(a.minute))[0];
   if(goal)setToasts(list=>list.map(x=>x.key===t.key?{...x,scorer:goal.player}:x));
  }catch{/* scorer is optional */}
 };

 useEffect(()=>{
  if(!matches?.length)return;
  const now=new Map<string,[number,number]>();
  for(const m of matches){const g=goals(m);if(g)now.set(m.id,g);}
  const before=previous.current;previous.current=now;
  if(!before)return;
  if(resumed.current){resumed.current=false;return;}
  const {settings:s,favorites:f,goalLog:log}=latest.current;
  const found:Toast[]=[],logged:{matchId:string;goal:{minute:string;home:boolean;score:string;at:string}}[]=[];
  for(const m of matches){
   const old=before.get(m.id),cur=now.get(m.id);
   if(!old||!cur||!(isLive(m.status)||isFinished(m.status)))continue;
   for(const home of [true,false]){
    const i=home?0:1;
    if(cur[i]<=old[i]||cur[i]-old[i]>3)continue;
    const minute=isLive(m.status)?liveMinute(m):"";
    logged.push({matchId:m.id,goal:{minute:minute.replace(/[′']/g,""),home,score:`${cur[0]}-${cur[1]}`,at:new Date().toISOString()}});
    const wanted=s.scope==="all"||(s.scope==="favorites"?follows(m,f):competitionPriority(m)<=6&&senior(m))||follows(m,f);
    if(s.enabled&&wanted)found.push({key:`${m.id}:${cur[0]}-${cur[1]}`,match:m,home,minute,score:cur});
   }
  }
  log.add(logged);
  push(found);
  // eslint-disable-next-line react-hooks/exhaustive-deps
 },[matches]);

 useEffect(()=>{
  const preview=()=>{
   const sample=matches?.find(m=>isLive(m.status)&&goals(m))||matches?.find(m=>goals(m));
   const m:Match=sample||{id:"preview",leagueId:"4328",league:"English Premier League",country:"England",home:"Arsenal",away:"Chelsea",homeId:"133604",awayId:"133610",homeScore:"2",awayScore:"1",kickoff:"",date:"",status:"2H",progress:"67",round:"",group:"",venue:"",season:""};
   const g=goals(m)||[1,0];
   setToasts(list=>[{key:`preview-${Date.now()}`,match:m,home:true,minute:isLive(m.status)?liveMinute(m):"67′",score:[Math.max(g[0],1),g[1]] as [number,number],scorer:sample?undefined:"בוקאיו סאקה"},...list].slice(0,MAX));
  };
  window.addEventListener(GOAL_PREVIEW_EVENT,preview);
  return()=>window.removeEventListener(GOAL_PREVIEW_EVENT,preview);
 },[matches]);

 if(!toasts.length)return null;
 return <div className="gt-stack" dir="rtl" aria-label="עדכוני שערים">{toasts.map(t=><GoalToast key={t.key} toast={t}
  onClose={()=>setToasts(list=>list.filter(x=>x.key!==t.key))}
  onOpen={()=>{setToasts(list=>list.filter(x=>x.key!==t.key));if(t.match.id!=="preview")openMatch(t.match);}}
  onSettings={openSettings}/>)}</div>;
}
