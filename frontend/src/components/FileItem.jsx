import { useState } from "react";
import ContextMenu from "./ContextMenu";

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
      setOpenTabs([...openTabs, file]);
    }
  };

  const handleRightClick = (e) => {
    e.preventDefault();

    setMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
    });
  };

  return (
    <>
      <div
        draggable
       onDragStart={(e) => {
  console.log("Dragging:", file.fileName);

  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("itemId", file._id);
  e.dataTransfer.setData("itemType", file.type);
}}

  onDragEnd={() => {
    console.log("Drag End");
  }}

  
        onContextMenu={handleRightClick}
        className={`flex justify-between items-center p-2 mb-2 rounded-lg border ${
          selectedFileId === file._id
            ? "bg-blue-100 border-blue-500"
            : "hover:bg-gray-100"
        }`}
      >
        <div
          className="flex-1 cursor-pointer"
          onClick={handleClick}
        >
          {file.type === "folder" ? "📁" : "📄"} {file.fileName}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => renameFile(file)}
            className="text-blue-600"
          >
            ✏
          </button>

          <button
            onClick={() => deleteFile(file)}
            className="text-red-600"
          >
            🗑
          </button>
        </div>
      </div>

      {menu.visible && (
        <ContextMenu
          x={menu.x}
          y={menu.y}
          isFolder={file.type === "folder"}
          onRename={() => {
            renameFile(file);
            setMenu({ ...menu, visible: false });
          }}
          onDelete={() => {
            deleteFile(file);
            setMenu({ ...menu, visible: false });
          }}
          onNewFile={() => {
            setMenu({ ...menu, visible: false });
          }}
          onNewFolder={() => {
            setMenu({ ...menu, visible: false });
          }}
          onClose={() =>
            setMenu({ ...menu, visible: false })
          }
        />
      )}
    </>
  );
};

export default FileItem;