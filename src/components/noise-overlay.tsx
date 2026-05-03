export function NoiseOverlay() {
  return (
    <div
      aria-hidden="true"
      className="noise-overlay pointer-events-none fixed inset-0 z-[9999] opacity-[0.018] mix-blend-overlay will-change-transform"
    />
  );
}
