import { FaCode, FaUsers, FaSignOutAlt } from "react-icons/fa";

const Navbar = ({ roomCode, onlineCount }) => {

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <nav className="bg-slate-900 text-white px-8 py-4 flex justify-between items-center shadow-lg">

      <div className="flex items-center gap-3">

        <FaCode className="text-2xl text-blue-400" />

        <h1 className="text-2xl font-bold">
          CodeCollab
        </h1>

      </div>

      <div className="flex items-center gap-8">

        <div>
          <span className="text-gray-300">
            Room :
          </span>

          <span className="ml-2 font-semibold">
            {roomCode}
          </span>
        </div>

        <div className="flex items-center gap-2">

          <FaUsers className="text-green-400" />

          <span>
            {onlineCount} Online
          </span>

        </div>

        <div className="flex items-center gap-2">

          <div className="w-8 h-8 rounded-full bg-blue-500 flex justify-center items-center">

            {user?.name?.charAt(0).toUpperCase()}

          </div>

          <span>
            {user?.name}
          </span>

        </div>

        <button
          className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2"
        >
          <FaSignOutAlt />

          Logout

        </button>

      </div>

    </nav>
  );
};

export default Navbar;