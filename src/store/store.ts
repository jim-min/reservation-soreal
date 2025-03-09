import { create } from "zustand";
import { Database } from "../../types_db";
import { User } from "@supabase/auth-js";

interface StoreData {
  loggedIn: boolean;
  setLoggedIn: (loginState: boolean) => void;
  tableData: Database['public']['Tables']['test']['Row'][];
  setTableData: (data: Database['public']['Tables']['test']['Row'][]) => void;
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
