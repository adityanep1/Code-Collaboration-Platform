import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import socket from "../socket/socket";

import FileItem from "./FileItem";
import FolderItem from "./FolderItem";
import FileSearch from "./FileSearch";

import { exportProject } from "../utils/exportProject";

import {
  createFileAPI,
  getFilesAPI,
  renameFileAPI,
  deleteFileAPI,
} from "../services/fileService";

import {
  FaFile,
  FaFolder,
  FaBoxOpen,
  FaPlus,
  FaFolderPlus,
  FaDownload,
} from "react-icons/fa";

const FileExplorer = ({
  selectedFileId,
  setSelectedFileId,
  openTabs,
  setOpenTabs,
}) => {
  const { roomCode } = useParams();

  const [files, setFiles] = useState([]);

  const [selectedFolder, setSelectedFolder] =
    useState(null);

  // =====================================================
  // LOAD FILES
  // =====================================================

  const loadFiles = async () => {
    try {
      const result =
        await getFilesAPI(roomCode);

      setFiles(result.files);

      // Automatically select first file
      if (
        result.files.length > 0 &&
        !selectedFileId
      ) {
        setSelectedFileId(
          result.files[0]._id
        );
      }
    } catch (error) {
      console.error(
        "Load files error:",
        error
      );
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadFiles();
  }, []);

  // =====================================================
  // REAL-TIME FILE REFRESH
  // =====================================================

  useEffect(() => {
    const handleRefreshFiles = () => {
      loadFiles();
    };

    const handleGitHubImport = () => {
      loadFiles();
    };

    socket.on(
      "refresh-files",
      handleRefreshFiles
    );

    window.addEventListener(
      "github-imported",
      handleGitHubImport
    );

    return () => {
      socket.off(
        "refresh-files",
        handleRefreshFiles
      );

      window.removeEventListener(
        "github-imported",
        handleGitHubImport
      );
    };
  }, [roomCode]);

  // =====================================================
  // CREATE FILE
  // =====================================================

  const createFile = async () => {
    const fileName = window.prompt(
      "Enter File Name"
    );

    if (!fileName) return;

    try {
      await createFileAPI({
        roomCode,
        fileName,
        type: "file",
        parentId: selectedFolder,
      });

      socket.emit("file-created", {
        roomCode,
      });

      await loadFiles();
    } catch (error) {
      console.error(
        "Create file error:",
        error
      );
    }
  };

  // =====================================================
  // CREATE FOLDER
  // =====================================================

  const createFolder = async () => {
    const folderName = window.prompt(
      "Enter Folder Name"
    );

    if (!folderName) return;

    try {
      await createFileAPI({
        roomCode,
        fileName: folderName,
        type: "folder",
        parentId: selectedFolder,
      });

      socket.emit("file-created", {
        roomCode,
      });

      await loadFiles();
    } catch (error) {
      console.error(
        "Create folder error:",
        error
      );
    }
  };

  // =====================================================
  // RENAME
  // =====================================================

  const renameFile = async (file) => {
    const newName = window.prompt(
      "Enter New File Name",
      file.fileName
    );

    if (!newName) return;

    try {
      await renameFileAPI(
        file._id,
        newName
      );

      await loadFiles();

      socket.emit("file-created", {
        roomCode,
      });
    } catch (error) {
      console.error(
        "Rename error:",
        error
      );
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const deleteFile = async (file) => {
    const confirmDelete =
      window.confirm(
        `Delete "${file.fileName}"?`
      );

    if (!confirmDelete) return;

    try {
      await deleteFileAPI(
        file._id
      );

      await loadFiles();

      socket.emit("file-created", {
        roomCode,
      });

      if (
        selectedFileId === file._id
      ) {
        setSelectedFileId(null);
      }
    } catch (error) {
      console.error(
        "Delete error:",
        error
      );
    }
  };

  // =====================================================
  // FILE COUNTS
  // =====================================================

  const rootFiles = files.filter(
    (file) =>
      file.type === "file" &&
      !file.parentId
  );

  const folders = files.filter(
    (file) =>
      file.type === "folder"
  );

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="w-full">

      {/* ================================================
          SEARCH
      ================================================= */}

      <div className="mb-3">
        <FileSearch
          files={files}
          setSelectedFileId={
            setSelectedFileId
          }
          openTabs={openTabs}
          setOpenTabs={setOpenTabs}
        />
      </div>

      {/* ================================================
          HEADER
      ================================================= */}

      <div className="flex items-center justify-between gap-2 mb-3">

        <div className="flex items-center gap-2 min-w-0">

          <FaFolder
            className="
              shrink-0
              text-amber-500
              text-sm
            "
          />

          <h2 className="
            truncate
            text-base
            font-semibold
            text-slate-800
          ">
            Files
          </h2>

          <span className="
            text-xs
            text-slate-400
          ">
            {files.length}
          </span>

        </div>

        {/* ACTIONS */}

        <div className="
          flex
          items-center
          gap-1
          shrink-0
        ">

          {/* New File */}

          <button
            type="button"
            onClick={createFile}
            className="
              w-8
              h-8
              flex
              items-center
              justify-center
              rounded-lg
              bg-blue-600
              hover:bg-blue-700
              text-white
              transition-colors
            "
            title="New file"
          >
            <FaFile className="text-xs" />
          </button>

          {/* New Folder */}

          <button
            type="button"
            onClick={createFolder}
            className="
              w-8
              h-8
              flex
              items-center
              justify-center
              rounded-lg
              bg-emerald-600
              hover:bg-emerald-700
              text-white
              transition-colors
            "
            title="New folder"
          >
            <FaFolderPlus className="text-xs" />
          </button>

          {/* Export */}

          <button
            type="button"
            onClick={() =>
              exportProject(files)
            }
            className="
              w-8
              h-8
              flex
              items-center
              justify-center
              rounded-lg
              bg-violet-600
              hover:bg-violet-700
              text-white
              transition-colors
            "
            title="Export project"
          >
            <FaDownload className="text-xs" />
          </button>

        </div>

      </div>

      {/* ================================================
          FILE LIST
      ================================================= */}

      <div className="
        max-h-[360px]
        overflow-y-auto
        pr-1
        space-y-1
      ">

        {/* EMPTY */}

        {files.length === 0 && (
          <div className="
            py-6
            text-center
            text-sm
            text-slate-400
          ">
            <FaBoxOpen
  className="mx-auto mb-2 text-xl text-slate-300"
/>

            <p>
              No files yet
            </p>
          </div>
        )}

        {/* ROOT FILES */}

        {rootFiles.map((file) => (
          <FileItem
            key={file._id}
            file={file}
            selectedFileId={
              selectedFileId
            }
            openTabs={openTabs}
            setOpenTabs={setOpenTabs}
            setSelectedFileId={
              setSelectedFileId
            }
            setSelectedFolder={
              setSelectedFolder
            }
            renameFile={renameFile}
            deleteFile={deleteFile}
          />
        ))}

        {/* FOLDERS */}

        {folders.map((folder) => (
          <FolderItem
            key={folder._id}
            folder={folder}
            files={files}
            selectedFileId={
              selectedFileId
            }
            openTabs={openTabs}
            setOpenTabs={setOpenTabs}
            setSelectedFileId={
              setSelectedFileId
            }
            setSelectedFolder={
              setSelectedFolder
            }
            renameFile={renameFile}
            deleteFile={deleteFile}
          />
        ))}

      </div>

    </div>
  );
};

export default FileExplorer;