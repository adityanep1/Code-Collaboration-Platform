import { useState } from "react";
import FileItem from "./FileItem";

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

  const childFiles = files.filter(
    (file) =>
      file.parentId === folder._id &&
      file.type === "file"
  );

  return (
    <div className="mb-3">

      {/* Folder */}

      <div
        onClick={() => {
          setExpanded(!expanded);
          setSelectedFolder(folder._id);
        }}
        className="cursor-pointer font-semibold flex items-center gap-2 hover:text-blue-600"
      >
        {expanded ? "📂" : "📁"} {folder.fileName}
      </div>

      {/* Files */}

      {expanded && (

        <div className="ml-6 mt-2">

          {childFiles.length === 0 ? (

            <p className="text-gray-400 text-sm">
              Empty Folder
            </p>

          ) : (

            childFiles.map((file) => (

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

            ))

          )}

        </div>

      )}

    </div>
  );
};

export default FolderItem;