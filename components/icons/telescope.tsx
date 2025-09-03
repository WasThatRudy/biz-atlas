export function TelescopeIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7" cy="7" r="3" stroke="#1a1a1a" strokeWidth="1" fill="none"/>
      <path d="M10.5 10.5L20 20" stroke="#1a1a1a" strokeWidth="1"/>
      <path d="M15 5L20 10" stroke="#1a1a1a" strokeWidth="1"/>
      <circle cx="20" cy="20" r="1" fill="#1a1a1a"/>
    </svg>
  );
}