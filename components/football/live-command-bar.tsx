"use client";
import {Activity,CalendarDays,ChevronLeft,ChevronRight,CircleCheck,Clock3,LayoutGrid,RotateCcw,Star} from "lucide-react";
import {dayLabel,shiftDate,today} from "@/lib/football/client";

const SECONDARY=[
 {id:"all",label:"כל המשחקים",Icon:LayoutGrid},
 {id:"upcoming",label:"בהמשך",Icon:Clock3},
 {id:"finished",label:"הסתיימו",Icon:CircleCheck},
 {id:"followed",label:"במעקב",Icon:Star},
] as const;

type Props={
 date:string;
 days:string[];
 filter:string;
 counts:Record<string,number>;
 active:boolean;
 onDate:(date:string)=>void;
 onFilter:(filter:string)=>void;
};

export function LiveCommandBar({date,days,filter,counts,active,onDate,onFilter}:Props){
 const now=today(),live=counts.live||0;
 return <section className="lc-wrap" aria-label="משחקים ועדכונים">
  <div className="lc-bar">
   <button type="button" className={`lc-live ${active&&filter==="live"?"active":""}`} aria-pressed={active&&filter==="live"} onClick={()=>onFilter("live")}>
    <span className="lc-broadcast"><Activity size={16}/><i aria-hidden="true"/></span>
    <span className="lc-live-copy"><strong>עכשיו בלייב</strong><small>{live?`${live} משחקים מתקיימים כעת`:"מחכים למשחק הבא"}</small></span>
    <b>{live}</b>
   </button>

   <nav className="lc-filters" aria-label="סינון משחקים">
    {SECONDARY.map(({id,label,Icon})=><button key={id} type="button" className={active&&filter===id?"active":""} aria-pressed={active&&filter===id} onClick={()=>onFilter(id)}>
     <Icon size={14}/><span>{label}</span><em>{counts[id]||0}</em>
    </button>)}
   </nav>

   <div className="lc-calendar" aria-label="בחירת יום">
    <label className="lc-picker" title="בחירת תאריך"><CalendarDays size={16}/><input type="date" value={date} onChange={e=>e.target.value&&onDate(e.target.value)} aria-label="בחירת תאריך"/></label>
    <button type="button" className="lc-arrow" onClick={()=>onDate(shiftDate(date,-7))} aria-label="שבוע קודם"><ChevronRight size={16}/></button>
    <div className="lc-days">{days.map(d=>{
     const isToday=d===now,[weekday,rest]=dayLabel(d,true).split(","),[num,month]=(rest||"").trim().split(" ");
     return <button type="button" key={d} className={`${d===date?"active":""} ${isToday?"today":""}`} aria-pressed={d===date} onClick={()=>onDate(d)}>
      <span>{isToday?"היום":weekday.replace("יום ","")}</span><strong>{num||d.slice(8)}</strong><small>{month}</small>
     </button>;
    })}</div>
    <button type="button" className="lc-arrow" onClick={()=>onDate(shiftDate(date,7))} aria-label="שבוע הבא"><ChevronLeft size={16}/></button>
    {date!==now&&<button type="button" className="lc-today" onClick={()=>onDate(now)}><RotateCcw size={13}/>היום</button>}
   </div>
  </div>
 </section>;
}
