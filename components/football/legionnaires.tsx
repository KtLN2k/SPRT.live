"use client";
import {useEffect,useState} from 'react';
import {Globe2,UserRound,Search,ChevronLeft,RefreshCw,ShieldCheck} from 'lucide-react';
import roster from '@/lib/football/legionnaires-roster.json';
import {useFootball,useFavorites,dayLabel,today} from '@/lib/football/client';
import type {Match} from '@/lib/football/types';
import {countryName,isLive} from '@/lib/football/types';
import {hebrewTeam} from '@/lib/football/names';

import {lineupLabel,positionLabel,type Legionnaire,type LegionnaireData} from '@/lib/football/legionnaires';
import {Emblem,FavoriteButton,MatchRow,EmptyState} from './ui';
import type {Panel} from './details';
function PlayerCard({seed,id,open}:{seed?:Legionnaire;id:string;open:(p:Panel)=>void}) {
 const resource=useFootball<LegionnaireData>({view:'legionnaire',id},120000),favorites=useFavorites();
 const player=resource.data?.player||seed;
 const [failedPhoto,setFailedPhoto]=useState('');
 const photo=player?.photo||seed?.photo||'';

 if(!player)return <div className="leg-card leg-pending">{resource.loading?'בודקים את פרטי השחקן…':<button onClick={resource.retry}>הפרטים לא נטענו · נסה שוב</button>}</div>;
 const match=resource.data?.match;
 return <article className="leg-card"><div className="leg-player"><div className="leg-portrait">{photo&&failedPhoto!==photo?<img src={photo} alt={player.name} loading="lazy" decoding="async" onError={()=>setFailedPhoto(photo)}/>:<UserRound size={32} aria-hidden="true"/>}<span className="israel-flag" role="img" aria-label="ישראל"><svg viewBox="0 0 28 20" aria-hidden="true"><rect width="28" height="20" fill="white"/><path d="M0 4H28M0 16H28" stroke="#1962b1" strokeWidth="2"/><path d="M14 6L18 12H10ZM14 14L10 8H18Z" fill="none" stroke="#1962b1" strokeWidth=".8"/></svg></span></div><div className="leg-identity"><small>{positionLabel(player.position)} · {countryName(player.country)}</small><h2>{player.name}</h2><button className="leg-club" onClick={()=>open({kind:'team',id:player.teamId,name:hebrewTeam(player.team)})}><Emblem name={player.team} id={player.teamId} src={player.badge} small/>{hebrewTeam(player.team)}<ChevronLeft size={14}/></button></div><FavoriteButton item={{kind:'team',id:player.teamId,name:hebrewTeam(player.team)}} saved={favorites.has('team',player.teamId)} toggle={favorites.toggle}/></div>
 {resource.loading?<div className="leg-status loading-pulse">מעדכנים קבוצה ומשחקים…</div>:resource.error?<div className="leg-status">העדכון מתעכב · פרטי הקבוצה מ־{player.checkedAt.slice(0,10)}<button className="icon-button" aria-label={`נסה שוב עבור ${player.name}`} onClick={resource.retry}><RefreshCw size={15}/></button></div>:resource.data?.eligible===false?<p className="leg-status">לפי העדכון האחרון, השחקן אינו פעיל בקבוצה בחו״ל.</p>:<><div className={`leg-status ${resource.data?.lineup||'unknown'}`}><ShieldCheck size={15}/>{match?lineupLabel[resource.data?.lineup||'unknown']:'טרם התקבל משחק קרוב'}{match&&isLive(match.status)&&<span className="leg-live">במשחק חי</span>}</div>{match&&<div className="leg-fixture"><div className="leg-date">{match.date===today()?'היום':match.date?dayLabel(match.date,true):'המשחק הקרוב'}<span>משחק הקבוצה</span></div><MatchRow match={match} open={m=>open({kind:'match',id:m.id,name:`${m.home} – ${m.away}`,match:m})}/></div>}{resource.data?.partial&&<p className="leg-footnote">חלק מהנתונים מתעכבים. ייתכן שהתוצאה אינה מעודכנת.</p>}</>}
 </article>;
}
export function Legionnaires({open,matches=[]}:{open:(p:Panel)=>void;matches?:Match[]}){
 const [onlyToday,setOnlyToday]=useState(false);
 const playingIds=new Set(matches.flatMap(m=>[m.homeId,m.awayId]));
 const liveIds=new Set(matches.filter(m=>isLive(m.status)).flatMap(m=>[m.homeId,m.awayId]));
 const [query,setQuery]=useState(''),[page,setPage]=useState(0),[extra,setExtra]=useState<string[]>([]),[remoteQuery,setRemoteQuery]=useState('');
 const search=useFootball<{players:{id:string;name:string}[]}>(remoteQuery?{view:'legionnaire-search',q:remoteQuery}:null);
 const filtered=roster.filter(p=>(!onlyToday||playingIds.has(p.teamId))&&`${p.name} ${p.english} ${hebrewTeam(p.team)} ${countryName(p.country)}`.toLowerCase().includes(query.trim().toLowerCase())).sort((a,b)=>Number(liveIds.has(b.teamId))-Number(liveIds.has(a.teamId))||Number(playingIds.has(b.teamId))-Number(playingIds.has(a.teamId)));
 useEffect(()=>{setPage(0);setRemoteQuery('');},[query,onlyToday]);
 const pages=Math.ceil(filtered.length/6);
 return <section className="legionnaires"><div className="leg-hero art-spotlight"><div className="leg-hero-icon"><Globe2 size={33}/></div><span className="leg-eyebrow">הבית של הישראלים בחו״ל</span><h2>רחוק מהבית.<br/><strong>קרוב למשחק.</strong></h2><p>השחקנים שלנו, הקבוצות שלהם והרגעים שאנחנו מחכים להם.</p><small className="art-credit">איור מקורי · דמויות דמיוניות</small><div className="leg-hero-bottom"><span>שמות בעברית</span><i/><span>הרכבים כשמתפרסמים</span><i/><span>מעקב בלחיצה</span></div></div>
 <div className="leg-section-heading"><div><h2>הנציגים שלנו</h2><p>כל שחקן מקבל במה. גם כשהקבוצה שלו משחקת.</p></div><span>{roster.length} ברשימה</span></div>
 <label className="search leg-search"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="חיפוש שחקן, קבוצה או מדינה" aria-label="חיפוש ליגיונר"/></label>
 <div className="leg-filters"><button className={!onlyToday?"selected":""} aria-pressed={!onlyToday} onClick={()=>setOnlyToday(false)}>כל השחקנים</button><button className={onlyToday?"selected":""} aria-pressed={onlyToday} onClick={()=>setOnlyToday(true)}>משחקים היום</button></div>
 <div className="leg-grid">{filtered.slice(page*6,page*6+6).map(p=><PlayerCard key={p.id} seed={p} id={p.id} open={open}/>)}{extra.filter(id=>!filtered.some(p=>p.id===id)).map(id=><PlayerCard key={id} id={id} open={open}/>)}</div>
 {!filtered.length&&<EmptyState title={onlyToday?"לא התקבלו משחקים להיום עבור השחקנים האלה":"השחקן עדיין לא נמצא ברשימה"} description={onlyToday?"אפשר לעבור לכל השחקנים. הכיסוי תלוי בנתוני המשחקים הזמינים.":"אפשר לבדוק במאגר השחקנים לפי שמו באנגלית."}/>}
 {pages>1&&<div className="leg-pagination"><button className="plain-button" disabled={page===0} onClick={()=>setPage(p=>p-1)}>הקודמים</button><span>{page+1} מתוך {pages}</span><button className="plain-button" disabled={page+1>=pages} onClick={()=>setPage(p=>p+1)}>הבאים</button></div>}
 {query.trim().length>=2&&<div className="leg-discover"><button className="plain-button" onClick={()=>setRemoteQuery(query.trim())}>חפש שחקן נוסף במאגר</button>{search.loading&&<p>מחפשים שחקנים ישראלים…</p>}{search.error&&<p>החיפוש לא זמין כרגע. אפשר לנסות שוב.</p>}{search.data?.players.map(p=><button className="plain-button" key={p.id} onClick={()=>setExtra(old=>[...new Set([...old,p.id])])}>{p.name} · הצג פרטים</button>)}{search.data&&!search.data.players.length&&<p>לא נמצא שחקן ישראלי פעיל בשם הזה. נסה שם מלא באנגלית.</p>}</div>}
 <details className="leg-coverage"><summary>על הרשימה ועדכוני ההרכב</summary><p>רשימת הבסיס כוללת שחקנים ישראלים פעילים שנמצאו ב־TheSportsDB בקבוצות מחוץ לישראל, ונבדקה ב־26.09.2026. זו עדיין אינה רשימה מלאה של כל הליגיונרים. אפשר לחפש שחקנים נוספים במאגר.</p><p>הקבוצה והמשחק נבדקים מחדש בפתיחת הכרטיס. נתוני המשחק מתרעננים בכל שתי דקות כשהעמוד פתוח. ״פותח בהרכב״ ו״בסגל המחליפים״ מוצגים רק כשיש התאמה למזהה השחקן בהרכב שהתקבל; חוסר מידע אינו מעיד שהשחקן מחוץ לסגל. הכוכב עוקב אחרי הקבוצה או המשחק, במכשיר הזה.</p></details>
 </section>;
}
