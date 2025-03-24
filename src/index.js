document.addEventListener("DOMContentLoaded", () => {
    const characterBar = document.getElementById("character-bar");
    const detailedInfo = document.getElementById("detailed-info");
    const nameElement = document.getElementById("name");
    const imageElement = document.getElementById("image");
    const voteCountElement = document.getElementById("vote-count");
    const votesForm = document.getElementById("votes-form");
    const resetButton = document.getElementById("reset-btn");

    let selectedCharacter = null; // Store the currently selected character

    // Fetch characters from db.json
    fetch("http://localhost:3000/characters")
        .then(response => response.json())
        .then(characters => {
            characters.forEach(character => {
                // Creating a span elements for each character
                const span = document.createElement("span");
                span.textContent = character.name;
                span.style.cursor = "pointer";

                // Add event listener to display character details
                span.addEventListener("click", () => displayCharacterDetails(character));

                // Append the span to character-bar
                characterBar.appendChild(span);
            });
        })
        .catch(error => console.error("Error fetching characters:", error));

    // Function to display character details
    function displayCharacterDetails(character) {
        selectedCharacter = character; // Store the selected character
        nameElement.textContent = character.name;
        imageElement.src = character.image;
        imageElement.alt = character.name;
        voteCountElement.textContent = character.votes;
    }

    // Handle vote form submission
    votesForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent form from reloading the page

        if (!selectedCharacter) {
            alert("Please select a character first!");
            return;
        }

        // Get votes input and convert it to a number
        const votesInput = document.getElementById("votes");
        let additionalVotes = parseInt(votesInput.value);

        if (isNaN(additionalVotes) || additionalVotes < 1) {
            alert("Please enter a valid number of votes!");
            return;
        }

        let newVoteCount = selectedCharacter.votes + additionalVotes;

        // Update UI
        voteCountElement.textContent = newVoteCount;

        // Send PATCH request to update votes in the server
        fetch(`http://localhost:3000/characters/${selectedCharacter.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ votes: newVoteCount }),
        })
        .then(response => response.json())
        .then(updatedCharacter => {
            selectedCharacter.votes = updatedCharacter.votes; // Update local character data
            votesInput.value = ""; // Clear input field after submission
        })
        .catch(error => console.error("Error updating votes:", error));
    });

    // Handle vote reset
    resetButton.addEventListener("click", () => {
        if (!selectedCharacter) {
            alert("Please select a character first!");
            return;
        }

        // Reset vote count to 0
        voteCountElement.textContent = 0;

        // Send PATCH request to reset votes
        fetch(`http://localhost:3000/characters/${selectedCharacter.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ votes: 0 }),
        })
        .then(response => response.json())
        .then(updatedCharacter => {
            selectedCharacter.votes = updatedCharacter.votes;
        })
        .catch(error => console.error("Error resetting votes:", error));
    });
});
