export function MapIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 2L3 7V19L9 14L15 19L21 14V2L15 7L9 2Z" stroke="#1a1a1a" strokeWidth="1" fill="none"/>
      <line x1="9" y1="2" x2="9" y2="14" stroke="#1a1a1a" strokeWidth="1"/>
      <line x1="15" y1="7" x2="15" y2="19" stroke="#1a1a1a" strokeWidth="1"/>
    </svg>
  );
}