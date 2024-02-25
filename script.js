// Define the searchPhrase function
async searchPhrase() {
  // Get the search term from the search bar
  const searchTerm = document.getElementById("search-bar").value.toLowerCase();

  // Fetch the data from the JSON file
  const response = await fetch("phrases.json");

  // Convert the response to JSON
  const data = await response.json();

  // Filter the phrases that include the search term
  const phrases = data.phrases.filter((item) => item.phrase.toLowerCase().includes(searchTerm));

  // Display the phrases on the page
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "";
  if (phrases.length === 0) {
    resultDiv.innerHTML = "No matching phrases found.";
  } else {
    phrases.forEach((phrase) => {
      const p = document.createElement("p");
      p.textContent = phrase.phrase;
      resultDiv.appendChild(p);
    });
  }
}
