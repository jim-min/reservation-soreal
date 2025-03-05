"use client"

import React, { useEffect } from "react";
import { supabase } from "../../utils/supabase";
import { User } from "@supabase/auth-js";
import Login from "../components/Login";
import TimeTable from "../components/TimeTable";
import { create } from "zustand";

interface StoreData {
  loggedIn: Boolean;
  setLoggedIn: (loginState: Boolean) => void;
  tableData: any[];
  setTableData: (data: any[]) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  hoursReserving: boolean;
  setHoursReserving: (hourReserving: boolean) => void;
};

export const PublicStore = create<StoreData>((set) => ({
  loggedIn: false,
  setLoggedIn(loginState) {
    set({ loggedIn: loginState });
  },
  tableData: [],
  setTableData: (data) => set({ tableData: data }),
  user: null,
  setUser: (user) => set({ user }),
  hoursReserving: false,
  setHoursReserving: (hoursReserving) => set({ hoursReserving })
}));

export default function Home() {
  const { setLoggedIn, setTableData, setUser } = PublicStore();
  
  const fetchTable = async () => {
    const { data, error } = await supabase
      .from('test')
      .select('*');

    if (error) {
      console.error('Error fetching data:', error);
    } else {
      console.log('Fetched data:', data);
      setTableData(data || []);
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
          table: 'test'
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
    <div className="flex flex-col items-center justify-items-center min-h-screen w-full p-8 pb-20 gap-8 font-[family-name:var(--font-geist-sans)] overflow-x-hidden">
      <h1 className="text-3xl md:text-5xl underline decoration-wavy decoration-red-700 underline-offset-8 font-extrabold whitespace-nowrap">소리얼 예약 페이지</h1>
      <div className="w-[75%] justify-items-center">
        <Login />
        
        <TimeTable />
      </div>
    </div>
  );
}