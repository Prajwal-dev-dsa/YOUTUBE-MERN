import { create } from "zustand";
import axios from "axios";
import { serverURL } from "../App";

export const useSubscribedContentStore = create((set, get) => ({
  subscribedChannels: null,
  subscribedChannelVideos: null,
  subscribedChannelShorts: null,
  subscribedChannelPlaylists: null,
  subscribedChannelCommunityPosts: null,

  setSubscribedChannels: (data) => set({ subscribedChannels: data }),
  setSubscribedChannelVideos: (data) => set({ subscribedChannelVideos: data }),
  setSubscribedChannelShorts: (data) => set({ subscribedChannelShorts: data }),
  setSubscribedChannelPlaylists: (data) =>
    set({ subscribedChannelPlaylists: data }),
  setSubscribedChannelCommunityPosts: (data) =>
    set({ subscribedChannelCommunityPosts: data }),

  getSubscribedContentData: async () => {
    try {
      const res = await axios.get(
        `${serverURL}/api/user/get-subscribed-content-data`,
        {
          withCredentials: true,
        }
      );
      set({ subscribedChannels: res.data.subscribers || [] });
      set({ subscribedChannelVideos: res.data.videos });
      set({ subscribedChannelShorts: res.data.shorts });
      set({ subscribedChannelPlaylists: res.data.playlists });
      set({ subscribedChannelCommunityPosts: res.data.communityPosts });

      console.log("Subscribed Content Data:", res.data);
    } catch (error) {
      console.log("Error fetching subscribed content:", error);
    }
  },
}));
