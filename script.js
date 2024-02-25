function searchPhr() {
  const searchTerm = document.getElementById("search-bar").value.toLowerCase();
  const resultDiv = document.getElementById("result");  resultDiv.innerHTML = "";

  fetch("data.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      const matchingEntries = data.entries.filter((entry) => {
        return (
          marked(entry.desc).toLowerCase().includes(searchTerm) ||
          (entry.shortUrl && entry.shortUrl.toLowerCase().includes(searchTerm))
        );
      });

      if (matchingEntries.length === 0) {
        resultDiv.innerHTML = "No matching entries found.";
      } else {
        const highlightedEntries = matchingEntries.map((entry) => {
          let highlightedText = "";
          let propertyName = "";
          if (marked(entry.desc).toLowerCase().includes(searchTerm)) {
            highlightedText = marked(entry.desc).replace(
              new RegExp("(" + searchTerm + ")", "gi"),
              "<span class='highlight'>$1</span>"
            );
            propertyName = "Description";
          } else if (entry.shortUrl && entry.shortUrl.toLowerCase().includes(searchTerm)) {
            highlightedText = entry.shortUrl.replace(
              new RegExp("(" + searchTerm + ")", "gi"),
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
              <p><strong>${propertyName}:</strong> ${highlightedText}</p>
            </div>
          `;
        }).filter(x => x);
        resultDiv.innerHTML = highlightedEntries.join("");
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      resultDiv.innerHTML = "Error fetching data.";
    });
}
