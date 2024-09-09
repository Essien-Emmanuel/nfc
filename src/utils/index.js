import fs from "fs";
const { lstat } = fs.promises;

export const checkIsFile = async (filePath) => {
  try {
    const fileStat = await lstat(filePath);
    return fileStat.isFile();
  } catch (error) {
    console.error("An error occured for lstat: ", error.message);
  }
};

export const checkData = async (data) => {
  try {
    const result = await data;
    return [result, null];
  } catch (err) {
    return [null, err];
  }
};
