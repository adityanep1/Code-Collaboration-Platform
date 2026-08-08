import prettier from "prettier/standalone";
import * as babelPlugin from "prettier/plugins/babel";
import * as estreePlugin from "prettier/plugins/estree";

export const formatCode = async (language, code) => {
  try {
    if (language !== "javascript") {
      return code;
    }

    return await prettier.format(code, {
      parser: "babel",
      plugins: [babelPlugin, estreePlugin],
      semi: true,
      singleQuote: true,
      tabWidth: 2,
    });
  } catch (error) {
    console.error(error);
    return code;
  }
};