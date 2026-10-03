"use client";
import { useLayoutEffect, useRef, type KeyboardEvent } from "react";

export type UnderlineTab = { id: string; label: string; count?: number };

export function UnderlineTabs({ tabs, value, onChange, label, className = "" }: { tabs: UnderlineTab[]; value: string; onChange: (id: string) => void; label: string; className?: string }) {
  const list = useRef<HTMLDivElement>(null), bar = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const root = list.current;
    if (!root) return;
    const place = () => {
      const active = root.querySelector<HTMLElement>(`[data-tab="${value}"]`);
      if (!active || !bar.current) return;
      bar.current.style.width = `${active.offsetWidth}px`;
      bar.current.style.transform = `translateX(${active.offsetLeft}px)`;
      requestAnimationFrame(() => { if (bar.current) bar.current.dataset.ready = "true"; });
    };
    place();
    const observer = new ResizeObserver(place);
    observer.observe(root);
    return () => observer.disconnect();
  }, [value, tabs.length]);
  const move = (e: KeyboardEvent) => {
    const step = e.key === "ArrowLeft" ? 1 : e.key === "ArrowRight" ? -1 : 0;
    if (!step) return;
    const next = tabs[(tabs.findIndex(t => t.id === value) + step + tabs.length) % tabs.length];
    onChange(next.id);
    list.current?.querySelector<HTMLElement>(`[data-tab="${next.id}"]`)?.focus();
  };
  return <div className={`ed-tabs ${className}`} role="tablist" aria-label={label} ref={list} onKeyDown={move}>
    {tabs.map(t => <button key={t.id} type="button" role="tab" data-tab={t.id} aria-selected={t.id === value} tabIndex={t.id === value ? 0 : -1} className={t.id === value ? "active" : ""} onClick={() => onChange(t.id)}>{t.label}{t.count != null && <small>{t.count}</small>}</button>)}
    <span className="ed-tab-bar" ref={bar} aria-hidden="true"/>
  </div>;
}
