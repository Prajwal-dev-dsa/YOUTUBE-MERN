import { create } from "zustand";
import axios from "axios";
import { serverURL } from "../App";

export const useChannelStore = create((set, get) => ({
  channelData: null,
  setChannelData: (data) => set({ channelData: data }),
  getUserChannel: async () => {
    try {
      const res = await axios.get(`${serverURL}/api/user/get-channel`, {
        withCredentials: true,
      });
      set({ channelData: res.data });
      console.log(get().channelData);
    } catch (error) {
      console.log(error);
    }
  },
}));
