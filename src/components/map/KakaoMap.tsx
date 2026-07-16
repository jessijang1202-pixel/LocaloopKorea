"use client";

import { useEffect, useRef } from "react";
import { RATING_COLORS, RATING_TEXT, isGradeableCategory } from "@/lib/grades";

export interface MapPin {
  id: string;
  lat: number;
  lng: number;
  title: string;
  rating?: string;
  category?: string;
}

interface KakaoMapProps {
  pins: MapPin[];
  center: { lat: number; lng: number };
  zoom?: number;
  onPinClick?: (id: string) => void;
  lang?: "ko" | "en";
}

// Max overlays drawn at once. CustomOverlays are DOM nodes, so with ~1,400 DB
// places we render only the pins inside the current viewport (updated on the
// map's idle event) and cap the count to keep panning smooth.
const MAX_VISIBLE_PINS = 250;

type KakaoNS = typeof window.kakao;

export function KakaoMap({ pins, center, zoom = 5, onPinClick, lang = "ko" }: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapObjRef = useRef<unknown>(null);
  const overlaysRef = useRef<{ setMap(m: unknown): void }[]>([]);
  const pinsRef = useRef<MapPin[]>(pins);
  const onPinClickRef = useRef(onPinClick);
  pinsRef.current = pins;
  onPinClickRef.current = onPinClick;

  // Draw the pins currently inside the viewport (capped). Called on map idle
  // and whenever the pins prop changes.
  function renderVisible() {
    const kakao = window.kakao as KakaoNS | undefined;
    const map = mapObjRef.current as {
      getBounds(): { contain(p: unknown): boolean };
    } | null;
    if (!kakao || !map) return;

    // Clear previous overlays.
    for (const o of overlaysRef.current) o.setMap(null);
    overlaysRef.current = [];

    const bounds = map.getBounds();
    let drawn = 0;
    for (const pin of pinsRef.current) {
      if (drawn >= MAX_VISIBLE_PINS) break;
      const pos = new kakao.maps.LatLng(pin.lat, pin.lng);
      if (!bounds.contain(pos)) continue;

      // HTMLElement content so the overlay itself is clickable (CustomOverlay
      // does not support kakao event listeners).
      const el = document.createElement("div");
      el.style.cssText =
        "display:flex;flex-direction:column;align-items:center;cursor:pointer;filter:drop-shadow(0 3px 8px rgba(0,0,0,0.28));";

      if (pin.category && !isGradeableCategory(pin.category)) {
        // Administrative/infrastructure places (telecom, bank, government,
        // real estate) — plain neutral pin, no grade badge.
        el.innerHTML = `
          <div style="width:26px;height:26px;border-radius:50%;background:#5B5568;border:2px solid #fff;display:flex;align-items:center;justify-content:center;">
            <div style="width:8px;height:8px;border-radius:50%;background:#fff;"></div>
          </div>
          <div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:7px solid #5B5568;margin-top:-1px;"></div>`;
      } else {
        const color = RATING_COLORS[pin.rating ?? "C"] ?? "#FFC93C";
        const textColor = RATING_TEXT[pin.rating ?? "C"] ?? "#3a2c00";
        el.innerHTML = `
          <div style="background:${color};border-radius:10px;padding:5px 11px;font-size:14px;font-weight:800;color:${textColor};letter-spacing:0.04em;line-height:1;">
            ${pin.rating ?? "?"}
          </div>
          <div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:7px solid ${color};"></div>`;
      }
      const pinId = pin.id;
      el.addEventListener("click", () => onPinClickRef.current?.(pinId));

      const overlay = new kakao.maps.CustomOverlay({
        position: pos,
        content: el,
        yAnchor: 1.3,
      });
      overlay.setMap(mapObjRef.current);
      overlaysRef.current.push(overlay as { setMap(m: unknown): void });
      drawn++;
    }
  }

  // Map bootstrap — rebuilds when lang/center/zoom change.
  useEffect(() => {
    let cancelled = false;

    function buildMap() {
      if (cancelled || !mapRef.current || !window.kakao) return;
      window.kakao.maps.load(() => {
        if (cancelled || !mapRef.current) return;
        const kakao = window.kakao as KakaoNS;
        const map = new kakao.maps.Map(mapRef.current, {
          center: new kakao.maps.LatLng(center.lat, center.lng),
          level: zoom,
        });
        mapObjRef.current = map;

        // Re-render visible pins after every pan/zoom settles.
        kakao.maps.event.addListener(map, "idle", renderVisible);
        renderVisible();
      });
    }

    // Reload SDK with the correct language. Delete the existing kakao global so
    // the freshly loaded script can re-initialize with the requested lang.
    delete (window as Window & { kakao?: unknown }).kakao;

    const script = document.createElement("script");
    // Cache-bust with timestamp so browser re-fetches with the correct lang param
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false&lang=${lang}&_ts=${Date.now()}`;
    script.async = true;
    script.onload = buildMap;
    document.head.appendChild(script);

    return () => {
      cancelled = true;
      script.onload = null;
      script.remove();
      mapObjRef.current = null;
      overlaysRef.current = [];
      delete (window as Window & { kakao?: unknown }).kakao;
    };
    // renderVisible reads pins via ref; map rebuilds only on lang/center/zoom.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, center.lat, center.lng, zoom]);

  // Pins prop changed (e.g. live DB places swapped in) — redraw on the
  // existing map without rebuilding it.
  useEffect(() => {
    renderVisible();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pins]);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
}
