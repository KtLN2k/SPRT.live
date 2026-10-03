// Provider spellings → Hebrew. Keys are matched after accent/punctuation folding and
// after sport suffixes (BC, KK, Basket…) are stripped, so only the base club is needed.
export const basketballTeams: [string, string][] = [
  // Israel
  ["Hapoel HaEmek", "הפועל העמק"], ["Hapoel Emek", "הפועל העמק"], ["Ironi Kiryat Ata", "עירוני קריית אתא"], ["Maccabi Ashdod", "מכבי אשדוד"],
  ["A.S. Ramat HaSharon", "א.ס. רמת השרון"], ["Elitzur Eito Ashkelon", "אליצור אשקלון"], ["Elitzur Ashkelon", "אליצור אשקלון"], ["Elitzur Shomron", "אליצור שומרון"],
  ["Elitzur Yavne", "אליצור יבנה"], ["Hapoel Hevel Modiin", "הפועל חבל מודיעין"], ["Hapoel Migdal HaEmek", "הפועל מגדל העמק"], ["Ironi Nahariya", "עירוני נהריה"],
  ["Maccabi Kiryat Gat", "מכבי קריית גת"], ["Maccabi Petah Tikva Elitzur", "מכבי פתח תקווה"], ["Maccabi Ra'anana", "מכבי רעננה"], ["Maccabi Rehovot", "מכבי רחובות"],
  ["Otef Darom", "עוטף דרום"], ["Hapoel Upper Galilee", "הפועל גליל עליון"], ["Maccabi Haifa", "מכבי חיפה"], ["Hapoel Afula", "הפועל עפולה"], ["Hapoel Ramat Gan Givatayim", "הפועל רמת גן גבעתיים"],
  // EuroLeague / EuroCup
  ["Virtus Pallacanestro Bologna", "וירטוס בולוניה"], ["Virtus Segafredo Bologna", "וירטוס בולוניה"], ["Lyon-Villeurbanne", "וילרבאן"], ["LDLC ASVEL", "וילרבאן"],
  ["Paris Basketball", "פריז"], ["Dubai Basketball", "דובאי"], ["Dubai", "דובאי"], ["Olimpia Milano", "אולימפיה מילאנו"], ["EA7 Emporio Armani Milano", "אולימפיה מילאנו"],
  ["Crvena zvezda", "הכוכב האדום בלגרד"], ["Crvena Zvezda Meridianbet", "הכוכב האדום בלגרד"], ["Partizan Mozzart Bet", "פרטיזן בלגרד"], ["Bayern München Basketball", "באיירן מינכן"],
  ["Monaco Basket", "מונאקו"], ["Saski Baskonia", "באסקוניה"], ["Anadolu Efes", "אנאדולו אפס"],
  ["Balkan Botevgrad", "בלקאן בוטבגרד"], ["Bosna Royal", "בוסנה סרייבו"], ["Budućnost", "בודוצ׳נוסט פודגוריצה"], ["Buducnost VOLI", "בודוצ׳נוסט פודגוריצה"],
  ["Cedevita Olimpija", "צדביטה אולימפיה"], ["London Lions", "לונדון ליונס"], ["Rīgas Zeļļi", "ריגאס זלי"], ["U-BT Cluj-Napoca", "קלוז׳"], ["Śląsk Wrocław", "שלונסק ורוצלאב"],
  ["Hapoel Jerusalem", "הפועל ירושלים"], ["Joventut Badalona", "יובנטוט בדאלונה"], ["Bahçeşehir Koleji", "בחצ׳השהיר"], ["Türk Telekom", "טורק טלקום"], ["Ulm", "אולם"], ["ratiopharm Ulm", "אולם"],
  ["Trento", "טרנטו"], ["Aquila Basket Trento", "טרנטו"], ["Reyer Venezia Mestre", "ונציה"], ["Reyer Venezia", "ונציה"], ["Lietkabelis", "ליטקבליס"], ["Wolves Twinsbet", "וולבס וילנה"], ["Wolves Vilnius", "וולבס וילנה"],
  ["Hamburg Towers", "המבורג טאוורס"], ["Cluj-Napoca", "קלוז׳"], ["Gran Canaria", "גראן קנריה"], ["CB Gran Canaria", "גראן קנריה"], ["Dreamland Gran Canaria", "גראן קנריה"],
  ["Unicaja", "יוניקאחה מלאגה"], ["Baloncesto Málaga", "יוניקאחה מלאגה"], ["Unicaja Malaga", "יוניקאחה מלאגה"], ["Manresa", "מנרסה"], ["Basquet Manresa", "מנרסה"],
  ["Prometey", "פרומתיי"], ["Turk Telekom Ankara", "טורק טלקום"], ["Aris", "אריס סלוניקי"], ["Aris Thessaloniki", "אריס סלוניקי"], ["Niners Chemnitz", "ניינרס קמניץ"],
  // Spain
  ["Andorra", "אנדורה"], ["Basket Zaragoza", "סרגוסה"], ["Zaragoza", "סרגוסה"], ["Bàsquet Girona", "ג׳ירונה"], ["Básquet Coruña", "קורוניה"], ["Leyma Coruña", "קורוניה"],
  ["CB 1939 Canarias", "טנריפה"], ["Lenovo Tenerife", "טנריפה"], ["San Pablo Burgos", "בורגוס"], ["Força Lleida CE", "לרידה"], ["Força Lleida", "לרידה"], ["Obradoiro", "אוברדוירו"],
  ["Bilbao Basket", "בילבאו"], ["Breogan", "בראוגאן"], ["CB Breogan", "בראוגאן"], ["Murcia", "מורסיה"], ["UCAM Murcia", "מורסיה"], ["Granada", "גרנאדה"], ["Covirán Granada", "גרנאדה"],
  ["Real Madrid Baloncesto", "ריאל מדריד"], ["FC Barcelona Basquet", "ברצלונה"], ["Valencia Basket", "ולנסיה"], ["Casademont Zaragoza", "סרגוסה"], ["MoraBanc Andorra", "אנדורה"],
  // Italy
  ["Roma SPQR", "רומא"], ["BC Roma SPQR", "רומא"], ["Derthona Basket", "טורטונה"], ["Derthona", "טורטונה"], ["Maxima Roma", "רומא"], ["Napoli Basket", "נאפולי"],
  ["Pallacanestro Cantù", "קאנטו"], ["Cantù", "קאנטו"], ["Pallacanestro Trieste", "טריאסטה"], ["Trieste", "טריאסטה"], ["Scafati Basket", "סקאפאטי"], ["Scaligera Basket Verona", "ורונה"],
  ["Udine", "אודינה"], ["Universo Treviso Basket", "טרוויזו"], ["Treviso", "טרוויזו"], ["Pallacanestro Reggiana", "רג׳יאנה"], ["Reggiana", "רג׳יאנה"], ["Pallacanestro Varese", "וארזה"], ["Varese", "וארזה"],
  ["Brescia", "ברשה"], ["Germani Brescia", "ברשה"], ["Sassari", "סאסארי"], ["Dinamo Sassari", "סאסארי"], ["Pistoia", "פיסטויה"], ["Tortona", "טורטונה"],
  // Germany
  ["Baskets Oldenburg", "אולדנבורג"], ["Oldenburg", "אולדנבורג"], ["Braunschweig", "בראונשווייג"], ["Gladiators Trier", "טריר"], ["Ludwigsburg", "לודוויגסבורג"],
  ["Mitteldeutscher BC", "מיטלדויטשר"], ["Mitteldeutscher", "מיטלדויטשר"], ["Phoenix Hagen", "פניקס האגן"], ["Rostock Seawolves", "רוסטוק"], ["Science City Jena", "ינה"],
  ["Skyliners Frankfurt", "פרנקפורט"], ["Bamberg Baskets", "במברג"], ["Brose Bamberg", "במברג"], ["Bonn", "בון"], ["Telekom Baskets Bonn", "בון"], ["Rasta Vechta", "וכטה"],
  ["s.Oliver Würzburg", "וירצבורג"], ["Würzburg Baskets", "וירצבורג"], ["Heidelberg", "היידלברג"], ["MLP Academics Heidelberg", "היידלברג"], ["Alba Berlin", "אלבה ברלין"], ["Göttingen", "גטינגן"],
  // France
  ["Boulazac Basket Dordogne", "בולזאק"], ["Bourg-en-Bresse", "בורג אן ברס"], ["JL Bourg", "בורג אן ברס"], ["Chorale Roanne Basket", "רואן"], ["Chorale Roanne", "רואן"],
  ["Gravelines-Dunkerque", "גרבלין דנקרק"], ["Le Mans Sarthe Basket", "לה מאן"], ["Le Mans Sarthe", "לה מאן"], ["Limoges", "לימוז׳"], ["Limoges CSP", "לימוז׳"], ["SLUC Nancy Basket", "נאנסי"],
  ["SLUC Nancy", "נאנסי"], ["Saint-Quentin Basket-Ball", "סן קנטן"], ["Saint-Quentin", "סן קנטן"], ["Élan Béarnais", "פו אורתז"], ["Pau-Orthez", "פו אורתז"], ["Élan Chalon", "שאלון"],
  ["Cholet", "שולה"], ["Cholet Basket", "שולה"], ["Nanterre", "נאנטר"], ["Nanterre 92", "נאנטר"], ["Strasbourg", "שטרסבורג"], ["SIG Strasbourg", "שטרסבורג"], ["Dijon", "דיז׳ון"], ["JDA Dijon", "דיז׳ון"],
  // Greece
  ["ASK Karditsas", "קרדיצה"], ["Karditsa", "קרדיצה"], ["Doxa Lefkadas", "דוקסה לפקדה"], ["Iraklis", "איראקליס"], ["Kolossos", "קולוסוס רודוס"], ["Kolossos Rodou", "קולוסוס רודוס"],
  ["Maroussi", "מרוסי"], ["Mykonos", "מיקונוס"], ["PAOK", "פאוק"], ["AEK", "א.א.ק אתונה"], ["AEK Athens", "א.א.ק אתונה"], ["Peristeri", "פריסטרי"], ["Promitheas Patras", "פרומתאוס פטראס"],
  ["Lavrio", "לבריו"], ["Panionios", "פניוניוס"], ["Apollon Patras", "אפולון פטראס"],
  // Turkey
  ["Bordo Sportif", "בורדו ספורטיף"], ["Bursaspor Basketbol", "בורסאספור"], ["Bursaspor", "בורסאספור"], ["Esenler Erokspor", "אסנלר ארוקספור"], ["Karşıyaka", "קרשייקה"], ["Pinar Karsiyaka", "קרשייקה"],
  ["Manisa BB", "מניסה"], ["Manisa", "מניסה"], ["Merkezefendi Belediyesi Denizli", "דניזלי"], ["Petkim Spor", "פטקים ספור"], ["Aliaga Petkimspor", "פטקים ספור"], ["Tofaş", "טופאש"],
  ["Çayirova", "צ׳איירובה"], ["Galatasaray", "גלאטסראיי"], ["Darussafaka", "דרושפקה"], ["Büyükçekmece", "ביוקצ׳קמג׳ה"], ["Trabzonspor", "טרבזונספור"],
  // Lithuania / Baltics
  ["Gargždai-SC", "גרגז׳דאי"], ["Gargždai", "גרגז׳דאי"], ["Jonava", "יונבה"], ["Neptūnas", "נפטונאס קלייפדה"], ["Nevėžis", "נבז׳יס"], ["Tauragė", "טאורגה"], ["Šiauliai", "שיאוליאי"],
  ["Lietuvos rytas", "ריטאס וילנה"], ["Rytas Vilnius", "ריטאס וילנה"], ["VEF Rīga", "וף ריגה"], ["Kalev", "קאלב טאלין"], ["Kalev/Cramo", "קאלב טאלין"],
  // Adriatic / Balkans
  ["Ilirija", "אילירייה"], ["KD Ilirija", "אילירייה"], ["Borac Čačak", "בוראץ צ׳אצ׳אק"], ["FMP", "פ.מ.פ"], ["Igokea", "איגוקאה"], ["Krka", "קרקה"], ["Mega Basket", "מגה בלגרד"], ["Mega Superbet", "מגה בלגרד"], ["Mega", "מגה בלגרד"], ["SK Slavia Prague ERA NBK", "סלביה פראג"],
  ["Spartak Subotica", "ספרטק סובוטיצה"], ["Split", "ספליט"], ["Studentski centar", "סטודנטסקי צנטאר"], ["TFT", "ט.פ.ט סקופיה"], ["Zadar", "זדאר"], ["Cibona Zagreb", "צ׳יבונה זאגרב"], ["Cibona", "צ׳יבונה זאגרב"],
  ["Vienna", "וינה"], ["Rilski Sportist", "רילסקי ספורטיסט"], ["Batumi", "בטומי"], ["Sabah", "סבאח"], ["CSM Oradea", "אוראדיה"], ["Oradea", "אוראדיה"],
  // Champions League / others
  ["AEK Larnaca", "א.א.ק לרנקה"], ["Antwerp Giants", "אנטוורפן ג׳איינטס"], ["Juventus Utena", "יובנטוס אוטנה"], ["Opava", "אופבה"], ["Pardubice", "פרדוביצה"], ["Patrioti Levice", "לביצה"],
  ["Bakken Bears", "באקן ברס"], ["Dziki Warszawa", "דז׳יקי ורשה"], ["Legia Warszawa", "לגיה ורשה"], ["FC Porto Basketball", "פורטו"], ["Falco KC", "פאלקו סומבטהיי"], ["Falco Szombathely", "פאלקו סומבטהיי"],
  ["Fribourg Olympic", "פריבור אולימפיק"], ["Landau Lions", "לנדאו ליונס"], ["Landstede Hammers", "לנדסטדה זוולה"], ["Lions de Genève", "ליונס ז׳נבה"], ["Manchester Basketball", "מנצ׳סטר"],
  ["S.L. Benfica", "בנפיקה"], ["SL Benfica", "בנפיקה"], ["Slavia Prague ERA NBK", "סלביה פראג"], ["Salon Vilpas", "וילפאס סאלו"], ["Nymburk", "נימבורק"], ["ERA Nymburk", "נימבורק"],
  ["Tenerife", "טנריפה"], ["Galatasaray Nef", "גלאטסראיי"], ["Rytas", "ריטאס וילנה"], ["Telekom Bonn", "בון"], ["Window Szczecin", "שצ׳צ׳ין"], ["King Szczecin", "שצ׳צ׳ין"],
  // WNBA
  ["Golden State Valkyries", "גולדן סטייט ולקיריז"], ["Dallas Wings", "דאלאס ווינגס"], ["Washington Mystics", "וושינגטון מיסטיקס"], ["Atlanta Dream", "אטלנטה דרים"],
  ["Indiana Fever", "אינדיאנה פיבר"], ["Las Vegas Aces", "לאס וגאס אייסס"], ["New York Liberty", "ניו יורק ליברטי"], ["Minnesota Lynx", "מינסוטה לינקס"], ["Seattle Storm", "סיאטל סטורם"],
  ["Phoenix Mercury", "פיניקס מרקורי"], ["Chicago Sky", "שיקגו סקיי"], ["Connecticut Sun", "קונטיקט סאן"], ["Los Angeles Sparks", "לוס אנג׳לס ספארקס"], ["Toronto Tempo", "טורונטו טמפו"], ["Portland Fire", "פורטלנד פייר"],
  // Australia NBL
  ["Brisbane Bullets", "בריסביין בולטס"], ["Tasmania JackJumpers", "טסמניה ג׳קג׳אמפרס"], ["Melbourne United", "מלבורן יונייטד"], ["Cairns Taipans", "קיירנס טייפאנס"], ["New Zealand Breakers", "ניו זילנד ברייקרס"],
  ["Sydney Kings", "סידני קינגס"], ["Perth Wildcats", "פרת׳ ווילדקאטס"], ["Adelaide 36ers", "אדלייד 36ers"], ["Illawarra Hawks", "אילאוורה הוקס"], ["South East Melbourne Phoenix", "דרום מזרח מלבורן פיניקס"],
  // VTB United League
  ["Lokomotiv Kuban", "לוקומוטיב קובאן"], ["MBA Moscow", "מ.ב.א מוסקבה"], ["Avtodor Saratov", "אבטודור סרטוב"], ["Avtodor", "אבטודור סרטוב"], ["Uralmash Ekaterinburg", "אורלמאש יקטרינבורג"],
  ["UNICS", "אוניקס קאזאן"], ["UNICS Kazan", "אוניקס קאזאן"], ["CSKA Moscow", "צסק״א מוסקבה"], ["Zenit St Petersburg", "זניט סנט פטרבורג"], ["Zenit Saint Petersburg", "זניט סנט פטרבורג"],
  ["Parma Basket", "פארמה פרם"], ["Nizhny Novgorod", "ניז׳ני נובגורוד"], ["Enisey", "יניסיי"], ["Samara", "סמארה"], ["Dynamo Vladivostok", "דינמו ולדיווסטוק"], ["Pari Nizhny Novgorod", "ניז׳ני נובגורוד"],
  // National teams
  ["Czech Republic", "צ׳כיה"], ["Bosnia-Herzegovina", "בוסניה והרצגובינה"], ["Bosnia and Herzegovina", "בוסניה והרצגובינה"], ["D.R. Congo", "הרפובליקה הדמוקרטית של קונגו"],
  ["Ivory Coast", "חוף השנהב"], ["Great Britain", "בריטניה"], ["United States", "ארצות הברית"], ["Chinese Taipei", "טאייוואן"], ["Cape Verde", "כף ורדה"], ["Turkey", "טורקיה"],
  ["South Sudan", "דרום סודאן"], ["Republic of Ireland", "אירלנד"], ["North Macedonia", "צפון מקדוניה"], ["Northern Ireland", "צפון אירלנד"], ["Scotland", "סקוטלנד"], ["Wales", "ויילס"],
];

export const footballTeams: [string, string][] = [
  // Israel
  ["Hapoel Kiryat Yam", "הפועל קריית ים"], ["Ironi Modi'in", "עירוני מודיעין"], ["Maccabi Akhi Nazareth", "מכבי אחי נצרת"], ["Maccabi Kiryat Gat", "מכבי קריית גת"],
  ["Hapoel Rishon LeZion", "הפועל ראשון לציון"], ["Hapoel Ironi Rishon LeZion", "הפועל ראשון לציון"], ["Bnei Yehuda Tel Aviv", "בני יהודה"], ["Maccabi Herzliya", "מכבי הרצליה"],
  // England
  ["Hull City", "האל סיטי"], ["Bolton Wanderers", "בולטון"], ["Bristol City", "בריסטול סיטי"], ["Charlton Athletic", "צ׳רלטון"], ["Lincoln City", "לינקולן סיטי"], ["Millwall", "מילוול"],
  ["Portsmouth", "פורטסמות׳"], ["Preston North End", "פרסטון"], ["Wrexham", "רקסהאם"], ["Sheffield United", "שפילד יונייטד"], ["Sheffield Wednesday", "שפילד וונסדיי"], ["Middlesbrough", "מידלסברו"],
  ["Norwich City", "נוריץ׳"], ["Coventry City", "קובנטרי"], ["Watford", "ווטפורד"], ["West Bromwich Albion", "ווסט ברום"], ["West Brom", "ווסט ברום"], ["Stoke City", "סטוק סיטי"], ["Swansea City", "סוונסי"],
  ["Queens Park Rangers", "קווינס פארק ריינג׳רס"], ["QPR", "קווינס פארק ריינג׳רס"], ["Blackburn Rovers", "בלקבורן"], ["Derby County", "דרבי קאונטי"], ["Oxford United", "אוקספורד יונייטד"],
  ["Birmingham City", "בירמינגהאם"], ["Cardiff City", "קארדיף"], ["Luton Town", "לוטון"], ["Plymouth Argyle", "פלימות׳"],
  // Spain
  ["Deportivo de A Coruña", "דפורטיבו לה קורוניה"], ["Deportivo La Coruna", "דפורטיבו לה קורוניה"], ["Racing de Santander", "ראסינג סנטנדר"], ["Racing Santander", "ראסינג סנטנדר"],
  ["Real Oviedo", "ריאל אוביידו"], ["Oviedo", "ריאל אוביידו"], ["Albacete", "אלבסטה"], ["Burgos", "בורגוס"], ["Castellón", "קסטיון"], ["Celta Fortuna", "סלטה ויגו ב׳"], ["Ceuta", "סאוטה"],
  ["Cádiz", "קאדיס"], ["Córdoba", "קורדובה"], ["Eibar", "אייבר"], ["Eldense", "אלדנסה"], ["Leganés", "לגאנס"], ["Real Sociedad B", "ריאל סוסיאדד ב׳"], ["Sabadell", "סבאדל"],
  ["Sporting de Gijón", "ספורטינג חיחון"], ["Sporting Gijon", "ספורטינג חיחון"], ["Tenerife", "טנריפה"], ["Granada", "גרנאדה"], ["Las Palmas", "לאס פלמאס"], ["Real Valladolid", "ריאל ויאדוליד"],
  ["Valladolid", "ריאל ויאדוליד"], ["Almería", "אלמריה"], ["Zaragoza", "סרגוסה"], ["Real Zaragoza", "סרגוסה"], ["Huesca", "הואסקה"], ["Mirandés", "מירנדס"], ["Málaga", "מלאגה"], ["Andorra", "אנדורה"],
  ["Cultural Leonesa", "קולטורל לאונסה"], ["Deportivo Alavés", "אלאבס"], ["Real Racing Club", "ראסינג סנטנדר"],
  // Italy
  ["Frosinone", "פרוזינונה"], ["Arezzo", "ארצו"], ["Ascoli", "אסקולי"], ["Avellino", "אבלינו"], ["Benevento", "בנבנטו"], ["Carrarese", "קאררזה"], ["Catanzaro", "קטנזרו"], ["Cesena", "צ׳זנה"],
  ["Juve Stabia", "יובה סטביה"], ["Mantova", "מנטובה"], ["Modena", "מודנה"], ["Padova", "פדובה"], ["Südtirol", "זודטירול"], ["Vicenza", "ויצ׳נצה"], ["Virtus Entella", "אנטלה"], ["Palermo", "פלרמו"],
  ["Sampdoria", "סמפדוריה"], ["Venezia", "ונציה"], ["Empoli", "אמפולי"], ["Monza", "מונצה"], ["Bari", "בארי"], ["Spezia", "ספציה"], ["Salernitana", "סלרניטנה"], ["Reggiana", "רג׳יאנה"], ["Pescara", "פסקרה"],
  ["Cittadella", "צ׳יטדלה"], ["Brescia", "ברשה"], ["Sampdoria Genoa", "סמפדוריה"],
  // Germany
  ["Elversberg", "אלברסברג"], ["Hamburg", "המבורג"], ["Köln", "קלן"], ["1. FC Köln", "קלן"], ["Paderborn", "פאדרבורן"], ["St. Pauli", "זנקט פאולי"], ["FC St. Pauli", "זנקט פאולי"],
  ["Arminia Bielefeld", "ארמיניה בילפלד"], ["Bochum", "בוכום"], ["VfL Bochum", "בוכום"], ["Darmstadt", "דארמשטאט"], ["Dynamo Dresden", "דינמו דרזדן"], ["Eintracht Braunschweig", "איינטרכט בראונשווייג"],
  ["Energie Cottbus", "אנרגיה קוטבוס"], ["Greuther Fürth", "גרויטר פירת׳"], ["Hertha", "הרתה ברלין"], ["Hertha Berlin", "הרתה ברלין"], ["Hertha BSC", "הרתה ברלין"], ["Holstein Kiel", "הולשטיין קיל"],
  ["Kaiserslautern", "קייזרסלאוטרן"], ["Karlsruhe", "קרלסרוהה"], ["Karlsruher SC", "קרלסרוהה"], ["Magdeburg", "מגדבורג"], ["Nürnberg", "נירנברג"], ["Osnabrück", "אוסנבריק"], ["Schalke 04", "שאלקה"],
  ["Schalke", "שאלקה"], ["Hannover 96", "הנובר"], ["Hannover", "הנובר"], ["Fortuna Düsseldorf", "פורטונה דיסלדורף"], ["Preußen Münster", "פרויסן מינסטר"], ["Ulm", "אולם"], ["Regensburg", "רגנסבורג"],
  ["Borussia Mönchengladbach", "בורוסיה מנשנגלדבאך"], ["Mainz 05", "מיינץ"], ["Werder", "ורדר ברמן"],
  // France
  ["Le Mans", "לה מאן"], ["Troyes", "טרואה"], ["Annecy", "אנסי"], ["Boulogne", "בולון"], ["Clermont Foot", "קלרמון"], ["Clermont", "קלרמון"], ["Dijon", "דיז׳ון"], ["Dunkerque", "דנקרק"],
  ["Grenoble", "גרנובל"], ["Guingamp", "גנגאן"], ["Laval", "לאבאל"], ["Nancy Lorraine", "נאנסי"], ["Nancy", "נאנסי"], ["Pau", "פו"], ["Red Star", "רד סטאר"], ["Rodez", "רודז"], ["Sochaux", "סושו"],
  ["Stade de Reims", "ריימס"], ["Reims", "ריימס"], ["Angers", "אנז׳ה"], ["Saint-Etienne", "סנט אטיין"], ["Saint-Étienne", "סנט אטיין"], ["Montpellier", "מונפלייה"], ["Bastia", "בסטיה"], ["Amiens", "אמיין"],
  ["Ajaccio", "אז׳קסיו"], ["Caen", "קאן"], ["Bordeaux", "בורדו"], ["Stade Rennais", "ראן"], ["Olympique Lyonnais", "ליון"], ["Olympique de Marseille", "מארסיי"],
  // Netherlands
  ["ADO Den Haag", "אדו דן האג"], ["Cambuur", "קאמבור"], ["Excelsior", "אקסלסיור"], ["Fortuna Sittard", "פורטונה סיטארד"], ["Go Ahead Eagles", "גו אהד איגלס"], ["Groningen", "חרונינגן"],
  ["Heerenveen", "הירנבן"], ["PEC Zwolle", "זוולה"], ["Sparta Rotterdam", "ספרטה רוטרדם"], ["Telstar", "טלסטאר"], ["Willem II", "וילם השני"], ["AZ Alkmaar", "א.ז. אלקמאר"], ["AZ", "א.ז. אלקמאר"],
  ["Utrecht", "אוטרכט"], ["FC Utrecht", "אוטרכט"], ["NAC Breda", "נ.א.ק. ברדה"], ["Almere City", "אלמרה סיטי"], ["RKC Waalwijk", "ואלוויק"], ["Volendam", "וולנדאם"],
  // Portugal
  ["Académico de Viseu", "אקדמיקו ויזאו"], ["Alverca", "אלברקה"], ["Arouca", "ארוקה"], ["Casa Pia", "קאזה פיה"], ["Estoril Praia", "אשטוריל"], ["Estoril", "אשטוריל"], ["Estrela Amadora", "אשטרלה אמדורה"],
  ["Famalicao", "פמליקאו"], ["Famalicão", "פמליקאו"], ["Gil Vicente", "ז׳יל ויסנטה"], ["Marítimo", "מריטימו"], ["Moreirense", "מוריירנסה"], ["Nacional de Madeira", "נסיונל"], ["Nacional", "נסיונל"],
  ["Rio Ave", "ריו אבה"], ["Santa Clara", "סנטה קלרה"], ["Vitória de Guimarães", "ויטוריה גימאראייש"], ["Vitoria Guimaraes", "ויטוריה גימאראייש"], ["Braga", "בראגה"], ["SC Braga", "בראגה"],
  ["Sporting Braga", "בראגה"], ["Boavista", "בואביסטה"], ["Torreense", "טוריינסה"], ["Tondela", "טונדלה"], ["AVS", "א.ו.ס"],
  // Belgium
  ["Beveren", "בברן"], ["Cercle Brugge", "סרקל ברוז׳"], ["Charleroi", "שארלרואה"], ["Lommel", "לומל"], ["Mechelen", "מכלן"], ["KV Mechelen", "מכלן"], ["Oud-Heverlee Leuven", "לובן"],
  ["RAAL La Louvière", "לה לובייר"], ["Sint-Truiden", "סינט טרוידן"], ["Westerlo", "וסטרלו"], ["Zulte Waregem", "זולטה ורגם"], ["Genk", "גנק"], ["KRC Genk", "גנק"], ["Gent", "חנט"], ["KAA Gent", "חנט"],
  ["Standard Liège", "סטנדר ליאז׳"], ["Standard Liege", "סטנדר ליאז׳"], ["Union Saint-Gilloise", "יוניון סן ז׳ילואז"], ["Royal Antwerp", "אנטוורפן"], ["Antwerp", "אנטוורפן"], ["Dender", "דנדר"],
  // Turkey
  ["Alanyaspor", "אלאניאספור"], ["Amed", "אמד"], ["Erzurumspor", "ארזורומספור"], ["Eyüpspor", "אייופספור"], ["Gaziantep", "גזיאנטפ"], ["Gençlerbirliği", "גנצ׳לרבירליי"], ["Göztepe", "גזטפה"],
  ["Kasımpaşa", "קאסימפשה"], ["Kocaelispor", "קוג׳אליספור"], ["Konyaspor", "קוניאספור"], ["Rizespor", "ריזהספור"], ["Çaykur Rizespor", "ריזהספור"], ["Samsunspor", "סמסונספור"], ["Çorum", "צ׳ורום"],
  ["Trabzonspor", "טרבזונספור"], ["Başakşehir", "באשקשהיר"], ["Istanbul Basaksehir", "באשקשהיר"], ["Kayserispor", "קייסריספור"], ["Antalyaspor", "אנטליאספור"], ["Sivasspor", "סיוואספור"], ["Hatayspor", "הטאייספור"],
  // Scotland / Ireland / UK
  ["Dundee", "דנדי"], ["Dundee United", "דנדי יונייטד"], ["Falkirk", "פולקירק"], ["Kilmarnock", "קילמרנוק"], ["Motherwell", "מאת׳רוול"], ["St Johnstone", "סנט ג׳ונסטון"], ["St Mirren", "סנט מירן"],
  ["Aberdeen", "אברדין"], ["Hearts", "הארטס"], ["Heart of Midlothian", "הארטס"], ["Hibernian", "היברניאן"], ["Livingston", "ליווינגסטון"], ["Ross County", "רוס קאונטי"],
  ["Shamrock Rovers", "שמרוק רוברס"], ["Shelbourne", "שלבורן"], ["Bohemians", "בוהמיאנס"], ["Derry City", "דרי סיטי"], ["Linfield", "לינפילד"], ["Larne", "לארן"], ["Glentoran", "גלנטורן"], ["Coleraine", "קולריין"],
  ["The New Saints", "הניו סיינטס"], ["Caernarfon Town", "קרנרפון"], ["Connah's Quay Nomads", "קונאס קי"], ["Pen-y-Bont", "פן אי בונט"],
  // Greece / Cyprus
  ["Aris", "אריס סלוניקי"], ["Asteras Tripolis", "אסטראס טריפוליס"], ["Atromitos", "אטרומיטוס"], ["Iraklis 1908", "איראקליס"], ["Kalamata", "קלמטה"], ["Kifisia", "קיפיסיה"], ["Levadiakos", "לבדיאקוס"],
  ["OFI", "אופ״י כרתים"], ["OFI Crete", "אופ״י כרתים"], ["Panetolikos", "פנאיטוליקוס"], ["PAOK", "פאוק"], ["AEK Athens", "א.א.ק אתונה"], ["AEK Athens FC", "א.א.ק אתונה"], ["Volos NFC", "וולוס"], ["Panserraikos", "פנסראיקוס"],
  ["AEL Limassol", "א.א.ל לימסול"], ["APOEL Nicosia", "אפואל ניקוסיה"], ["APOEL", "אפואל ניקוסיה"], ["Anorthosis Famagusta", "אנורתוזיס"], ["Anorthosis", "אנורתוזיס"], ["Aris Limassol", "אריס לימסול"],
  ["Karmiotissa", "קרמיוטיסה"], ["Krasava Ypsonas", "קרסבה"], ["Nea Salamis Famagusta", "נאה סלמיס"], ["Olympiakos Nicosia", "אולימפיאקוס ניקוסיה"], ["Omonia 29M", "אומוניה 29 מאי"],
  ["Omonia Aradippou", "אומוניה ארדיפו"], ["Apollon Limassol", "אפולון לימסול"], ["AEK Larnaca", "א.א.ק לרנקה"], ["Pafos", "פאפוס"], ["Pafos FC", "פאפוס"], ["Ethnikos Achna", "אתניקוס אכנה"],
  // Austria / Switzerland
  ["Austria Lustenau", "אוסטריה לוסטנאו"], ["Grazer AK", "גראצר א.ק"], ["LASK", "לאסק לינץ"], ["LASK Linz", "לאסק לינץ"], ["SCR Altach", "אלטאך"], ["Altach", "אלטאך"], ["SV Ried", "רייד"],
  ["TSV Hartberg", "הרטברג"], ["WSG Tirol", "טירול"], ["Wolfsberger AC", "וולפסברגר"], ["Sturm Graz", "שטורם גראץ"], ["Rapid Wien", "ראפיד וינה"], ["Rapid Vienna", "ראפיד וינה"],
  ["Austria Wien", "אוסטריה וינה"], ["Austria Vienna", "אוסטריה וינה"], ["Blau-Weiß Linz", "בלאו וייס לינץ"],
  ["Grasshoppers", "גראסהופרס"], ["Grasshopper", "גראסהופרס"], ["Lausanne-Sport", "לוזאן"], ["Lausanne", "לוזאן"], ["Lugano", "לוגאנו"], ["Luzern", "לוצרן"], ["Sion", "סיון"], ["St. Gallen", "סנט גאלן"],
  ["Thun", "טון"], ["Vaduz", "ואדוץ"], ["Young Boys", "יאנג בויז"], ["Basel", "באזל"], ["FC Basel", "באזל"], ["Servette", "סרבט"], ["Zürich", "ציריך"], ["FC Zurich", "ציריך"], ["Winterthur", "וינטרתור"], ["Yverdon", "איברדון"],
  // Scandinavia
  ["AC Horsens", "הורסנס"], ["Horsens", "הורסנס"], ["AGF Aarhus", "אורהוס"], ["AGF", "אורהוס"], ["Brøndby", "ברונבי"], ["FC Nordsjælland", "נורשילנד"], ["Nordsjaelland", "נורשילנד"], ["Lyngby", "לינגבי"],
  ["Odense BK", "אודנסה"], ["Odense", "אודנסה"], ["Randers FC", "ראנדרס"], ["Randers", "ראנדרס"], ["Silkeborg IF", "סילקבורג"], ["Silkeborg", "סילקבורג"], ["Sønderjyske", "סונריוסקה"], ["Viborg", "ויבורג"],
  ["FC Copenhagen", "קופנהגן"], ["Copenhagen", "קופנהגן"], ["FC København", "קופנהגן"], ["Midtjylland", "מידטיילנד"], ["FC Midtjylland", "מידטיילנד"], ["Aalborg", "אלבורג"], ["Vejle", "וילה"], ["Fredericia", "פרדריסיה"],
  ["AIK", "א.י.ק שטוקהולם"], ["Brommapojkarna", "ברומאפויקרנה"], ["Degerfors", "דגרפורס"], ["Djurgården", "יורגורדן"], ["Elfsborg", "אלפסבורג"], ["GAIS", "גאיס"], ["Halmstad", "הלמסטד"], ["Hammarby", "המארבי"],
  ["Häcken", "הקן"], ["BK Häcken", "הקן"], ["IFK Göteborg", "גטבורג"], ["Kalmar", "קלמר"], ["Malmö", "מאלמו"], ["Malmö FF", "מאלמו"], ["Mjällby", "מיאלבי"], ["Sirius", "סיריוס"], ["Västerås", "וסטרוס"],
  ["Örgryte", "ארגריטה"], ["IFK Norrköping", "נורשפינג"], ["Norrköping", "נורשפינג"], ["IK Sirius", "סיריוס"],
  ["Aalesund", "אולסונד"], ["Brann", "בראן"], ["Fredrikstad", "פרדריקסטד"], ["Hamarkameratene", "האם קאם"], ["HamKam", "האם קאם"], ["KFUM-Kameratene Oslo", "KFUM אוסלו"], ["Kristiansund", "קריסטיאנסונד"],
  ["Lillestrøm", "לילסטרום"], ["Sandefjord", "סנדפיורד"], ["Sarpsborg 08", "סרפסבורג"], ["Start", "סטארט"], ["Tromsø", "טרומסו"], ["Viking", "ויקינג"], ["Vålerenga", "ולרנגה"], ["Bodø/Glimt", "בודו גלימט"],
  ["Bodo/Glimt", "בודו גלימט"], ["Molde", "מולדה"], ["Rosenborg", "רוזנבורג"], ["Strømsgodset", "סטרומסגודסט"], ["HJK Helsinki", "הלסינקי"], ["HJK", "הלסינקי"], ["KuPS", "קופס"], ["Ilves", "אילבס"], ["Inter Turku", "אינטר טורקו"],
  ["Valur", "ואלור"], ["Víkingur Reykjavík", "ויקינגור רייקיאוויק"], ["Stjarnan", "סטיארנן"], ["Vestri", "וסטרי"], ["Breidablik", "ברייד׳בליק"], ["KÍ Klaksvík", "קלאקסוויק"], ["HB Tórshavn", "ה.ב. טורסהאון"],
  ["NSÍ Runavík", "רונאוויק"], ["Víkingur Gøta", "ויקינגור גטה"],
  // Poland / Czechia / Slovakia / Hungary
  ["Cracovia", "קרקוביה"], ["GKS Katowice", "קטוביצה"], ["Górnik Zabrze", "גורניק זבז׳ה"], ["Jagiellonia Białystok", "יאגלוניה ביאליסטוק"], ["Korona Kielce", "קורונה קיילצה"], ["Motor Lublin", "מוטור לובלין"],
  ["Piast Gliwice", "פיאסט גליביצה"], ["Pogoń Szczecin", "פוגון שצ׳צ׳ין"], ["Radomiak Radom", "רדומיאק"], ["Widzew Łódź", "וידזב לודז׳"], ["Wieczysta Kraków", "ויצ׳יסטה קרקוב"], ["Wisła Kraków", "ויסלה קרקוב"],
  ["Wisła Płock", "ויסלה פלוצק"], ["Zagłębie Lubin", "זגלמביה לובין"], ["Śląsk Wrocław", "שלונסק ורוצלאב"], ["Legia Warsaw", "לגיה ורשה"], ["Legia Warszawa", "לגיה ורשה"], ["Lech Poznań", "לך פוזנן"], ["Raków Częstochowa", "רקוב צ׳נסטוחובה"],
  ["Lechia Gdańsk", "לכיה גדנסק"], ["Puszcza Niepołomice", "פושצ׳ה"], ["Stal Mielec", "סטאל מיילץ"],
  ["Artis Brno", "ארטיס ברנו"], ["Baník Ostrava", "באניק אוסטרבה"], ["Bohemians 1905", "בוהמיאנס פראג"], ["Hradec Králové", "הרדץ קרלובה"], ["Jablonec", "יבלונץ"], ["Mladá Boleslav", "מלאדה בולסלב"],
  ["Pardubice", "פרדוביצה"], ["Sigma Olomouc", "סיגמה אולומוץ"], ["Slovan Liberec", "סלובן ליברץ"], ["Slovácko", "סלובאצקו"], ["Teplice", "טפליצה"], ["Zbrojovka Brno", "זברויובקה ברנו"], ["Zlín", "זלין"],
  ["Sparta Prague", "ספרטה פראג"], ["Sparta Praha", "ספרטה פראג"], ["Slavia Prague", "סלביה פראג"], ["Slavia Praha", "סלביה פראג"], ["Viktoria Plzeň", "ויקטוריה פלזן"], ["Viktoria Plzen", "ויקטוריה פלזן"], ["Karviná", "קרווינה"], ["Dukla Prague", "דוקלה פראג"],
  ["DAC 1904 Dunajská Streda", "דונאיסקה סטרדה"], ["Spartak Trnava", "ספרטק טרנבה"], ["Žilina", "ז׳ילינה"], ["Slovan Bratislava", "סלובן ברטיסלבה"],
  ["Budapest Honvéd", "הונבד"], ["Kisvárda", "קישוורדה"], ["MTK Budapest", "מ.ט.ק בודפשט"], ["Nyíregyháza", "ניירג׳האזה"], ["Puskás Akadémia", "פושקאש אקדמיה"], ["Vasas", "וואשאש"], ["Zalaegerszeg", "זלאגרסג"],
  ["Újpest", "אויפשט"], ["Debrecen", "דברצן"], ["Győri ETO", "ג׳ור"], ["Paks", "פאקש"], ["Fehérvár", "פהרוואר"], ["Diósgyőr", "דיושג׳ור"],
  // Balkans
  ["Hajduk Split", "היידוק ספליט"], ["HNK Gorica", "גוריצה"], ["Istra 1961", "איסטרה"], ["Lokomotiva Zagreb", "לוקומוטיבה זאגרב"], ["Osijek", "אוסייק"], ["Rijeka", "ריאקה"], ["Rudeš", "רודש"],
  ["Slaven Belupo Koprivnica", "סלאבן בלופו"], ["Slaven Belupo", "סלאבן בלופו"], ["Varaždin", "ורז׳דין"],
  ["IMT Novi Beograd", "אי.אם.טי בלגרד"], ["Mačva Šabac", "מאצ׳בה שבאץ"], ["Mladost Lučani", "מלדוסט לוצ׳ני"], ["Novi Pazar", "נובי פזאר"], ["OFK Beograd", "או.אף.קיי בלגרד"], ["Radnik Surdulica", "רדניק סורדוליצה"],
  ["Radnički 1923", "רדניצ׳קי קרגוייבאץ"], ["Radnički Niš", "רדניצ׳קי ניש"], ["Zemun", "זמון"], ["Čukarički", "צ׳וקאריצ׳קי"], ["Vojvodina", "וויבודינה"], ["TSC Bačka Topola", "באצ׳קה טופולה"], ["Železničar Pančevo", "ז׳לזניצ׳אר פנצ׳בו"],
  ["Arda Kardzhali", "ארדה קרדז׳אלי"], ["Botev Plovdiv", "בוטב פלובדיב"], ["Botev Vratsa", "בוטב ורצה"], ["Cherno More", "צ׳רנו מורה"], ["Dunav Ruse", "דונאב רוסה"], ["Lokomotiv Plovdiv", "לוקומוטיב פלובדיב"],
  ["Lokomotiv Sofia", "לוקומוטיב סופיה"], ["Septemvri Sofia", "ספטמברי סופיה"], ["Slavia Sofia", "סלביה סופיה"], ["Spartak Varna", "ספרטק ורנה"], ["Levski Sofia", "לבסקי סופיה"], ["CSKA Sofia", "צסק״א סופיה"], ["CSKA 1948", "צסק״א 1948"],
  ["Argeș Pitești", "ארג׳ש פיטשט"], ["Botoșani", "בוטושאני"], ["Corvinul Hunedoara", "קורווינול"], ["Csíkszereda Miercurea Ciuc", "צ׳יקסרדה"], ["Dinamo București", "דינמו בוקרשט"], ["Dinamo Bucharest", "דינמו בוקרשט"],
  ["Farul Constanța", "פארול קונסטנצה"], ["Oțelul Galați", "אוצלול גלאץ"], ["Petrolul Ploiești", "פטרולול פלויישט"], ["Rapid București", "ראפיד בוקרשט"], ["Rapid Bucharest", "ראפיד בוקרשט"], ["Sepsi OSK", "ספסי"],
  ["UTA Arad", "אוטה ארד"], ["Voluntari", "וולונטארי"], ["FCSB", "פ.צ.ס.ב"], ["CFR Cluj", "צ.פ.ר קלוז׳"], ["Universitatea Cluj", "אוניברסיטטה קלוז׳"], ["Universitatea Craiova", "אוניברסיטטה קראיובה"],
  ["Borac Banja Luka", "בוראץ באניה לוקה"], ["FK Sarajevo", "סרייבו"], ["Sarajevo", "סרייבו"], ["Zrinjski Mostar", "זריניסקי מוסטאר"], ["Velež Mostar", "ולז׳ מוסטאר"], ["Sutjeska", "סוטיסקה"],
  ["Dečić", "דצ׳יץ׳"], ["Mornar", "מורנאר"], ["Petrovac", "פטרובאץ"], ["Budućnost Podgorica", "בודוצ׳נוסט פודגוריצה"], ["Vardar", "ורדר סקופיה"], ["Shkëndija", "שקנדייה"], ["Sileks", "סילקס"],
  ["Ballkani", "בלקאני"], ["Drita", "דריטה"], ["Dukagjini", "דוקאג׳יני"], ["Malisheva", "מלישבה"], ["Egnatia", "אגנאטיה"], ["Elbasani", "אלבסאני"], ["Vllaznia Shkodër", "ולאזניה שקודר"], ["Dinamo City", "דינמו טירנה"],
  ["Partizani Tirana", "פרטיזני טירנה"], ["Koper", "קופר"], ["Celje", "צליה"], ["Aluminij", "אלומיניי"], ["Bravo", "בראבו"], ["Olimpija Ljubljana", "אולימפיה ליובליאנה"], ["Maribor", "מריבור"],
  // Ukraine / Eastern Europe / Caucasus
  ["Bukovyna Chernivtsi", "בוקובינה צ׳רניבצי"], ["Chornomorets Odesa", "צ׳רנומורץ אודסה"], ["Epitsentr Kamianets-Podilsky", "אפיצנטר"], ["Karpaty Lviv", "קרפטי לבוב"], ["Kharkiv", "חרקוב"],
  ["Kolos Kovalivka", "קולוס קובליבקה"], ["Kryvbas Kryvyi Rih", "קריבבאס"], ["Kudrivka", "קודריבקה"], ["Livyi Bereh Kyiv", "ליבי ברג"], ["Obolon Kyiv", "אובולון קייב"], ["Veres Rivne", "ורס ריבנה"],
  ["Zorya Luhansk", "זוריה לוהנסק"], ["Polissya Zhytomyr", "פוליסיה ז׳יטומיר"], ["LNZ Cherkasy", "צ׳רקאסי"], ["Oleksandriya", "אולקסנדריה"], ["Metalist 1925", "מטליסט 1925"], ["Rukh Lviv", "רוך לבוב"],
  ["Sabah Baku", "סבאח באקו"], ["Sabah", "סבאח באקו"], ["Qarabağ", "קרבאח"], ["Qarabag", "קרבאח"], ["Neftçi PFK", "נפטצ׳י באקו"], ["Neftchi Baku", "נפטצ׳י באקו"], ["Zirə", "זירה"], ["Sumgayit", "סומגאיט"],
  ["Ararat-Armenia", "ארארט ארמניה"], ["Alashkert", "אלשקרט"], ["Noah", "נואה"], ["Pyunik Yerevan", "פיוניק ירוואן"], ["Pyunik", "פיוניק ירוואן"], ["Dila Gori", "דילה גורי"], ["Dinamo Tbilisi", "דינמו טביליסי"],
  ["Iberia 1999", "איבריה 1999"], ["Torpedo Kutaisi", "טורפדו קוטאיסי"], ["Astana", "אסטנה"], ["Elimai Semey", "אלימאי סמיי"], ["Tobol", "טובול"], ["Kairat", "קאיראט אלמטי"],
  ["BATE Borisov", "באטה בוריסוב"], ["Maxline Vitebsk", "ויטבסק"], ["Milsami Orhei", "מילסמי אורהיי"], ["Petrocub Hîncești", "פטרוקוב"], ["Sheriff Tiraspol", "שריף טירספול"], ["Zimbru Chișinău", "זימברו קישינב"],
  // Baltics / small nations
  ["Flora Tallinn", "פלורה טאלין"], ["Levadia Tallinn", "לבדיה טאלין"], ["Nõmme Kalju", "נמה קליו"], ["Paide Linnameeskond", "פאידה"], ["Auda Kekava", "אאודה"], ["Liepāja", "ליאפאיה"], ["RFS", "ר.פ.ס ריגה"],
  ["Riga FC", "ריגה"], ["Riga", "ריגה"], ["Hegelmann", "הגלמן"], ["Kauno Žalgiris", "ז׳לגיריס קובנה"], ["Panevėžys", "פנבז׳יס"], ["Žalgiris Vilnius", "ז׳לגיריס וילנה"],
  ["Atert Bissen", "אטרט ביסן"], ["Differdange 03", "דיפרדאנז׳"], ["Mondorf-les-Bains", "מונדורף"], ["UNA Strassen", "שטראסן"], ["Atlètic d'Escaldes", "אטלטיק אסקלדס"], ["Inter Club d'Escaldes", "אינטר אסקלדס"],
  ["FC Santa Coloma", "סנטה קולומה"], ["Floriana", "פלוריאנה"], ["Marsaxlokk", "מרסשלוק"], ["Valletta", "ולטה"], ["Ħamrun Spartans", "חמרון ספרטנס"], ["Europa FC", "אירופה גיברלטר"], ["Lincoln Red Imps", "לינקולן רד אימפס"],
  ["St Joseph's", "סנט ג׳וזף"], ["La Fiorita", "לה פיוריטה"], ["Tre Fiori", "טרה פיורי"], ["Virtus", "וירטוס"],
];
