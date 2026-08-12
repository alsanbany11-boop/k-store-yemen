export default function StarRating({ rating = 0, count, size = 14 }) {
  const r = Math.max(0, Math.min(5, rating));
  const full = Math.floor(r);
  const half = r - full >= 0.5;
  return (
    <div className="flex items-center gap-1">
      <div className="flex" style={{ gap: 1 }}>
        {[0, 1, 2, 3, 4].map((i) => {
          const isFull = i < full;
          const isHalf = i === full && half;
          return (
            <svg key={i} width={size} height={size} viewBox="0 0 24 24" className={isFull || isHalf ? "text-gold-400" : "text-ink-700"}>
              <defs>
                <linearGradient id={`h${i}-${size}`}>
                  <stop offset="50%" stopColor="currentColor" />
                  <stop offset="50%" stopColor="transparent" />
                </linearGradient>
              </defs>
              {isHalf ? (
                <path fill={`url(#h${i}-${size})`} d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.7 7-6.3-3.8L5.4 21l1.7-7L1.7 9.5l7.1-.6z" stroke="currentColor" strokeWidth="1" />
              ) : (
                <path fill={isFull ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.7 7-6.3-3.8L5.4 21l1.7-7L1.7 9.5l7.1-.6z" />
              )}
            </svg>
          );
        })}
      </div>
      {count != null && <span className="text-xs text-ink-500">({count})</span>}
    </div>
  );
}
