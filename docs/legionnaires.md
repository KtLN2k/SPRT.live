# Israeli footballers abroad

The initial directory is a provider-verified snapshot dated 2026-09-26. It is **not an exhaustive registry**. Names are curated in Hebrew; clubs, photos and player IDs were retrieved from TheSportsDB `searchplayers.php` and `lookupteam.php`, filtered to active Israeli soccer players with a club outside Israel. Search can be fuzzy: verify the returned English identity before assigning a Hebrew name. Eli Dasa and Or Dasa are distinct people.

Runtime `legionnaire` requests use player IDs, refresh club identity every six hours, load previous/next club fixtures, merge premium livescore records, and fetch the selected game's lineup every 110 seconds. No result inferred from absence: only an exact `idPlayer` match and an explicit `strSubstitute=Yes/No` produce bench/starter labels. Bench means listed as substitute, not proof of whether the player subsequently entered the match. The client refreshes visible cards every two minutes and displays explicit degraded states. Six player cards per page bound fan-out. Shared provider caching coalesces identical team/live/lineup requests.

The directory is intentionally readable without an API response. A failed fresh lookup labels the snapshot date; departed/inactive players are identified on their cards. New verified IDs can be added to `lib/football/legionnaires-roster.json`. The in-product search finds further active Israeli footballers by English name, then verifies the club on opening the card. Search results are session-only; this is not a crowdsourced global registry.

Coverage needed for a guaranteed complete catalogue: a maintained all-Israeli-player registry (including lower divisions, youth and women's football), a periodic ingestion task, and provider coverage for each competition. The current provider documentation does not offer a nationality enumeration endpoint. Do not describe these 22 players as all Israeli players abroad.

References: https://www.thesportsdb.com/documentation (player lookup/search, team schedules, event lineups, 100/min premium rate limit). National-team lists alone are not sufficient to establish complete coverage.
