
import { useState, useEffect, useRef } from "react";

const FileSearch = ({
  files,
  setSelectedFileId,
  openTabs,
  setOpenTabs,
}) => {

  const [search, setSearch] = useState("");
  const inputRef = useRef(null);

  const filteredFiles = files.filter((file) =>
    file.fileName.toLowerCase().includes(search.toLowerCase())
  );

  const openFile = (file) => {

    setSelectedFileId(file._id);

    const exists = openTabs.find(
      (tab) => tab._id === file._id
    );

    if (!exists) {
      setOpenTabs([...openTabs, file]);
    }

    setSearch("");
  };


  useEffect(() => {

  const handleShortcut = (e) => {

    if (e.ctrlKey && e.key.toLowerCase() === "p") {

      e.preventDefault();

      inputRef.current.focus();

    }

  };

  window.addEventListener("keydown", handleShortcut);

  return () => {

    window.removeEventListener("keydown", handleShortcut);

  };

}, []);

  return (
    <div className="mb-4">

      <input
  ref={inputRef}
        type="text"
        placeholder="🔍 Search Files..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded-lg p-2"
      />

      {search && (

        <div className="border rounded-lg mt-2 bg-white max-h-48 overflow-auto">

          {filteredFiles.length === 0 ? (

            <p className="p-2 text-gray-500">
              No files found
            </p>

          ) : (

            filteredFiles.map((file) => (

              <div
                key={file._id}
                onClick={() => openFile(file)}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                📄 {file.fileName}
              </div>

            ))

          )}

        </div>

      )}

    </div>
  );
};

export default FileSearch;