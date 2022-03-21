import "./style.css";
import shuffle from "just-shuffle";

const dataURL = window.navigator.onLine
  ? "https://docs.google.com/spreadsheets/d/e/2PACX-1vTfUZWbzQwzCqK1pW-uXHLckN-oh0SrL2OM3_G6eFeIN_EW1RJtx76kI5FIeErwg126nWVYoXYBN08m/pub?output=csv"
  : "keywords.csv";

const maxFontSizeForTag = 6;

function handleResult(fragment, result, highestValue) {
  const rating = result.weight;
  const name = result.kw;
  let fontSize = (rating / highestValue) * maxFontSizeForTag;
  fontSize = +fontSize.toFixed(2);
  if (fontSize <= 1) {
    fontSize = 1;
  }
  const fontSizeProperty = `${fontSize}em`;
  const tag = document.createElement("li");
  tag.classList.add("tag");
  tag.innerHTML = `<span class="tag__link" style="--font-size: ${fontSizeProperty}">${name}</span>`;
  fragment.appendChild(tag);
}

function showElective(data, title, language) {
  const template = document.querySelector("template").content;
  const copy = template.cloneNode(true);
  copy.querySelector("h2").textContent = `${title} - ${language}`;
  const fragment = document.createDocumentFragment();
  data.forEach((result) => handleResult(fragment, result, 10));
  copy.querySelector(".tags").appendChild(fragment);
  document.querySelector(".clouds").appendChild(copy);
}
fetch(dataURL)
  .then(function (res) {
    return res.text();
  })
  .then(function (data) {
    const dataAsArray = data.split("\n").slice(1);

    const keywords = dataAsArray.map((ar) => {
      const [kw, weight, elective] = ar.split(",");

      return {
        kw,
        weight,
        elective: elective.split("\r")[0],
      };
    });
    const fe = keywords.filter((kw) => kw.elective === "FE");
    const dd = keywords.filter((kw) => kw.elective === "DD");
    const dbcm = keywords.filter((kw) => kw.elective === "DBCM");
    showElective(shuffle(dbcm), "DBCM", "English");
    showElective(shuffle(dd), "Digitalt Design", "Danish");
    showElective(shuffle(fe), "Front End Development", "English");
  });
