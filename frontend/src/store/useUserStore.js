import { create } from "zustand";
import axios from "axios";
import { serverURL } from "../App";

export const useUserStore = create((set, get) => ({
  loggedInUserData: null,
  getCurrentLoggedInUser: async () => {
    try {
      const res = await axios.get(`${serverURL}/api/user`, {
        withCredentials: true,
      });
      set({ loggedInUserData: res.data });
      console.log(get().loggedInUserData);
    } catch (error) {
      console.log(error);
    }
  },
  logout: async () => {
    try {
      await axios.post(`${serverURL}/api/auth/logout`, null, {
        withCredentials: true,
      });
      set({ loggedInUserData: null });
    } catch (error) {
      console.log(error);
    }
  },
  setLoggedInUserData: (user) => set({ loggedInUserData: user }),
}));
