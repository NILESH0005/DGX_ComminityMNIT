const techStrip = [
  "Linux", "Python", "Networking", "Data Center", "NVIDIA DGX",
  "BCM", "Docker", "SLURM", "Kubernetes", "Run:ai",
];

export default function TechMarquee() {
  const items = [...techStrip, ...techStrip];
  return (
    <div className="bg-[#013D54] overflow-hidden whitespace-nowrap py-4">
      <style>{`
        @keyframes dgx-marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .dgx-marquee { animation: dgx-marquee 30s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .dgx-marquee { animation: none; } }
      `}</style>
      <div className="dgx-marquee inline-block">
        {items.map((t, i) => (
          <span key={i} className="inline-block mx-7 text-[#9BD92E] font-extrabold text-sm tracking-wide">
            ◆ {t}
          </span>
        ))}
      </div>
    </div>
  );
}