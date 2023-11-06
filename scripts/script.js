
$('.digit-group').find('input').each(function () {
    $(this).attr('maxlength', 1);
    $(this).on('keyup', function (e) {
        var parent = $($(this).parent());

        if (e.keyCode === 8 || e.keyCode === 37) {
            var prev = parent.find('input#' + $(this).data('previous'));

            if (prev.length) {
                $(prev).select();
            }
        } else if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 65 && e.keyCode <= 90) || (e.keyCode >= 96 && e.keyCode <= 105) || e.keyCode === 39) {
            var next = parent.find('input#' + $(this).data('next'));

            if (next.length) {
                $(next).select();
            } else {
                if (parent.data('autosubmit')) {
                    parent.submit();
                }
            }
        }
    });
});



function fetchLevel(level) {
    const url = `https://www.crack-the-code.com/code/${level}?time=${Date.now()}`; // Replace with the URL you want to fetch data from
    fetch(url, {
        method: 'GET', // You can specify the HTTP method here (e.g., GET, POST, etc.)
        mode: 'cors', // This indicates that it's a cross-origin request
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json(); // Assuming the response is in JSON format
        })
        .then((data) => {
            console.log(data);
            // Process the data
            localStorage.setItem("data", data);
            const guessCodeArr = data.guessCode;
            const numberToGuess = data.numberToGuess;
            const hints = data.hints;

            // Convert guessCode to a string
            const guessCode = guessCodeToString(guessCodeArr);
            localStorage.setItem("guessCode", guessCode);
            localStorage.setItem('currentCode', guessCode);

            currentCode = localStorage.getItem("currentCode");
            console.log("guessCode: ", guessCode); // Output: "021"
            console.log("currentCode: ", currentCode); // Output: "021"

            // Update the number of arrows and code input fields
            const arrowIncreaseCount = numberToGuess;
            const arrowDecreaseCount = numberToGuess;
            updateArrows(arrowIncreaseCount, arrowDecreaseCount);
            createHintElements(hints);
            createInputElements(guessCode);

            // Function to create input elements
            function createInputElements(guessCode) {
                const codeInputsContainer = document.getElementById("code-inputs");
                codeInputsContainer.innerHTML = "";

                for (let i = 1; i <= guessCode.length; i++) {
                    const input = document.createElement("input");
                    input.className = "input";
                    input.type = "number";
                    input.id = `digit_${i}`;
                    input.name = `digit_${i}`;

                    // Set data attributes for the next and previous inputs (if needed)
                    if (i < guessCode.length) {
                        input.setAttribute("data-next", `digit_${i + 1}`);
                    }
                    if (i > 1) {
                        input.setAttribute("data-previous", `digit_${i - 1}`);
                    }

                    // Add event listeners for input validation
                    input.onchange = () => checkCodeValue(i);
                    input.oninput = () => checkCodeValue(i);

                    codeInputsContainer.appendChild(input);
                }
            }

            function addSpacesBeforeCapitals(str) { return str.replace(/([A-Z])/g, ' $1'); }

            // Function to update the number of arrows
            function updateArrows(increaseCount, decreaseCount) {
                // Clear existing arrow elements
                const arrowIncreaseContainer = document.querySelector('.arrow-increase');
                const arrowDecreaseContainer = document.querySelector('.arrow-decrease');

                arrowIncreaseContainer.innerHTML = '';
                arrowDecreaseContainer.innerHTML = '';

                // Add increase arrows
                for (let i = 1; i <= increaseCount; i++) {
                    const arrowImg = document.createElement("img");
                    arrowImg.src = "./assets/code-arrow-up.png";
                    arrowImg.alt = `Increase ${i}`;
                    arrowImg.onclick = () => increase_code(i);
                    arrowIncreaseContainer.appendChild(arrowImg);
                }

                // Add decrease arrows
                for (let i = 1; i <= decreaseCount; i++) {
                    const arrowImg = document.createElement("img");
                    arrowImg.src = "./assets/code-arrow-down.png";
                    arrowImg.alt = `Decrease ${i}`;
                    arrowImg.onclick = () => decrease_code(i);
                    arrowDecreaseContainer.appendChild(arrowImg);
                }
            }

            // Function to create hint elements based on the hints data
            function createHintElements(hints) {
                const hintsContainer = document.getElementById("hints-container");
                hintsContainer.innerHTML = "";

                for (const hintKey in hints) {
                    if (hints.hasOwnProperty(hintKey)) {
                        const hintValue = hints[hintKey];

                        // <div class="hint-parent">
                        //     <div class="code-cont">
                        //         <span class="code">3</span>
                        //         <span class="code">3</span>
                        //         <span class="code">3</span>
                        //         <span class="code">3</span>
                        //     </div>

                        //     <div class="four-words-width-parag">
                        //         <p style="text-align: left;">
                        //             Two Numbers are Correct
                        //             but wrongly placed.
                        //             Two Numbers are Correct
                        //             but wrongly placed.
                        //         </p>
                        //     </div>
                        // </div>

                        // Create a hint element
                        const hintParent = document.createElement("div");
                        hintParent.classList.add("hint-parent");

                        // Create code container for hint value
                        const codeContainer = document.createElement("div");
                        codeContainer.classList.add("code-cont");
                        hintValue.forEach(value => {
                            const codeSpan = document.createElement("span");
                            codeSpan.classList.add("code");
                            codeSpan.textContent = value;
                            codeContainer.appendChild(codeSpan);
                        });

                        // Create paragraph for hint key
                        const fourWordsParag = document.createElement("div");
                        fourWordsParag.classList.add("four-words-width-parag");

                        const parag = document.createElement("p");
                        parag.style.textAlign = "left";
                        const stringWithSpaces = addSpacesBeforeCapitals(hintKey);
                        parag.textContent = stringWithSpaces;
                        fourWordsParag.appendChild(parag)

                        hintParent.appendChild(codeContainer);
                        hintParent.appendChild(fourWordsParag);

                        hintsContainer.appendChild(hintParent);
                    }
                }
            }
        })
        .catch((error) => {
            console.error("There was a problem with the fetch operation:", error);
        });
}


document.querySelector('.selected-option').addEventListener('click', function () {
    const dropdownContent = document.querySelector('.dropdown-content');
    dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
});

const dropdownImages = document.querySelectorAll('.dropdown-content img');
dropdownImages.forEach(img => {
    img.addEventListener('click', function () {
        const selectedOption = document.querySelector('.selected-option img');
        selectedOption.src = this.src;
    });
});



function increase_code(index) {
    let old_value = Number(document.getElementById(`digit_${index}`).value);
    document.getElementById(`digit_${index}`).value = old_value + 1;
    if (document.getElementById(`digit_${index}`).value >= 9) document.getElementById(`digit_${index}`).value = 9;
}

function decrease_code(index) {
    let old_value = Number(document.getElementById(`digit_${index}`).value);
    document.getElementById(`digit_${index}`).value = old_value - 1;
    if (document.getElementById(`digit_${index}`).value <= 0) document.getElementById(`digit_${index}`).value = 0;
}

function checkCodeValue(index) {
    if (document.getElementById(`digit_${index}`).value.length > 1) document.getElementById(`digit_${index}`).value = document.getElementById(`digit_${index}`).value.at(1);
    if (document.getElementById(`digit_${index}`).value >= 9) document.getElementById(`digit_${index}`).value = 9;
    if (document.getElementById(`digit_${index}`).value <= 0) document.getElementById(`digit_${index}`).value = 0;
}



let data = localStorage.getItem("data");
let guessCode = localStorage.getItem("guessCode");
let currentCode = localStorage.getItem("currentCode");
// localStorage.setItem("level", 1)
// localStorage.setItem("score", 1)
let level = localStorage.getItem("level") || 1;
let score = localStorage.getItem("score") || 0;
console.log("data:", data);
console.log("guessCode:", guessCode);
console.log("currentCode:", currentCode);
console.log("level:", level);
console.log("score:", score);
setPage();

function setPage() {
    let level = localStorage.getItem("level");
    console.log("heeeeeere level: ", level);

    fetchLevel(level);

    const inputCount = guessCode; // Change this to match the number of input fields you have
    currentCode = guessCode;
    console.log("currentCode: ", currentCode);
    console.log("guessCode: ", guessCode);

    for (let i = 1; i <= inputCount.toString().length; i++) {
        document.getElementById(`digit_${i}`).value = 0;
    }

    let scoreEle = document.getElementById("score");
    scoreEle.innerHTML = localStorage.getItem("score");

    let levelEle = document.getElementById("level");
    levelEle.innerHTML = localStorage.getItem("level");
}


function guessCodeToString(guessCode) {
    // Create an array of string representations of the numbers
    const stringArray = guessCode.map(num => num.toString());
    // Join the string array into a single string
    const guessString = stringArray.join("");
    return guessString;
}


function generateRandomNumber() {
    // Generate a random number between 10000 and 99999
    const randomNumber = Math.floor(Math.random() * 90000) + 10000;
    // Convert the number to a string
    const randomString = randomNumber.toString();
    return randomString;
}


function correct() {
    console.log("CORRECT");
    document.getElementById("congrats").classList.add("visible");
    setInterval(() => {
        document.getElementById("congrats").classList.remove("visible");
    }, 1000);

    level = localStorage.getItem("level");
    score = localStorage.getItem("score");

    localStorage.setItem("score", Number(score) + 115)
    levelEle = document.getElementById("level")
    scoreEle = document.getElementById("score")
    scoreEle.innerHTML = localStorage.getItem("score")


    console.log(level);
    let newLevel = Number(level) + 1
    localStorage.setItem("level", newLevel);
    localStorage.setItem("chance", 1);
    levelEle.innerHTML = localStorage.getItem("level")
    console.log(localStorage.getItem("level"));

    fetchLevel(localStorage.getItem("level"))

    guessCode = localStorage.getItem("guessCode"); // Change this to match the number of input fields you have
    console.log("guessCode: ", guessCode);

    let inputCount = guessCode;
    for (let i = 1; i <= inputCount.toString().length; i++) {
        document.getElementById(`digit_${i}`).value = 0;
    }
}

function wrong() {
    console.log("WRONG");

    document.getElementById("wrong-banner").classList.add("visible");
    setInterval(() => {
        document.getElementById("wrong-banner").classList.remove("visible");
    }, 1000);

    console.log(currentCode);
}

function checkCodeAnswer() {
    console.log("level: ", level);
    guessCode = localStorage.getItem("guessCode");
    const inputCount = guessCode; // Change this to match the number of input fields you have
    let finalAnswer = "";

    for (let i = 1; i <= inputCount.toString().length; i++) {
        const inputElement = document.getElementById(`digit_${i}`).value;
        finalAnswer += inputElement;
    }

    console.log("finalAnswer: ", finalAnswer);
    console.log("currentCode: ", localStorage.getItem('currentCode'));

    console.log(typeof finalAnswer);
    console.log(typeof localStorage.getItem('currentCode'));

    let correctAnswer = Number(localStorage.getItem('currentCode')) == Number(finalAnswer);
    if (correctAnswer) {
        correct();
    } else {
        wrong();
    }
}

function reset() {
    let chance = localStorage.getItem("chance");
    if (chance == null) {
        localStorage.setItem("chance", 1);
        chance = localStorage.getItem("chance");
    }

    localStorage.setItem("chance", chance - 1)
    if (chance == 1) {
        localStorage.setItem("chance", 0);
        setPage();
    }

    if (chance == 0) {
        localStorage.setItem("chance", 1);
        localStorage.setItem("score", localStorage.getItem("score") - 115);
        localStorage.setItem("level", localStorage.getItem("level") - 1);
        setPage()
    }

}


// Get the paragraph element
const parags = document.getElementsByClassName("four-words-width-parag");

Object.entries(parags).forEach(([key, value]) => {
    let parag = value.children[0];

    // Define the maximum number of characters per line
    const maxCharsPerLine = 75;

    // Split the text content into words
    const words = parag.textContent.split(' ');

    // Initialize variables to keep track of the current line and current line length
    let currentLine = '';
    let currentLineLength = 0;
    parag.innerHTML = '';

    // Iterate through the words and construct lines
    words.forEach(word => {
        if (currentLineLength + word.length <= maxCharsPerLine) {
            // Add the word to the current line
            currentLine += word + ' ';
            currentLineLength += word.length + 1; // Add 1 for the space
        } else {
            // Add a line break, and start a new line
            parag.innerHTML += currentLine + '<br>';
            currentLine = word + ' ';
            currentLineLength = word.length + 1;
        }
    });

    // Add any remaining content
    parag.innerHTML += currentLine;
})


