const FileDropZone = ({
  children,
  onFilesDropped,
}) => {

  const handleDrop = (event) => {
    event.preventDefault();

    const files = Array.from(
      event.dataTransfer.files
    );

    if (files.length === 0) {
      return;
    }

    if (onFilesDropped) {
      onFilesDropped(files);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div
      className="w-full h-full"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {children}
    </div>
  );
};

export default FileDropZone;