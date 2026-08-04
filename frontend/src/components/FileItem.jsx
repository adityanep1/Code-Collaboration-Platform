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

  return (
    <div
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
        {file.type === "folder" ? "📁" : "📄"}{" "}
        {file.fileName}
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
  );
};

export default FileItem;