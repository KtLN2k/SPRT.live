# kickoff — עבודה עצמאית עם הקוד

זהו קוד המקור של האתר, כולל העיצוב לנייד ולדסקטופ, תמונות, סמלים מקומיים, API פנימי וחיבורי ספקי הנתונים. הגרסה יוצאה מ־commit שמופיע ב־SOURCE_VERSION.txt.

## התחלה במחשב שלך

1. התקן Node.js בגרסה 22.13 ומעלה ו־pnpm. אפשר להתקין pnpm באמצעות `npm install -g pnpm@11.25.0`.
2. חלץ את ה־ZIP ופתח את תיקיית `kickoff` ב־VS Code או ב־Cursor.
3. פתח Terminal בתוך התיקייה והתקן את הספריות:

```bash
pnpm install --frozen-lockfile
```

4. העתק את `.env.example` לקובץ בשם `.env.local` בתיקיית הפרויקט. ב־Windows אפשר להעתיק ולשנות את השם דרך העורך. מלא את המפתחות שלך:

```dotenv
THESPORTSDB_API_KEY=your_sportsdb_key
API_FOOTBALL_KEY=
```

SportsDB הוא הספק העיקרי. API-Football הוא חיבור משלים אופציונלי לפרטי משחקים; ללא מפתח שלו לא תתבצע השלמת הנתונים. הזמינות תלויה בכיסוי ובמסלול של הספקים.

5. הפעל את האתר:

```bash
pnpm dev:local
```

פתח http://localhost:3000 בדפדפן. שינויים בקוד מתעדכנים במהלך הפיתוח. מפתחות נשארים בצד השרת: אל תוסיף להם קידומת `NEXT_PUBLIC_`, ואל תעלה את `.env.local` ל־GitHub.

## בדיקה וגרסת production

```bash
pnpm typecheck
pnpm build:local
pnpm start:local
```

`start:local` דורש קודם `build:local`.

## איפה עורכים

- `app/page.tsx`: בחירה בין תצוגת נייד ודסקטופ.
- `components/football/sports-mobile.tsx`: מסכי הנייד.
- `components/football/sports-desktop.tsx`: המסך הראשי בדסקטופ.
- `components/football/details.tsx`: מרכז משחק, פרטי ליגה וקבוצה.
- `app/sports-mobile.css`, `app/sports-desktop.css`, `app/sports-desktop-detail.css`: עיצוב.
- `lib/football/names.ts`, `components/football/team-name.tsx`: שמות בעברית ותצוגת גיל נבחרות.
- `lib/football/provider.ts`: SportsDB; `lib/football/secondary-provider.ts`: API-Football.
- `app/api/football/route.ts`: ה־API הפנימי של האתר.
- `public`: תמונות, גופנים וסמלים מקומיים; חלק מהסמלים והתמונות נטענים מספקי הנתונים בזמן השימוש.

## מה עובר עם הקוד

הקוד והנכסים המקומיים כלולים. `node_modules`, קבצי build, היסטוריית Git ומפתחות אמיתיים אינם כלולים. התוצאות והנתונים החיים ממשיכים להגיע מספקי הנתונים ומצריכים חיבור אינטרנט.

מועדפים והגדרות מעקב נשמרים ב־localStorage לפי הדפדפן וכתובת האתר; הם לא עוברים אוטומטית מהאתר המתארח ל־localhost. אין כרגע חשבון משתמש שמסנכרן אותם בין מכשירים. חיבור הנתונים וההתראות אינו מבטיח Push כאשר האתר סגור.

## GitHub ואחסון משלך

אפשר ליצור repository חדש ולהעלות אליו את הקוד. האתר מפעיל API בצד השרת ולכן צריך אחסון שתומך ב־Next.js; אחסון של קבצי HTML בלבד לא יספיק. פקודת ה־build למסלול העצמאי היא `pnpm build:local`. הגדר את מפתחות הנתונים גם במשתני הסביבה של שרת האחסון.

הפרויקט המקורי משתמש ב־Vinext/Cloudflare דרך Sites. הקבצים והפקודות המקוריים נשמרו לצורך תאימות: `pnpm dev` ו־`pnpm build` מפעילים את המסלול המקורי. הפקודות עם `:local` מפעילות Next.js רגיל ואינן דורשות את סביבת ChatGPT. README.md המקורי מתאר את תשתית Sites; מסמך זה מתאר את ההפעלה העצמאית.

השימוש במדיה ובנתוני הספקים כפוף לתנאי השימוש שלהם. קובץ ZIP זה אינו מעביר מנוי API או הרשאות של שירות חיצוני.
