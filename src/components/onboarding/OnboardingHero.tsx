import Image from "next/image";

const COLORS: Record<string, string> = {
  place:  "#C2410C",
  food:   "#0F766E",
  guide:  "#1D4ED8",
  meetup: "#6D28D9",
};

type IconDef = { cat: string; size: number; left: number; top: number; delay: number };

// food > place > guide > meetup (count), more icons = smaller size, meetup = largest
const ICONS: IconDef[] = [
  // food: 7 icons, size 14 (most = smallest)
  { cat:"food",   size:14, left:22, top:36, delay:0.0  },
  { cat:"food",   size:14, left:46, top:20, delay:0.5  },
  { cat:"food",   size:14, left:70, top:28, delay:1.0  },
  { cat:"food",   size:14, left:15, top:58, delay:0.3  },
  { cat:"food",   size:14, left:54, top:52, delay:0.8  },
  { cat:"food",   size:14, left:62, top:70, delay:1.3  },
  { cat:"food",   size:14, left:83, top:53, delay:0.6  },
  // place: 5 icons, size 18
  { cat:"place",  size:18, left:34, top:32, delay:0.2  },
  { cat:"place",  size:18, left:66, top:24, delay:0.7  },
  { cat:"place",  size:18, left:42, top:60, delay:1.2  },
  { cat:"place",  size:18, left:74, top:60, delay:1.7  },
  { cat:"place",  size:18, left:26, top:68, delay:0.4  },
  // guide: 3 icons, size 23
  { cat:"guide",  size:23, left:50, top:34, delay:0.15 },
  { cat:"guide",  size:23, left:24, top:50, delay:0.9  },
  { cat:"guide",  size:23, left:78, top:68, delay:1.6  },
  // meetup: 2 icons, size 30 (fewest = largest)
  { cat:"meetup", size:30, left:37, top:49, delay:0.6  },
  { cat:"meetup", size:30, left:62, top:43, delay:1.4  },
];

function PinSVG({ color, size }: { color: string; size: number }) {
  return (
    <svg
      width={size}
      height={Math.round(size * 1.45)}
      viewBox="0 0 24 35"
      fill={color}
      style={{ display: "block" }}
    >
      <path d="M12 0C7.16 0 3 4.16 3 9C3 15.75 12 28 12 28C12 28 21 15.75 21 9C21 4.16 16.84 0 12 0ZM12 12.5C10.07 12.5 8.5 10.93 8.5 9C8.5 7.07 10.07 5.5 12 5.5C13.93 5.5 15.5 7.07 15.5 9C15.5 10.93 13.93 12.5 12 12.5Z" />
      <ellipse cx="12" cy="32" rx="3" ry="1.5" opacity="0.25" />
    </svg>
  );
}

export function OnboardingHero() {
  return (
    <div style={{ position:"relative", width:"100%", height:"100%", minHeight:"220px", overflow:"hidden" }}>
      <Image
        src="/seoul-map.jpeg"
        alt="Seoul map"
        fill
        style={{ objectFit:"cover", objectPosition:"center 38%" }}
        priority
      />

      {/* Bottom fade for mobile blend */}
      <div style={{
        position:"absolute", bottom:0, left:0, right:0, height:72,
        background:"linear-gradient(to bottom, transparent, rgba(255,255,255,0.95) 85%, #ffffff)",
        pointerEvents:"none",
      }} />

      {/* Floating location pins */}
      {ICONS.map((icon, i) => (
        <div
          key={i}
          style={{
            position:"absolute",
            left:`${icon.left}%`,
            top:`${icon.top}%`,
            animation:"pin-bob 2.6s ease-in-out infinite",
            animationDelay:`${icon.delay}s`,
            filter:"drop-shadow(0 2px 5px rgba(0,0,0,0.28))",
            zIndex:10,
          }}
        >
          <PinSVG color={COLORS[icon.cat]} size={icon.size} />
        </div>
      ))}
    </div>
  );
}
