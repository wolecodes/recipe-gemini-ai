import prompt from "./prompt";

import { GoogleGenerativeAI } from "@google/generative-ai";

//load key from .env;
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);

//load the form
const formEl = document.querySelector("form");

//get the input
const input = document.querySelector("input[type=file]");

//get the loader
const loader = document.querySelector(".loader");

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
  e.preventDefault();
  //check if the image is uploaded
  if (!input.files[0]) {
    return;
  }

  //if the image was uploaded, then remove hidden from loader;
  loader.classList.remove("hidden");

  const text = await run();
  displayResult(text);
});

//convet a file object to GooglegenearativeAi part object;

async function fileToGenerativePart(file) {
  const base64EncodedDataPromise = new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
}
// bug: fix the run
async function run() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const imageParts = await Promise.all(
    [...input.files].map(fileToGenerativePart)
  );

  const result = await model.generateContent([prompt, ...imageParts]);

  const response = await result.response;

  const text = response.text();

  return text;
}

//display Result
const displayResult = function (text) {
  loader.classList.add("hidden");

  const obj = JSON.parse(text);

  const result = document.querySelector(".result");

  if (obj.error) {
    result.innerHTML = `${obj.error}`;
  } else {
    const { name, ingredients, instructions, healthBenefits } = obj;

    result.innerHTML = `
    <h2>${name}</h2>
    <h4>Ingredients:</h4>
    <ol>${ingredients
      .map((text) => {
        return `<li>${text}</li>`;
      })
      .join(" ")}
  </ol>
      <h4>Instructions:</h4>
      <ol>${instructions
        .map((text) => {
          return `<li>${text}</li>`;
        })
        .join(" ")}
    </ol>
    ${
      healthBenefits &&
      `<h4>Health Benefits:</h4>
        <ol>
            ${healthBenefits
              .map((text) => {
                return `<li>${text}</li>`;
              })
              .join(" ")}
        </ol>`
    }
    `;
  }
};
