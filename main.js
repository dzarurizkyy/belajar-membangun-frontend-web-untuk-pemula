    const books = []
    const RENDER_EVENT = "render-book"
    const SAVED_EVENT = "saved-book"
    const STORAGE_KEY = "BOOKSHELF_APPS"

    document.addEventListener("DOMContentLoaded", function() {
        if(isStorageExist) {
            loadDataFromStorage()
        }

        const isCompleted = document.getElementById("bookFormIsComplete")
        isCompleted.addEventListener("change", function(event) {
            event.preventDefault()
            changeSubmitText(this.checked)
        })
        
        const submitForm = document.getElementById("bookForm")
        submitForm.addEventListener("submit", function(event) {
            event.preventDefault()
            addBook()
        })
    })

    function changeSubmitText(isCompleted) {
        const button = document.getElementById("bookFormSubmit")
        const text  = button.querySelector("span")
        
        if (isCompleted) {
            text.innerText = "Selesai dibaca"
        } else {
            text.innerText = "Belum selesai dibaca"
        }
    }

    function generateId() {
        return String(+new Date())
    }

    function generateBookObject(id, title, author, year, isCompleted) {
        return {
            id,
            title,
            author,
            year,
            isCompleted
        }
    }

    function findBook(bookID) {
        for(const book of books) {
            if(book.id === bookID) {
                return book
            }
        }
        return
    }

    function findBookIndex(bookID) {
        for(let index = 0; index < books.length; index++) {
            if(books[index].id === bookID) {
                return index
            }
        }
        return -1
    }

    function addBook() {
        const id = generateId()
        const title = document.getElementById("bookFormTitle").value
        const author = document.getElementById("bookFormAuthor").value
        const year = document.getElementById("bookFormYear").value
        const isCompleted = document.getElementById("bookFormIsComplete").checked
        
        const bookObject = generateBookObject(id, title, author, year, isCompleted)
        books.push(bookObject)

        document.dispatchEvent(new Event(RENDER_EVENT))
        saveData()
    }

    function makeBook(bookObject) {
        const title = document.createElement("h3")
        title.innerText = bookObject.title

        const author = document.createElement("p")
        author.innerText = bookObject.author

        const year = document.createElement("p")
        year.innerText = bookObject.year

        const textContainer = document.createElement("div")
        textContainer.append(title, author, year)

        const buttonContainer = document.createElement("div")
        
        const removeButton= document.createElement("button")
        removeButton.addEventListener("click", function() {
            removeBook(bookObject.id)
        })

        removeButton.innerText = "Hapus buku"

        if(bookObject.isCompleted) {
            const incompleteButton = document.createElement("button")
            incompleteButton.innerText = "Belum selesai dibaca"
            incompleteButton.addEventListener("click", function() {
                moveBookToIncomplete(bookObject.id)
            })
            buttonContainer.append(incompleteButton, removeButton)
        } else {
            const completeButton = document.createElement("button")
            completeButton.innerText = "Selesai dibaca" 
            completeButton.addEventListener("click", function() {
                moveBookToComplete(bookObject.id)
            })
            buttonContainer.append(completeButton, removeButton)
        }

        const container = document.createElement("div")
        container.append(textContainer, buttonContainer)
        container.setAttribute("id", `book-${bookObject.id}`)

        return container
    }

    function moveBookToComplete(bookID) {
        const bookTarget = findBook(bookID)
        if(bookTarget === null) return
        bookTarget.isCompleted = true
        document.dispatchEvent(new Event(RENDER_EVENT))
        saveData()
    }

    function moveBookToIncomplete(bookID) {
        const bookTarget = findBook(bookID)
        if(bookTarget === null) return
        bookTarget.isCompleted = false
        document.dispatchEvent(new Event(RENDER_EVENT))
        saveData()
    }

    function removeBook(bookID) {
        const bookTarget = findBookIndex(bookID)
        if(bookTarget === -1) return
        books.splice(bookTarget, 1)
        document.dispatchEvent(new Event(RENDER_EVENT))
        saveData()
    }

    function saveData(){
        if(isStorageExist()) {
            const parsed = JSON.stringify(books)
            localStorage.setItem(STORAGE_KEY, parsed)
            document.dispatchEvent(new Event(SAVED_EVENT))
        }
    }   
    
    function isStorageExist() {
        if(typeof(Storage) === undefined){
            alert("Browser kamu tidak mendukung local storage")
            return false
        }

        return true
    }

    function loadDataFromStorage() {
        const serializedData = localStorage.getItem(STORAGE_KEY)
        let data = JSON.parse(serializedData)

        if(data !== null) {
            for(const book of data) {
                books.push(book)
            }
        }

        document.dispatchEvent(new Event(RENDER_EVENT))
    }

    document.addEventListener(RENDER_EVENT, function() {
        const uncompletedBookList = document.getElementById("incompleteBookList")
        const completedBookList = document.getElementById("completeBookList")

        uncompletedBookList.innerHTML = ""
        completedBookList.innerHTML = ""

        for (const book of books) {
            const bookElement = makeBook(book)
            
            if(book.isCompleted) {
                completedBookList.append(bookElement)
            } else {
                uncompletedBookList.append(bookElement)
            }
        }
    })

    document.addEventListener(SAVED_EVENT, function() {
        console.log(localStorage.getItem(STORAGE_KEY))
    })