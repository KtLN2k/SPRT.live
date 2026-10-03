import type {Match} from "./types";
import {isLive} from "./types";

// TheSportsDB league ids: the well-known top flights of each European country, then the major second tiers.
export const BIG_FIVE=["4328","4335","4332","4331","4334"];
export const EUROPE_TOP=["4337","4344","4338","4339","4330","4336","4621","4675","4340","4347","4358","4422","4631","4629","4671","4691","4630","4690","4626","4354","4355","4672","4692","4636","4643"];
export const SECOND_TIERS=["4329","4400","4394","4399","4401","4641","4662","4623","4676","4395"];
export const ISRAEL=["4644","4966"];
export const EURO_CUPS=["4480","4481","5071"];
export const TOP_LEAGUES:Record<"Soccer"|"Basketball",string[]>={Soccer:["4644",...BIG_FIVE,...EURO_CUPS,"4966"],Basketball:["4387","4546","4474","4408","4547","4433","4452","4475"]};
export const TABLE_GROUPS=[{label:"ישראל",ids:ISRAEL},{label:"חמש הגדולות",ids:BIG_FIVE},{label:"מפעלים אירופיים",ids:EURO_CUPS},{label:"ליגות בכירות באירופה",ids:EUROPE_TOP},{label:"ליגות משנה",ids:SECOND_TIERS}];

// National teams first, international clubs next, then domestic schedules.
export function competitionPriority(match:Pick<Match,"league"|"leagueId">):number {
 const name=match.league.toLowerCase(),id=match.leagueId;
 if(/club world cup|גביע העולם למועדונים/.test(name))return 1;
 if(/world cup|גביע העולם|מונדיאל/.test(name))return 0;
 if(/uefa euro(?!pa)|uefa nations|european championship|copa am[eé]rica|africa cup|african nations|asian cup|gold cup|international friend|olympic|eurobasket|americup|afrobasket|asiacup|נבחרות|אולימפי|יורובאסקט|יורו(?!ליג)|ליגת האומות|קופה אמריקה|גביע אפריקה|גביע אסיה/.test(name))return 0;
 if(/uefa champions league|ליגת האלופות/.test(name))return 1;
 if(/uefa europa league|הליגה האירופית/.test(name))return 2;
 if(/euroleague|יורוליג|ליגת אירופה בכדורסל/.test(name))return 3;
 if(/conference league|קונפרנס/.test(name))return 3;
 if(ISRAEL.includes(id)||BIG_FIVE.includes(id)||/^(nba|israeli basketball premier league|spanish liga acb)$/.test(name))return 4;
 if(EUROPE_TOP.includes(id))return 5;
 if(SECOND_TIERS.includes(id))return 6;
 return 10;
}
export const INITIAL_GROUPS=15, MORE_GROUPS=20;
export function sortGroups<T extends [string,Match[]]>(groups:T[],favorite:(leagueId:string)=>boolean):T[] {
 const live=(group:T)=>group[1].some(m=>isLive(m.status));
 return [...groups].sort((a,b)=>Number(favorite(b[0]))-Number(favorite(a[0]))||competitionPriority(a[1][0])-competitionPriority(b[1][0])||Number(live(b))-Number(live(a)));
}
