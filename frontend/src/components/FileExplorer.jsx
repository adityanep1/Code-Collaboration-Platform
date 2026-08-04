import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../socket/socket";

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

        <button
          onClick={createFile}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
        >
          +
        </button>

      </div>

      {/* File List */}
      {files.length === 0 ? (

        <p className="text-gray-500">
          No files
        </p>

      ) : (

        files.map((file) => (

          <div
            key={file._id}
            className={`flex justify-between items-center p-2 mb-2 rounded-lg border ${
              selectedFileId === file._id
                ? "bg-blue-100 border-blue-500"
                : "hover:bg-gray-100"
            }`}
          >

            <div
              className="flex-1 cursor-pointer"
             onClick={() => {

  setSelectedFileId(file._id);

  const exists = openTabs.find(
    (tab) => tab._id === file._id
  );

  if (!exists) {
    setOpenTabs([...openTabs, file]);
  }

}}
            >
              📄 {file.fileName}
            </div>

            <div className="flex gap-2">

  <button
    onClick={() => renameFile(file)}
    className="text-blue-600 hover:text-blue-800"
  >
    ✏
  </button>

  <button
    onClick={() => deleteFile(file)}
    className="text-red-600 hover:text-red-800"
  >
    🗑
  </button>

</div>

          </div>

        ))

      )}

    </div>
  );
};

export default FileExplorer;