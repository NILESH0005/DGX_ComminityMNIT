import React, { useEffect, useRef, useState, useContext } from "react";
// import toast from "react-hot-toast";
import ApiContext from "../../context/ApiContext";

const getYoutubeId = (url) => {
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?v=))([^#&?]*).*/;

  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : null;
};

export default function YoutubeProgressPlayer({ youtubeUrl, fileId }) {
  const { fetchData, userToken, user } = useContext(ApiContext);

  const iframeRef = useRef(null);
  const playerRef = useRef(null);

  const trackingInterval = useRef(null);

  const durationRef = useRef(0);
  const currentTimeRef = useRef(0);
  const maxWatchedRef = useRef(0);
  const lastSavedRef = useRef(0);
  const resumeTimeRef = useRef(0);

  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const videoId = getYoutubeId(youtubeUrl);

  useEffect(() => {
    loadSavedProgress();
  }, [fileId]);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);

      window.onYouTubeIframeAPIReady = initializePlayer;
    } else if (window.YT && window.YT.Player) {
      initializePlayer();
    }
  }, [youtubeUrl]);

  const initializePlayer = () => {
    if (!iframeRef.current || playerRef.current || !videoId) return;

    playerRef.current = new window.YT.Player(iframeRef.current, {
      videoId,
      playerVars: {
        controls: 1,
        modestbranding: 1,
        rel: 0,
        autoplay: 0,
      },
      events: {
        onReady: onPlayerReady,
      },
    });
  };

  const onPlayerReady = (event) => {
    const player = event.target;

    const dur = player.getDuration();

    durationRef.current = dur;
    setDuration(dur);

    if (resumeTimeRef.current > 0) {
      player.seekTo(resumeTimeRef.current, true);
    }

    startTracking();
  };

  const startTracking = () => {
    if (trackingInterval.current) return;

    trackingInterval.current = setInterval(() => {
      const player = playerRef.current;
      if (!player) return;

      const time = player.getCurrentTime();
      const dur = player.getDuration();

      currentTimeRef.current = time;
      durationRef.current = dur;

      setCurrentTime(time);
      setDuration(dur);

      if (time > maxWatchedRef.current) {
        maxWatchedRef.current = time;
      }

      // Prevent skipping
      if (time > maxWatchedRef.current + 5) {
        player.seekTo(maxWatchedRef.current);
        toast.error("Skipping ahead is disabled");
      }

      maybeSaveProgress();
    }, 1000);
  };

  const maybeSaveProgress = async () => {
    const time = currentTimeRef.current;

    if (time - lastSavedRef.current < 10) return;

    lastSavedRef.current = time;

    try {
      await fetchData(
        "video-progress/save",
        "POST",
        {
          UserID: user.UserID,
          FileID: fileId,
          CurrentTime: time,
          Duration: durationRef.current,
        },
        {
          "Content-Type": "application/json",
          "auth-token": userToken,
        },
      );
    } catch (err) {
      console.error("Progress save failed", err);
    }
  };

  const loadSavedProgress = async () => {
    try {
      const res = await fetchData(
        `video-progress/${user.UserID}/${fileId}`,
        "GET",
        {},
        {
          "Content-Type": "application/json",
          "auth-token": userToken,
        },
      );

      resumeTimeRef.current = res?.data?.CurrentTime || 0;
      currentTimeRef.current = resumeTimeRef.current;
      setCurrentTime(resumeTimeRef.current);
    } catch (err) {
      console.error("Progress fetch failed", err);
    }
  };

  const watchPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="bg-DGXgreen rounded overflow-hidden w-full aspect-video">
        <div ref={iframeRef} className="w-full h-full" />
      </div>
      <div className="mt-4 bg-white border border-gray-200 rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">
            Watch Progress
          </span>

          <span className="text-sm font-semibold text-green-600">
            {watchPercentage.toFixed(1)}%
          </span>
        </div>
        <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-full transition-all duration-500"
            style={{ width: `${watchPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
