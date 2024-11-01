// components/ProfileCard.tsx
"use client";

export default function ProfileCard() {
  return (
    <div className="bg-white p-4 rounded-lg shadow flex flex-col items-center">
      <img src="/profile.jpg" alt="Profile Picture" className="w-16 h-16 rounded-full mb-3" />
      <h4 className="font-semibold">Aston Agar</h4>
      <p className="text-sm text-gray-600">4 from 6 tasks completed</p>
      <button className="mt-2 bg-blue-500 text-white px-3 py-1 rounded">View Profile</button>
    </div>
  );
}
