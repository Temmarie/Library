// Book Class: Represents a Book
class Book { //eslint-disable-line
  constructor(title, author, pages) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read; //eslint-disable-line
  }
}

// UI Class: Handle UI Tasks
class UI {
  static displayBooks() {
    const books = Store.getBooks(); //eslint-disable-line

    books.forEach((book) => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.querySelector('#book-list');
    const row = document.createElement('tr');
    book.read = document.getElementById('read').checked;

    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.pages}</td>
      <td> <button class="btn btn-info" id="status"> ${book.read} </button></td>
      <td><a href="#" class="btn btn-danger btn-sm delete">Delete</a></td>
    `;

    list.appendChild(row);
    document.querySelector('body').addEventListener('click', (e) => {
      if (e.target.id === 'status') {
        e.preventDefault();
        if (book.read === false) {
          book.read = true;
          e.target.innerHTML = 'true';
        } else {
          book.read = false;
          e.target.innerHTML = 'false';
        }
      }
    });
  }

  static deleteBook(el) {
    if (el.classList.contains('delete')) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    container.insertBefore(div, form);

    // Vanish in 3 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 3000);
  }

  static clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#pages').value = '';
    document.querySelector('#read').checked = false;
  }
}

// Store Class: Handles Storage
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(title) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if (book.title === title) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
}

// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
  // Prevent actual submit
  e.preventDefault();

  // Get form values
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const pages = document.querySelector('#pages').value;
  const read = document.querySelector('#read').value;

  // Validate
  if (title === '' || author === '' || pages === '') {
    UI.showAlert('Please fill in all fields', 'danger');
  } else {
    // Instatiate book
    const book = new Book(title, author, pages, read);

    // Add Book to UI
    UI.addBookToList(book);

    // Add book to store
    Store.addBook(book);

    // Show success message
    UI.showAlert('Book Added', 'success');

    // Clear fields
    UI.clearFields();
  }
});

// Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {
  // Remove book from UI
  UI.deleteBook(e.target);

  // Remove book from store
  Store.removeBook(e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent); //eslint-disable-line

  // Show success message
  UI.showAlert('Book Removed', 'success');
});