import { FaCircle, FaPlay } from "react-icons/fa";

const Sidebar = ({ users }) => {

  return (
    <div className="bg-slate-900 text-white h-full p-5">

      <h2 className="text-xl font-bold mb-6">

        👥 Members

      </h2>

      <div className="space-y-3">

        {users.map((user) => (

          <div
            key={user.socketId}
            className="flex items-center gap-3"
          >

            <FaCircle className="text-green-500 text-xs" />

            {user.name}

          </div>

        ))}

      </div>

      <hr className="my-8" />

      <button
        className="bg-green-600 w-full py-3 rounded-lg flex justify-center items-center gap-2"
      >

        <FaPlay />

        Run Code

      </button>

    </div>
  );
};

export default Sidebar;