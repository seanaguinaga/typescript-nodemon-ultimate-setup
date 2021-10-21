import axios from "axios";
import { parse } from "url";
const http = require("https");
const fs = require("fs");
const { basename } = require("path");

function greet(name: string): void {
  console.log("Hello", name);
}

const readerName = "Medium Reader";

greet(readerName);

function downloadWithProgress(url: string) {
  const startTime = new Date().getTime();

  axios({
    method: "get",

    url,

    responseType: "blob",

    // headers: { Authorization: token },

    onDownloadProgress: (e) => {
      const percent_complete = Math.floor((e.loaded / e.total) * 100);

      const duration = (new Date().getTime() - startTime) / 1000;
      const bps = e.loaded / duration;

      const kbps = Math.floor(bps / 1024);

      const time = (e.total - e.loaded) / bps;
      const seconds = Math.floor(time % 60);
      const minutes = Math.floor(time / 60);

      console.log(
        `${percent_complete}% - ${kbps} Kbps - ${minutes} min ${seconds} sec remaining`
      );
    },
  }).then((res) => {
    let type = res.headers["content type"];
    console.log(type);
  });
}

download(
  "https://firebasestorage.googleapis.com/v0/b/dashreel-development.appspot.com/o/test%2FIMG_0052.MOV?alt=media&token=7a110c84-086e-4893-abef-94cca31d975e",
  "test.mp4"
);

const TIMEOUT = 10000;

function download(url: string, path: string) {
  const uri = parse(url);
  if (!path) {
    path = basename(uri.path);
  }
  const file = fs.createWriteStream(path);

  return new Promise(function (resolve, reject) {
    const request = http.get(uri.href).on("response", function (res: any) {
      const len = parseInt(res.headers["content-length"], 10);
      console.log(len);
      let downloaded = 0;
      let percent = "0";
      res
        .on("data", function (chunk: any) {
          file.write(chunk);
          downloaded += chunk.length;
          percent = ((100.0 * downloaded) / len).toFixed(2);
          process.stdout.write(`Downloading ${percent}% ${downloaded} bytes\r`);
        })
        .on("end", function () {
          file.end();
          console.log(`${uri.path} downloaded to: ${path}`);
          resolve(true);
        })
        .on("error", function (err: Error) {
          reject(err);
        });
    });
    request.setTimeout(20000, function () {
      request.abort();
      reject(new Error(`request timeout after ${TIMEOUT / 1000.0}s`));
    });
  });
}
