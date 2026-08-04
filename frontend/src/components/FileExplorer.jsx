import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../socket/socket";
import FileItem from "./FileItem";
import FolderItem from "./FolderItem";

import {
  createFileAPI,
  getFilesAPI,
  renameFileAPI,
  deleteFileAPI,
} from "../services/fileService";

const FileExplorer = ({
  selectedFileId,
  setSelectedFileId,
  openTabs,
  setOpenTabs,
}) => {
  const { roomCode } = useParams();

  const [files, setFiles] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);

  // ==========================
  // Load Files
  // ==========================
  const loadFiles = async () => {
    try {
      const result = await getFilesAPI(roomCode);

      setFiles(result.files);

      // Auto select first file
      if (
        result.files.length > 0 &&
        !selectedFileId
      ) {
        setSelectedFileId(result.files[0]._id);
      }

    } catch (error) {
      console.log(error);
    }
  };

  // Initial Load
  useEffect(() => {
    loadFiles();
  }, []);

  // Real-time refresh
  useEffect(() => {

    socket.on("refresh-files", () => {
      loadFiles();
    });

    return () => {
      socket.off("refresh-files");
    };

  }, []);

// ==========================
// Create File
// ==========================
const createFile = async () => {

  const fileName = prompt("Enter File Name");

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

    loadFiles();

  } catch (error) {

    console.log(error);

  }

};

// ==========================
// Create Folder
// ==========================
const createFolder = async () => {

  const folderName = prompt("Enter Folder Name");

  if (!folderName) return;

  try {

    await createFileAPI({
      roomCode,
      fileName: folderName,
      type: "folder",
    });

    socket.emit("file-created", {
      roomCode,
    });

    loadFiles();

  } catch (error) {

    console.log(error);

  }

};
  // ==========================
  // Rename File
  // ==========================
  const renameFile = async (file) => {

    const newName = prompt(
      "Enter New File Name",
      file.fileName
    );

    if (!newName) return;

    try {

      await renameFileAPI(
        file._id,
        newName
      );

      loadFiles();

      socket.emit("file-created", {
        roomCode,
      });

    } catch (error) {

      console.log(error);

    }

  };
  // ==========================
// Delete File
// ==========================
const deleteFile = async (file) => {

  const confirmDelete = window.confirm(
    `Delete "${file.fileName}"?`
  );

  if (!confirmDelete) return;

  try {

    await deleteFileAPI(file._id);

    loadFiles();

    socket.emit("file-created", {
      roomCode,
    });

    // Clear editor if deleted file was open
    if (selectedFileId === file._id) {
      setSelectedFileId(null);
    }

  } catch (error) {

    console.log(error);

  }

};

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 mt-5">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">

        <h2 className="text-xl font-bold">
          📁 Files
        </h2>

        <div className="flex gap-2">

  <button
    onClick={createFile}
    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
  >
    📄
  </button>

  <button
    onClick={createFolder}
    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
  >
    📁
  </button>

</div>

      </div>

      {/* File List */}
      {files.length === 0 ? (

        <p className="text-gray-500">
          No files
        </p>

      ) : (

      <>
  {/* Root Files */}

  {files
    .filter(
      (file) =>
        file.type === "file" &&
        !file.parentId
    )
    .map((file) => (

      <FileItem
        key={file._id}
        file={file}
        selectedFileId={selectedFileId}
        openTabs={openTabs}
        setOpenTabs={setOpenTabs}
        setSelectedFileId={setSelectedFileId}
        setSelectedFolder={setSelectedFolder}
        renameFile={renameFile}
        deleteFile={deleteFile}
      />

    ))}

  {/* Folders */}

  {files
    .filter(
      (file) =>
        file.type === "folder"
    )
    .map((folder) => (

      <FolderItem
        key={folder._id}
        folder={folder}
        files={files}
        selectedFileId={selectedFileId}
        openTabs={openTabs}
        setOpenTabs={setOpenTabs}
        setSelectedFileId={setSelectedFileId}
        setSelectedFolder={setSelectedFolder}
        renameFile={renameFile}
        deleteFile={deleteFile}
      />

    ))}
</>

      )}

    </div>
  );
};

export default FileExplorer;