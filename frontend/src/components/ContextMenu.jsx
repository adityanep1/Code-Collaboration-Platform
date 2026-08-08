const ContextMenu = ({
  x,
  y,
  onRename,
  onDelete,
  onNewFile,
  onNewFolder,
  isFolder,
  onClose,
}) => {
  return (
    <div
      style={{
        position: "fixed",
        top: y,
        left: x,
        background: "#252526",
        color: "white",
        border: "1px solid #444",
        borderRadius: "6px",
        width: "180px",
        zIndex: 9999,
        boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
      }}
      onMouseLeave={onClose}
    >
      {isFolder && (
        <>
          <div
            className="px-3 py-2 hover:bg-gray-700 cursor-pointer"
            onClick={onNewFile}
          >
            📄 New File
          </div>

          <div
            className="px-3 py-2 hover:bg-gray-700 cursor-pointer"
            onClick={onNewFolder}
          >
            📁 New Folder
          </div>

          <hr className="border-gray-600" />
        </>
      )}

      <div
        className="px-3 py-2 hover:bg-gray-700 cursor-pointer"
        onClick={onRename}
      >
        ✏ Rename
      </div>

      <div
        className="px-3 py-2 hover:bg-red-700 cursor-pointer"
        onClick={onDelete}
      >
        🗑 Delete
      </div>
    </div>
  );
};

export default ContextMenu;