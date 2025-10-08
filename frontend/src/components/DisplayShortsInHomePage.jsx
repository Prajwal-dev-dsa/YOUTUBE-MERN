import React, { useEffect } from "react";
import { SiYoutubeshorts } from "react-icons/si";
import { useContentStore } from "../store/useContentStore";
import ShortCard from "./ShortCard";

const DisplayShortsInHomePage = () => {
  const { shorts, getAllShorts } = useContentStore();

  useEffect(() => {
    getAllShorts();
  }, [getAllShorts]);

  return (
    <div className="px-6 py-4">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-1">
        <SiYoutubeshorts className="text-red-600 size-6" />
        Shorts
      </h2>
      <div className="flex gap-6 overflow-x-auto pb-4 scroll-hide">
        {shorts?.map((short) => (
          <ShortCard
            key={short?._id}
            shortUrl={short?.shortUrl}
            title={short?.title}
            channelName={short?.channel?.name}
            avatar={short?.channel?.avatar}
            views={short?.views}
            id={short?._id}
          />
        ))}
      </div>
    </div>
  );
};

export default DisplayShortsInHomePage;
