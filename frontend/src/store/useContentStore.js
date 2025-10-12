import { create } from "zustand";
import axios from "axios";
import { serverURL } from "../App";

export const useContentStore = create((set, get) => ({
  videos: null,
  shorts: null,
  setVideos: (data) => set({ videos: data }),
  setShorts: (data) => set({ shorts: data }),
  getAllVideos: async () => {
    try {
      const res = await axios.get(`${serverURL}/api/content/getAllVideos`, {
        withCredentials: true,
      });
      set({ videos: res.data });
      console.log(get().videos);
    } catch (error) {
      console.log(error);
    }
  },
  getAllShorts: async () => {
    try {
      const res = await axios.get(`${serverURL}/api/content/getAllShorts`, {
        withCredentials: true,
      });
      set({ shorts: res.data });
      console.log(get().shorts);
    } catch (error) {
      console.log(error);
    }
  },
  incrementViewCount: (videoId) =>
    set((state) => {
      if (!state.videos) {
        return {};
      }
      return {
        videos: state.videos.map((video) =>
          video._id === videoId ? { ...video, views: video.views + 1 } : video
        ),
      };
    }),
}));
