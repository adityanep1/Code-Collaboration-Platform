import {
  FaCircle,
  FaPlay,
  FaUsers,
} from "react-icons/fa";

const Sidebar = ({ users = [] }) => {
  return (
    <div className="w-full">

      {/* ================================
          HEADER
      ================================= */}

      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <FaUsers className="text-indigo-500 text-sm" />

          <h2 className="text-base font-semibold text-slate-800">
            Members
          </h2>

          <span className="ml-auto text-xs font-medium text-slate-400">
            {users.length}
          </span>
        </div>
      </div>

      {/* ================================
          MEMBERS
      ================================= */}

      <div className="px-4 pb-3">

        {users.length === 0 ? (
          <div className="py-2 text-sm text-slate-400">
            No members online
          </div>
        ) : (
          <div className="space-y-1">

            {users.map((user) => (
              <div
                key={user.socketId}
                className="
                  flex
                  items-center
                  gap-2.5
                  min-w-0
                  px-2.5
                  py-2
                  rounded-lg
                  hover:bg-slate-50
                  transition-colors
                "
              >

                {/* Online indicator */}

                <FaCircle
                  className="
                    shrink-0
                    text-green-500
                    text-[8px]
                  "
                />

                {/* User name */}

                <span
                  className="
                    min-w-0
                    truncate
                    text-sm
                    font-medium
                    text-slate-700
                  "
                  title={user.name}
                >
                  {user.name}
                </span>

                <span className="ml-auto text-[10px] text-green-500">
                  Online
                </span>

              </div>
            ))}

          </div>
        )}

      </div>

      {/* ================================
          DIVIDER
      ================================= */}

      <div className="mx-4 border-t border-slate-200" />

      {/* ================================
          RUN CODE
      ================================= */}

      <div className="p-4">

        <button
          type="button"
          className="
            w-full
            h-10
            flex
            items-center
            justify-center
            gap-2
            rounded-lg
            bg-green-600
            hover:bg-green-700
            active:bg-green-800
            text-white
            text-sm
            font-medium
            transition-colors
          "
        >
          <FaPlay className="text-xs" />

          <span>
            Run Code
          </span>
        </button>

      </div>

    </div>
  );
};

export default Sidebar;