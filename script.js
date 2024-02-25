function searchPhr() {
  const searchTerm = document.getElementById("search-bar").value.toLowerCase();
  const resultDiv = document.getElementById("result");  resultDiv.innerHTML = "";

  const md = window.markdownit({
    html: false,
    linkify: false,
    typographer: false
  });

  const slugify = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  fetch("data.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      const matchingEntries = data.entries.filter((entry) => {
        const desc = md.render(entry.desc);
        return desc.toLowerCase().includes(searchTerm) || (entry.shortUrl && entry.shortUrl.toLowerCase().includes(searchTerm));
      });

      if (matchingEntries.length === 0) {
        resultDiv.innerHTML = "No matching entries found.";
      } else {
        const highlightedEntries = matchingEntries.map((entry) => {
          let highlightedText = "";
          let propertyName = "";
          if (entry.desc) {
            const desc = md.render(entry.desc);
            const headers = desc.match(/(#+ .+?)\n/g);
            if (headers) {
              headers.forEach((header) => {
                const text = header.replace(/#+ /, '').trim();
                const id = slugify(text);
                highlightedText += `<h2 id="${id}">${text}</h2>`;
              });
              const descText = desc.replace(/(#+ .+?)\n/g, '').trim();
              highlightedText += md.render(descText).replace(
                new RegExp("(" + searchTerm + ")", "gi"),
                "<span class='highlight'>$1</span>"
              );
            }
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
          });
          resultDiv.innerHTML = highlightedEntries.join("");
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      resultDiv.innerHTML = "Error fetching data.";
    });
}
