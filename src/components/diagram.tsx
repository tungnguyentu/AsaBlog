// SVG line-art diagram glyphs matching the wireframe designs.
// All strokes are crisp (1px), monochrome, no fills except the terminal node.

const MONO = 'var(--font-mono)';

type DiagramKind = "flow" | "mind" | "code" | "graph";

interface DiagramProps {
  kind?: DiagramKind;
  size?: number;
  style?: React.CSSProperties;
}

// Explicit literal types so TypeScript accepts these as SVG element props.
type SvgStrokeAttrs = {
  stroke: string;
  strokeWidth: number;
  fill: string;
  strokeLinecap: "round";
  strokeLinejoin: "round";
};

function svgStyle(stroke: string): SvgStrokeAttrs {
  return { stroke, strokeWidth: 1, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
}

function FlowDiagram({ ink, muted }: { ink: string; muted: string }) {
  const s = svgStyle(ink);
  const sm = svgStyle(muted);
  return (
    <>
      <rect x="4" y="9" width="22" height="14" {...s} />
      <rect x="37" y="9" width="22" height="14" {...s} />
      <rect x="70" y="9" width="22" height="14" {...s} />
      <rect x="37" y="42" width="22" height="14" fill={ink} stroke={ink} />
      <text
        x="48"
        y="52"
        textAnchor="middle"
        fontSize="8"
        fill="var(--paper)"
        fontFamily={MONO}
      >
        out
      </text>
      <path d="M26 16 L37 16" {...sm} />
      <path d="M59 16 L70 16" {...sm} />
      <path d="M48 23 L48 42" {...sm} />
      <path d="M45 39 L48 42 L51 39" {...s} />
    </>
  );
}

function MindDiagram({ ink, muted }: { ink: string; muted: string }) {
  const s = svgStyle(ink);
  const sm = svgStyle(muted);
  return (
    <>
      <line x1="16" y1="14" x2="48" y2="32" {...sm} />
      <line x1="80" y1="14" x2="48" y2="32" {...sm} />
      <line x1="16" y1="52" x2="48" y2="32" {...sm} />
      <line x1="80" y1="52" x2="48" y2="32" {...sm} />
      <circle cx="48" cy="32" r="8" fill={ink} stroke={ink} />
      <circle cx="16" cy="14" r="4" {...s} />
      <circle cx="80" cy="14" r="4" {...s} />
      <circle cx="16" cy="52" r="4" {...s} />
      <circle cx="80" cy="52" r="4" {...s} />
    </>
  );
}

function CodeDiagram({ ink, muted }: { ink: string; muted: string }) {
  const s = svgStyle(ink);
  const sm = svgStyle(muted);
  return (
    <>
      <rect x="2" y="3" width="92" height="58" {...s} />
      <line x1="2" y1="14" x2="94" y2="14" {...s} />
      <circle cx="8" cy="8.5" r="1.2" fill={ink} />
      <circle cx="13" cy="8.5" r="1.2" fill={ink} />
      <circle cx="18" cy="8.5" r="1.2" fill={ink} />
      <line x1="10" y1="22" x2="34" y2="22" {...sm} />
      <line x1="10" y1="30" x2="58" y2="30" stroke={ink} strokeWidth="1.5" />
      <line x1="18" y1="38" x2="42" y2="38" {...sm} />
      <line x1="18" y1="46" x2="62" y2="46" {...sm} />
      <line x1="10" y1="54" x2="30" y2="54" {...sm} />
    </>
  );
}

function GraphDiagram({ ink, muted }: { ink: string; muted: string }) {
  const s = svgStyle(ink);
  return (
    <>
      <line x1="8" y1="56" x2="92" y2="56" {...s} />
      <line x1="8" y1="6" x2="8" y2="56" {...s} />
      <path
        d="M8 48 L24 42 L36 38 L52 28 L70 22 L90 10"
        stroke={ink}
        strokeWidth="1.4"
        fill="none"
      />
      <circle cx="36" cy="38" r="1.6" fill={ink} />
      <circle cx="52" cy="28" r="1.6" fill={ink} />
      <circle cx="70" cy="22" r="1.6" fill={ink} />
      <line
        x1="8" y1="46" x2="92" y2="46"
        stroke={muted} strokeWidth="0.5" strokeDasharray="2 2"
      />
      <line
        x1="8" y1="32" x2="92" y2="32"
        stroke={muted} strokeWidth="0.5" strokeDasharray="2 2"
      />
      <line
        x1="8" y1="18" x2="92" y2="18"
        stroke={muted} strokeWidth="0.5" strokeDasharray="2 2"
      />
    </>
  );
}

const DIAGRAM_MAP: Record<
  DiagramKind,
  (props: { ink: string; muted: string }) => React.ReactNode
> = {
  flow: FlowDiagram,
  mind: MindDiagram,
  code: CodeDiagram,
  graph: GraphDiagram,
};

export function Diagram({ kind = "flow", size = 96, style }: DiagramProps) {
  const Inner = DIAGRAM_MAP[kind];
  return (
    <svg
      width={size}
      height={size * 0.7}
      viewBox="0 0 96 64"
      style={{ overflow: "visible", ...style }}
    >
      <Inner ink="var(--ink)" muted="var(--muted)" />
    </svg>
  );
}

export type { DiagramKind };
