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
          entry.content.toLowerCase().includes(searchTerm) ||
          (entry.attachment1 && entry.attachment1.toLowerCase().includes(searchTerm)) ||
          (entry.attachment2 && entry.attachment2.toLowerCase().includes(searchTerm))
        );
      });

      if (matchingEntries.length === 0) {
        resultDiv.innerHTML = "No matching entries found.";
      } else {
        const highlightedEntries = matchingEntries.map((entry) => {
          let highlightedText = "";
          let propertyName = "";
          if (entry.content.toLowerCase().includes(searchTerm)) {
            highlightedText = entry.content.replace(
              new RegExp("(" + searchTerm + ")", "gi"),
              "<span class='highlight'>$1</span>"
            );
            propertyName = "Content";
          } else if (entry.attachment1 && entry.attachment1.toLowerCase().includes(searchTerm)) {
            highlightedText = entry.attachment1.replace(
              new RegExp("(" + searchTerm + ")", "gi"),
              "<span class='highlight'>$1</span>"
            );
            propertyName = "Attachment 1";
          } else if (entry.attachment2 && entry.attachment2.toLowerCase().includes(searchTerm)) {
            highlightedText = entry.attachment2.replace(
              new RegExp("(" + searchTerm + ")", "gi"),
              "<span class='highlight'>$1</span>"
            );
            propertyName = "Attachment 2";
          }
          if (!highlightedText) {
            return "";
          }
          return `
            <div>
              <h2><b>${entry.title}</b></h2>
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
