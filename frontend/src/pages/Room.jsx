import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { createFileAPI } from "../services/fileService";

import VideoCall from "../components/VideoCall";
import Whiteboard from "../components/Whiteboard";
import FileDropZone from "../components/FileDropZone";
import CodeEditor from "../components/Editor";
import Chat from "../components/Chat";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import ExecutionHistory from "../components/ExecutionHistory";
import FileExplorer from "../components/FileExplorer";
import AIAssistant from "../components/AIAssistant";
import GitHubImport from "../components/GitHubImport";

import socket from "../socket/socket";

const Room = () => {
  const { roomCode } = useParams();

  // =====================================================
  // BASIC ROOM STATE
  // =====================================================

  const [selectedFileId, setSelectedFileId] = useState(null);

  const [openTabs, setOpenTabs] = useState([]);

  const [users, setUsers] = useState([]);

  const [typingUser, setTypingUser] = useState("");

  // =====================================================
  // SIDEBAR
  // =====================================================

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [sidebarWidth, setSidebarWidth] = useState(260);

  const [isResizingSidebar, setIsResizingSidebar] =
    useState(false);

  // =====================================================
  // RIGHT PANEL
  // =====================================================

  const [activePanel, setActivePanel] = useState(null);

  const [panelWidth, setPanelWidth] = useState(380);

  const [isResizingPanel, setIsResizingPanel] =
    useState(false);

  // =====================================================
  // PANEL TOGGLE
  // =====================================================

  const togglePanel = (panel) => {
    setActivePanel((current) => {
      if (current === panel) {
        return null;
      }

      return panel;
    });
  };

  // =====================================================
  // START SIDEBAR RESIZE
  // =====================================================

  const startSidebarResize = (event) => {
    event.preventDefault();

    setIsResizingSidebar(true);
  };

  // =====================================================
  // START RIGHT PANEL RESIZE
  // =====================================================

  const startPanelResize = (event) => {
    event.preventDefault();

    setIsResizingPanel(true);
  };

  // =====================================================
  // RESIZE HANDLER
  // =====================================================

  useEffect(() => {
    const handleMouseMove = (event) => {
      // ---------------------------------------------
      // SIDEBAR RESIZE
      // ---------------------------------------------

      if (isResizingSidebar) {
        const newWidth = event.clientX;

        // Minimum sidebar width
        const minWidth = 220;

        // Maximum sidebar width
        const maxWidth = 420;

        if (
          newWidth >= minWidth &&
          newWidth <= maxWidth
        ) {
          setSidebarWidth(newWidth);
        }
      }

      // ---------------------------------------------
      // RIGHT PANEL RESIZE
      // ---------------------------------------------

      if (isResizingPanel) {
        const newWidth =
          window.innerWidth - event.clientX;

        // Minimum panel width
        const minWidth = 300;

        // Maximum panel width
        const maxWidth = 650;

        if (
          newWidth >= minWidth &&
          newWidth <= maxWidth
        ) {
          setPanelWidth(newWidth);
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizingSidebar(false);
      setIsResizingPanel(false);
    };

    if (
      isResizingSidebar ||
      isResizingPanel
    ) {
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    } else {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    window.addEventListener(
      "mouseup",
      handleMouseUp
    );

    return () => {
      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      window.removeEventListener(
        "mouseup",
        handleMouseUp
      );

      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [
    isResizingSidebar,
    isResizingPanel,
  ]);

  // =====================================================
  // FILE DROP
  // =====================================================

  const handleFilesDropped = async (files) => {
    for (const file of files) {
      const reader = new FileReader();

      reader.onload = async (event) => {
        try {
          const extension = file.name
            .split(".")
            .pop()
            .toLowerCase();

          let language = "plaintext";

          switch (extension) {
            case "js":
            case "jsx":
              language = "javascript";
              break;

            case "ts":
            case "tsx":
              language = "typescript";
              break;

            case "py":
              language = "python";
              break;

            case "java":
              language = "java";
              break;

            case "cpp":
            case "cc":
            case "cxx":
              language = "cpp";
              break;

            case "c":
              language = "c";
              break;

            case "css":
              language = "css";
              break;

            case "html":
              language = "html";
              break;

            case "json":
              language = "json";
              break;

            case "sql":
              language = "sql";
              break;

            default:
              language = "plaintext";
          }

          const result = await createFileAPI({
            roomCode,
            fileName: file.name,
            code: event.target.result,
            language,
            type: "file",
            parentId: null,
          });

          // Select uploaded file
          setSelectedFileId(
            result.file._id
          );

          // Add file to tabs
          setOpenTabs((previousTabs) => {
            const exists = previousTabs.find(
              (tab) =>
                tab._id === result.file._id
            );

            if (exists) {
              return previousTabs;
            }

            return [
              ...previousTabs,
              result.file,
            ];
          });

          // Notify other users
          socket.emit("file-created", {
            roomCode,
          });

          console.log(
            "✅ File uploaded:",
            result.file
          );
        } catch (error) {
          console.error(
            "❌ File upload error:",
            error
          );
        }
      };

      reader.readAsText(file);
    }
  };

  // =====================================================
  // ROOM SOCKET EVENTS
  // =====================================================

  useEffect(() => {
    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (!user) {
      return;
    }

    // Join room
    socket.emit("join-room", {
      roomCode,
      userName: user.name,
    });

    // ---------------------------------------------
    // ONLINE USERS
    // ---------------------------------------------

    const handleRoomUsers = (usersList) => {
      setUsers(usersList);
    };

    // ---------------------------------------------
    // TYPING
    // ---------------------------------------------

    const handleTyping = (userName) => {
      setTypingUser(
        `${userName} is typing...`
      );

      setTimeout(() => {
        setTypingUser("");
      }, 1200);
    };

    socket.on(
      "room-users",
      handleRoomUsers
    );

    socket.on(
      "user-typing",
      handleTyping
    );

    return () => {
      socket.off(
        "room-users",
        handleRoomUsers
      );

      socket.off(
        "user-typing",
        handleTyping
      );
    };
  }, [roomCode]);

  // =====================================================
  // PANEL BUTTON
  // =====================================================

  const PanelButton = ({
    id,
    icon,
    label,
  }) => {
    const isActive =
      activePanel === id;

    return (
      <button
        onClick={() =>
          togglePanel(id)
        }
        className={`
          h-9
          px-3
          flex
          items-center
          gap-2
          rounded-lg
          border
          text-sm
          font-medium
          whitespace-nowrap
          transition-all
          duration-200

          ${
            isActive
              ? "bg-blue-600 text-white border-blue-600 shadow-sm"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
          }
        `}
      >
        <span>{icon}</span>

        <span>{label}</span>
      </button>
    );
  };

  // =====================================================
  // PANEL TITLE
  // =====================================================

  const getPanelTitle = () => {
    switch (activePanel) {
      case "chat":
        return "💬 Chat";

      case "video":
        return "🎥 Video Meeting";

      case "whiteboard":
        return "✏️ Collaborative Whiteboard";

      case "ai":
        return "🤖 AI Assistant";

      case "output":
        return "▣ Execution History";

      default:
        return "";
    }
  };

  // =====================================================
  // PANEL CONTENT
  // =====================================================

  const renderPanel = () => {
    switch (activePanel) {
      case "chat":
        return <Chat />;

      case "video":
        return <VideoCall />;

      case "whiteboard":
        return <Whiteboard />;

      case "ai":
        return <AIAssistant />;

      case "output":
        return <ExecutionHistory />;

      default:
        return null;
    }
  };

  // =====================================================
  // RESET SIDEBAR WIDTH
  // =====================================================

  const resetSidebarWidth = () => {
    setSidebarWidth(260);
  };

  // =====================================================
  // RESET PANEL WIDTH
  // =====================================================

  const resetPanelWidth = () => {
    setPanelWidth(380);
  };

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <FileDropZone
      onFilesDropped={
        handleFilesDropped
      }
    >
      <div className="h-screen w-full flex flex-col overflow-hidden bg-slate-100">

        {/* =================================================
            NAVBAR
        ================================================= */}

        <div className="shrink-0">
          <Navbar
            roomCode={roomCode}
            onlineCount={users.length}
          />
        </div>

        {/* =================================================
            TYPING INDICATOR
        ================================================= */}

        {typingUser && (
          <div className="shrink-0 h-6 flex items-center justify-center bg-slate-800 text-slate-200 text-xs">
            {typingUser}
          </div>
        )}

        {/* =================================================
            WORKSPACE
        ================================================= */}

        <div className="flex-1 min-h-0 flex overflow-hidden">

          {/* =================================================
              LEFT SIDEBAR
          ================================================= */}

          <aside
            className={`
              hidden
              lg:flex
              shrink-0
              h-full
              flex-col
              overflow-hidden
              bg-slate-100
              border-r
              border-slate-200
              relative
            `}
            style={{
              width: sidebarOpen
                ? `${sidebarWidth}px`
                : "0px",

              transition:
                isResizingSidebar
                  ? "none"
                  : "width 200ms ease",
            }}
          >

            {/* ---------------------------------------------
                SIDEBAR CONTENT
            --------------------------------------------- */}

            <div
              className="
                h-full
                flex
                flex-col
                gap-3
                p-3
                overflow-y-auto
              "
              style={{
                width: `${sidebarWidth}px`,
              }}
            >

              {/* -------------------------------------------
                  MEMBERS
              ------------------------------------------- */}

              <div
                className="
                  shrink-0
                  bg-white
                  rounded-xl
                  border
                  border-slate-200
                  overflow-hidden
                  shadow-sm
                "
              >
                <Sidebar
                  users={users}
                />
              </div>

              {/* -------------------------------------------
                  FILE EXPLORER
              ------------------------------------------- */}

              <div
                className="
                  shrink-0
                  bg-white
                  rounded-xl
                  border
                  border-slate-200
                  p-2
                  shadow-sm
                "
              >
                <FileExplorer
                  selectedFileId={
                    selectedFileId
                  }
                  setSelectedFileId={
                    setSelectedFileId
                  }
                  openTabs={openTabs}
                  setOpenTabs={
                    setOpenTabs
                  }
                />
              </div>

              {/* -------------------------------------------
                  GITHUB IMPORT
              ------------------------------------------- */}

              <div
                className="
                  shrink-0
                  bg-white
                  rounded-xl
                  border
                  border-slate-200
                  p-2
                  shadow-sm
                "
              >
                <GitHubImport />
              </div>

            </div>

            {/* ---------------------------------------------
                SIDEBAR RESIZE HANDLE
            --------------------------------------------- */}

            {sidebarOpen && (
              <div
                onMouseDown={
                  startSidebarResize
                }
                onDoubleClick={
                  resetSidebarWidth
                }
                className="
                  absolute
                  top-0
                  right-0
                  w-1
                  h-full
                  cursor-col-resize
                  bg-transparent
                  hover:bg-blue-500
                  z-50
                  transition-colors
                "
                title="Drag to resize sidebar • Double-click to reset"
              />
            )}

          </aside>

          {/* =================================================
              MAIN AREA
          ================================================= */}

          <main className="flex-1 min-w-0 min-h-0 flex flex-col overflow-hidden">

            {/* =================================================
                TOOLBAR
            ================================================= */}

            <div
              className="
                shrink-0
                h-14
                flex
                items-center
                gap-2
                px-3
                bg-white
                border-b
                border-slate-200
                overflow-x-auto
              "
            >

              {/* ---------------------------------------------
                  SIDEBAR BUTTON
              --------------------------------------------- */}

              <button
                onClick={() =>
                  setSidebarOpen(
                    (previous) =>
                      !previous
                  )
                }
                className="
                  h-9
                  w-9
                  shrink-0
                  flex
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  text-slate-600
                  hover:bg-slate-50
                  transition
                "
                title={
                  sidebarOpen
                    ? "Hide sidebar"
                    : "Show sidebar"
                }
              >
                {sidebarOpen
                  ? "‹"
                  : "›"}
              </button>

              <div className="h-6 w-px bg-slate-200 mx-1" />

              {/* ---------------------------------------------
                  PANELS
              --------------------------------------------- */}

              <PanelButton
                id="chat"
                icon="💬"
                label="Chat"
              />

              <PanelButton
                id="video"
                icon="🎥"
                label="Video"
              />

              <PanelButton
                id="whiteboard"
                icon="✏️"
                label="Board"
              />

              <PanelButton
                id="ai"
                icon="🤖"
                label="AI"
              />

              <PanelButton
                id="output"
                icon="▣"
                label="Output"
              />

              <div className="flex-1 min-w-2" />

              {typingUser && (
                <span className="text-xs text-slate-400 whitespace-nowrap">
                  {typingUser}
                </span>
              )}

            </div>

            {/* =================================================
                EDITOR + RIGHT PANEL
            ================================================= */}

            <div className="flex-1 min-h-0 flex overflow-hidden">

              {/* =================================================
                  EDITOR
              ================================================= */}

              <section className="flex-1 min-w-0 min-h-0">

                <div className="h-full p-3">

                  <div
                    className="
                      h-full
                      bg-white
                      rounded-xl
                      border
                      border-slate-200
                      overflow-hidden
                      shadow-sm
                    "
                  >
                    <CodeEditor
                      selectedFileId={
                        selectedFileId
                      }
                      openTabs={openTabs}
                      setOpenTabs={
                        setOpenTabs
                      }
                      setSelectedFileId={
                        setSelectedFileId
                      }
                    />
                  </div>

                </div>

              </section>

              {/* =================================================
                  RIGHT PANEL
              ================================================= */}

              <aside
                className="
                  shrink-0
                  h-full
                  relative
                  overflow-hidden
                  bg-white
                  border-l
                  border-slate-200
                "
                style={{
                  width: activePanel
                    ? `${panelWidth}px`
                    : "0px",

                  transition:
                    isResizingPanel
                      ? "none"
                      : "width 200ms ease",
                }}
              >

                {/* ---------------------------------------------
                    PANEL CONTENT
                --------------------------------------------- */}

                {activePanel && (
                  <div
                    className="
                      h-full
                      flex
                      flex-col
                    "
                    style={{
                      width: `${panelWidth}px`,
                    }}
                  >

                    {/* -----------------------------------------
                        PANEL HEADER
                    ----------------------------------------- */}

                    <div
                      className="
                        h-12
                        shrink-0
                        flex
                        items-center
                        justify-between
                        px-4
                        bg-slate-50
                        border-b
                        border-slate-200
                      "
                    >

                      <span className="text-sm font-semibold text-slate-700">
                        {getPanelTitle()}
                      </span>

                      <button
                        onClick={() =>
                          setActivePanel(
                            null
                          )
                        }
                        className="
                          h-8
                          w-8
                          flex
                          items-center
                          justify-center
                          rounded-lg
                          text-slate-400
                          hover:text-slate-700
                          hover:bg-slate-200
                          transition
                        "
                        title="Close panel"
                      >
                        ✕
                      </button>

                    </div>

                    {/* -----------------------------------------
                        PANEL BODY
                    ----------------------------------------- */}

                    <div
                      className="
                        flex-1
                        min-h-0
                        overflow-auto
                        p-3
                      "
                    >
                      {renderPanel()}
                    </div>

                  </div>
                )}

                {/* ---------------------------------------------
                    RIGHT PANEL RESIZE HANDLE
                --------------------------------------------- */}

                {activePanel && (
                  <div
                    onMouseDown={
                      startPanelResize
                    }
                    onDoubleClick={
                      resetPanelWidth
                    }
                    className="
                      absolute
                      top-0
                      left-0
                      w-1
                      h-full
                      cursor-col-resize
                      bg-transparent
                      hover:bg-blue-500
                      z-50
                      transition-colors
                    "
                    title="Drag to resize panel • Double-click to reset"
                  />
                )}

              </aside>

            </div>

          </main>

        </div>

      </div>
    </FileDropZone>
  );
};

export default Room;