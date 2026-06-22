"use client";

export default function AnimatedMarketBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 bg-center bg-cover scale-105 animate-[zoomMarket_12s_ease-in-out_infinite]"
        style={{ backgroundImage: "url('/images/market-bg.jpg')" }}
      />

      <div className="absolute inset-0 bg-black/55" />

      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="none">
        <path
          d="M0 500 L120 460 L220 480 L310 360 L430 410 L540 260 L650 310 L760 180 L870 230 L1000 90"
          fill="none"
          stroke="#22c55e"
          strokeWidth="5"
          strokeDasharray="20 15"
          className="animate-[moveLine_4s_linear_infinite]"
        />
      </svg>

      <div className="absolute bottom-0 left-0 right-0 flex items-end gap-1 px-4 h-64 opacity-70">
        {Array.from({ length: 45 }).map((_, i) => (
          <div
            key={i}
            className={i % 2 === 0 ? "w-3 bg-green-500 animate-pulse" : "w-3 bg-red-500 animate-pulse"}
            style={{
              height: `${40 + ((i * 37) % 180)}px`,
              animationDelay: `${i * 0.08}s`,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/25 via-transparent to-green-500/25 animate-pulse" />

      <style jsx>{`
        @keyframes zoomMarket {
          0%, 100% { transform: scale(1.05); }
          50% { transform: scale(1.12); }
        }

        @keyframes moveLine {
          from { stroke-dashoffset: 120; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}