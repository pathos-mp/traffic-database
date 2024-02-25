function searchPhrase() {
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
      const matchingEntries = data.entries.filter((entry) => {
        return (
          entry.content.toLowerCase().includes(searchTerm) ||
          entry.attachment1.toLowerCase().includes(searchTerm) ||
          entry.attachment2.toLowerCase().includes(searchTerm)
        );
      });

      if (matchingEntries.length === 0) {
        resultDiv.innerHTML = "No matching entries found.";
      } else {
        const highlightedEntries = matchingEntries.map((entry) => {
          let highlightedContent = entry.content.replace(
            new RegExp("(" + searchTerm + ")", "gi"),
            "<span class='highlight'>$1</span>"
          );
          let highlightedAttachment1 = "";
          if (entry.attachment1) {
            highlightedAttachment1 = entry.attachment1.replace(
              new RegExp("(" + searchTerm + ")", "gi"),
              "<span class='highlight'>$1</span>"
            );
          }
          let highlightedAttachment2 = "";
          if (entry.attachment2) {
            highlightedContent = entry.attachment2.replace(
              new RegExp("(" + searchTerm + ")", "gi"),
              "<span class='highlight'>$1</span>"
            );
          }
          return `
            <div>
              <h2><b>${entry.title}</b></h2>
              <p><strong>Content:</strong> ${highlightedContent}</p>
              ${
                entry.attachment1
                  ? `<p><strong>Attachment 1:</strong> ${highlightedAttachment1}</p>`
                  : ""
              }
              ${
                entry.attachment2
                  ? `<p><strong>Attachment 2:</strong> ${highlightedAttachment2}</p>`
                  : ""
              }
            </div>
          `;
        });
        resultDiv.innerHTML = highlightedEntries.join("");
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      resultDiv.innerHTML = "Error fetching data.";
    });
}
