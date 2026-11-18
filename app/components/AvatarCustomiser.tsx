"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export type AvatarConfig = {
  gender: "female" | "male";
  skin: string;
  hairStyle: number;
  hairColor: string;
  eyeColor: string;
  outfit: number;
  outfitColor: string;
  accessory: number;
  expression: number;
};

export const defaultAvatar: AvatarConfig = {
  gender: "female",
  skin: "#f5c5a3",
  hairStyle: 0,
  hairColor: "#3d1f00",
  eyeColor: "#3d2b1f",
  outfit: 0,
  outfitColor: "#c084fc",
  accessory: 0,
  expression: 0,
};

const SKINS    = ["#fde8d0","#f5c5a3","#e8a87c","#c68642","#8d5524","#4a2912"];
const HAIR_C   = ["#1a1a1a","#3d1f00","#8b4513","#d4a017","#ff6eb4","#c084fc","#7dd3fc","#fff"];
const EYE_C    = ["#3d2b1f","#1a6b3c","#1a3a6b","#6b1a1a","#4a3860"];
const OUTFIT_C = ["#c084fc","#ff6eb4","#7dd3fc","#67e8c8","#ffb347","#ff4d6d","#e2e8f0","#1e293b"];

/* ── Female hair styles ── */
const F_HAIR: ((c: string) => React.ReactNode)[] = [
  // 0 long straight
  c => <g key="fh0" fill={c}>
    <ellipse cx="100" cy="68" rx="44" ry="46" />
    <rect x="56" y="85" width="14" height="90" rx="7" />
    <rect x="130" y="85" width="14" height="90" rx="7" />
  </g>,
  // 1 bob
  c => <g key="fh1" fill={c}>
    <ellipse cx="100" cy="68" rx="44" ry="44" />
    <rect x="56" y="85" width="14" height="44" rx="7" />
    <rect x="130" y="85" width="14" height="44" rx="7" />
  </g>,
  // 2 curly
  c => <g key="fh2" fill={c}>
    <ellipse cx="100" cy="68" rx="48" ry="46" />
    <circle cx="54" cy="90" r="13" /><circle cx="48" cy="110" r="11" />
    <circle cx="146" cy="90" r="13" /><circle cx="152" cy="110" r="11" />
  </g>,
  // 3 bun
  c => <g key="fh3" fill={c}>
    <ellipse cx="100" cy="72" rx="42" ry="40" />
    <circle cx="100" cy="38" r="18" />
    <rect x="88" y="38" width="24" height="22" />
  </g>,
  // 4 ponytail
  c => <g key="fh4" fill={c}>
    <ellipse cx="100" cy="70" rx="42" ry="42" />
    <rect x="90" y="36" width="20" height="60" rx="10" />
    <ellipse cx="100" cy="96" rx="11" ry="16" />
  </g>,
];

/* ── Male hair styles ── */
const M_HAIR: ((c: string) => React.ReactNode)[] = [
  // 0 short neat
  c => <g key="mh0" fill={c}>
    <ellipse cx="100" cy="66" rx="42" ry="36" />
    <rect x="58" y="66" width="84" height="14" />
  </g>,
  // 1 side part
  c => <g key="mh1" fill={c}>
    <ellipse cx="100" cy="66" rx="42" ry="36" />
    <rect x="58" y="66" width="84" height="14" />
    <ellipse cx="72" cy="60" rx="20" ry="10" transform="rotate(-10 72 60)" />
  </g>,
  // 2 messy
  c => <g key="mh2" fill={c}>
    <ellipse cx="100" cy="66" rx="44" ry="38" />
    <ellipse cx="78" cy="56" rx="16" ry="10" transform="rotate(-15 78 56)" />
    <ellipse cx="118" cy="54" rx="14" ry="9" transform="rotate(10 118 54)" />
    <ellipse cx="100" cy="52" rx="12" ry="8" />
  </g>,
  // 3 buzz cut
  c => <g key="mh3" fill={c}>
    <ellipse cx="100" cy="68" rx="42" ry="32" />
  </g>,
  // 4 wavy
  c => <g key="mh4" fill={c}>
    <ellipse cx="100" cy="66" rx="44" ry="38" />
    <path d="M58 72 Q70 60 82 72 Q94 60 106 72 Q118 60 130 72 Q136 66 142 72" fill={c} />
  </g>,
];

/* ── Outfits ── */
const OUTFITS: ((c: string, gender: "female"|"male") => React.ReactNode)[] = [
  // 0 casual top
  (c, g) => <g key="o0">
    <path d={g==="female"
      ? "M52 188 Q52 168 68 163 L100 171 L132 163 Q148 168 148 188 L148 230 L52 230 Z"
      : "M44 188 Q44 165 62 160 L100 170 L138 160 Q156 165 156 188 L156 240 L44 240 Z"}
      fill={c} />
    <rect x={g==="female"?34:28} y={g==="female"?184:184} width="20" height={g==="female"?46:56} rx="10" fill={c} />
    <rect x={g==="female"?146:152} y={g==="female"?184:184} width="20" height={g==="female"?46:56} rx="10" fill={c} />
  </g>,
  // 1 hoodie
  (c, g) => <g key="o1">
    <path d={g==="female"
      ? "M46 188 Q46 164 66 158 L100 168 L134 158 Q154 164 154 188 L154 238 L46 238 Z"
      : "M38 188 Q38 162 60 156 L100 167 L140 156 Q162 162 162 188 L162 248 L38 248 Z"}
      fill={c} />
    <path d={`M82 168 Q100 160 118 168 L114 185 Q100 178 86 185 Z`} fill={c} opacity="0.6" />
    <rect x={g==="female"?28:22} y="184" width="20" height={g==="female"?54:64} rx="10" fill={c} />
    <rect x={g==="female"?152:158} y="184" width="20" height={g==="female"?54:64} rx="10" fill={c} />
  </g>,
  // 2 shirt / blazer
  (c) => <g key="o2">
    <path d="M40 188 Q40 162 62 156 L100 167 L138 156 Q160 162 160 188 L160 248 L40 248 Z" fill={c} />
    <path d="M100 167 L90 195 L100 212 L110 195 Z" fill="rgba(255,255,255,0.12)" />
    <rect x="22" y="184" width="20" height="64" rx="10" fill={c} />
    <rect x="158" y="184" width="20" height="64" rx="10" fill={c} />
  </g>,
];

/* ── Accessories ── */
const ACCESSORIES: (((c: string) => React.ReactNode) | null)[] = [
  null,
  // 1 flower crown
  c => <g key="a1">
    {[0,1,2,3,4,5].map(i => {
      const a = (i/6)*Math.PI*2 - Math.PI/2;
      return <circle key={i} cx={100+Math.cos(a)*40} cy={50+Math.sin(a)*12} r={6} fill={c} opacity="0.9" />;
    })}
  </g>,
  // 2 headband
  c => <rect key="a2" x="56" y="78" width="88" height="9" rx="4" fill={c} />,
  // 3 glasses
  c => <g key="a3">
    <rect x="66" y="106" width="26" height="17" rx="7" fill="none" stroke={c} strokeWidth="2" />
    <rect x="108" y="106" width="26" height="17" rx="7" fill="none" stroke={c} strokeWidth="2" />
    <line x1="92" y1="114" x2="108" y2="114" stroke={c} strokeWidth="2" />
    <line x1="66" y1="114" x2="58" y2="116" stroke={c} strokeWidth="2" />
    <line x1="134" y1="114" x2="142" y2="116" stroke={c} strokeWidth="2" />
  </g>,
];

const EXPRESSIONS = [
  // 0 smile
  <path key="e0" d="M86 146 Q100 158 114 146" stroke="#b05070" strokeWidth="2.5" fill="none" strokeLinecap="round" />,
  // 1 big smile
  <path key="e1" d="M82 144 Q100 162 118 144" stroke="#b05070" strokeWidth="2.5" fill="none" strokeLinecap="round" />,
  // 2 neutral
  <line key="e2" x1="88" y1="150" x2="112" y2="150" stroke="#b05070" strokeWidth="2.5" strokeLinecap="round" />,
  // 3 sad
  <path key="e3" d="M86 154 Q100 144 114 154" stroke="#b05070" strokeWidth="2.5" fill="none" strokeLinecap="round" />,
];

export function AvatarSVG({ cfg, size = 120 }: { cfg: AvatarConfig; size?: number }) {
  // Normalise cfg — DB may store old string-based avatar shape
  const safe: AvatarConfig = {
    ...defaultAvatar,
    ...cfg,
    hairStyle: typeof cfg.hairStyle === "number" && cfg.hairStyle >= 0 && cfg.hairStyle <= 4 ? cfg.hairStyle : 0,
    outfit:    typeof cfg.outfit    === "number" && cfg.outfit    >= 0 && cfg.outfit    <= 2 ? cfg.outfit    : 0,
    accessory: typeof cfg.accessory === "number" && cfg.accessory >= 0 && cfg.accessory <= 3 ? cfg.accessory : 0,
    expression:typeof cfg.expression=== "number" && cfg.expression>= 0 && cfg.expression<= 3 ? cfg.expression: 0,
    gender: cfg.gender === "male" ? "male" : "female",
  };
  const hair = safe.gender === "female" ? F_HAIR : M_HAIR;
  const lipColor = safe.gender === "female" ? "#e8748a" : safe.skin;
  const browThick = safe.gender === "male" ? 3 : 2;

  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 200 280" style={{ overflow: "visible", display: "block" }}>
      {/* Neck */}
      <rect x="88" y="162" width="24" height="30" rx="10" fill={safe.skin} />
      {/* Outfit */}
      {OUTFITS[safe.outfit](safe.outfitColor, safe.gender)}
      {/* Hair back layer */}
      {hair[safe.hairStyle](safe.hairColor)}
      {/* Head */}
      <ellipse cx="100" cy="112" rx="44" ry="52" fill={safe.skin} />
      {/* Ears */}
      <ellipse cx="56" cy="116" rx="8" ry="11" fill={safe.skin} />
      <ellipse cx="144" cy="116" rx="8" ry="11" fill={safe.skin} />
      <ellipse cx="56" cy="116" rx="5" ry="7" fill={safe.skin} opacity="0.6" />
      <ellipse cx="144" cy="116" rx="5" ry="7" fill={safe.skin} opacity="0.6" />
      {/* Blush (female only) */}
      {safe.gender === "female" && <>
        <ellipse cx="72" cy="128" rx="12" ry="7" fill="#ff9eb5" opacity="0.28" />
        <ellipse cx="128" cy="128" rx="12" ry="7" fill="#ff9eb5" opacity="0.28" />
      </>}
      {/* Eye whites */}
      <ellipse cx="82" cy="112" rx="10" ry="11" fill="white" />
      <ellipse cx="118" cy="112" rx="10" ry="11" fill="white" />
      {/* Irises */}
      <circle cx="83" cy="113" r="7" fill={safe.eyeColor} />
      <circle cx="119" cy="113" r="7" fill={safe.eyeColor} />
      {/* Pupils */}
      <circle cx="84" cy="113" r="3.5" fill="#111" />
      <circle cx="120" cy="113" r="3.5" fill="#111" />
      {/* Eye shine */}
      <circle cx="86" cy="110" r="2" fill="white" />
      <circle cx="122" cy="110" r="2" fill="white" />
      {/* Eyelashes (female) */}
      {safe.gender === "female" && [[-3,-2],[0,-3],[3,-2]].map(([dx,dy],i) => (
        <g key={`eyelash-${i}`}>
          <line x1={82+dx} y1={102+dy} x2={82+dx*1.3} y2={99+dy*1.4} stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
          <line x1={118+dx} y1={102+dy} x2={118+dx*1.3} y2={99+dy*1.4} stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      ))}
      {/* Eyebrows */}
      <path d={safe.gender==="female" ? "M70 100 Q82 95 92 99" : "M68 99 Q82 93 94 98"}
        stroke={safe.hairColor==="#fff" ? "#aaa" : safe.hairColor} strokeWidth={browThick} fill="none" strokeLinecap="round" />
      <path d={safe.gender==="female" ? "M108 99 Q118 95 130 100" : "M106 98 Q118 93 132 99"}
        stroke={safe.hairColor==="#fff" ? "#aaa" : safe.hairColor} strokeWidth={browThick} fill="none" strokeLinecap="round" />
      {/* Nose */}
      <path d="M97 126 Q100 132 103 126" stroke={safe.skin<"#c" ? "#7a4020" : "#c8907a"} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.55" />
      {/* Lips */}
      <path d="M88 144 Q94 140 100 142 Q106 140 112 144 Q106 152 100 153 Q94 152 88 144 Z" fill={lipColor} opacity={safe.gender==="female"?1:0.4} />
      {/* Expression */}
      {EXPRESSIONS[safe.expression]}
      {/* Accessory */}
      {safe.accessory > 0 && ACCESSORIES[safe.accessory]?.("#ff6eb4")}
    </svg>
  );
}

/* ── Compact swatch ── */
function Swatch({ color, selected, onClick }: { color: string; selected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      width: 24, height: 24, borderRadius: "50%", background: color === "#fff" ? "#e8e8e8" : color,
      border: "none", cursor: "pointer",
      outline: selected ? "2.5px solid #ff6eb4" : "2px solid transparent",
      outlineOffset: 2, transition: "all 0.15s",
      transform: selected ? "scale(1.2)" : "scale(1)",
    }} />
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      padding: "5px 11px", borderRadius: 8, border: "1px solid",
      borderColor: active ? "rgba(255,110,180,0.5)" : "rgba(192,132,252,0.15)",
      background: active ? "rgba(255,110,180,0.1)" : "transparent",
      color: active ? "#ff6eb4" : "#6b5a80",
      fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "all 0.15s",
    }}>{label}</button>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b5a80", marginBottom: 6 }}>{label}</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>{children}</div>
    </div>
  );
}

export default function AvatarCustomiser({ cfg, onChange, stressLevel = 30, compact = false }: {
  cfg: AvatarConfig; onChange: (c: AvatarConfig) => void; stressLevel?: number; compact?: boolean;
}) {
  const [tab, setTab] = useState<"look"|"style">("look");
  const aura = stressLevel >= 70 ? "#ff4d6d" : stressLevel >= 40 ? "#ffb347" : "#c084fc";
  const hairStyles = cfg.gender === "female"
    ? ["Long","Bob","Curly","Bun","Ponytail"]
    : ["Short","Side Part","Messy","Buzz","Wavy"];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Avatar preview */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: compact ? "12px 0 8px" : "16px 0 10px", position: "relative" }}>
        <div style={{
          position: "absolute", width: 130, height: 130, borderRadius: "50%",
          background: `radial-gradient(circle, ${aura}18 0%, transparent 70%)`,
          filter: "blur(16px)", pointerEvents: "none",
        }} />
        <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}>
          <AvatarSVG cfg={cfg} size={compact ? 90 : 110} />
        </motion.div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, padding: "0 12px 8px" }}>
        {(["look","style"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: "5px 0", borderRadius: 8, border: "1px solid",
            borderColor: tab===t ? "rgba(255,110,180,0.4)" : "rgba(192,132,252,0.12)",
            background: tab===t ? "rgba(255,110,180,0.08)" : "transparent",
            color: tab===t ? "#ff6eb4" : "#6b5a80",
            fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "all 0.15s",
          }}>{t === "look" ? "👤 Look" : "👗 Style"}</button>
        ))}
      </div>

      {/* Panel */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 12px 12px" }}>
        {tab === "look" && <>
          <Row label="Gender">
            <Chip label="♀ Female" active={cfg.gender==="female"} onClick={() => onChange({...cfg, gender:"female", hairStyle:0})} />
            <Chip label="♂ Male"   active={cfg.gender==="male"}   onClick={() => onChange({...cfg, gender:"male",   hairStyle:0})} />
          </Row>
          <Row label="Skin">
            {SKINS.map(s => <Swatch key={s} color={s} selected={cfg.skin===s} onClick={() => onChange({...cfg,skin:s})} />)}
          </Row>
          <Row label="Hair Style">
            {hairStyles.map((s,i) => <Chip key={i} label={s} active={cfg.hairStyle===i} onClick={() => onChange({...cfg,hairStyle:i})} />)}
          </Row>
          <Row label="Hair Color">
            {HAIR_C.map(c => <Swatch key={c} color={c} selected={cfg.hairColor===c} onClick={() => onChange({...cfg,hairColor:c})} />)}
          </Row>
          <Row label="Eyes">
            {EYE_C.map(c => <Swatch key={c} color={c} selected={cfg.eyeColor===c} onClick={() => onChange({...cfg,eyeColor:c})} />)}
          </Row>
          <Row label="Expression">
            {["😊","😄","😐","😢"].map((e,i) => (
              <button key={i} onClick={() => onChange({...cfg,expression:i})} style={{
                width: 30, height: 30, borderRadius: 8, border: "1px solid",
                borderColor: cfg.expression===i ? "rgba(255,110,180,0.5)" : "rgba(192,132,252,0.12)",
                background: cfg.expression===i ? "rgba(255,110,180,0.1)" : "transparent",
                fontSize: 15, cursor: "pointer",
              }}>{e}</button>
            ))}
          </Row>
        </>}

        {tab === "style" && <>
          <Row label="Outfit">
            {["Casual","Hoodie","Blazer"].map((s,i) => <Chip key={i} label={s} active={cfg.outfit===i} onClick={() => onChange({...cfg,outfit:i})} />)}
          </Row>
          <Row label="Color">
            {OUTFIT_C.map(c => <Swatch key={c} color={c} selected={cfg.outfitColor===c} onClick={() => onChange({...cfg,outfitColor:c})} />)}
          </Row>
          <Row label="Accessory">
            {["None","🌸 Crown","🎀 Band","👓 Glasses"].map((s,i) => (
              <Chip key={i} label={s} active={cfg.accessory===i} onClick={() => onChange({...cfg,accessory:i})} />
            ))}
          </Row>
        </>}
      </div>
    </div>
  );
}
