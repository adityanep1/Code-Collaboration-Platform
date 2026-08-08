import { useState } from "react";
import FileItem from "./FileItem";
import { useParams } from "react-router-dom";
import socket from "../socket/socket";
import { moveFileAPI } from "../services/fileService";

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

  const [expanded, setExpanded] = useState(true);
  const { roomCode } = useParams();

const children = files.filter(
  (file) => String(file.parentId) === String(folder._id)
);

  return (
    <div className="mb-3">

      {/* Folder */}

<div className="flex justify-between items-center w-full">
  <div
  onDragOver={(e) => e.preventDefault()}

  onDrop={async (e) => {

    e.preventDefault();

    const itemId = e.dataTransfer.getData("itemId");

    if (!itemId) return;

    try {

      await moveFileAPI(itemId, folder._id);

      socket.emit("file-created", {
        roomCode,
      });

    } catch (error) {

      console.log(error);

    }

  }}

  onClick={() => {
    setExpanded(!expanded);
    setSelectedFolder(folder._id);
  }}

  className="flex-1 cursor-pointer"
>
    {expanded ? "📂" : "📁"} {folder.fileName}
  </div>

  <div className="flex gap-2">

    <button
      onClick={() => renameFile(folder)}
      className="text-blue-600"
    >
      ✏
    </button>

    <button
      onClick={() => deleteFile(folder)}
      className="text-red-600"
    >
      🗑
    </button>

  </div>

</div>

      {/* Files */}

      {expanded && (

        <div className="ml-6 mt-2">

      {children.length === 0 ? (

  <p className="text-gray-400 text-sm">
    Empty Folder
  </p>

) : (

  children.map((item) =>

    item.type === "folder" ? (

      <FolderItem
        key={item._id}
        folder={item}
        files={files}
        selectedFileId={selectedFileId}
        openTabs={openTabs}
        setOpenTabs={setOpenTabs}
        setSelectedFileId={setSelectedFileId}
        setSelectedFolder={setSelectedFolder}
        renameFile={renameFile}
        deleteFile={deleteFile}
      />

    ) : (

      <FileItem
        key={item._id}
        file={item}
        selectedFileId={selectedFileId}
        openTabs={openTabs}
        setOpenTabs={setOpenTabs}
        setSelectedFileId={setSelectedFileId}
        setSelectedFolder={setSelectedFolder}
        renameFile={renameFile}
        deleteFile={deleteFile}
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