"use client"

import { useEffect } from "react";
import { supabase } from "../../utils/supabase";

export default function Home() {
  useEffect(() => {
    supabase.from('test').select('*').then(console.log);
  }, []);

  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen w-screen p-8 pb-20 gap-16 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-5xl underline decoration-wavy decoration-red-700 underline-offset-8 font-extrabold mb-4 whitespace-nowrap">걍 내가 만드는 소리얼 예약 페이지</h1>
      <div className="w-[75%] justify-items-center">
        <table className="w-full max-w-[75%] border-collapse border border-gray-300">
          <thead>
            <tr>
              {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                <th key={day} className="flex-1 border border-gray-300 p-2">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {Array.from({ length: 7 }).map((_, dayIndex) => {
                const date = new Date();
                date.setDate(date.getDate() + 0 * 7 + dayIndex);
                return (
                  <td key={dayIndex} className="border border-gray-300 p-0">
                    {Array.from({ length: 12 }).map((_, hourIndex) => {
                      const hour = 11 + hourIndex; // Start from 11:00
                      return (
                        <div key={hourIndex} className="flex-1 border-b border-gray-200 last:border-b-0">
                          <div className="w-16 p-1 text-xs border-r border-gray-200 bg-gray-50">
                            {hour}:00
                          </div>
                          <input
                            type="text"
                            className="flex-1 p-1 text-sm outline-none focus:bg-blue-50"
                            placeholder="이름"
                          />
                        </div>
                      );
                    })}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}