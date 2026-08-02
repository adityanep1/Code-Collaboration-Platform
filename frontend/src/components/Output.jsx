const Output = ({ output }) => {
  return (
    <div className="bg-gray-900 text-green-400 rounded-xl mt-6 p-4 shadow-lg">

      <h2 className="text-white text-lg font-semibold mb-3">
        ▶ Output
      </h2>

      <pre className="whitespace-pre-wrap font-mono min-h-[120px]">
        {output || "Run your code to see output..."}
      </pre>

    </div>
  );
};

export default Output;