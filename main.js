import "./style.css";
import shuffle from "just-shuffle";

const dataURL = "keywords.csv";

const maxFontSizeForTag = 6;

function handleResult(fragment, result, highestValue) {
  const rating = result.weight;
  const name = result.kw;
  const link = "#";
  let fontSize = (rating / highestValue) * maxFontSizeForTag;
  fontSize = +fontSize.toFixed(2);
  if (fontSize <= 1) {
    fontSize = 1;
  }
  const fontSizeProperty = `${fontSize}em`;
  const tag = document.createElement("li");
  tag.classList.add("tag");
  tag.innerHTML = `<a class="tag__link" href="${link}" style="--font-size: ${fontSizeProperty}">${name}</a>`;
  fragment.appendChild(tag);
}

function showElective(data) {
  const template = document.querySelector("template").content;
  const copy = template.cloneNode(true);
  copy.querySelector("h2").textContent = data[0].elective;
  const fragment = document.createDocumentFragment();
  data.forEach((result) => handleResult(fragment, result, 10));
  copy.querySelector(".tags").appendChild(fragment);
  document.body.appendChild(copy);
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
    showElective(shuffle(dbcm));
    showElective(shuffle(dd));
    showElective(shuffle(fe));
  });
