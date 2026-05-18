// Pure presentational SVG components — no client state needed.
// CSS classes reference diagram-svg rules in globals.css.

function ArrowDefs() {
  return (
    <defs>
      <marker
        id="ah"
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="7"
        markerHeight="7"
        orient="auto-start-reverse"
      >
        <path d="M0 0 L10 5 L0 10 z" className="arrow-head" />
      </marker>
      <marker
        id="ah-a"
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="7"
        markerHeight="7"
        orient="auto-start-reverse"
      >
        <path d="M0 0 L10 5 L0 10 z" className="arrow-head-accent" />
      </marker>
    </defs>
  );
}

type NodeProps = {
  x: number;
  y: number;
  w?: number;
  h?: number;
  label: string;
  mono?: boolean;
  strong?: boolean;
};

function Node({ x, y, w = 110, h = 44, label, mono = false, strong = false }: NodeProps) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="8"
        className={strong ? "node-strong" : "node"}
      />
      <text
        x={x + w / 2}
        y={y + h / 2 + (mono ? 4 : 5)}
        textAnchor="middle"
        className={mono ? "label-mono" : "label"}
      >
        {label}
      </text>
    </g>
  );
}

// Closed-loop: Intent → Plan → Execute → Verify → Record → (loop back)
export function SpineDiagram1() {
  const stops = ["Intent", "Plan", "Execute", "Verify", "Record"];
  const W = 720;
  const H = 220;
  const top = 80;
  const gap = 16;
  const nodeW = (W - 80 - gap * 4) / 5;

  return (
    <svg
      className="diagram-svg"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Closed-loop flow: intent, plan, execute, verify, record, repeat."
    >
      <ArrowDefs />
      {stops.map((s, i) => {
        const x = 40 + i * (nodeW + gap);
        const strong = s === "Verify" || s === "Record";
        return (
          <Node key={s} x={x} y={top} w={nodeW} h={44} label={s} strong={strong} />
        );
      })}

      {/* connector arrows between nodes */}
      {stops.slice(0, -1).map((_, i) => {
        const x1 = 40 + i * (nodeW + gap) + nodeW;
        const x2 = x1 + gap;
        const y = top + 22;
        return (
          <line
            key={i}
            x1={x1}
            y1={y}
            x2={x2 - 4}
            y2={y}
            className="line-stroke"
            markerEnd="url(#ah)"
          />
        );
      })}

      {/* loop-back: Record → Intent via curved terracotta path */}
      <path
        d={`M ${40 + 4 * (nodeW + gap) + nodeW / 2} ${top + 44}
            C ${40 + 4 * (nodeW + gap) + nodeW / 2} ${H - 12},
              ${40 + nodeW / 2} ${H - 12},
              ${40 + nodeW / 2} ${top + 44 + 4}`}
        className="accent-stroke"
        markerEnd="url(#ah-a)"
      />
      <text
        x={W / 2}
        y={H - 18}
        textAnchor="middle"
        className="label-mono label-mute"
      >
        ↻ no status → no progress
      </text>
    </svg>
  );
}

// Visibility boundary: World → (Tools | Memory) → Agent → Action
export function SpineDiagram2() {
  const W = 720;
  const H = 240;

  return (
    <svg
      className="diagram-svg"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Agent visibility boundary: world enters through tools and memory; only what the agent sees informs the action."
    >
      <ArrowDefs />

      {/* dashed boundary rect around agent context */}
      <rect x="270" y="40" width="280" height="160" rx="14" className="boundary" />
      <text x="410" y="32" textAnchor="middle" className="label-mono label-mute">
        visibility boundary
      </text>

      <Node x={40}  y={100} w={160} h={50} label="The world" />
      <Node x={290} y={70}  w={110} h={40} label="Tools" mono />
      <Node x={290} y={130} w={110} h={40} label="Memory" mono />
      <Node x={420} y={100} w={110} h={50} label="Agent" strong />
      <Node x={580} y={100} w={110} h={50} label="Action" />

      {/* arrows */}
      <line x1="200" y1="115" x2="286" y2="90"  className="line-stroke" markerEnd="url(#ah)" />
      <line x1="200" y1="135" x2="286" y2="150" className="line-stroke" markerEnd="url(#ah)" />
      <line x1="400" y1="90"  x2="420" y2="118" className="line-stroke" markerEnd="url(#ah)" />
      <line x1="400" y1="150" x2="420" y2="132" className="line-stroke" markerEnd="url(#ah)" />
      <line x1="530" y1="125" x2="576" y2="125" className="accent-stroke" markerEnd="url(#ah-a)" />

      {/* dashed "unseen" path bypassing the boundary */}
      <path d="M 120 175 C 240 220, 500 220, 670 175" className="line-dash" />
      <text
        x={W / 2}
        y={H - 14}
        textAnchor="middle"
        className="label-mono label-mute"
      >
        — what the agent can&apos;t see → can&apos;t reason about
      </text>
    </svg>
  );
}

// State machine: not_started → active ↔ blocked → passing
export function SpineDiagram3() {
  const W = 720;
  const H = 200;

  return (
    <svg
      className="diagram-svg"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Feature state machine: not started, active, blocked, passing."
    >
      <ArrowDefs />

      <Node x={30}  y={70} w={150} h={50} label="not_started" mono />
      <Node x={220} y={70} w={120} h={50} label="active"      mono strong />
      <Node x={380} y={20} w={120} h={50} label="blocked"     mono />
      <Node x={540} y={70} w={150} h={50} label="passing"     mono strong />

      {/* not_started → active */}
      <line x1="180" y1="95" x2="216" y2="95" className="line-stroke" markerEnd="url(#ah)" />

      {/* active → passing (success path, terracotta) */}
      <line x1="340" y1="95" x2="536" y2="95" className="accent-stroke" markerEnd="url(#ah-a)" />

      {/* active ↔ blocked */}
      <path d="M 320 75 C 340 30, 380 30, 388 50" className="line-stroke" markerEnd="url(#ah)" />
      <path d="M 432 70 C 380 130, 320 130, 268 120" className="line-stroke" markerEnd="url(#ah)" />

      {/* annotations */}
      <text x="200" y="60"  textAnchor="middle" className="label-mono label-mute">begin</text>
      <text x="440" y="160" textAnchor="middle" className="label-mono label-mute">unblock</text>
      <text x="440" y="85"  textAnchor="middle" className="label-mono label-mute">block</text>
      <text x="610" y="60"  textAnchor="middle" className="label-mono label-mute">verify ✓</text>

      <text
        x={W / 2}
        y={H - 12}
        textAnchor="middle"
        className="label-mono label-mute"
      >
        states are observable · transitions are recorded
      </text>
    </svg>
  );
}
