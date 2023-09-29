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
    if (getAppStorage().length == 0) {
        textElement.placeholder = 'First Note Tips 💡\n\nClick to type\nEnter after /b for list\nDouble Click to Delete';
    }

    else {

        textElement.placeholder = 'Note is all yours!';
    }

    textElement.addEventListener("change", () => {
        updateNote(id, textElement.value);
    });

    textElement.addEventListener("dblclick", () => {
        const check = confirm("Are You Sure to Delete ?");
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

            if (beforeCaret.endsWith(bulletText)) {
                const newText = beforeCaret.slice(0, -bulletText.length) + "\n• " + afterCaret;
                textElement.value = newText;
                updateNote(id, newText);
                const newCaretStart = caretStart + 3;
                textElement.setSelectionRange(newCaretStart, newCaretStart);
            } else {
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