import { ZipTool } from "./zip.js";
import { helpStr } from "./help.js";
import { UnzipTool } from "./upzip.js";

export class Tool2 {
  constructor(cmd, targetItems) {
    this.validCmds = [
      "--help",
      "-h",
      "--manual",
      "zip",
      "pdf",
      "--here",
      "unzip",
    ];
    this.helpCmds = ["-h", "h", "--help", "--manual"];

    if (!this.validCmds.includes(cmd)) {
      throw new Error(this.help());
    }

    this.cmd = cmd;
    this.targetItems = targetItems;
  }

  checkArgs(args = []) {
    if (args.length < 3) {
    }
  }
  help() {
    console.log(helpStr);
  }

  async zip() {
    for (const targetItem of this.targetItems) {
      const zipTool = new ZipTool(targetItem);
      zipTool.zip();
    }
  }

  async unzip() {
    for (const targetItem of this.targetItems) {
      const unzipTool = new UnzipTool(targetItem);
      unzipTool.unzip();
    }
  }

  pdf() {
    console.log("converting item to pdf");
  }

  use() {
    if (this.validCmds.includes(this.cmd)) {
      return this[this.cmd]?.();
    }
  }
}

export class ToolManager {
  constructor(args) {
    this.args = args;
  }

  zip(args) {
    console.log("here");
    const dirs = args.args;
    const opts = args.opt;
    const zipTool = new ZipTool(dirs, opts);
    zipTool.use();
  }

  register() {
    const tool = this.args.tools[0];
    return this[tool]?.(this.args);
  }

  use() {
    this.register();
  }
}
