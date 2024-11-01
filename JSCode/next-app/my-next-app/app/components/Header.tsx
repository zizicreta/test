// components/Header.tsx

"use client";

import Image from 'next/image';

export default function Header() {
  return (
    <header className="header">
      <div className="profile">
        <Image src="/profile.jpg" alt="Profile" width={40} height={40} />
        <span>Aston Agar</span>
      </div>
      <div className="stats">
        <div>Total Sells: $2,968.05</div>
        <div>Total Revenue: $1,549.45</div>
      </div>
    </header>
  );
}
