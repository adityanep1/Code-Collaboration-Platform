import prettier from "prettier/standalone";
import parserBabel from "prettier/parser-babel";
import parserHtml from "prettier/parser-html";
import parserPostcss from "prettier/parser-postcss";

export const formatCode = async (language, code) => {
  try {
    let parser = "babel";

    switch (language) {
      case "javascript":
        parser = "babel";
        break;

      case "html":
        parser = "html";
        break;

      case "css":
        parser = "css";
        break;

      case "json":
        parser = "json";
        break;

      default:
        return code;
    }

    const formatted = await prettier.format(code, {
      parser,
      plugins: [
        parserBabel,
        parserHtml,
        parserPostcss,
      ],
      semi: true,
      singleQuote: true,
      tabWidth: 2,
    });

    return formatted;

  } catch (error) {

    console.log(error);

    return code;

  }
};