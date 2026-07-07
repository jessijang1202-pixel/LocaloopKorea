// Shared SVG icons — only paths that are byte-identical across multiple call
// sites are deduplicated here. Each component exposes size/strokeWidth/stroke
// props so every call site can reproduce its exact previous attributes.

type IconProps = {
  size?: number;
  strokeWidth?: number | string;
  stroke?: string;
};

// Map pin — used in AppNav (map tab), AdminShell (places), admin dashboard.
export function PinIcon({ size = 20, strokeWidth = 2, stroke = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

// People/users — used in AdminShell (users nav) and admin dashboard stat.
export function UsersIcon({ size = 20, strokeWidth = 2, stroke = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

// Book — used in AdminShell (courses nav) and admin dashboard stat.
export function BookIcon({ size = 20, strokeWidth = 2, stroke = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

// Sun (light-mode indicator) — used in AppNav and LangToggle theme toggles.
export function SunIcon({ size = 14, strokeWidth = 2 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round">
      <circle cx="12" cy="12" r="5"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
  );
}

// Moon (dark-mode indicator) — used in AppNav and LangToggle theme toggles.
export function MoonIcon({ size = 14, strokeWidth = 2 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
    </svg>
  );
}
