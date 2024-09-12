const validTools = ["zip", "unzip"];
const validOptions = ["here"];

// map each tool to their corresponding options
const mappedToolsOpt = {
  zip: ["here"],
  unzip: ["here"],
};

function parseCliArgs(cliArgs = []) {
  return cliArgs.reduce(
    (acc, cur) => {
      if (cur[0] === "-") {
        const opt = cur.replace(/^-+/g, "");
        acc.opts.push(opt);
        return acc;
      }

      if (!acc.tool && Object.keys(mappedToolsOpt).includes(cur)) {
        acc.tools.push(cur);
        return acc;
      }

      acc.args.push(cur);

      return acc;
    },
    { tools: [], opts: [], args: [] }
  );
}

export function validateArgs(cliArgs) {
  const parsedArgs = parseCliArgs(cliArgs);

  if (parsedArgs.tools.length < 1) {
    console.log(
      "No such tool exists in this toolbox. see options with the --help command"
    );
    return;
  }

  if (parsedArgs.tools.length > 1) {
    parsedArgs.tools = [parsedArgs.tools[0]];
  }

  for (const opt of parsedArgs.opts) {
    const validToolOpt = mappedToolsOpt[parsedArgs.tools[0]];
    if (!validToolOpt.includes(opt)) {
      console.log(
        `Not an option for ${parsedArgs.tools[0]}. See list of options with the --help command`
      );
      return;
    }
  }

  return parsedArgs;
}
