"use client";
export {detectAlerts} from "./notifications";
import type {MatchAlertOptions,MatchSubscriptions} from "./notifications";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { AlertItem, AlertSettings, DayData, Favorite, LiveState, Match } from "./types";
import { demoData, demoFavorites, demoAlerts } from "./demo";
import { follows, isFinished, isLive, liveMinute } from "./types";
export const today = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jerusalem", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
export const dayLabel = (date: string, short = false) => new Intl.DateTimeFormat("he-IL", { timeZone: "Asia/Jerusalem", weekday: short ? "short" : "long", day: "numeric", month: "short" }).format(new Date(`${date}T12:00:00Z`));
export const clock = (date: string) => { const d = new Date(date); return Number.isNaN(d.valueOf()) ? "שעה לא נקבעה" : new Intl.DateTimeFormat("he-IL", { timeZone: "Asia/Jerusalem", hour: "2-digit", minute: "2-digit" }).format(d); };
export const shiftDate = (date: string, amount: number) => { const d = new Date(`${date}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + amount); return d.toISOString().slice(0, 10); };
// Pace background enrichment and let an opened match jump ahead of queued badges/cards.
const requestQueue: {priority:number; run:()=>Promise<void>}[] = [];
let activeRequests=0, nextRequestAt=0;
function drainRequests() {
  if(activeRequests>=3||!requestQueue.length)return;
  const wait=nextRequestAt-Date.now();
  if(wait>0){setTimeout(drainRequests,wait);return;}
  requestQueue.sort((a,b)=>b.priority-a.priority);
  const job=requestQueue.shift()!;
  activeRequests++;nextRequestAt=Date.now()+300;
  void job.run().finally(()=>{activeRequests--;drainRequests();});
  if(requestQueue.length)setTimeout(drainRequests,300);
}
export function requestData<T>(query:string,signal?:AbortSignal):Promise<T> {
  const view=new URLSearchParams(query).get("view");
  return new Promise((resolve,reject)=>{
    requestQueue.push({priority:view==="event"?10:view==="badge"||view==="cards"?0:5,run:async()=>{
      try {
        const response=await fetch(`/api/football?${query}`,{signal:signal||AbortSignal.timeout(35000)});
        const data:unknown=await response.json();
        if(!response.ok)throw new Error(data&&typeof data==="object"&&"error" in data?String(data.error):"לא ניתן לטעון את הנתונים כרגע");
        resolve(data as T);
      }catch(error){reject(error);}
    }});
    drainRequests();
  });
}
// Share requests and retain successful results across screen changes.
const resourceCache = new Map<string, {data: unknown; at: number}>();
const resourceRequests = new Map<string, Promise<unknown>>();
function cachedRequest<T>(key: string): Promise<T> {
  let job = resourceRequests.get(key);
  if (!job) {
    job = requestData<T>(key).then(data => {
      if(resourceCache.size >= 250) resourceCache.delete(resourceCache.keys().next().value!);
      resourceCache.set(key, {data, at:Date.now()}); return data;
    }).finally(() => resourceRequests.delete(key));
    resourceRequests.set(key,job);
  }
  return job as Promise<T>;
}
export function useFootball<T>(params: Record<string, string> | null, interval = 0) {
  const { demo } = useDesignMode();
  const key = params ? new URLSearchParams(params).toString() : "";
  const [state, setState] = useState<{ key: string; data?: T; error?: string }>({ key: "" });
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt(v => v + 1), []);
  useEffect(() => {
    if (!key || demo) return;
    let active = true, busy = false;
    const cached=resourceCache.get(key);
    if(cached) setState({key,data:cached.data as T});
    const load = async () => {
      if (busy || document.visibilityState === "hidden") return;
      busy = true;
      try { const data = await cachedRequest<T>(key); if(active) setState({key,data}); }
      catch (e) { if(active) setState(old => ({key,data:old.key===key?old.data:resourceCache.get(key)?.data as T,error:e instanceof Error?e.message:"טעינת המידע נכשלה"})); }
      finally { busy=false; }
    };
    const ttl=interval?Math.min(interval,30000):300000;
    if(attempt || !cached || Date.now()-cached.at>ttl) void load();
    const timer=interval?setInterval(()=>void load(),interval):undefined;
    const visible=()=>{if(document.visibilityState==="visible")void load();};
    document.addEventListener("visibilitychange",visible);
    return ()=>{active=false;clearInterval(timer);document.removeEventListener("visibilitychange",visible);};
  },[key,interval,attempt,demo]);
  if(demo)return {data:key?demoData(new URLSearchParams(key)) as T:undefined,error:undefined,loading:false,retry};
  const data=state.key===key?state.data:resourceCache.get(key)?.data as T|undefined;
  const error=state.key===key?state.error:undefined;
  return {data,error,loading:Boolean(key)&&!data&&!error,retry};
}
export function useVisibilityResumeGuard() {
  const resumed=useRef(false);
  useEffect(()=>{
    const onVisibility=()=>{ if(document.visibilityState==="hidden") resumed.current=true; };
    document.addEventListener("visibilitychange",onVisibility);
    return()=>document.removeEventListener("visibilitychange",onVisibility);
  },[]);
  return resumed;
}
export const LIVE_INTERVAL=30000, DAY_INTERVAL=300000;
// The livescore feed keeps finished games for a while, so patching the day list from it is safe between full reloads.
export function useLiveDay(day: DayData | undefined, sport: "Soccer" | "Basketball", enabled: boolean): DayData | undefined {
  const live = useFootball<{ matches: Match[]; liveState: LiveState; fetchedAt: string | null }>(enabled && day && !day.limited ? { view: "live", sport } : null, LIVE_INTERVAL);
  const feed = live.data;
  return useMemo(() => {
    if (!day || !feed || feed.liveState !== "connected" || !feed.fetchedAt || feed.fetchedAt <= day.fetchedAt) return day;
    const updates = new Map(feed.matches.map(m => [m.id, m]));
    let changed = false;
    const matches = day.matches.map(m => {
      const update = updates.get(m.id);
      if (!update) return m;
      changed = true;
      return { ...m, ...Object.fromEntries(Object.entries(update).filter(([, value]) => value !== "" && value != null)) } as Match;
    });
    return changed ? { ...day, matches, liveState: "connected", fetchedAt: feed.fetchedAt } : day;
  }, [day, feed]);
}
const fallback = new Map<string, string>();
const read = (key: string) => { try { return localStorage.getItem(key) || fallback.get(key) || ""; } catch { return fallback.get(key) || ""; } };
const write = (key: string, value: unknown) => { const raw = JSON.stringify(value); fallback.set(key, raw); try { localStorage.setItem(key, raw); } catch { /* The current session remains usable when device storage is blocked. */ } window.dispatchEvent(new Event("matchline:storage")); };
const subscribe = (callback: () => void) => { window.addEventListener("storage", callback); window.addEventListener("matchline:storage", callback); return () => { window.removeEventListener("storage", callback); window.removeEventListener("matchline:storage", callback); }; };
function useDevice<T>(key: string, defaultValue: T) {
  const snapshot = useSyncExternalStore(subscribe, () => read(key), () => "");
  const value = useMemo(() => { try { return snapshot ? JSON.parse(snapshot) as T : defaultValue; } catch { return defaultValue; } }, [snapshot, defaultValue]);
  return [value, (next: T) => write(key, next)] as const;
}
const EMPTY_FAVORITES: Favorite[] = [];
const EMPTY_ALERTS: AlertItem[] = [];
const DEFAULT_SETTINGS: AlertSettings = { goals: true, kickoff: true, fulltime: true, desktop: false };
export function useDesignMode() { const [demo,setDemo] = useDevice<boolean>("kickoff:design-mode", false); return {demo,setDemo}; }
export function useFavorites() {
  const {demo}=useDesignMode();
  const [stored, set] = useDevice<Favorite[]>(demo ? "kickoff:demo-favorites" : "matchline:favorites:v2", demo ? demoFavorites : EMPTY_FAVORITES);
  const favorites = Array.isArray(stored) ? stored.filter(f => f && typeof f.id === "string" && typeof f.name === "string" && ["league", "team", "match"].includes(f.kind)) : EMPTY_FAVORITES;
  const has = (kind: Favorite["kind"], id: string) => favorites.some(f => f.kind === kind && f.id === id);
  const toggle = (item: Favorite) => { if (!item.id) return; set(has(item.kind, item.id) ? favorites.filter(f => !(f.kind === item.kind && f.id === item.id)) : [...favorites, item]); };
  return { favorites, has, toggle };
}
export function useAlerts() {
  const {demo}=useDesignMode();
  const [settings, setSettings] = useDevice<AlertSettings>("matchline:alert-settings", DEFAULT_SETTINGS);
  const [items, setItems] = useDevice<AlertItem[]>(demo ? "kickoff:demo-alerts" : "matchline:alerts", demo ? demoAlerts : EMPTY_ALERTS);
  const safeItems = Array.isArray(items) ? items.filter(a => a && typeof a.id === "string").slice(0, 100) : EMPTY_ALERTS;
  const safeSettings = { ...DEFAULT_SETTINGS, ...(settings && typeof settings === "object" ? settings : {}) };
  return { settings: safeSettings, setSettings, items: safeItems, markRead: (id?:string) => setItems(safeItems.map(a => !id||a.id===id?{ ...a, read: true }:a)), clear: () => setItems([]), add: (incoming: AlertItem[]) => { const seen = new Set(safeItems.map(a => a.id)); const next = incoming.filter(a => !seen.has(a.id)); if (next.length) setItems([...next, ...safeItems].slice(0, 100)); return next; } };
}

export function isQuietTime(settings: AlertSettings, date=new Date()) { if(!settings.quiet) return false; const time=new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Jerusalem",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(date); const from=settings.quietFrom||"23:00",to=settings.quietTo||"07:00"; return from>to ? time>=from||time<to : time>=from&&time<to; }

export type GoalToastSettings = { enabled: boolean; scope: "top" | "favorites" | "all"; desktop: boolean };
const DEFAULT_GOAL_TOASTS: GoalToastSettings = { enabled: true, scope: "top", desktop: false };
export function useGoalToastSettings() {
  const [stored, set] = useDevice<GoalToastSettings>("kickoff:goal-toasts", DEFAULT_GOAL_TOASTS);
  const settings = { ...DEFAULT_GOAL_TOASTS, ...(stored && typeof stored === "object" ? stored : {}) };
  return { settings, update: (patch: Partial<GoalToastSettings>) => set({ ...settings, ...patch }) };
}
// Goals seen in the live feed on this device; fills timelines the provider leaves without goal entries.
export type LoggedGoal = { minute: string; home: boolean; score: string; at: string };
type GoalLog = Record<string, LoggedGoal[]>;
const EMPTY_GOAL_LOG: GoalLog = {};
export function useGoalLog() {
  const [stored, set] = useDevice<GoalLog>("kickoff:goal-log", EMPTY_GOAL_LOG);
  const log = stored && typeof stored === "object" && !Array.isArray(stored) ? stored : EMPTY_GOAL_LOG;
  const add = (entries: { matchId: string; goal: LoggedGoal }[]) => {
    if (!entries.length) return;
    const next: GoalLog = { ...log };
    for (const { matchId, goal } of entries) {
      const list = next[matchId] || [];
      if (!list.some(g => g.score === goal.score)) next[matchId] = [...list, goal];
    }
    const keys = Object.keys(next);
    for (const key of keys.slice(0, Math.max(0, keys.length - 80))) delete next[key];
    set(next);
  };
  return { log, add };
}

export function useObservedGoalLog(matches:Match[]|undefined,sport:"Soccer"|"Basketball"){
  const {add}=useGoalLog();
  const previous=useRef<Map<string,[number,number]>|null>(null);
  const resumed=useVisibilityResumeGuard();
  useEffect(()=>{
    if(sport!=="Soccer"||!matches?.length)return;
    const now=new Map<string,[number,number]>();
    for(const match of matches){
      if(match.homeScore==null||match.awayScore==null||match.homeScore===""||match.awayScore==="")continue;
      const home=Number(match.homeScore),away=Number(match.awayScore);
      if(Number.isFinite(home)&&Number.isFinite(away))now.set(match.id,[home,away]);
    }
    const before=previous.current;
    previous.current=now;
    if(!before)return;
    if(resumed.current){resumed.current=false;return;}
    const entries:{matchId:string;goal:LoggedGoal}[]=[];
    for(const match of matches){
      const old=before.get(match.id),current=now.get(match.id);
      if(!old||!current||!(isLive(match.status)||isFinished(match.status)))continue;
      const minute=isLive(match.status)?liveMinute(match).replace(/[′']/g,""):"";
      for(const home of [true,false]){
        const side=home?0:1;
        const delta=current[side]-old[side];
        if(delta<=0||delta>3)continue;
        entries.push({matchId:match.id,goal:{minute,home,score:`${current[0]}-${current[1]}`,at:new Date().toISOString()}});
      }
    }
    add(entries);
  },[matches,sport,add,resumed]);
}

const EMPTY_MATCH_NOTIFICATIONS: MatchSubscriptions = {};
export function useMatchNotifications(){
  const {demo}=useDesignMode();
  const [stored,set]=useDevice<MatchSubscriptions>(demo?"kickoff:demo-match-notifications":"kickoff:match-notifications",EMPTY_MATCH_NOTIFICATIONS);
  const values=stored&&typeof stored==="object"&&!Array.isArray(stored)?stored:EMPTY_MATCH_NOTIFICATIONS;
  const {favorites}=useFavorites();
  const {settings}=useAlerts();
  const enabled=(match:Match)=>{const current=values[match.id];return current&&typeof current==="object"?Object.values(current).some(Boolean):Boolean(current??follows(match,favorites.filter(f=>f.kind!=="match")));};
  const preferences=(match:Match):MatchAlertOptions=>{const current=values[match.id];return current&&typeof current==="object"?current:enabled(match)?{goals:settings.goals,kickoff:settings.kickoff,fulltime:settings.fulltime}:{goals:false,kickoff:false,fulltime:false};};
  return {values,enabled,preferences,toggle:(match:Match)=>set({...values,[match.id]:!enabled(match)}),setEvent:(match:Match,event:keyof MatchAlertOptions,on:boolean)=>set({...values,[match.id]:{...preferences(match),[event]:on}}),disable:(match:Match)=>set({...values,[match.id]:false})};
}
