"use client";
import { useSyncExternalStore } from "react";
import DesktopApp from "@/components/football/legacy-page";
import { SportsMobile } from "@/components/football/sports-mobile";
const query="(min-width: 1050px)";
const subscribe=(notify:()=>void)=>{const media=window.matchMedia(query);media.addEventListener("change",notify);return()=>media.removeEventListener("change",notify)};
export default function Home(){const desktop=useSyncExternalStore(subscribe,()=>window.matchMedia(query).matches,()=>false);return desktop?<DesktopApp/>:<SportsMobile/>}
