import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../socket/socket";
import { getExecutionHistoryAPI } from "../services/executionService";

const ExecutionHistory = () => {
  const { roomCode } = useParams();

  const [history, setHistory] = useState([]);

const loadHistory = async () => {
  try {

    const result = await getExecutionHistoryAPI(roomCode);

    setHistory(result.history);

  } catch (error) {

    console.log(error);

  }
};

useEffect(() => {

  loadHistory();

}, [roomCode]);

useEffect(() => {

  socket.on("refresh-history", () => {

    loadHistory();

  });

  return () => {

    socket.off("refresh-history");

  };

}, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 mt-5">
      <h2 className="text-xl font-bold mb-4">
        📜 Execution History
      </h2>

      {history.length === 0 ? (
        <p>No executions yet...</p>
      ) : (
        history.map((item) => (
          <div
            key={item._id}
            className="border rounded-lg p-3 mb-3"
          >
            <div className="flex justify-between">

              <strong>{item.executedBy}</strong>

              <span className="text-gray-500 text-sm">
                {new Date(item.createdAt).toLocaleString()}
              </span>

            </div>

            <p className="mt-2">
              <strong>Language:</strong> {item.language}
            </p>

            <pre className="bg-gray-100 p-2 rounded mt-2 overflow-x-auto">
{item.output}
            </pre>

          </div>
        ))
      )}
    </div>
  );
};

export default ExecutionHistory;