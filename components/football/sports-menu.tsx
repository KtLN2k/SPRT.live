"use client";
import {useEffect,useRef,useState} from "react";
import {ChevronDown} from "lucide-react";
import {IoBasketballOutline,IoFootballOutline,IoTennisballOutline} from "react-icons/io5";

export type SportChoice="Soccer"|"Basketball"|"Tennis";
const SPORTS=[
 {id:"Soccer",label:"כדורגל",Icon:IoFootballOutline},
 {id:"Basketball",label:"כדורסל",Icon:IoBasketballOutline},
 {id:"Tennis",label:"טניס",Icon:IoTennisballOutline,soon:true},
] as const;

export function SportsMenu({current,active,onSelect}:{current:SportChoice;active:boolean;onSelect:(s:SportChoice)=>void}){
 const [open,setOpen]=useState(false);
 const root=useRef<HTMLDivElement>(null);
 const items=useRef<(HTMLButtonElement|null)[]>([]);
 useEffect(()=>{
  if(!open)return;
  const outside=(e:PointerEvent)=>{if(!root.current?.contains(e.target as Node))setOpen(false);};
  const key=(e:KeyboardEvent)=>{if(e.key==="Escape"){setOpen(false);root.current?.querySelector<HTMLButtonElement>(".sm-trigger")?.focus();}};
  document.addEventListener("pointerdown",outside);document.addEventListener("keydown",key);
  items.current[SPORTS.findIndex(s=>s.id===current)]?.focus();
  return()=>{document.removeEventListener("pointerdown",outside);document.removeEventListener("keydown",key);};
 },[open,current]);
 const move=(e:React.KeyboardEvent,i:number)=>{
  if(e.key!=="ArrowDown"&&e.key!=="ArrowUp")return;
  e.preventDefault();
  items.current[(i+(e.key==="ArrowDown"?1:SPORTS.length-1))%SPORTS.length]?.focus();
 };
 return <div className={`sm ${open?"open":""}`} ref={root} data-sport={current}>
  <button type="button" className={`sm-trigger ${active?"active":""}`} aria-haspopup="menu" aria-expanded={open} onClick={()=>setOpen(o=>!o)}>ענפים<ChevronDown size={15} aria-hidden="true"/></button>
  {open&&<div className="sm-menu" role="menu" aria-label="בחירת ענף">
   {SPORTS.map(({id,label,Icon,...rest},i)=>{const selected=id===current;return <button key={id} ref={el=>{items.current[i]=el}} type="button" role="menuitemradio" aria-checked={selected} className={`sm-item ${selected?"selected":""}`} onKeyDown={e=>move(e,i)} onClick={()=>{onSelect(id);setOpen(false);}}>
    <Icon className="sm-sport-icon" aria-hidden="true"/>
    <span>{label}</span>
    {"soon" in rest&&<small>בקרוב</small>}
   </button>;})}
  </div>}
 </div>;
}
