import {IoTennisballOutline} from "react-icons/io5";
import {Trophy,Globe2,UserRound,ArrowRight} from "lucide-react";

const slams=[
 {name:"אליפות אוסטרליה הפתוחה",place:"מלבורן",month:"ינואר",surface:"משטח קשה",tone:"hard"},
 {name:"רולאן גארוס",place:"פריז",month:"מאי–יוני",surface:"חימר",tone:"clay"},
 {name:"וימבלדון",place:"לונדון",month:"יוני–יולי",surface:"דשא",tone:"grass"},
 {name:"אליפות ארה״ב הפתוחה",place:"ניו יורק",month:"אוגוסט–ספטמבר",surface:"משטח קשה",tone:"hard"},
];

export function TennisSoon({back}:{back:()=>void}){
 return <section className="ts" aria-labelledby="ts-title">
  <div className="ts-card">
   <span className="ts-badge"><IoTennisballOutline aria-hidden="true"/>בקרוב ב־SPRT.live</span>
   <h2 id="ts-title">טניס, בדרך אלינו</h2>
   <p>אנחנו בונים מדור טניס שמותאם לענף של שחקנים יחידים: כל שחקנית וכל שחקן עם שם מלא בעברית, דגל המדינה, דירוג ותוצאות. בלי פרסומות, כמו כל השאר.</p>
   <ul className="ts-features">
    <li><UserRound size={16}/>כרטיס שחקן: שם בעברית, מדינה ודגל</li>
    <li><Trophy size={16}/>סבבי ATP ו־WTA, טורנירים ותוצאות</li>
    <li><Globe2 size={16}/>גביע דייוויס, גביע בילי ג׳ין קינג ואולימפיאדה</li>
   </ul>
   <button type="button" className="ts-back" onClick={back}><ArrowRight size={16}/>בינתיים, חזרה לכדורגל</button>
  </div>
  <div className="ts-slams" aria-label="טורנירי הגראנד סלאם">
   <h3>ארבעת הגדולים</h3>
   {slams.map(s=><div key={s.name} className={`ts-slam ${s.tone}`}><b>{s.name}</b><span>{s.place} · {s.month}</span><em>{s.surface}</em></div>)}
  </div>
 </section>;
}
