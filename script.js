function searchPhr() {
  const searchTerm = document.getElementById("search-bar").value.toLowerCase();
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "";

  fetch("data.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      const md = window.markdownit();
      const matchingEntries = data.entries.filter((entry) => {
        const descRendered = md.render(entry.desc).toLowerCase();
        const descIncludesSearchTerm = descRendered.includes(searchTerm);
        const shortUrlIncludesSearchTerm = entry.shortUrl && entry.shortUrl.toLowerCase().includes(searchTerm);
        const nameIncludesSearchTerm = entry.name.toLowerCase() == searchTerm;

        if (nameIncludesSearchTerm) {
          const updatedDesc2 = entry.desc.replace(/(?=#\w+)\#/g, "# ");
          const redHighlightTerm = ["Caution", "Suspended", "Revoked"];
          let highlightedText2 = md.render(updatedDesc2).replace(
            new RegExp("(" + redHighlightTerm.join("|") + ")", "gi"),
              "<span class='highlight-red'>$1</span>"
            );
          resultDiv.innerHTML += `
            <div>
              <h2><b>${entry.name}</b></h2>
              <p>${highlightedText2}</p>
              <p><strong>Last edited:</strong> ${entry.dateLastActivity}</p>
              <p><strong>Link:</strong> ${entry.shortUrl}</p>
            </div>
          `;
          return true;
        }

        return descIncludesSearchTerm || shortUrlIncludesSearchTerm;
      });

      if (matchingEntries.length === 0) {
        resultDiv.innerHTML += "No matching entries found.";
      } else {
        const highlightedEntries = matchingEntries.map((entry) => {
          let highlightedText = "";
          let propertyName = "";
          if (entry.desc && md.render(entry.desc).toLowerCase().includes(searchTerm)) {
            const updatedDesc = entry.desc.replace(/(?=#\w+)\#/g, "# "); // add a space after the hashtag if it's followed by a word
            highlightedText = md.render(updatedDesc).replace(
              new RegExp("(" + searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&") + ")", "gi"),
              "<span class='highlight'>$1</span>"
            );
            propertyName = "";
          } else if (entry.shortUrl && entry.shortUrl.toLowerCase().includes(searchTerm)) {
            highlightedText = entry.shortUrl.replace(
              new RegExp("(" + searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&") + ")", "gi"),
              "<span class='highlight'>$1</span>"
            );
            propertyName = "Short URL";
          }
          if (!highlightedText) {
            return "";
          }
          return `
            <div>
              <h2><b>${entry.name}</b></h2>
              <p><strong>${propertyName}</strong> ${highlightedText}</p>
            </div>
          `;
        });

        resultDiv.innerHTML += highlightedEntries.join("");
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      resultDiv.innerHTML += "Error fetching data.";
    });
}
