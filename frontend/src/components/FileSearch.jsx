import { useState, useEffect, useRef } from "react";

import {
  FaSearch,
  FaFileCode,
} from "react-icons/fa";

const FileSearch = ({
  files,
  setSelectedFileId,
  openTabs,
  setOpenTabs,
}) => {
  const [search, setSearch] =
    useState("");

  const inputRef = useRef(null);

  // =========================================
  // SEARCH RESULTS
  // =========================================

  const filteredFiles = files.filter(
    (file) =>
      file.fileName
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
  );

  // =========================================
  // OPEN FILE
  // =========================================

  const openFile = (file) => {
    setSelectedFileId(
      file._id
    );

    const exists = openTabs.find(
      (tab) =>
        tab._id === file._id
    );

    if (!exists) {
      setOpenTabs([
        ...openTabs,
        file,
      ]);
    }

    setSearch("");
  };

  // =========================================
  // CTRL + P
  // =========================================

  useEffect(() => {
    const handleShortcut = (
      event
    ) => {
      if (
        event.ctrlKey &&
        event.key.toLowerCase() ===
          "p"
      ) {
        event.preventDefault();

        inputRef.current?.focus();
      }
    };

    window.addEventListener(
      "keydown",
      handleShortcut
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleShortcut
      );
    };
  }, []);

  return (
    <div className="relative w-full">

      {/* =====================================
          SEARCH INPUT
      ====================================== */}

      <div
        className="
          relative
          w-full
        "
      >

        <FaSearch
          className="
            absolute
            left-3
            top-1/2
            -translate-y-1/2
            text-[11px]
            text-slate-400
            pointer-events-none
          "
        />

        <input
          ref={inputRef}
          type="text"
          placeholder="Search files..."
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
          className="
            w-full
            h-9
            pl-8
            pr-10
            rounded-lg
            border
            border-slate-200
            bg-slate-50
            text-xs
            text-slate-700
            outline-none
            placeholder:text-slate-400
            focus:bg-white
            focus:border-blue-400
            focus:ring-2
            focus:ring-blue-50
            transition
          "
        />

        {/* Ctrl P */}

        {!search && (
          <span
            className="
              absolute
              right-2
              top-1/2
              -translate-y-1/2
              px-1.5
              py-0.5
              rounded
              border
              border-slate-200
              bg-white
              text-[9px]
              text-slate-400
            "
          >
            Ctrl P
          </span>
        )}

      </div>

      {/* =====================================
          SEARCH RESULTS
      ====================================== */}

      {search && (
        <div
          className="
            absolute
            z-40
            left-0
            right-0
            top-11
            max-h-56
            overflow-y-auto
            rounded-lg
            border
            border-slate-200
            bg-white
            shadow-lg
          "
        >

          {filteredFiles.length ===
          0 ? (
            <div
              className="
                px-3
                py-4
                text-center
                text-xs
                text-slate-400
              "
            >
              No files found
            </div>
          ) : (
            filteredFiles.map(
              (file) => (
                <button
                  key={file._id}
                  type="button"
                  onClick={() =>
                    openFile(file)
                  }
                  className="
                    w-full
                    h-9
                    flex
                    items-center
                    gap-2
                    px-3
                    text-left
                    text-xs
                    text-slate-600
                    hover:bg-slate-50
                    transition-colors
                  "
                >

                  <FaFileCode
                    className="
                      shrink-0
                      text-[10px]
                      text-slate-400
                    "
                  />

                  <span
                    className="
                      truncate
                    "
                    title={
                      file.fileName
                    }
                  >
                    {file.fileName}
                  </span>

                </button>
              )
            )
          )}

        </div>
      )}

    </div>
  );
};

export default FileSearch;