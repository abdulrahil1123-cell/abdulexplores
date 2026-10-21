/** Lightweight CSS-only 3D background: a perspective road grid rushing toward the viewer. */
export function Road3DBackground() {
  return (
    <div aria-hidden className="road3d pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="road3d-sky" />
      <div className="road3d-stage">
        <div className="road3d-floor" />
        <div className="road3d-lane" />
      </div>
      <div className="road3d-fade" />
    </div>
  );
}
