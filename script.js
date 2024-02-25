function searchPhrase() {
  const searchTerm = document.getElementById("search-bar").value.toLowerCase();
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "";

  fetch("phrases.json")
    .then((response) => response.json())
    .then((data) => {
      const matchingPhrases = data.phrases.filter(
        (phrase) => phrase.phrase.toLowerCase().includes(searchTerm)
      );

      if (matchingPhrases.length === 0) {
        resultDiv.innerHTML = "No matching phrases found.";
      } else {
        const highlightedPhrases = matchingPhrases.map((phrase) => {
          const highlightedPhrase = phrase.phrase.replace(
            new RegExp("(" + searchTerm + ")", "gi"),
            "<span class='highlight'>$1</span>"
          );
          return `<p>${highlightedPhrase}</p>`;
        });

        resultDiv.innerHTML = highlightedPhrases.join("");
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      resultDiv.innerHTML = "Error fetching data.";
    });
}
