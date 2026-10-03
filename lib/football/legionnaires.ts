import type { Match } from './types';
export type Legionnaire = {id:string;name:string;english:string;teamId:string;team:string;country:string;badge:string;photo:string;position:string;checkedAt:string};
export type LegionnaireData = {player:Legionnaire;match:Match|null;lineup:'starter'|'bench'|'unknown';checkedAt:string;partial:boolean;eligible:boolean};
export const lineupLabel = {starter:'פותח בהרכב',bench:'בסגל המחליפים',unknown:'מידע על ההרכב טרם התקבל'};
export function lineupStatus(rows:Record<string,unknown>[],id:string):LegionnaireData['lineup'] {
 const player=rows.find(row=>String(row.idPlayer)===id);
 return player?.strSubstitute==='No'?'starter':player?.strSubstitute==='Yes'?'bench':'unknown';
}
export const positionLabel=(value:string)=> /keeper/i.test(value)?'שוער':/back|defender/i.test(value)?'הגנה':/midfield/i.test(value)?'קישור':/forward|wing|striker|attack/i.test(value)?'התקפה':'שחקן';
