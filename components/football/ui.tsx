"use client";
import { useState, useEffect, useRef } from "react";
import { Star, Shield, CalendarX2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import {TeamName} from "./team-name";
import { Skeleton } from "@/components/ui/skeleton";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import type { Favorite, Match, MatchCards } from "@/lib/football/types";
import { isLive, isFinished, statusText, liveMinute } from "@/lib/football/types";
import { badgeFor, resizedBadge, safeBadge } from "@/lib/football/identity";
import { requestData, useFootball, useFavorites, clock, dayLabel } from "@/lib/football/client";
export function FavoriteButton({ item, saved, toggle }: { item: Favorite; saved: boolean; toggle: (f: Favorite) => void }) {
  return <button type="button" className={`favorite ${saved ? "saved" : ""}`} onClick={() => { toggle(item); toast(saved ? "הוסר מהמעקב" : "נוסף למעקב", {description:item.name,duration:2200,icon:<Star size={18} fill={saved?"none":"currentColor"}/>}); }} aria-pressed={saved} aria-label={`${saved ? "הסר" : "הוסף"} ${item.name} ${saved ? "מהמועדפים" : "למועדפים"}`} title={saved ? "הסר מהמועדפים" : "הוסף למועדפים"}><Star size={19} fill={saved ? "currentColor" : "none"} /></button>;
}
const badgeRequests=new Map<string,Promise<string>>();
export function Emblem({ name, small = false, large = false, src, id, kind="team" }: { name: string; small?: boolean; large?: boolean; src?:string; id?:string; kind?:"team"|"league" }) {
 const ref=useRef<HTMLSpanElement>(null);const [failed,setFailed]=useState<string[]>([]);const [resolved,setResolved]=useState<{key:string;src:string}>({key:"",src:""});const key=`${kind}:${id}`;
 const remote=safeBadge(src),fetched=resolved.key===key?resolved.src:"",size=large?"small":"tiny";
 const source=[resizedBadge(remote,size),remote,badgeFor(name),resizedBadge(fetched,size),fetched].find(s=>s&&!failed.includes(s))||"";
 useEffect(()=>{if(source||!id||!/^\d{1,12}$/.test(id))return;let active=true;const el=ref.current;if(!el)return;
 const observer=new IntersectionObserver(entries=>{if(!entries.some(e=>e.isIntersecting))return;observer.disconnect();let request=badgeRequests.get(key);if(!request){request=requestData<{badge?:string}>(`view=badge&kind=${kind}&id=${id}`).then((d:{badge?:string})=>safeBadge(d.badge)).catch(()=>"");if(badgeRequests.size>300)badgeRequests.delete(badgeRequests.keys().next().value!);badgeRequests.set(key,request);}void request.then(src=>{if(active)setResolved({key,src});});},{rootMargin:"100px"});observer.observe(el);return()=>{active=false;observer.disconnect();};},[source,id,kind,key]);
 return <span ref={ref} className={`emblem ${small ? "small" : ""} ${source?"has-badge":"fallback-badge"}`} aria-hidden="true">{source ? <img src={source} alt="" loading="lazy" decoding="async" onError={()=>setFailed(old=>[...old,source])}/> : <><Shield size={small?23:30}/><span>{name.trim().slice(0,1)}</span></>}</span>;
}
export function MatchRow({ match: m, open, showDate = false }: { match: Match; open: (m: Match) => void; showDate?: boolean }) {
  const favorites=useFavorites();
  const rowRef=useRef<HTMLDivElement>(null);
  const [visible,setVisible]=useState(false);
  useEffect(()=>{const el=rowRef.current;if(!el)return;const observer=new IntersectionObserver(entries=>setVisible(entries.some(e=>e.isIntersecting)));observer.observe(el);return()=>observer.disconnect();},[]);
  const cardData=useFootball<{cards:MatchCards}>(visible&&m.sport!=="Basketball"&&isLive(m.status)?{view:"cards",id:m.id}:null,120000);
  const cards=cardData.data?.cards||m.cards;
  const state = isLive(m.status) ? (m.sport==="Basketball" ? `${statusText(m.status)}${m.progress ? ` · ${m.progress}` : ""}` : liveMinute(m)) : isFinished(m.status) ? "סיום" : ["PST", "CANC", "ABD", "SUSP", "INT"].includes(m.status) ? statusText(m.status) : clock(m.kickoff);
  return <div ref={rowRef} className={`match-wrap ${favorites.has("match",m.id)?"is-followed":""}`}><button className={`match ${isLive(m.status) ? "live-match" : ""}`} onClick={() => open(m)} aria-label={`${m.home} נגד ${m.away}, ${m.homeScore ?? ""} ${m.awayScore ?? ""}, ${state}`}><span className="desktop-matchline"><span className="desktop-match-home"><TeamName value={m.home} className="team-name"/><CardBadges yellow={cards?.homeYellow} red={cards?.homeRed}/><Emblem name={m.home} id={m.homeId} src={m.homeBadge} small/></span><span className="desktop-match-score" dir="rtl"><b>{m.homeScore??"–"}</b><i>:</i><b>{m.awayScore??"–"}</b></span><span className="desktop-match-away"><Emblem name={m.away} id={m.awayId} src={m.awayBadge} small/><TeamName value={m.away} className="team-name"/><CardBadges yellow={cards?.awayYellow} red={cards?.awayRed}/></span></span><span className={`match-time ${isLive(m.status) ? "playing" : ""}`}>{showDate && m.date && <small>{dayLabel(m.date, true)}</small>}{isLive(m.status) && <i className="live-dot"/>}{state}</span><span className="pair"><span><Emblem name={m.home} id={m.homeId} src={m.homeBadge} small/><TeamName value={m.home} className="team-name"/><CardBadges yellow={cards?.homeYellow} red={cards?.homeRed}/></span><span><Emblem name={m.away} id={m.awayId} src={m.awayBadge} small/><TeamName value={m.away} className="team-name"/><CardBadges yellow={cards?.awayYellow} red={cards?.awayRed}/></span></span><span className="score" aria-hidden="true"><b key={`h-${m.homeScore}`} className={Number(m.homeScore)>Number(m.awayScore)?"leading":""}>{m.homeScore ?? "–"}</b><b key={`a-${m.awayScore}`} className={Number(m.awayScore)>Number(m.homeScore)?"leading":""}>{m.awayScore ?? "–"}</b></span></button><FavoriteButton item={{kind:"match",id:m.id,name:`${m.home} – ${m.away}`,homeId:m.homeId,awayId:m.awayId,leagueId:m.leagueId,sport:m.sport==="Basketball"?"Basketball":"Soccer"}} saved={favorites.has("match",m.id)} toggle={favorites.toggle}/></div>;
}
export function LoadingRows() { return <div className="loading-rows" aria-label="טוען נתונים" role="status">{[0, 1, 2].map(i => <div key={i}><Skeleton className="h-10 w-10 rounded-lg"/><div><Skeleton className="h-3 w-36"/><Skeleton className="h-3 w-24"/></div><Skeleton className="mr-auto h-7 w-8"/></div>)}</div>; }
export function EmptyState({ title, description, error = false, retry }: { title: string; description?: string; error?: boolean; retry?: () => void }) { return <Empty className="empty-state"><EmptyHeader><EmptyMedia variant="icon">{error ? <AlertCircle/> : <CalendarX2/>}</EmptyMedia><EmptyTitle>{title}</EmptyTitle>{description && <EmptyDescription>{description}</EmptyDescription>}</EmptyHeader>{retry && <button className="plain-button" onClick={retry}>נסה שוב</button>}</Empty>; }
export function CoverageNote({ children }: { children?: React.ReactNode }) { return <div className="coverage-note"><AlertCircle size={16}/><span>{children || "המידע המוצג חלקי במסגרת החיבור הציבורי. כיסוי נוסף תלוי במנוי ובתחרות."}</span></div>; }

export function CardBadges({yellow,red}:{yellow?:number|null;red?:number|null}) {return <span className="card-badges">{typeof yellow==="number"&&yellow>0&&<span className="card-count yellow" aria-label={`${yellow} כרטיסים צהובים`} title={`${yellow} כרטיסים צהובים`}><i aria-hidden="true"/>{yellow}</span>}{typeof red==="number"&&red>0&&<span className="card-count red" aria-label={`${red} כרטיסים אדומים`} title={`${red} כרטיסים אדומים`}><i aria-hidden="true"/>{red}</span>}</span>;}
