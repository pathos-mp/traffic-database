// Define the searchPhrase function
async function searchPhrase() {
    // Get the search term from the search bar
    const searchTerm = document.getElementById("search-bar").value;
  
    // Fetch the data from the JSON file
    const response = await fetch("https://vasekstolba.github.io/Pages-Tests/phrases.json");
  
    // Convert the response to JSON
    const data = await response.json();
  
    // Find the phrase with the matching ID
    const phrase = data.phrases.find((item) => item.id === parseInt(searchTerm));
  
    // Display the phrase in the console
    if (phrase) {
      console.log(`Phrase: ${phrase.phrase}`);
    } else {
      console.log("Phrase not found.");
    }
  }
