import { useState } from "react";
import { useParams } from "react-router-dom";

import socket from "../socket/socket";
import { moveFileAPI } from "../services/fileService";

import FileItem from "./FileItem";
import {
  FaChevronRight,
  FaChevronDown,
  FaFolder,
  FaFolderOpen,
  FaPen,
  FaTrash,
} from "react-icons/fa";

const FolderItem = ({
  folder,
  files,
  selectedFileId,
  openTabs,
  setOpenTabs,
  setSelectedFileId,
  setSelectedFolder,
  renameFile,
  deleteFile,
}) => {
  const [expanded, setExpanded] =
    useState(true);

  const { roomCode } = useParams();

  // =========================================
  // CHILDREN
  // =========================================

  const children = files.filter(
    (file) =>
      String(file.parentId) ===
      String(folder._id)
  );

  // =========================================
  // TOGGLE FOLDER
  // =========================================

  const handleFolderClick = () => {
    setExpanded(
      (previous) => !previous
    );

    setSelectedFolder(
      folder._id
    );
  };

  // =========================================
  // DROP FILE INTO FOLDER
  // =========================================

  const handleDrop = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const itemId =
      event.dataTransfer.getData(
        "itemId"
      );

    if (!itemId) {
      return;
    }

    // Don't move folder into itself
    if (
      String(itemId) ===
      String(folder._id)
    ) {
      return;
    }

    try {
      await moveFileAPI(
        itemId,
        folder._id
      );

      socket.emit(
        "file-created",
        {
          roomCode,
        }
      );
    } catch (error) {
      console.error(
        "Move file error:",
        error
      );
    }
  };

  // =========================================
  // DRAG OVER
  // =========================================

  const handleDragOver = (event) => {
    event.preventDefault();

    event.dataTransfer.dropEffect =
      "move";
  };

  return (
    <div className="w-full">

      {/* =====================================
          FOLDER ROW
      ====================================== */}

      <div
        onClick={
          handleFolderClick
        }
        onDrop={handleDrop}
        onDragOver={
          handleDragOver
        }
        className="
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
          text-slate-700
          hover:bg-slate-50
          border
          border-transparent
          hover:border-slate-200
          transition-colors
        "
      >

        {/* ===================================
            ARROW
        ==================================== */}

        <span
          className="
            shrink-0
            w-3
            flex
            items-center
            justify-center
            text-slate-400
          "
        >
          {expanded ? (
            <FaChevronDown className="text-[8px]" />
          ) : (
            <FaChevronRight className="text-[8px]" />
          )}
        </span>

        {/* ===================================
            FOLDER ICON
        ==================================== */}

        {expanded ? (
          <FaFolderOpen
            className="
              shrink-0
              text-sm
              text-amber-500
            "
          />
        ) : (
          <FaFolder
            className="
              shrink-0
              text-sm
              text-amber-500
            "
          />
        )}

        {/* ===================================
            FOLDER NAME
        ==================================== */}

        <span
          className="
            flex-1
            min-w-0
            truncate
            text-xs
            font-medium
          "
          title={folder.fileName}
        >
          {folder.fileName}
        </span>

        {/* ===================================
            ACTIONS
        ==================================== */}

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
            onClick={() =>
              renameFile(folder)
            }
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
            title="Rename folder"
          >
            <FaPen className="text-[9px]" />
          </button>

          {/* Delete */}

          <button
            type="button"
            onClick={() =>
              deleteFile(folder)
            }
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
            title="Delete folder"
          >
            <FaTrash className="text-[9px]" />
          </button>

        </div>

      </div>

      {/* =====================================
          CHILDREN
      ====================================== */}

      {expanded && (
        <div
          className="
            ml-4
            pl-2
            border-l
            border-slate-200
            mb-1
          "
        >

          {children.length === 0 ? (
            <div
              className="
                h-7
                flex
                items-center
                px-2
                text-[11px]
                text-slate-400
              "
            >
              Empty folder
            </div>
          ) : (
            children.map((item) =>
              item.type ===
              "folder" ? (
                <FolderItem
                  key={item._id}
                  folder={item}
                  files={files}
                  selectedFileId={
                    selectedFileId
                  }
                  openTabs={
                    openTabs
                  }
                  setOpenTabs={
                    setOpenTabs
                  }
                  setSelectedFileId={
                    setSelectedFileId
                  }
                  setSelectedFolder={
                    setSelectedFolder
                  }
                  renameFile={
                    renameFile
                  }
                  deleteFile={
                    deleteFile
                  }
                />
              ) : (
                <FileItem
                  key={item._id}
                  file={item}
                  selectedFileId={
                    selectedFileId
                  }
                  openTabs={
                    openTabs
                  }
                  setOpenTabs={
                    setOpenTabs
                  }
                  setSelectedFileId={
                    setSelectedFileId
                  }
                  setSelectedFolder={
                    setSelectedFolder
                  }
                  renameFile={
                    renameFile
                  }
                  deleteFile={
                    deleteFile
                  }
                />
              )
            )
          )}

        </div>
      )}

    </div>
  );
};

export default FolderItem;