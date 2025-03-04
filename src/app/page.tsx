"use client"

import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import { User } from "@supabase/auth-js";
import Login from "../../component/login";
import TimeTable from "../../component/TimeTable";

export default function Home() {
  const [tableData, setTableData] = useState<any[]>([]);
  const [trigger, setTrigger] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

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

  const handleReservation = async (day : string, time : number) => {
    const { error } = await supabase.from('test').insert({ 
      reserved_day: day, 
      reserved_time: time, 
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

        <Login loggedIn={loggedIn} user={user} />
        
        <TimeTable />
      </div>
    </div>
  );
}