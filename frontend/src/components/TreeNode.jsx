import { useState } from "react";

const TreeNode = ({
  item,
  files,
  openTabs,
  setOpenTabs,
  selectedFileId,
  setSelectedFileId,
}) => {

  const [expanded, setExpanded] = useState(true);

  const children = files.filter(
    (file) => String(file.parentId) === String(item._id)
  );

  const openFile = () => {

    setSelectedFileId(item._id);

    const exists = openTabs.find(
      (tab) => tab._id === item._id
    );

    if (!exists) {
      setOpenTabs([...openTabs, item]);
    }

  };

  return (
    <div style={{ marginLeft: "15px" }}>

      {item.type === "folder" ? (

        <>
          <div
            style={{
              cursor: "pointer",
              fontWeight: "bold",
            }}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "▼" : "▶"} 📁 {item.fileName}
          </div>

          {expanded &&
            children.map((child) => (
              <TreeNode
                key={child._id}
                item={child}
                files={files}
                openTabs={openTabs}
                setOpenTabs={setOpenTabs}
                selectedFileId={selectedFileId}
                setSelectedFileId={setSelectedFileId}
              />
            ))}
        </>

      ) : (

        <div
          onClick={openFile}
          style={{
            cursor: "pointer",
            padding: "4px",
            background:
              selectedFileId === item._id
                ? "#dbeafe"
                : "transparent",
          }}
        >
          📄 {item.fileName}
        </div>

      )}

    </div>
  );
};

export default TreeNode;