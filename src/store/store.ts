import { create } from "zustand";
import { User } from "@supabase/auth-js";

// Define the structure for joined data
export interface ReservationWithUser {
  reserved_day: string | null;
  reserved_time: number | null;
  users: {
    uid: string;
    user_name: string;
  } | null;
}

interface StoreData {
  loggedIn: boolean;
  setLoggedIn: (loginState: boolean) => void;
  tableData: ReservationWithUser[];
  setTableData: (data: ReservationWithUser[]) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  hoursReserving: boolean;
  setHoursReserving: (hourReserving: boolean) => void;
  vacationMode: boolean;
  setVacationMode: (vacationMode: boolean) => void;
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
  setHoursReserving: (hoursReserving) => set({ hoursReserving }),
  vacationMode: false,
  setVacationMode: (vacationMode) => set({ vacationMode })
}));
