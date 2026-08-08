import { useState } from "react";
import { useParams } from "react-router-dom";

import { createFileAPI } from "../services/fileService";
import socket from "../socket/socket";

import {
  FaGithub,
  FaDownload,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

const GitHubImport = () => {
  const { roomCode } = useParams();

  const [repoUrl, setRepoUrl] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  // =====================================================
  // LANGUAGE DETECTION
  // =====================================================

  const getLanguage = (fileName) => {
    const extension = fileName
      .split(".")
      .pop()
      .toLowerCase();

    const languages = {
      js: "javascript",
      jsx: "javascript",
      ts: "typescript",
      tsx: "typescript",
      py: "python",
      java: "java",
      cpp: "cpp",
      c: "c",
      h: "cpp",
      html: "html",
      css: "css",
      json: "json",
      md: "markdown",
      sql: "sql",
      xml: "xml",
      sh: "shell",
    };

    return (
      languages[extension] ||
      "plaintext"
    );
  };

  // =====================================================
  // GITHUB URL PARSER
  // =====================================================

  const parseGitHubUrl = (url) => {
    try {
      const parsed = new URL(url);

      if (
        parsed.hostname !==
        "github.com"
      ) {
        return null;
      }

      const parts =
        parsed.pathname
          .split("/")
          .filter(Boolean);

      if (parts.length < 2) {
        return null;
      }

      return {
        owner: parts[0],
        repo: parts[1].replace(
          ".git",
          ""
        ),
      };
    } catch {
      return null;
    }
  };

  // =====================================================
  // IMPORT REPOSITORY
  // =====================================================

  const importRepository =
    async () => {
      if (!repoUrl.trim()) {
        setMessage(
          "Please enter a GitHub repository URL."
        );

        return;
      }

      const repository =
        parseGitHubUrl(repoUrl);

      if (!repository) {
        setMessage(
          "Invalid GitHub URL."
        );

        return;
      }

      try {
        setLoading(true);

        setMessage(
          "Reading repository..."
        );

        const {
          owner,
          repo,
        } = repository;

        // ---------------------------------------------
        // Repository information
        // ---------------------------------------------

        const repoResponse =
          await fetch(
            `https://api.github.com/repos/${owner}/${repo}`
          );

        if (!repoResponse.ok) {
          throw new Error(
            "Repository not found or it is private."
          );
        }

        const repoData =
          await repoResponse.json();

        const branch =
          repoData.default_branch;

        // ---------------------------------------------
        // Repository tree
        // ---------------------------------------------

        const treeResponse =
          await fetch(
            `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
          );

        if (!treeResponse.ok) {
          throw new Error(
            "Could not read repository files."
          );
        }

        const treeData =
          await treeResponse.json();

        if (!treeData.tree) {
          throw new Error(
            "No files found."
          );
        }

        // ---------------------------------------------
        // Ignore unnecessary folders
        // ---------------------------------------------

        const ignoredFolders = [
          "node_modules",
          ".git",
          "dist",
          "build",
          ".next",
          "coverage",
        ];

        const items =
          treeData.tree.filter(
            (item) => {
              const firstFolder =
                item.path.split(
                  "/"
                )[0];

              return !ignoredFolders.includes(
                firstFolder
              );
            }
          );

        // ---------------------------------------------
        // Folders
        // ---------------------------------------------

        const folders =
          items
            .filter(
              (item) =>
                item.type ===
                "tree"
            )
            .sort(
              (a, b) =>
                a.path.split(
                  "/"
                ).length -
                b.path.split(
                  "/"
                ).length
            );

        // ---------------------------------------------
        // Files
        // ---------------------------------------------

        const files =
          items.filter(
            (item) =>
              item.type ===
              "blob"
          );

        // Keep import manageable
        const limitedFiles =
          files.slice(0, 100);

        const folderMap = {};

        // =============================================
        // CREATE FOLDERS
        // =============================================

        setMessage(
          "Creating folders..."
        );

        for (const folder of folders) {
          const parts =
            folder.path.split(
              "/"
            );

          const folderName =
            parts[
              parts.length - 1
            ];

          const parentPath =
            parts
              .slice(0, -1)
              .join("/");

          const parentId =
            folderMap[
              parentPath
            ] || null;

          try {
            const result =
              await createFileAPI({
                roomCode,
                fileName:
                  folderName,
                type: "folder",
                parentId,
              });

            folderMap[
              folder.path
            ] =
              result.file._id;
          } catch (error) {
            console.error(
              "Folder creation failed:",
              folder.path,
              error
            );
          }
        }

        // =============================================
        // CREATE FILES
        // =============================================

        setMessage(
          `Importing ${limitedFiles.length} files...`
        );

        let imported = 0;

        for (const file of limitedFiles) {
          try {
            const parts =
              file.path.split(
                "/"
              );

            const fileName =
              parts[
                parts.length - 1
              ];

            const parentPath =
              parts
                .slice(0, -1)
                .join("/");

            const parentId =
              folderMap[
                parentPath
              ] || null;

            const rawUrl =
              `https://raw.githubusercontent.com/` +
              `${owner}/${repo}/${branch}/` +
              `${file.path}`;

            const contentResponse =
              await fetch(
                rawUrl
              );

            let code = "";

            if (
              contentResponse.ok
            ) {
              code =
                await contentResponse.text();

              // Protect application
              // from huge files
              if (
                code.length >
                200000
              ) {
                code =
                  "// File too large to import.\n";
              }
            }

            await createFileAPI({
              roomCode,
              fileName,
              code,
              language:
                getLanguage(
                  fileName
                ),
              type: "file",
              parentId,
            });

            imported++;

            setMessage(
              `Imported ${imported}/${limitedFiles.length} files...`
            );
          } catch (error) {
            console.error(
              "File import failed:",
              file.path,
              error
            );
          }
        }

        // =============================================
        // REFRESH FILE EXPLORER
        // =============================================

        socket.emit(
          "file-created",
          {
            roomCode,
          }
        );

        window.dispatchEvent(
          new Event(
            "github-imported"
          )
        );

        setMessage(
          `GitHub project imported successfully. ${imported} files added.`
        );

        setRepoUrl("");
      } catch (error) {
        console.error(
          "GitHub Import Error:",
          error
        );

        setMessage(
          error.message
        );
      } finally {
        setLoading(false);
      }
    };

  // =====================================================
  // UI
  // =====================================================

  const isSuccess =
    message.startsWith(
      "GitHub project imported successfully"
    );

  const isError =
    message.startsWith(
      "Invalid"
    ) ||
    message.startsWith(
      "Repository"
    ) ||
    message.startsWith(
      "Could"
    ) ||
    message.startsWith(
      "Please"
    );

  return (
    <div className="w-full">

      {/* ================================================
          HEADER
      ================================================= */}

      <div className="
        flex
        items-center
        gap-2
        mb-3
      ">

        <FaGithub
          className="
            text-slate-800
            text-lg
          "
        />

        <h2 className="
          text-base
          font-semibold
          text-slate-800
        ">
          GitHub Import
        </h2>

      </div>

      {/* ================================================
          INPUT
      ================================================= */}

      <input
        type="text"
        value={repoUrl}
        onChange={(event) =>
          setRepoUrl(
            event.target.value
          )
        }
        placeholder="github.com/user/project"
        disabled={loading}
        className="
          w-full
          h-10
          px-3
          rounded-lg
          border
          border-slate-200
          bg-white
          text-sm
          text-slate-700
          outline-none
          placeholder:text-slate-400
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-100
          disabled:bg-slate-50
          transition
        "
      />

      {/* ================================================
          BUTTON
      ================================================= */}

      <button
        type="button"
        onClick={
          importRepository
        }
        disabled={loading}
        className="
          w-full
          h-10
          mt-2
          flex
          items-center
          justify-center
          gap-2
          rounded-lg
          bg-slate-900
          hover:bg-slate-800
          active:bg-slate-950
          text-white
          text-sm
          font-medium
          disabled:opacity-50
          disabled:cursor-not-allowed
          transition-colors
        "
      >

        {loading ? (
          <>
            <span className="
              h-4
              w-4
              rounded-full
              border-2
              border-white
              border-t-transparent
              animate-spin
            " />

            <span>
              Importing...
            </span>
          </>
        ) : (
          <>
            <FaDownload className="text-xs" />

            <span>
              Import Repository
            </span>
          </>
        )}

      </button>

      {/* ================================================
          MESSAGE
      ================================================= */}

      {message && (
        <div
          className={`
            mt-3
            flex
            items-start
            gap-2
            text-xs
            leading-relaxed

            ${
              isSuccess
                ? "text-green-600"
                : isError
                ? "text-red-500"
                : "text-slate-500"
            }
          `}
        >

          {isSuccess && (
            <FaCheckCircle
              className="
                shrink-0
                mt-0.5
              "
            />
          )}

          {isError && (
            <FaExclamationCircle
              className="
                shrink-0
                mt-0.5
              "
            />
          )}

          <span>
            {message}
          </span>

        </div>
      )}

    </div>
  );
};

export default GitHubImport;