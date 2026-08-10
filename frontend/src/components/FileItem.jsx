import { useState } from "react";
import ContextMenu from "./ContextMenu";

import {
  FaFileCode,
  FaEllipsisV,
  FaPen,
  FaTrash,
} from "react-icons/fa";

const FileItem = ({
  file,
  selectedFileId,
  openTabs,
  setOpenTabs,
  setSelectedFileId,
  setSelectedFolder,
  renameFile,
  deleteFile,
}) => {
  const [menu, setMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });

  // =========================================
  // OPEN FILE
  // =========================================

  const handleClick = () => {
    if (file.type === "folder") {
      setSelectedFolder(file._id);
      return;
    }

    setSelectedFileId(file._id);

    const exists = openTabs.find(
      (tab) => tab._id === file._id
    );

    if (!exists) {
      setOpenTabs([
        ...openTabs,
        file,
      ]);
    }
  };

  // =========================================
  // RIGHT CLICK
  // =========================================

  const handleRightClick = (event) => {
    event.preventDefault();

    setMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
    });
  };

  // =========================================
  // CLOSE CONTEXT MENU
  // =========================================

  const closeMenu = () => {
    setMenu({
      visible: false,
      x: 0,
      y: 0,
    });
  };

  return (
    <>
      <div
        draggable
        onDragStart={(event) => {
          event.dataTransfer.effectAllowed =
            "move";

          event.dataTransfer.setData(
            "itemId",
            file._id
          );

          event.dataTransfer.setData(
            "itemType",
            file.type
          );
        }}
        onDragEnd={() => {
          // Drag completed
        }}
        onContextMenu={handleRightClick}
        className={`
          group
          w-full
          min-w-0
          h-9
          flex
          items-center
          gap-2
          rounded-md
          px-2
          mb-1
          cursor-pointer
          transition-colors
          border
          ${
            selectedFileId === file._id
              ? `
                bg-blue-50
                border-blue-200
                text-blue-700
              `
              : `
                bg-transparent
                border-transparent
                text-slate-600
                hover:bg-slate-50
                hover:border-slate-200
              `
          }
        `}
        onClick={handleClick}
      >
        {/* =====================================
            FILE ICON
        ====================================== */}

        <FaFileCode
          className={`
            shrink-0
            text-xs
            ${
              selectedFileId === file._id
                ? "text-blue-500"
                : "text-slate-400"
            }
          `}
        />

        {/* =====================================
            FILE NAME
        ====================================== */}

        <span
          className="
            flex-1
            min-w-0
            truncate
            text-xs
            font-medium
          "
          title={file.fileName}
        >
          {file.fileName}
        </span>

        {/* =====================================
            ACTIONS
        ====================================== */}

        <div
          className="
            shrink-0
            flex
            items-center
            gap-1
            opacity-0
            group-hover:opacity-100
            transition-opacity
          "
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          {/* Rename */}

          <button
            type="button"
            onClick={() => {
              renameFile(file);
            }}
            className="
              w-6
              h-6
              flex
              items-center
              justify-center
              rounded
              text-slate-400
              hover:text-blue-600
              hover:bg-blue-50
              transition-colors
            "
            title="Rename"
          >
            <FaPen className="text-[9px]" />
          </button>

          {/* Delete */}

          <button
            type="button"
            onClick={() => {
              deleteFile(file);
            }}
            className="
              w-6
              h-6
              flex
              items-center
              justify-center
              rounded
              text-slate-400
              hover:text-red-600
              hover:bg-red-50
              transition-colors
            "
            title="Delete"
          >
            <FaTrash className="text-[9px]" />
          </button>
        </div>

        {/* Small menu indicator */}

        <FaEllipsisV
          className="
            shrink-0
            text-[9px]
            text-slate-300
            opacity-0
            group-hover:opacity-100
            transition-opacity
          "
        />
      </div>

      {/* =========================================
          CONTEXT MENU
      ========================================== */}

      {menu.visible && (
        <ContextMenu
          x={menu.x}
          y={menu.y}
          isFolder={
            file.type === "folder"
          }
          onRename={() => {
            renameFile(file);
            closeMenu();
          }}
          onDelete={() => {
            deleteFile(file);
            closeMenu();
          }}
          onNewFile={() => {
            closeMenu();
          }}
          onNewFolder={() => {
            closeMenu();
          }}
          onClose={closeMenu}
        />
      )}
    </>
  );
};

export default FileItem;