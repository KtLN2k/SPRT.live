import roster from './legionnaires-roster.json';
import {array,text,provider,uniqueMatches,configured,localDate} from './provider';
import {hebrewTeam} from './names';
import {isLive,isFinished} from './types';
import {lineupStatus,type Legionnaire,type LegionnaireData} from './legionnaires';
export async function legionnaire(id:string):Promise<LegionnaireData> {
 const known=roster.find(p=>p.id===id);
 const info=await provider(`lookupplayer.php?id=${id}`,21600);
 const p=array(info.data,'players','player')[0];
 if(!p||p.strNationality!=='Israel'||p.strSport!=='Soccer')throw new Error('Player unavailable');
 const teamId=text(p.idTeam);
 if(!/^\d+$/.test(teamId))throw new Error('Club unavailable');
 const club=await provider(`lookupteam.php?id=${teamId}`,21600);
 const t=array(club.data,'teams')[0];
 const eligible=!!t?.strCountry&&t.strCountry!=='Israel'&&p.strStatus==='Active'&&t.strTeam!=='Israel';
 const player:Legionnaire={id,name:known?.name||text(p.strPlayer),english:text(p.strPlayer),teamId,team:hebrewTeam(text(t?.strTeam||p.strTeam)),country:text(t?.strCountry),badge:text(t?.strBadge||t?.strTeamBadge),photo:text(p.strCutout||p.strThumb),position:text(p.strPosition),checkedAt:info.at};
 if(!eligible)return {player,match:null,lineup:'unknown',checkedAt:info.at,partial:false,eligible:false};
 const results=await Promise.allSettled([provider(`eventsnext.php?id=${teamId}`,110),provider(`eventslast.php?id=${teamId}`,110),...(configured()?[provider('livescore/soccer',30,true)]:[])]);
 let matches=uniqueMatches(results.slice(0,2).flatMap(r=>r.status==='fulfilled'?array(r.value.data,'events','results'):[])).filter(m=>m.homeId===teamId||m.awayId===teamId);
 const live=results[2];
 if(live?.status==='fulfilled')for(const m of uniqueMatches(array(live.value.data,'livescore','events')).filter(m=>m.homeId===teamId||m.awayId===teamId)){
 const old=matches.find(x=>x.id===m.id);matches=matches.filter(x=>x.id!==m.id);matches.push({...old,...Object.fromEntries(Object.entries(m).filter(([,v])=>v!==''&&v!=null))} as typeof m);
 }
 const today=localDate(new Date().toISOString(),'Asia/Jerusalem');
 const match=matches.find(m=>isLive(m.status)&&localDate(m.kickoff,'Asia/Jerusalem')===today)||matches.find(m=>localDate(m.kickoff,'Asia/Jerusalem')===today)||matches.filter(m=>!isFinished(m.status)&&m.kickoff>new Date().toISOString()).sort((a,b)=>a.kickoff.localeCompare(b.kickoff))[0]||null;
 let lineup:LegionnaireData['lineup']='unknown',partial=results.some(r=>r.status==='rejected');
 if(match){try{const response=await provider(`lookuplineup.php?id=${match.id}`,110);lineup=lineupStatus(array(response.data,'lineup'),id);}catch{partial=true;}}
 return {player,match,lineup,partial,eligible:true,checkedAt:new Date().toISOString()};
}
