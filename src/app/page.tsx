"use client"

import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import { User } from "@supabase/auth-js";

export default function Home() {
  const [tableData, setTableData] = useState<any[]>([]);
  const [trigger, setTrigger] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [hourReserving, setHourReserving] = useState<boolean>(false);

  useEffect(() => {
    const fetchTable = async () => {
      const { data, error } = await supabase
      .from('test').select('*');

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        console.log('Fetched data:', data);
        setTableData(data || []);
      }
    };

    fetchTable();
  }, [trigger]);

  // 초기 세션 확인
  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setLoggedIn(!!session);
    setUser(session?.user || null);
  };

  useEffect(() => {
    checkSession();

    // 인증 상태 변경 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session);
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
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

  const getCurrentWeekDates = () => {
    const today = new Date();
    const day = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
    const dates = [];
    
    // 일요일을 기준으로 잡기 위해 일요일 찾음
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - day);
    
    // 날짜 포맷팅
    for (let i = 0; i < 7; i++) {
      const date = new Date(sunday);
      date.setDate(sunday.getDate() + i);
      const formattedDate = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
      const dayName = ['일', '월', '화', '수', '목', '금', '토'][i];
      dates.push({ date: formattedDate, day: dayName });
    }
    
    return dates;
  };

  const weekDates = getCurrentWeekDates();

  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen w-full p-8 pb-20 gap-8 font-[family-name:var(--font-geist-sans)] overflow-x-hidden">
      <h1 className="text-3xl md:text-5xl underline decoration-wavy decoration-red-700 underline-offset-8 font-extrabold whitespace-nowrap">소리얼 예약 페이지</h1>
      <div className="w-[75%] justify-items-center">
        {loggedIn ? (
          <div className="flex flex-1 items-center gap-4 mb-8">
            <span className="text-sm md:text-2xl font-medium whitespace-nowrap">{user?.user_metadata?.name || '사용자'}님<br/>환영합니다</span>
            <button 
              className="text-xs md:text-lg bg-yellow-300 font-bold py-2 px-4 rounded-xl whitespace-nowrap" 
              type="button" 
              style={{ fontFamily: 'Noto Sans KR' }}
              onClick={() => signOut()}>
              로그아웃
            </button>
            <div className="flex">
              <div className={`text-xs md:text-lg ${hourReserving === true ? 'bg-green-300' : 'bg-gray-300'} p-2 rounded-l-xl cursor-pointer whitespace-nowrap`} onClick={() => setHourReserving(!hourReserving)}>1시간</div>
              <div className={`text-xs md:text-lg ${hourReserving === true ? 'bg-gray-300' : 'bg-green-300'} p-2 rounded-r-xl cursor-pointer whitespace-nowrap`} onClick={() => setHourReserving(!hourReserving)}>2시간</div>
            </div>
          </div>
        ) : (
          <button 
            className="bg-yellow-300 font-bold py-2 px-4 mb-8 rounded" 
            type="button" 
            style={{ fontFamily: 'Noto Sans KR' }}
            onClick={() => signInWithKakao()}>
            카카오로 로그인
          </button>
        )}
        
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              {weekDates.map((item) => (
                <th key={item.day} className="flex-1 border border-gray-300 p-2 text-xs sm:text-sm md:text-xl">
                  <div>{item.date}</div>
                  <div>{'(' + item.day + ')'}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {weekDates.map((item) => (
                <td key={item.date} className="border border-gray-300 p-0">
                  {Array.from({ length: 12 }).map((_, hourIndex) => {
                    let hour = 11 + hourIndex; // Start from 11:00

                    const handleReservation = async () => {
                      const { error } = await supabase.from('test').insert({ 
                        reserved_day: item.date, 
                        reserved_time: hour, 
                        user_name: user?.user_metadata?.name || '익명'
                      });
                      if (error) {
                        console.error('Error inserting data:', error);
                      }
                      else {
                        console.log('Data inserted successfully');
                        setTrigger(prev => prev + 1);
                      }
                    };

                    return (
                      <div key={hourIndex} className="flex-1 border-b border-gray-200 last:border-b-0">
                        <div className="absolute w-12 p-1 text-xs border-r border-gray-200 bg-gray-50 z-10 opacity-30">
                          {hour}:00
                        </div>
                        {tableData.find(data => data.reserved_day === item.date && data.reserved_time === hour) ? (
                          <div className="flex p-1 h-10 justify-center items-center text-sm bg-fuchsia-100 pl-8">
                            {tableData.find(data => data.reserved_day === item.date && data.reserved_time === hour)?.user_name}
                          </div>
                        ) : (
                          loggedIn ? (
                            <button
                              className="w-full h-10 text-sm hover:bg-blue-50 transition-colors pl-8 whitespace-nowrap"
                              onClick={handleReservation}
                            >
                              예약
                            </button>
                          ) : (
                            <div className="flex p-1 h-10 justify-center items-center text-sm text-gray-400 pl-8 whitespace-nowrap">
                              로그인
                            </div>
                          )
                        )}
                      </div>
                    );
                  })}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}