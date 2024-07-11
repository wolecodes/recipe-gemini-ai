import prompt from "./prompt";

import { GoogleGenerativeAI } from "@google/generative-ai";

//load key from .env;
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);

//load the form
const formEl = document.querySelector("form");
console.log(formEl);
//get the input
const input = document.getElementById("upload-file");

//get the loader
const loader = document.querySelector(".loader");
console.log(loader);

//image preview element
const imgPreview = document.querySelector(".img-preview");

// load the image for preview;
const getImgData = function () {
  const files = input.files[0];

  if (files) {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(files);
    fileReader.addEventListener("load", function () {
      imgPreview.style.display = "block";
      imgPreview.innerHTML = `<img src="` + this.result + `"/>`;
    });
  }
};
// listen when choose file is click;
input.addEventListener("change", function () {
  getImgData();
});

formEl.addEventListener("submit", async (e) => {
  //check if the image is uploaded
  if (input.files[0]) {
    return;
  }

  //if the image was uploaded, then remove hidden from loader;
  loader.classList.remove("hidden");

  const text = await run();
  displayResult();
});

//convet a file object to GooglegenearativeAi part object;

async function fileToGenerativePart(file) {
  const encodedDataPromise = new Promise((resolve) => {
    const reader = new fileReader();

    reader.onloadend = () => resolve(reader.result.split(","[1]));
    reader.readAsDataURL(file);
  });

  return {
    inlineData: {
      data: await encodedDataPromise,
      mimeType: file.type,
    },
  };
}

async function run() {
  const model = genAI.getGenerativeModel({ model: "gemini-pro-vission" });

  const imageParts = await Promise.all(
    [...fileInputEl.files].map(fileToGenerativePart)
  );

  const result = await model.generateContent([prompt, ...imageParts]);

  const response = await result.response;

  const text = response.text();

  return text;
}
