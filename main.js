//get the input

const input = document.getElementById("upload-file");

const imgPreview = document.querySelector(".img-preview");

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

input.addEventListener("change", function () {
  getImgData();
});
