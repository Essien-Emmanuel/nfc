import fs from "fs";
import { createGzip } from "zlib";
import { pipeline } from "stream";

const { readdir } = fs.promises;

function transformToZip(file) {
  if (file.includes(".gz")) return;

  const zippedFormat = file + ".gz";

  const src = fs.createReadStream(file);
  const gzip = createGzip();
  const dest = fs.createWriteStream(zippedFormat);

  return new Promise((resolve, _reject) => {
    resolve(pipeline(src, gzip, dest));
  });
}

export async function zipDir(targetDir) {
  console.log("here ", targetDir);
  const result = await readdir(targetDir);
  console.log("result ", result);
}
