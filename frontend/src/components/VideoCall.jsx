import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Peer } from "peerjs";
import socket from "../socket/socket";

const VideoCall = () => {
  const { roomCode } = useParams();

  const myVideo = useRef(null);
  const streamRef = useRef(null);
  const peerRef = useRef(null);

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [status, setStatus] = useState("Connecting...");

  useEffect(() => {
    let peer;

    const startVideoCall = async () => {
      try {
        // ==========================
        // Get Camera + Microphone
        // ==========================

        const stream =
          await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });

        streamRef.current = stream;

        if (myVideo.current) {
          myVideo.current.srcObject = stream;
        }

        // ==========================
        // Create Peer
        // ==========================

        peer = new Peer(undefined, {
          host: "localhost",
          port: 9000,
          path: "/peerjs",
        });

        peerRef.current = peer;

        // ==========================
        // Peer Connected
        // ==========================

        peer.on("open", (peerId) => {
          console.log("🟢 My Peer ID:", peerId);

          setStatus("Connected");

          socket.emit("peer-id", {
            roomCode,
            peerId,
          });
        });

        // ==========================
        // Incoming Call
        // ==========================

        peer.on("call", (call) => {
          console.log("📞 Incoming call:", call.peer);

          call.answer(stream);

          call.on("stream", (remoteStream) => {
            addRemoteVideo(
              call.peer,
              remoteStream
            );
          });
        });

        peer.on("error", (error) => {
          console.log("❌ Peer Error:", error);
          setStatus("Connection Error");
        });

        // ==========================
        // New User Joined
        // ==========================

        socket.on("peer-user", ({ peerId }) => {
          if (!peerId || peerId === peer.id) return;

          console.log(
            "📞 Calling new user:",
            peerId
          );

          const call = peer.call(
            peerId,
            stream
          );

          call.on("stream", (remoteStream) => {
            addRemoteVideo(
              peerId,
              remoteStream
            );
          });
        });

      } catch (error) {
        console.log(
          "❌ Camera/Microphone Error:",
          error
        );

        setStatus("Camera/Mic Error");
      }
    };

    startVideoCall();

    return () => {
      socket.off("peer-user");

      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) => track.stop());
      }

      if (peerRef.current) {
        peerRef.current.destroy();
      }

      // Remove remote videos
      document
        .querySelectorAll(".remote-video")
        .forEach((video) => {
          video.remove();
        });
    };
  }, [roomCode]);

  // ==========================
  // Add Remote Video
  // ==========================

  const addRemoteVideo = (
    peerId,
    remoteStream
  ) => {
    const container =
      document.getElementById(
        "remote-videos"
      );

    if (!container) return;

    let video =
      document.getElementById(
        `remote-${peerId}`
      );

    if (!video) {
      video = document.createElement("video");

      video.id = `remote-${peerId}`;
      video.className = "remote-video";

      video.autoplay = true;
      video.playsInline = true;

      video.style.width = "100%";
      video.style.borderRadius = "10px";
      video.style.background = "black";

      container.appendChild(video);

      setConnectedUsers((prev) => {
        if (prev.includes(peerId)) {
          return prev;
        }

        return [...prev, peerId];
      });
    }

    video.srcObject = remoteStream;
  };

  // ==========================
  // Toggle Microphone
  // ==========================

  const toggleMic = () => {
    if (!streamRef.current) return;

    streamRef.current
      .getAudioTracks()
      .forEach((track) => {
        track.enabled = !track.enabled;
      });

    setMicOn((prev) => !prev);
  };

  // ==========================
  // Toggle Camera
  // ==========================

  const toggleCamera = () => {
    if (!streamRef.current) return;

    streamRef.current
      .getVideoTracks()
      .forEach((track) => {
        track.enabled = !track.enabled;
      });

    setCameraOn((prev) => !prev);
  };

  // ==========================
  // Screen Share
  // ==========================

  const shareScreen = async () => {
    try {
      const screenStream =
        await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });

      if (myVideo.current) {
        myVideo.current.srcObject =
          screenStream;
      }

      setSharing(true);

      const screenTrack =
        screenStream.getVideoTracks()[0];

      screenTrack.onended = () => {
        if (streamRef.current && myVideo.current) {
          myVideo.current.srcObject =
            streamRef.current;
        }

        setSharing(false);
      };

    } catch (error) {
      console.log(
        "Screen share cancelled:",
        error
      );
    }
  };

  // ==========================
  // End Call
  // ==========================

  const endCall = () => {
    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => track.stop());
    }

    if (myVideo.current) {
      myVideo.current.srcObject = null;
    }

    if (peerRef.current) {
      peerRef.current.destroy();
    }

    setStatus("Call Ended");
  };

  return (
    <div
      style={{
        background: "#1f2937",
        borderRadius: "12px",
        padding: "15px",
        color: "white",
      }}
    >

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "15px",
        }}
      >
        <h3>
          🎥 Video Meeting
        </h3>

        <span>
          🟢 {status}
        </span>
      </div>

      {/* Videos */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "10px",
        }}
      >

        {/* My Video */}

        <video
          ref={myVideo}
          autoPlay
          muted
          playsInline
          style={{
            width: "100%",
            borderRadius: "10px",
            background: "black",
          }}
        />

        {/* Remote Videos */}

        <div
          id="remote-videos"
          style={{
            display: "contents",
          }}
        />

      </div>

      {/* Participant Count */}

      <div
        style={{
          marginTop: "10px",
          color: "#d1d5db",
        }}
      >
        👥 Participants:{" "}
        {connectedUsers.length + 1}
      </div>

      {/* Controls */}

      <div
        style={{
          marginTop: "15px",
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
        }}
      >

        <button
          onClick={toggleMic}
          style={{
            padding: "10px 15px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            background: micOn
              ? "#16a34a"
              : "#dc2626",
            color: "white",
          }}
        >
          {micOn
            ? "🎤 Mic On"
            : "🔇 Mic Off"}
        </button>

        <button
          onClick={toggleCamera}
          style={{
            padding: "10px 15px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            background: cameraOn
              ? "#2563eb"
              : "#dc2626",
            color: "white",
          }}
        >
          {cameraOn
            ? "📹 Camera On"
            : "🚫 Camera Off"}
        </button>

        <button
          onClick={shareScreen}
          style={{
            padding: "10px 15px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            background: "#9333ea",
            color: "white",
          }}
        >
          {sharing
            ? "🖥 Sharing"
            : "🖥 Share Screen"}
        </button>

        <button
          onClick={endCall}
          style={{
            padding: "10px 15px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            background: "#dc2626",
            color: "white",
          }}
        >
          📞 End
        </button>

      </div>

    </div>
  );
};

export default VideoCall;