function searchPhr() {
  const searchTerm = document.querySelector("search-bar").value.toLowerCase();
  const resultDiv = document.querySelector("#result");
  resultDiv.innerHTML = "";

  fetch("data.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      const entries = data.entries;
      const highlightedEntries = entries.filter((entry) => {
        let highlightedText = "";
        let propertyName = "";

        // Check if the search term fully matches the "name" property value
        if (entry.name.toLowerCase() === searchTerm) {
          highlightedText = entry.name;
          propertyName = "Name";

          // Return the "desc", "dateLastActive", and "shortUrl" properties
          const additionalProperties = ["desc", "dateLastActive", "shortUrl"];
          additionalProperties.forEach((property) => {
            if (entry[property]) {
              const renderedMarkdown = markdownit().render(entry[property]);
              const highlightedProperty = renderedMarkdown.replace(
                new RegExp("(" + searchTerm + ")", "gi"),
                "<span class='highlight'>$1</span>"
              );
              propertyName += `, ${property}`;
              highlightedText += `
                <p><strong>${property}:</strong> ${highlightedProperty}</p>
              `;
            }
          });
        } else {
          // Existing search logic
          if (entry.desc && entry.desc.toLowerCase().includes(searchTerm)) {
            highlightedText = entry.desc.replace(
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
        }
        if (!highlightedText) {
          return "";
        }
        return `
          <div>
            <h2><b>${highlightedText}</b></h2>
            <p><strong>${propertyName}:</strong></p>
          </div>
        `;
      });
      resultDiv.insertAdjacentHTML("beforeend", highlightedEntries.join(""));
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      resultDiv.innerHTML = "Error fetching data.";
    });
}
