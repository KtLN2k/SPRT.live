"use client";
import {Bell,BellOff,Flag,Play,Goal} from "lucide-react";
import {DropdownMenu,DropdownMenuTrigger,DropdownMenuContent,DropdownMenuLabel,DropdownMenuCheckboxItem,DropdownMenuSeparator,DropdownMenuItem} from "@/components/ui/dropdown-menu";
import {useMatchNotifications} from "@/lib/football/client";
import type {Match} from "@/lib/football/types";

export function MatchAlertMenu({match}:{match:Match}){
 const notifications=useMatchNotifications(),enabled=notifications.enabled(match),options=notifications.preferences(match);
 return <DropdownMenu dir="rtl"><DropdownMenuTrigger asChild><button type="button" className="match-action match-bell" aria-label="הגדרות התראות למשחק" aria-pressed={enabled} title="התראות למשחק"><Bell size={21} fill={enabled?"currentColor":"none"}/></button></DropdownMenuTrigger><DropdownMenuContent className="match-alert-menu" align="end" sideOffset={9}>
  <DropdownMenuLabel>עדכונים למשחק הזה</DropdownMenuLabel>
  <p className="match-alert-hint">בחר את העדכונים שחשובים לך</p>
  <DropdownMenuCheckboxItem checked={options.goals} onSelect={e=>e.preventDefault()} onCheckedChange={on=>notifications.setEvent(match,"goals",Boolean(on))}><Goal size={17}/>{match.sport==="Basketball"?"סלים ועדכוני תוצאה":"שערים ועדכוני תוצאה"}</DropdownMenuCheckboxItem>
  <DropdownMenuCheckboxItem checked={options.kickoff} onSelect={e=>e.preventDefault()} onCheckedChange={on=>notifications.setEvent(match,"kickoff",Boolean(on))}><Play size={17}/>תחילת המשחק</DropdownMenuCheckboxItem>
  <DropdownMenuCheckboxItem checked={options.fulltime} onSelect={e=>e.preventDefault()} onCheckedChange={on=>notifications.setEvent(match,"fulltime",Boolean(on))}><Flag size={17}/>תוצאת הסיום</DropdownMenuCheckboxItem>
  <p className="match-alert-footnote">העדכונים מתקבלים כשהאתר פתוח.</p>
  <DropdownMenuSeparator/>
  <DropdownMenuItem className="disable-match-alerts" onSelect={()=>notifications.disable(match)}><BellOff size={17}/>ביטול כל ההתראות למשחק</DropdownMenuItem>
 </DropdownMenuContent></DropdownMenu>;
}
