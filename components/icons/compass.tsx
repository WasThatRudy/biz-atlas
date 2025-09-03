export function CompassIcon({ className = "w-24 h-24" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="45" stroke="#1a1a1a" strokeWidth="1" fill="none"/>
      <circle cx="50" cy="50" r="35" stroke="#1a1a1a" strokeWidth="0.5" fill="none"/>
      <circle cx="50" cy="50" r="25" stroke="#1a1a1a" strokeWidth="0.5" fill="none"/>
      <circle cx="50" cy="50" r="15" stroke="#1a1a1a" strokeWidth="0.5" fill="none"/>
      
      {/* North indicator */}
      <polygon points="50,10 55,20 45,20" fill="#1a1a1a"/>
      <text x="50" y="8" textAnchor="middle" className="text-xs font-bold" fill="#1a1a1a">N</text>
      
      {/* Compass needle */}
      <line x1="50" y1="25" x2="50" y2="75" stroke="#8b5a2b" strokeWidth="2"/>
      <line x1="25" y1="50" x2="75" y2="50" stroke="#8b5a2b" strokeWidth="1"/>
      
      {/* Center circle */}
      <circle cx="50" cy="50" r="3" fill="#1a1a1a"/>
      
      {/* Decorative elements */}
      <g stroke="#1a1a1a" strokeWidth="0.5" fill="none">
        <path d="M50 5 L50 15 M50 85 L50 95 M5 50 L15 50 M85 50 L95 50"/>
        <path d="M20 20 L30 30 M70 70 L80 80 M80 20 L70 30 M30 70 L20 80"/>
      </g>
    </svg>
  );
}