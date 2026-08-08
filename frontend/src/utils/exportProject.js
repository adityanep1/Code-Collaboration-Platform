import JSZip from "jszip";
import { saveAs } from "file-saver";

export const exportProject = async (files) => {

  const zip = new JSZip();

  files.forEach((file) => {

    if (file.type === "file") {

      zip.file(
        file.fileName,
        file.code || ""
      );

    }

  });

  const content = await zip.generateAsync({
    type: "blob",
  });

  saveAs(content, "Project.zip");

};