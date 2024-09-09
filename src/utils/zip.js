import zlib from "node:zlib";
const { pipeline } = require("stream/promises");

exports.zipFile = async (file) => {
  if (file.includes("gz")) return;

  const zipFormat = file + ".gz";
  const source = fs.createReadStream(file);
  const gzip = zlib.createGzip();
  const destination = fs.createWriteStream(zipFormat);

  try {
    await pipeline(source, gzip, destination);
  } catch (exc) {
    console.log("An error occured whiling zipping file");
  }
};
