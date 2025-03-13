const myLibrary = [];

function Book(title, author, currentPage = 0, pages, status = "Reading", textArea = "") {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.currentPage = currentPage;
    this.status = status;
    this.textArea = textArea;
}

function addBookToLibrary(book) {
    myLibrary.push(book);
}

function displayBooks() {
    // We can safely remove this bookListContainer once we make it ourselves in the HTML
    // Some amount of pure page layout can fix code problems sometimes
    const bookListContainer = document.querySelector(".booklist");
    bookListContainer.innerHTML = "";

    myLibrary.forEach(book => {
        const bookDiv = document.createElement("div");
        bookDiv.classList.add("book");

        if (book.title || book.author || book.pages || book.status) {

            const titleElement = document.createElement("h3");
            titleElement.classList.add("book-title")
            titleElement.textContent = book.title;

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

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";

            const finishedButton = document.createElement("button");
            finishedButton.textContent = "Finished";

            // Textarea
            const notesElement = document.createElement("textarea");
            notesElement.placeholder = "Add your notes here..."
            notesElement.value = book.textArea; // If there's already a note, display it

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

    const totalBooks = myLibrary.length;
    const minSlots = 8;

    for (let i = totalBooks; i < minSlots; i++) {
        const placeholder = document.createElement("div");
        placeholder.classList.add("book-placeholder");
        bookListContainer.appendChild(placeholder);
    }
}

const book1 = new Book("The Hobbit", "J.R.R. Tolkien", 120, 310, "Reading", 
`This book is great!
My favorite part was when..

I also thought the characters..

Highly recommend it`);
const book2 = new Book("1984", "George Orwell", 328, 328, "Finished");

addBookToLibrary(book1);
addBookToLibrary(book2);

displayBooks();