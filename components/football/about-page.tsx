"use client";
import { useState } from "react";
import { Database, FileText, Info, Lock, Scale, ShieldAlert, Sparkles, Accessibility, Mail } from "lucide-react";
import { IoFootballOutline } from "react-icons/io5";

// Set a public contact address before launch; the legal sections refer to it.
const CONTACT_EMAIL = "";
const UPDATED = "3 באוקטובר 2026";

const sections = [
  { id: "about", label: "מה זה SPRT.live", icon: Info },
  { id: "data", label: "מקורות המידע", icon: Database },
  { id: "credits", label: "קרדיטים", icon: Sparkles },
  { id: "terms", label: "תנאי שימוש", icon: FileText },
  { id: "liability", label: "הגבלת אחריות", icon: ShieldAlert },
  { id: "ip", label: "סימנים וזכויות", icon: Scale },
  { id: "privacy", label: "פרטיות", icon: Lock },
  { id: "a11y", label: "נגישות", icon: Accessibility },
  { id: "contact", label: "יצירת קשר", icon: Mail },
];

export function AboutPage() {
  const [active, setActive] = useState("about");
  const jump = (id: string) => { setActive(id); document.getElementById(`about-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" }); };
  return <div className="ab-page">
    <header className="ab-hero">
      <span className="ab-hero-mark" aria-hidden="true"><IoFootballOutline/></span>
      <div className="ab-hero-copy">
        <small>אודות ותנאים</small>
        <h1>SPRT<i>.live</i></h1>
        <p>תוצאות, לוחות משחקים וטבלאות של כדורגל וכדורסל, בעברית, בחינם ובלי פרסומות. כאן מרוכז כל מה שחשוב לדעת על האתר, על מקורות המידע ועל תנאי השימוש.</p>
      </div>
    </header>
    <div className="ab-layout">
      <nav className="ab-toc" aria-label="תוכן העמוד">
        {sections.map(({ id, label, icon: Icon }) => <button key={id} type="button" className={active === id ? "active" : ""} onClick={() => jump(id)}><Icon size={16}/>{label}</button>)}
        <p>עודכן לאחרונה: {UPDATED}</p>
      </nav>
      <article className="ab-content">
        <section id="about-about">
          <h2><Info size={20}/>מה זה SPRT.live</h2>
          <p>SPRT.live הוא אתר מידע עצמאי לאוהדי ספורט. הוא מרכז במקום אחד משחקים חיים, תוצאות, לוחות משחקים, טבלאות ליגה, הרכבים וסטטיסטיקות, ומציג אותם בעברית ובממשק נקי.</p>
          <ul className="ab-points">
            <li><b>חינם לגמרי.</b> אין מנוי, אין הרשמה ואין תשלום.</li>
            <li><b>בלי פרסומות ובלי הימורים.</b> האתר אינו מציע, מקדם או מתווך הימורים מכל סוג.</li>
            <li><b>מותאם אישית במכשיר שלך.</b> קבוצות, ליגות ומשחקים שסימנת בכוכב וההגדרות של ההתראות נשמרים רק בדפדפן שלך.</li>
          </ul>
        </section>

        <section id="about-data">
          <h2><Database size={20}/>מקורות המידע</h2>
          <p>נתוני המשחקים, התוצאות, הטבלאות, ההרכבים, האירועים וסמלי הקבוצות והליגות מגיעים מ־<a href="https://www.thesportsdb.com" target="_blank" rel="noopener noreferrer">TheSportsDB</a>, מאגר ספורט פתוח שנבנה ומתוחזק בידי קהילה. השימוש בנתונים נעשה דרך הממשק הרשמי שלו (API) ובכפוף לתנאים שלו.</p>
          <p>התרגום לעברית של שמות ליגות, מדינות וקבוצות נעשה בידי SPRT.live. כשאין תרגום מוכר, השם מוצג לפי הכינוי המקובל או לפי שם המדינה ודרג הליגה.</p>
          <div className="ab-note"><b>חשוב לדעת:</b> נתונים חיים מתעדכנים בדרך כלל כל 30 שניות, אבל ייתכנו עיכובים, חוסרים או טעויות שמקורם בספק. כיסוי הנתונים משתנה בין ליגות ומשחקים.</div>
        </section>

        <section id="about-credits">
          <h2><Sparkles size={20}/>קרדיטים</h2>
          <dl className="ab-credits">
            <div><dt>נתוני ספורט וסמלים</dt><dd><a href="https://www.thesportsdb.com" target="_blank" rel="noopener noreferrer">TheSportsDB</a> והקהילה שתורמת לו</dd></div>
            <div><dt>אייקונים</dt><dd><a href="https://lucide.dev" target="_blank" rel="noopener noreferrer">Lucide</a> (רישיון ISC) ו־<a href="https://react-icons.github.io/react-icons/" target="_blank" rel="noopener noreferrer">React Icons</a> (Ionicons, רישיון MIT)</dd></div>
            <div><dt>גופן</dt><dd><a href="https://fonts.google.com/specimen/Heebo" target="_blank" rel="noopener noreferrer">Heebo</a> (רישיון SIL Open Font License), מוגש מהשרת של האתר</dd></div>
            <div><dt>תמונות רקע</dt><dd>צילומים ואיורים מקוריים. הדמויות בתמונות בדיוניות ואינן מייצגות שחקנים אמיתיים.</dd></div>
            <div><dt>טכנולוגיה</dt><dd>Next.js ו־React (רישיון MIT), רכיבי ממשק מבוססי Radix UI (רישיון MIT)</dd></div>
          </dl>
        </section>

        <section id="about-terms">
          <h2><FileText size={20}/>תנאי שימוש</h2>
          <p>השימוש באתר מהווה הסכמה לתנאים האלה. אם אינך מסכים להם, אנא הימנע משימוש באתר.</p>
          <ol className="ab-legal">
            <li>האתר מיועד לשימוש אישי ולא מסחרי, לצורכי מידע ובידור בלבד.</li>
            <li>אסור לאסוף, להעתיק או לשכפל את תוכן האתר באופן אוטומטי (סקרייפינג, בוטים וכדומה), להעמיס על השרתים או לנסות לעקוף מנגנוני הגנה.</li>
            <li>אסור להשתמש באתר לכל מטרה שאינה חוקית, ובכלל זה כבסיס להימורים לא חוקיים.</li>
            <li>האתר רשאי לשנות, להשעות או להפסיק כל חלק מהשירות בכל עת וללא הודעה מוקדמת.</li>
            <li>התנאים עשויים להתעדכן מעת לעת. הנוסח המחייב הוא זה שמופיע בעמוד הזה, ותאריך העדכון האחרון מצוין בראשו.</li>
            <li>על התנאים חלים דיני מדינת ישראל, וסמכות השיפוט הבלעדית נתונה לבתי המשפט המוסמכים בישראל.</li>
          </ol>
        </section>

        <section id="about-liability">
          <h2><ShieldAlert size={20}/>הגבלת אחריות</h2>
          <p>המידע באתר מוצג כמות שהוא (AS IS), ללא כל התחייבות לדיוק, לשלמות, לעדכניות או לזמינות רציפה. תוצאות, מועדים, הרכבים וסטטיסטיקות עשויים להשתנות או להתעדכן באיחור.</p>
          <p>אין להסתמך על המידע באתר לצורך קבלת החלטות כספיות, ובכלל זה הימורים. SPRT.live, מפעיליו והספקים שלו לא יישאו באחריות לכל נזק, ישיר או עקיף, שייגרם כתוצאה מהשימוש באתר, מהסתמכות על המידע בו או מאי־זמינותו.</p>
          <p>האתר עשוי לכלול קישורים לאתרים חיצוניים. אין לנו שליטה על התוכן שלהם ואין אנו אחראים לו.</p>
        </section>

        <section id="about-ip">
          <h2><Scale size={20}/>סימנים מסחריים וזכויות יוצרים</h2>
          <p>שמות, סמלים ולוגואים של ליגות, תחרויות, קבוצות והתאחדויות (לרבות FIFA, UEFA, ההתאחדות לכדורגל בישראל, NBA ו־EuroLeague) הם קניינם של בעליהם. הם מוצגים באתר לצורכי זיהוי ומידע בלבד.</p>
          <p><b>SPRT.live אינו קשור, ממומן או מאושר על ידי אף ליגה, קבוצה, התאחדות או גוף ספורט.</b></p>
          <p>העיצוב, הקוד, הטקסטים והתרגומים המקוריים באתר שייכים ל־SPRT.live. אם לדעתך תוכן כלשהו באתר פוגע בזכויותיך, פנה אלינו ונטפל בפנייה בהקדם.</p>
        </section>

        <section id="about-privacy">
          <h2><Lock size={20}/>פרטיות</h2>
          <ul className="ab-points">
            <li><b>אין חשבון משתמש.</b> אנחנו לא מבקשים שם, דוא״ל או כל מידע מזהה אחר.</li>
            <li><b>אין עוגיות פרסום ואין כלי מעקב.</b> האתר אינו משתמש ב־Google Analytics, בפיקסלים או ברשתות פרסום.</li>
            <li><b>אחסון מקומי בלבד.</b> המועדפים, ההתראות וההגדרות נשמרים באחסון המקומי של הדפדפן (localStorage). אפשר למחוק אותם בכל רגע דרך הגדרות הדפדפן.</li>
            <li><b>התראות.</b> התראות דסקטופ נשלחות רק אם אישרת אותן בדפדפן, ואפשר לבטל את ההרשאה בכל עת.</li>
            <li><b>לוגים טכניים.</b> כמו בכל אתר, השרת עשוי לרשום מידע טכני בסיסי (כמו כתובת IP וזמן הבקשה) לצורכי אבטחה ותפעול. המידע אינו משמש לפרסום ואינו נמכר.</li>
          </ul>
        </section>

        <section id="about-a11y">
          <h2><Accessibility size={20}/>נגישות</h2>
          <p>אנחנו פועלים כדי שהאתר יהיה נגיש לכל המשתמשים, ובהשראת תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע״ג–2013, ותקן WCAG 2.1 ברמה AA.</p>
          <ul className="ab-points">
            <li>ניווט מלא במקלדת, כולל מעבר בין לשוניות עם מקשי החיצים.</li>
            <li>תוויות לקוראי מסך על כפתורים ואייקונים.</li>
            <li>ניגודיות צבעים גבוהה ותמיכה בהעדפת הפחתת תנועה של מערכת ההפעלה.</li>
          </ul>
          <p>אם נתקלת ברכיב שאינו נגיש, נשמח לשמוע ולתקן.</p>
        </section>

        <section id="about-contact">
          <h2><Mail size={20}/>יצירת קשר</h2>
          {CONTACT_EMAIL ? <p>לשאלות, לדיווח על טעות בנתונים, לפניות בנושא זכויות או נגישות: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p> : <p>כתובת ליצירת קשר תפורסם כאן בקרוב. עד אז אפשר לדווח על טעויות בנתונים ישירות ל־<a href="https://www.thesportsdb.com" target="_blank" rel="noopener noreferrer">TheSportsDB</a>.</p>}
        </section>
      </article>
    </div>
  </div>;
}
