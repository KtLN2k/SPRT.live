"use client";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { League } from "@/lib/football/types";
import { leagueName } from "@/lib/football/types";
import { Emblem } from "./ui";

export type LeagueGroup = { label: string; ids: string[] };

export function LeaguePicker({ leagues, groups, value, onChange, className = "" }: { leagues: League[]; groups: LeagueGroup[]; value?: string; onChange: (id: string) => void; className?: string }) {
  const byId = new Map(leagues.map(l => [l.id, l]));
  const sections = groups.map(g => ({ ...g, items: g.ids.map(id => byId.get(id)).filter((l): l is League => !!l) })).filter(g => g.items.length);
  const listed = new Set(sections.flatMap(g => g.items.map(l => l.id)));
  const current = value ? byId.get(value) : undefined;
  if (current && !listed.has(current.id)) sections.unshift({ label: "נבחרה", ids: [current.id], items: [current] });
  return <Select value={value} onValueChange={onChange} dir="rtl">
    <SelectTrigger className={`league-picker ${className}`} aria-label="בחירת ליגה"><SelectValue placeholder="בחר ליגה"/></SelectTrigger>
    <SelectContent className="league-picker-menu" position="popper" sideOffset={6}>
      {sections.map((g, i) => <SelectGroup key={g.label}>
        {i > 0 && <SelectSeparator/>}
        <SelectLabel>{g.label}</SelectLabel>
        {g.items.map(l => <SelectItem key={l.id} value={l.id}><span className="league-picker-item"><Emblem name={leagueName(l.name)} id={l.id} kind="league" src={l.badge} small/><span>{leagueName(l.name)}</span></span></SelectItem>)}
      </SelectGroup>)}
    </SelectContent>
  </Select>;
}
