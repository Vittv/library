const myLibrary = [];

// Book constructor
function Book(title, author, currentPage = 0, pages, status = "Reading", textArea = "") {
    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.currentPage = currentPage;
    this.status = status;
    this.textArea = textArea;
}

// Add book to library and save to localStorage
function addBookToLibrary(book) {
    myLibrary.push(book);
    saveToLocalStorage();
}

// Save to localStorage
function saveToLocalStorage() {
    localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
}

// Load from localStorage and initialize default books if necessary
function loadLibraryFromStorage() {
    const storedLibrary = localStorage.getItem("myLibrary");
    if (storedLibrary) {
        myLibrary.push(...JSON.parse(storedLibrary));
    } else {
        // If no saved books, initialize with defaults
        const book1 = new Book("Alice in Wonderland", "Lewis Carroll", 200, 200, "Finished", 
`This book is great!
My favorite part was when..

I also thought the characters..

Highly recommend it`);
        const book2 = new Book("Harry Potter and the Sorcerer’s Stone", "J.K. Rowling", 200, 431, "Reading", `Still working through this one..`);

        myLibrary.push(book1, book2);
        saveToLocalStorage();
    }
}

// Load library when page loads
document.addEventListener("DOMContentLoaded", () => {
    loadLibraryFromStorage();
    displayBooks();
});

// Most buttons
document.addEventListener("DOMContentLoaded", () => {
    const modalOverlay = document.querySelector(".modal-overlay");
    const newBookButton = document.querySelector(".new-book");
    const clearAllButton = document.querySelector(".clear-all");

    const closeButton = document.querySelector(".close-btn");
    const bookForm = document.getElementById("book-form");

    // Show modal
    newBookButton.addEventListener("click", () => {
        modalOverlay.classList.add("show");
        document.body.classList.add("modal-open");
        document.querySelector(".modal-title").textContent = "Add New Book";

        bookForm.reset();

        editBook = null;
    });

    // Close modal
    closeButton.addEventListener("click", () => {
        closeModal();
    });

    // Enter and Escape events
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeModal();
        } else if (event.key === "Enter") {
            saveBook();
        }
    });

    // Clear all
    clearAllButton.addEventListener("click", () => {
        const confirmation = confirm("Are you sure you want to clear all books?");
        if (confirmation) {
            myLibrary.length = 0;
            localStorage.removeItem("myLibrary");
            displayBooks();
        }
    });

    function closeModal() {
        modalOverlay.classList.remove("show");
        document.body.classList.remove("modal-open");
    }

    // Handle form submission
    bookForm.addEventListener("submit", saveBook);
    function saveBook(event) {
        event.preventDefault();
        closeModal();
    
        const title = document.getElementById("title").value;
        const author = document.getElementById("author").value;
        const pages = document.getElementById("pages").value;
        const currentPage = document.getElementById("currentPage").value || 0;
        const status = document.getElementById("status").value;
        const notes = document.getElementById("notes").value;

        if (editBook) {
            // If editing an existing book
            editBook.title = title;
            editBook.author = author;
            editBook.pages = pages;
            editBook.currentPage = currentPage;
            editBook.status = status;
            editBook.textArea = notes;
    
            editBook = null; // Reset after saving
        } else {
            // If adding a new book
            const newBook = new Book(title, author, currentPage, pages, status, notes);
            addBookToLibrary(newBook);
        }
    
        saveToLocalStorage();
        displayBooks(); // Re-render the list of books
        bookForm.reset(); // Clear the form
    }
});

let editBook = null;

document.addEventListener("DOMContentLoaded", function () {
    const currentPageInput = document.getElementById("currentPage");
    const pagesInput = document.getElementById("pages");

    // When the user changes the total pages (pages input), update the max value for currentPage
    pagesInput.addEventListener("input", function(event) {
        const totalPages = parseInt(event.target.value);
    
        // Update max of currentPage input dynamically
        if (!isNaN(totalPages) && totalPages > 0) {
            currentPageInput.setAttribute("max", totalPages);
    
            if (parseInt(currentPageInput.value) > totalPages) {
                currentPageInput.value = totalPages;
            }
        } else {
            // If pages input is invalid, reset max
            currentPageInput.removeAttribute("max");
        }
    });
    
    // Prevent the user from typing a number of current pages bigger than total pages
    currentPageInput.addEventListener("input", function(event) {
        const maxPages = parseInt(currentPageInput.getAttribute("max"));
        const currentValue = parseInt(currentPageInput.value);
    
        // If the entered value is greater than the max, reset to max
        if (!isNaN(currentValue) && currentValue > maxPages) {
            currentPageInput.value = maxPages;
        }
    });
})

function openEditModal(book) {
    const modalOverlay = document.querySelector(".modal-overlay");
    const modalTitle = document.querySelector(".modal-title");
    const modalButton = document.querySelector(".submit-btn");

    modalTitle.textContent = "Edit Book";
    modalButton.textContent = "Save";

    document.getElementById("title").value = book.title;
    document.getElementById("author").value = book.author;
    document.getElementById("pages").value = book.pages;
    document.getElementById("currentPage").value = book.currentPage;
    document.getElementById("status").value = book.status;
    document.getElementById("notes").value = book.textArea;

    // Set the max of currentPage based on total pages when the page input changes
    const currentPageInput = document.getElementById("currentPage");
    const pagesInput = document.getElementById("pages");
    currentPageInput.setAttribute("max", pagesInput.value);

    editBook = book;

    modalOverlay.classList.add("show");
    document.body.classList.add("modal-open");
}

// Display the books
function displayBooks() {
    const bookListContainer = document.querySelector(".booklist");
    bookListContainer.innerHTML = "";

    myLibrary.forEach((book) => {
        const bookDiv = document.createElement("div");
        bookDiv.classList.add("book");
        bookDiv.dataset.id = book.id;

        if (book.title || book.author || book.pages || book.status) {

            const titleElement = document.createElement("h3");
            titleElement.classList.add("book-title")
            titleElement.textContent = book.title;
            titleElement.setAttribute("title", book.title);

            const authorElement = document.createElement("p");
            authorElement.classList.add("book-author");
            authorElement.textContent = `${book.author}`;

            const pagesElement = document.createElement("p");
            pagesElement.classList.add("book-pages");
            pagesElement.textContent = `${book.currentPage} / ${book.pages} pg`;

            const statusElement = document.createElement("p");
            statusElement.classList.add("book-status")
            statusElement.textContent = `${book.status}`;

            const textArea = document.createElement("textarea");
            textArea.classList.add("book-textarea");
            textArea.textContent = `${book.textArea}`;

            const buttonContainer = document.createElement("div");
            buttonContainer.classList.add("button-container");

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.addEventListener("click", () => openEditModal(book));

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", () => {
                const bookId = book.id;
                myLibrary.splice(myLibrary.findIndex(b => b.id === bookId), 1);
                saveToLocalStorage();
                displayBooks();
            })

            const finishedButton = document.createElement("button");
            finishedButton.textContent = book.status === "Finished" ? "Reading" : "Finished";

            finishedButton.addEventListener("click", () => {
                if (book.status === "Finished") {
                    book.status = "Reading";
                    finishedButton.textContent = "Finished";
                } else {
                    book.status = "Finished";
                    finishedButton.textContent = "Reading";
                }
                saveToLocalStorage();
                displayBooks();
            })

            // Textarea
            const notesElement = document.createElement("textarea");
            notesElement.id = crypto.randomUUID();
            notesElement.placeholder = "Edit to add notes";
            notesElement.value = book.textArea; // If there's already a note, display it
            notesElement.readOnly = true;

            buttonContainer.appendChild(editButton);
            buttonContainer.appendChild(deleteButton);
            buttonContainer.appendChild(finishedButton);

            bookDiv.appendChild(titleElement);
            bookDiv.appendChild(authorElement);
            bookDiv.appendChild(pagesElement);
            bookDiv.appendChild(statusElement);
            bookDiv.appendChild(notesElement);
            bookDiv.appendChild(buttonContainer);
        }
        bookListContainer.appendChild(bookDiv);
    });
}
