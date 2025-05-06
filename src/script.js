class Book {
    constructor(title, author, currentPage = 0, pages, status = "Reading", textArea = "") {
        this.id = crypto.randomUUID();
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.currentPage = currentPage;
        this.status = status;
        this.textArea = textArea;
    }
}

class Library {
    constructor() {
        this.books = [];
        this.load();
    }

    add(book) {
        this.books.push(book);
        this.save();
    }

    remove(bookId) {
        this.books = this.books.filter(book => book.id !== bookId);
        this.save();
    }

    save() {
        localStorage.setItem("myLibrary", JSON.stringify(this.books));
    }

    load() {
        const stored = localStorage.getItem("myLibrary");
        if (stored) {
            this.books = JSON.parse(stored).map(book => Object.assign(new Book(), book));
        } else {
            this.add(new Book("Alice in Wonderland", "Lewis Carroll", 200, 200, "Finished", 
`This book is great!
My favorite part was when..

I also thought the characters..

Highly recommend it`));
            this.add(new Book("Harry Potter and the Sorcerer’s Stone", "J.K. Rowling", 200, 431, "Reading", "Still working through this one.."));
        }
    }

    getAll() {
        return this.books;
    }
}

class BookUI {
    constructor(library) {
        this.library = library;
        this.editBook = null;
        this.modalOverlay = document.querySelector(".modal-overlay");
        this.bookForm = document.getElementById("book-form");

        this.bindEvents();
        this.displayBooks();
    }

    bindEvents() {
        document.querySelector(".new-book").addEventListener("click", () => this.openAddModal());
        document.querySelector(".clear-all").addEventListener("click", () => this.clearAll());
        document.querySelector(".close-btn").addEventListener("click", () => this.closeModal());
        document.addEventListener("keydown", (e) => this.handleKeydown(e));
        this.bookForm.addEventListener("submit", (e) => this.saveBook(e));

        const currentPageInput = document.getElementById("currentPage");
        const pagesInput = document.getElementById("pages");

        pagesInput.addEventListener("input", function(event) {
            const totalPages = parseInt(event.target.value);
            if (!isNaN(totalPages) && totalPages > 0) {
                currentPageInput.setAttribute("max", totalPages);
                if (parseInt(currentPageInput.value) > totalPages) {
                    currentPageInput.value = totalPages;
                }
            } else {
                currentPageInput.removeAttribute("max");
            }
        });

        currentPageInput.addEventListener("input", function() {
            const maxPages = parseInt(currentPageInput.getAttribute("max"));
            const currentValue = parseInt(currentPageInput.value);
            if (!isNaN(currentValue) && currentValue > maxPages) {
                currentPageInput.value = maxPages;
            }
        });
    }

    handleKeydown(event) {
        if (event.key === "Escape") this.closeModal();
        else if (event.key === "Enter") this.bookForm.requestSubmit();
    }

    openAddModal() {
        this.bookForm.reset();
        document.querySelector(".modal-title").textContent = "Add New Book";
        this.editBook = null;
        this.openModal();
    }

    openEditModal(book) {
        const { title, author, pages, currentPage, status, textArea } = book;
        this.bookForm.title.value = title;
        this.bookForm.author.value = author;
        this.bookForm.pages.value = pages;
        this.bookForm.currentPage.value = currentPage;
        this.bookForm.status.value = status;
        this.bookForm.notes.value = textArea;
        this.editBook = book;
        document.querySelector(".modal-title").textContent = "Edit Book";
        this.openModal();
    }

    openModal() {
        this.modalOverlay.classList.add("show");
        document.body.classList.add("modal-open");
    }

    closeModal() {
        this.modalOverlay.classList.remove("show");
        document.body.classList.remove("modal-open");
    }

    clearAll() {
        const confirmation = confirm("Are you sure you want to clear all books?");
        if (confirmation) {
            this.library.books = [];
            localStorage.removeItem("myLibrary");
            this.displayBooks();
        }
    }

    saveBook(event) {
        event.preventDefault();
        const { title, author, pages, currentPage, status, notes } = this.bookForm;

        if (this.editBook) {
            Object.assign(this.editBook, {
                title: title.value,
                author: author.value,
                pages: pages.value,
                currentPage: currentPage.value || 0,
                status: status.value,
                textArea: notes.value
            });
        } else {
            const newBook = new Book(title.value, author.value, currentPage.value || 0, pages.value, status.value, notes.value);
            this.library.add(newBook);
        }

        this.library.save();
        this.displayBooks();
        this.bookForm.reset();
        this.closeModal();
        this.editBook = null;
    }

    displayBooks() {
        const container = document.querySelector(".booklist");
        container.innerHTML = "";

        this.library.getAll().forEach(book => {
            const div = document.createElement("div");
            div.classList.add("book");
            div.dataset.id = book.id;

            const title = this.createElement("h3", "book-title", book.title);
            title.title = book.title;
            const author = this.createElement("p", "book-author", book.author);
            const pages = this.createElement("p", "book-pages", `${book.currentPage} / ${book.pages} pg`);
            const status = this.createElement("p", "book-status", book.status);
            const notes = document.createElement("textarea");
            notes.placeholder = "Edit to add notes";
            notes.value = book.textArea;
            notes.readOnly = true;

            const buttons = this.createButtons(book);
            div.append(title, author, pages, status, notes, buttons);
            container.appendChild(div);
        });
    }

    createElement(tag, className, text) {
        const el = document.createElement(tag);
        el.className = className;
        el.textContent = text;
        return el;
    }

    createButtons(book) {
        const container = document.createElement("div");
        container.classList.add("button-container");

        const edit = document.createElement("button");
        edit.textContent = "Edit";
        edit.addEventListener("click", () => this.openEditModal(book));

        const remove = document.createElement("button");
        remove.textContent = "Delete";
        remove.addEventListener("click", () => {
            this.library.remove(book.id);
            this.displayBooks();
        });

        const toggle = document.createElement("button");
        toggle.textContent = book.status === "Finished" ? "Reading" : "Finished";
        toggle.addEventListener("click", () => {
            book.status = book.status === "Finished" ? "Reading" : "Finished";
            this.library.save();
            this.displayBooks();
        });

        container.append(edit, remove, toggle);
        return container;
    }
}

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
    const myLibrary = new Library();
    new BookUI(myLibrary);
});
