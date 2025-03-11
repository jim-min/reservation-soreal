"use client"

import React, { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import Login from "../components/Login";
import TimeTable from "../components/TimeTable";
import { PublicStore } from "../store/store";

export default function Home() {
  const { setLoggedIn, setTableData, setUser } = PublicStore();
  const [ notification, setNotification ] = useState<string | null>(null);
  
  const fetchTable = async () => {
    // Get all reservations
    const { data: reservationData, error: reservationError } = await supabase
      .from('reservation')
      .select(`
        reserved_day, 
        reserved_time, 
        users!user_uid(uid, user_name)
      `);

    if (reservationError) {
      console.error('Error fetching data:', reservationError);
    } else {
      console.log('Fetched data:', reservationData);
      setTableData(reservationData || []);
    }
  };
  
  // 초기 세션 확인
  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    console.log(session);
    setLoggedIn(!!session);
    setUser(session?.user || null);
  };

  useEffect(() => {
    fetchTable();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('table-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reservation'
        },
        (payload) => {
          console.log('Change received:', payload);
          fetchTable(); // Refresh the data when a change occurs
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    checkSession();

    // 인증 상태 변경 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session);
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen w-full px-0 sm:px-4 pb-20 gap-8 font-[family-name:var(--font-geist-sans)] overflow-x-hidden">
      <div className="w-full sm:w-[90%] md:w-[85%] lg:w-[80%] flex flex-col items-center justify-items-center">
        <Login />
        <TimeTable notification={notification} setNotification={setNotification}/>
      </div>
      {/* Notification Toast */}
      {notification && (
          <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-up">
              {notification}
              <button className="ml-4 text-white hover:text-gray-200" onClick={() => setNotification(null)}>x</button>
          </div>
      )}
      <h1 className="text-3xl md:text-5xl underline decoration-wavy decoration-red-700 underline-offset-8 font-extrabold whitespace-nowrap">소리얼 예약 페이지</h1>
    </div>
  );
}