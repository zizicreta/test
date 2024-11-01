// components/Header.tsx
import Image from 'next/image';

export default function Header() {
  return (
    <header className="header">
      <div className="profile">
        <Image src="/profile.jpg" alt="Profile" width={40} height={40} />
        <span>Aston Agar</span>
      </div>
      <div className="stats">
        <div><span className="emoji">💰</span> Total Sells: $2,968.05</div>
        <div><span className="emoji">💵</span> Total Revenue: $1,549.45</div>
      </div>
    </header>
  );
}
