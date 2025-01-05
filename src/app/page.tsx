"use client"

import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";

export default function Home() {
  
  useEffect(() => {
    const fetchTable = async () => {
      const { data, error } = await supabase
      .from('test').select('*');

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        console.log('Fetched data:', data);
      }
    };

    fetchTable();
    //   const { error } = await supabase
    //     .from('test').insert({
    //       id: 3
    //     });
    // }
    // insertTable();
  }, []);

  const signInWithKakao = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
    });
    
    if (error) {
      console.error("Error signing in:", error);
    } else {
      console.log("Sign in successful:", data);
    }
  };

  async function signOut() {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error("Error signing out:", error);
    }
    else {
      console.log("Sign out successful");
    }
  }

  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen w-screen p-8 pb-20 gap-16 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-5xl underline decoration-wavy decoration-red-700 underline-offset-8 font-extrabold mb-4 whitespace-nowrap">걍 내가 만드는 소리얼 예약 페이지</h1>
      <div className="w-[75%] justify-items-center">
        <button className="bg-gradient-to-r from-yellow-500 to-red-500 font-bold py-2 px-4 mb-8 rounded mr-4" type="button" onClick={() => signInWithKakao()}>Sign In with Kakao</button>
        <button className="bg-gradient-to-r from-yellow-500 to-red-500 font-bold py-2 px-4 mb-8 rounded" type="button" onClick={() => signOut()}>Sign Out</button>
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
                const date = dayIndex + 1;
                return (
                  <td key={dayIndex} className="border border-gray-300 p-0">
                    {Array.from({ length: 12 }).map((_, hourIndex) => {
                      const hour = 11 + hourIndex; // Start from 11:00
                      const [inputValue, setInputValue] = useState('');

                      const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
                        if (event.key === 'Enter') {
                          const { error } = await supabase.from('test').insert({ reserved_day : date, reserved_time : hour, user_name : inputValue });
                          if (error) {
                            console.error('Error inserting data:', error);
                          }
                          else {
                            console.log('Data inserted successfully');
                          }
                          setInputValue('');
                        }
                      };

                      return (
                        <div key={hourIndex} className="flex-1 border-b border-gray-200 last:border-b-0">
                          <div className="w-16 p-1 text-xs border-r border-gray-200 bg-gray-50">
                            {hour}:00
                          </div>
                          <input
                            type="text"
                            className="flex-1 p-1 text-sm outline-none focus:bg-blue-50"
                            placeholder="이름"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
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