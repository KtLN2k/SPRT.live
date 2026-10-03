import type {AlertSettings, AlertItem, Match, Favorite} from "./types";
import {hebrewTeam} from "./names";
import {follows,isLive,isFinished} from "./types";

export type MatchAlertOptions = Pick<AlertSettings,"goals"|"kickoff"|"fulltime">;
export type MatchSubscriptions = Record<string,boolean|MatchAlertOptions>;
export function detectAlerts(previous: Match[], current: Match[], favorites: Favorite[], settings: AlertSettings, at: string, matchNotifications: MatchSubscriptions = {}, sport:"Soccer"|"Basketball"="Soccer"): AlertItem[] {
  const old = new Map(previous.map(m => [m.id, m]));
  const alerts: AlertItem[] = [];
  for (const m of current) {
    const before = old.get(m.id);
    const subscription=matchNotifications[m.id];
    const preferences=subscription&&typeof subscription==="object"?subscription:settings;
    const subscribed = subscription&&typeof subscription==="object"?Object.values(subscription).some(Boolean):subscription ?? follows(m, favorites.filter(f=>f.kind!=="match"));
    if (!before || !subscribed) continue;
    let title = "";
    const changedScore = before.homeScore != null && before.awayScore != null && m.homeScore != null && m.awayScore != null && (before.homeScore !== m.homeScore || before.awayScore !== m.awayScore);
    if (preferences.fulltime && isFinished(m.status) && !isFinished(before.status)) title = "שריקת הסיום";
    else if (preferences.goals && changedScore) title = Number(m.homeScore) + Number(m.awayScore) > Number(before.homeScore) + Number(before.awayScore) ? sport==="Basketball"?"סל!":"שער!" : "עדכון תוצאה";
    else if (preferences.kickoff && isLive(m.status) && !isLive(before.status) && !isFinished(before.status)) title = "המשחק התחיל";
    if (title) alerts.push({ sport, id: `${m.id}:${m.homeScore}:${m.awayScore}:${m.status}`, matchId: m.id, title, body: `${hebrewTeam(m.home)} ${m.homeScore ?? "–"} : ${m.awayScore ?? "–"} ${hebrewTeam(m.away)}`, at, read: false });
  }
  return alerts;
}
