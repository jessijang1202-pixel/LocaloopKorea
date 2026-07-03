"use client";

import { useEffect, useRef } from "react";

export interface MapPin {
  id: string;
  lat: number;
  lng: number;
  title: string;
  rating?: string;
}

interface KakaoMapProps {
  pins: MapPin[];
  center: { lat: number; lng: number };
  zoom?: number;
  onPinClick?: (id: string) => void;
  lang?: "ko" | "en";
}

const RATING_COLORS: Record<string, string> = {
  S: "#FF5636",
  A: "#12BFB6",
  B: "#7B4DFF",
  C: "#FFC93C",
};

const RATING_TEXT: Record<string, string> = {
  S: "#fff",
  A: "#fff",
  B: "#fff",
  C: "#3a2c00",
};

export function KakaoMap({ pins, center, zoom = 5, onPinClick, lang = "ko" }: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    function buildMap() {
      if (cancelled || !mapRef.current || !window.kakao) return;
      window.kakao.maps.load(() => {
        if (cancelled || !mapRef.current) return;
        const map = new window.kakao.maps.Map(mapRef.current, {
          center: new window.kakao.maps.LatLng(center.lat, center.lng),
          level: zoom,
        });

        pins.forEach((pin) => {
          const color = RATING_COLORS[pin.rating ?? "C"] ?? "#FFC93C";
          const textColor = RATING_TEXT[pin.rating ?? "C"] ?? "#3a2c00";
          const content = `
            <div style="display:flex;flex-direction:column;align-items:center;cursor:pointer;filter:drop-shadow(0 3px 8px rgba(0,0,0,0.28));">
              <div style="background:${color};border-radius:10px;padding:5px 11px;font-size:14px;font-weight:800;color:${textColor};letter-spacing:0.04em;line-height:1;">
                ${pin.rating ?? "?"}
              </div>
              <div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:7px solid ${color};"></div>
            </div>`;

          const overlay = new window.kakao.maps.CustomOverlay({
            position: new window.kakao.maps.LatLng(pin.lat, pin.lng),
            content,
            yAnchor: 1.3,
          });
          overlay.setMap(map);

          if (onPinClick) {
            window.kakao.maps.event.addListener(overlay, "click", () => onPinClick(pin.id));
          }
        });
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
      delete (window as Window & { kakao?: unknown }).kakao;
    };
    // pins/onPinClick not in deps — component is remounted via key when lang changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, center.lat, center.lng, zoom]);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
}
