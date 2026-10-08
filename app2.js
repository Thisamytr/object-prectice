"use strict"

class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}


class UI {
    addBookList(book) {
        const list = document.querySelector("#book-list");
        const row = document.createElement('tr');

         row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td class="delete">
                <span class="btn btn-danger">X</span>
            </td>
        `;

        list.appendChild(row);
    }

   clearField(){

        document.querySelector("#title").value = "";
        document.querySelector("#author").value = "";
        document.querySelector("#ISBN").value = "";

    }
    deleteBook(target)
    {
        if(target.className === "delete")
        {
            target.parentElement.remove();
        }
    }

    showAlert(message,className){
        this.clearAlert();
        const upperDiv = document.querySelector(".show-alert");
        const div =  document.createElement('div');
        div.className = `alert ${className}`;
        div.innerText = message;

        upperDiv.appendChild(div);

        setTimeout(()=>{
            document.querySelector(".alert").remove();
            this.clearAlert();
        },3000);
    }

    clearTasks()
    {
        document.querySelector("#book-list").innerHTML = "";
    }

    clearAlert()
    {
        const currentAlert = document.querySelector(".alert");

        if(currentAlert)
        {
            currentAlert.remove();
        }
    }


}


class Storage{
    getBooks()
    {
        let books;
        if(localStorage.getItem("books") === null)
        {
            books = [];
        }
        else{
            books = JSON.parse(localStorage.getItem("books"));
        }

        return books;
    
    }

    addBooks(book)
    {
        let books = this.getBooks();
        books.push(book);
        localStorage.setItem("books",JSON.stringify(books));
    }

    displayBooks()
    {
        let books = this.getBooks();

        const ui = new UI();
        books.forEach(book => {
            ui.addBookList(book);
        });
    }

    deleteBook(isbn)
    {
        let books = this.getBooks();

        books.forEach((book,index) => {

            if(book.isbn === isbn)
            {
                books.splice(index,1);
            }
            
        });

        localStorage.setItem("books",JSON.stringify(books));


    }

    clearAllBooks()
    {
        localStorage.removeItem("books");
    }
}


const storage = new Storage();
document.addEventListener("DOMContentLoaded",storage.displayBooks());

document.querySelector("#book-form").addEventListener("submit",(e)=>{

    e.preventDefault();
    
    const title =   document.querySelector("#title").value;
    const author =   document.querySelector("#author").value;
    const isbn =  document.querySelector("#ISBN").value;

    const ui = new UI();
    const book  = new Book(title,author,isbn);
    const storage = new Storage();

    if(title === "" || author === "" || isbn === ""
    )
    {
        ui.showAlert("Please Fill the Input Fileds...","alert-danger");
    }
    else
    {
        let bookExist = false;

        const books =  document.querySelectorAll("#book-list tr");
       
        for(let row of books)
        {
            const existTitle = row.querySelector("td:nth-child(1)").innerText;
            const existIsbn = row.querySelector("td:nth-child(3)").innerText;

            if(title === existTitle || isbn === existIsbn)
            {
                bookExist =true;
                break;
            }

        }

        if(bookExist)
        {
            ui.showAlert("Book with same name or isbn already exist","alert-danger");
            ui.clearField();
        }
        else
            
        {
            ui.addBookList(book);
            storage.addBooks(book);
            ui.showAlert("Book added succfully","alert-success");
            ui.clearField();
        }
    
    }
    

});


document.querySelector("#book-list").addEventListener("click",(e)=>{

   if(e.target.parentElement.className === "delete")
   {
    // console.log(e.target.parentElement.className);
    const ui = new UI();
    const storage = new Storage();

    ui.deleteBook(e.target.parentElement);

    const isbn = e.target.parentElement.previousElementSibling.innerText;
    // console.log(isbn);

    storage.deleteBook(isbn);

    ui.showAlert("Book deleted succfully", "alert-success");

   }



});

document.querySelector(".clear").addEventListener("click",()=>{
    const ui = new UI();
    const storage = new Storage();

    ui.clearTasks();
    storage.clearAllBooks();
    ui.showAlert("All Books Are Cleared from Book list","alert-success");

});