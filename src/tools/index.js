import { ZipTool } from "./zip.js";

export class Tool {
  constructor(cmd, targetItems) {
    this.validCmds = ["--help", "-h", "--manual", "zip", "pdf"];
    this.helpCmds = ["-h", "h", "--help", "--manual"];

    if (!this.validCmds.includes(cmd)) return;

    this.cmd = cmd;
    this.targetItems = targetItems;
  }

  help() {
    console.log("sending help");
  }

  async zip() {
    for (const targetItem of this.targetItems) {
      const zipTool = new ZipTool(targetItem);
      zipTool.zip();
    }
  }

  pdf() {
    console.log("converting item to pdf");
  }

  call() {
    if (this.validCmds.includes(this.cmd)) {
      if (this.helpCmds.includes(this.cmd)) return this.help();
      if (this.cmd === "zip") return this.zip();
      if (this.cmd === "pdf") return this.pdf();
    }
  }
}
