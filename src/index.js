#!/usr/bin/env node

import { zipDir } from "./tools/zip.js";

if (process.argv.length < 3) {
  console.log("Enter a command >>> 'zip', 'pdf'");
  process.exit(-1);
}

const args = process.argv.length > 2 ? process.argv.slice(2) : process.cwd();

const [command, ...files] = args;

function returnCmdFn(cmd) {
  if (cmd === "zip") {
    return zipDir;
  }
}
const cmdFn = returnCmdFn(command);
cmdFn(files);

// async function runZip(targetDir) {
//   try {
//     const isFile = await checkIsFile(targetDir);
//     if (isFile) {
//       zipFile(targetDir);
//       return;
//     }
//   } catch (error) {
//     console.error(error.message);
//   }

//   fs.readdir(targetDir, async (err, filenames) => {
//     if (err) {
//       console.log("Error: ", err.message);
//       return;
//     }

//     const filePaths = filenames.map((filename) =>
//       path.join(targetDir, filename)
//     );

//     for (const filePath of filePaths) {
//       const isFile = await checkIsFile(filePath);
//       if (isFile) zipFile(filePath);
//     }
//   });
// }

// if (typeof targetDirs === "string") {
//   runZip(targetDirs);
// } else {
//   for (const targetDir of targetDirs) {
//     runZip(targetDir);
//   }
// }
