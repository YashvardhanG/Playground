const containerElement = document.getElementById("container");
const btnAdd = document.getElementsByClassName("btn-add")[0];

function getAppStorage() {
    return JSON.parse(localStorage.getItem("yg-pg") || "[]");
}

getAppStorage().forEach(element => {
    const textElement = createTextElement(element.id, element.content);
    containerElement.insertBefore(textElement, btnAdd);
});

function createTextElement(id, content) {
    const textElement = document.createElement('textarea');
    textElement.classList.add('sticky');
    textElement.value = content;
    if (getAppStorage().length == 0 || getAppStorage().length == 1) {
        textElement.placeholder = 'First Note Tips 💡\n\nClick to type\nDouble Click to Delete\nNotes Auto-Saved\n\n\nMore Info press "\\"';
    }

    else {

        textElement.placeholder = 'Note is all yours!';
    }

    textElement.addEventListener("change", () => {
        updateNote(id, textElement.value);
    });

    textElement.addEventListener("dblclick", () => {
        const check = confirm("Delete this note?");
        if (check) {
            deleteNotes(id, textElement);
        }
    });

    textElement.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const caretStart = textElement.selectionStart;
            const caretEnd = textElement.selectionEnd;
            const text = textElement.value;
            const beforeCaret = text.substring(0, caretStart);
            const afterCaret = text.substring(caretEnd);
            const bulletText = "/b";
            const orderedText = "/o";

            if (beforeCaret.endsWith(bulletText)) {
                const newText = beforeCaret.slice(0, -bulletText.length) + "\n• " + afterCaret;
                textElement.value = newText;
                updateNote(id, newText);
                const newCaretStart = caretStart + 3;
                textElement.setSelectionRange(newCaretStart, newCaretStart);
            }

            else if (beforeCaret.endsWith(orderedText)) {
                const newText = beforeCaret.slice(0, -orderedText.length) + "\n1. " + afterCaret;
                textElement.value = newText;
                updateNote(id, newText);
                const newCaretStart = caretStart + 3;
                textElement.setSelectionRange(newCaretStart, newCaretStart);
            }

            else {
                const lines = beforeCaret.split('\n');
                const currentLine = lines[lines.length - 1];

                if (currentLine.trim() === "•") {
                    const newText = beforeCaret + "\n" + afterCaret;
                    textElement.value = newText;
                    updateNote(id, newText);
                    const newCaretStart = caretStart + 3;
                    textElement.setSelectionRange(newCaretStart, newCaretStart);

                }

                else if (currentLine.includes("•")) {
                    const newText = beforeCaret + "\n• " + afterCaret;
                    textElement.value = newText;
                    updateNote(id, newText);
                    const newCaretStart = caretStart + 3;
                    textElement.setSelectionRange(newCaretStart, newCaretStart);
                }

                else if (order(currentLine.trim())) {
                    const newText = beforeCaret + "\n" + afterCaret;
                    textElement.value = newText;
                    updateNote(id, newText);
                    const newCaretStart = caretStart + 1;
                    textElement.setSelectionRange(newCaretStart, newCaretStart);
                }

                else if (order(currentLine.substring(0, 2))) {
                    const currentNumber = parseInt(currentLine[0]);
                    const newNumber = currentNumber + 1;

                    const newText = beforeCaret + "\n" + newNumber + ". " + afterCaret;
                    textElement.value = newText;
                    updateNote(id, newText);
                    const newCaretStart = caretStart + 3;
                    textElement.setSelectionRange(newCaretStart, newCaretStart);
                }

                else {
                    const newText = beforeCaret + "\n" + afterCaret;
                    textElement.value = newText;
                    updateNote(id, newText);
                    const newCaretStart = caretStart + 1;
                    textElement.setSelectionRange(newCaretStart, newCaretStart);
                }
            }
        }
    });

    return textElement;
}

function order(line) {
    const pattern = /^[0-9]+\.$/;
    return pattern.test(line);
}

function addSticky() {
    const notes = getAppStorage();
    const noteObject = {
        id: Math.floor(Math.random() * 100000),
        content: ""
    }
    const textElement = createTextElement(noteObject.id, noteObject.content);
    containerElement.insertBefore(textElement, btnAdd);
    notes.push(noteObject);
    saveNotes(notes);
}

btnAdd.addEventListener('click', () => addSticky());
window.addEventListener("keyup", function (e) { if (e.keyCode === 219) { addSticky(); } });
window.addEventListener("keyup", function (e) { if (e.keyCode === 221) { deleteSticky(); } });
window.addEventListener("keyup", function (e) { if (e.keyCode === 220) { pop(); } });

function pop() {
    if (document.getElementById('myPopup').classList.contains("show")) {
        document.getElementById('myPopup').classList.remove("show");
    }

    else {
        document.getElementById('myPopup').classList.add("show");
    }
}

function deleteSticky() {
    if (getAppStorage().length > 0) {
        const check = confirm("Delete the last created note?");
        if (check) {
            const notes = getAppStorage();
            const lastNote = notes[notes.length - 1];
            const textElement = getLastTextarea();
            deleteNotes(lastNote.id, textElement);
        }
    }
}

function getLastTextarea() {
    const textElement = containerElement.querySelectorAll('textarea');
    if (textElement.length > 0) {
        return textElement[textElement.length - 1];
    }
    return null;
}

function saveNotes(notes) {
    localStorage.setItem("yg-pg", JSON.stringify(notes));
}


function updateNote(id, content) {
    const notes = getAppStorage();
    const updateElement = notes.filter((note) => note.id == id)[0];
    updateElement.content = content;
    saveNotes(notes);
}

function deleteNotes(id, textElement) {
    const notes = getAppStorage().filter((note) => note.id != id);
    saveNotes(notes);
    containerElement.removeChild(textElement);
}