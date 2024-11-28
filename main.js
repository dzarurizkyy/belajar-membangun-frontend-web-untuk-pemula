    const books = []
    let bookIdToEdit = null
    const RENDER_EVENT = "render-book"
    const SAVED_EVENT = "saved-book"
    const STORAGE_KEY = "BOOKSHELF_APPS"
   
    document.addEventListener("DOMContentLoaded", function() {
        if(isStorageExist) {
            loadDataFromStorage()
        }

        const isComplete = document.getElementById("bookFormIsComplete")
        isComplete.addEventListener("change", function(event) {
            event.preventDefault()
            changeSubmitText(this.checked) 
        })
        
        const submitForm = document.getElementById("bookForm")
        submitForm.addEventListener("submit", function(event) {
            event.preventDefault()

            if(bookIdToEdit !== null) {
                updateBook()
            } else {
                addBook()
            }
        })

        const searchButton = document.getElementById("searchBook")
        searchButton.addEventListener("submit", function(event) {
            event.preventDefault()
            searchBookByTitle()
        })

        const resetButton = document.getElementById("resetSubmit")
        resetButton.addEventListener("click", function(event) {
            event.preventDefault()
            document.dispatchEvent(new Event(RENDER_EVENT))
        })
    })

    function changeSubmitText(isComplete) {
        const button = document.getElementById("bookFormSubmit")
        const text  = button.querySelector("span")
            
        if (isComplete) {
            text.innerText = "Selesai dibaca"
        } else {
            text.innerText = "Belum selesai dibaca"
        }
    }

    function generateId() {
        return String(+new Date())
    }

    function generateBookObject(id, title, author, year, isComplete) {
        return {
            id,
            title,
            author,
            year,
            isComplete
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
        const year = parseInt(document.getElementById("bookFormYear").value)
        const isComplete = document.getElementById("bookFormIsComplete").checked
        
        const bookObject = generateBookObject(id, title, author, year, isComplete)
        books.push(bookObject)

        document.dispatchEvent(new Event(RENDER_EVENT))
        saveData()
    }

    function makeBook(bookObject) {
        const title = document.createElement("h3")
        title.setAttribute("data-testid", "bookItemTitle")
        title.innerText = bookObject.title

        const author = document.createElement("p")
        author.setAttribute("data-testid", "bookItemAuthor")
        author.classList.add("bookAuthor")
        author.innerText = bookObject.author

        const year = document.createElement("p")
        year.setAttribute("data-testid", "bookItemYear")
        year.classList.add("bookYear")
        year.innerText = bookObject.year

        const textContainer = document.createElement("div")
        textContainer.append(title, author, year)

        const buttonContainer = document.createElement("div")
        
        const removeButton= document.createElement("button")
        removeButton.setAttribute("data-testid", "bookItemDeleteButton")
        removeButton.innerText = "Hapus buku"
        removeButton.classList.add("button")
        removeButton.addEventListener("click", function() {
            removeBook(bookObject.id)
        })

        const editButton = document.createElement("button")
        editButton.setAttribute("data-testid", "bookItemEditButton")
        editButton.innerText = "Edit buku"
        editButton.classList.add("button")
        editButton.addEventListener("click", function() {
            editForm(bookObject)
            document.getElementById("sectionTitle").innerText = "Edit Buku"
        })
        

        if(bookObject.isComplete) {
            const incompleteButton = document.createElement("button")
            incompleteButton.setAttribute("data-testid", "bookItemIsCompleteButton")
            incompleteButton.innerText = "Belum selesai dibaca"
            incompleteButton.classList.add("button")
            incompleteButton.addEventListener("click", function() {
                moveBookToIncomplete(bookObject.id)
            })
            buttonContainer.append(incompleteButton, removeButton, editButton)
        } else {
            const completeButton = document.createElement("button")
            completeButton.setAttribute("data-testid", "bookItemIsCompleteButton")
            completeButton.innerText = "Selesai dibaca" 
            completeButton.classList.add("button")
            completeButton.addEventListener("click", function() {
                moveBookToComplete(bookObject.id)
            })
            buttonContainer.append(completeButton, removeButton, editButton)
        }

        buttonContainer.classList.add("buttonContainer")

        const container = document.createElement("div")
        container.setAttribute("data-bookid", bookObject.id)
        container.setAttribute("data-testid", "bookItem")
        container.classList.add("bookContainer")
        container.append(textContainer, buttonContainer)
        
        return container
    }

    function moveBookToComplete(bookID) {
        const bookTarget = findBook(bookID)
        if(bookTarget === null) return
        bookTarget.isComplete = true
        document.dispatchEvent(new Event(RENDER_EVENT))
        saveData()
    }

    function moveBookToIncomplete(bookID) {
        const bookTarget = findBook(bookID)
        if(bookTarget === null) return
        bookTarget.isComplete = false
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

    function editForm(bookObject) {
        document.getElementById("bookFormTitle").value = bookObject.title
        document.getElementById("bookFormAuthor").value = bookObject.author
        document.getElementById("bookFormYear").value = bookObject.year
        document.getElementById("bookFormIsComplete").checked = bookObject.isComplete

        if(document.getElementById("bookFormIsComplete").checked) {
            changeSubmitText(true)
        } else {
            changeSubmitText(false)
        }

        bookIdToEdit = bookObject.id
    }

    function updateBook() {
        const title = document.getElementById("bookFormTitle").value
        const author = document.getElementById("bookFormAuthor").value
        const year = document.getElementById("bookFormYear").value
        const isComplete = document.getElementById("bookFormIsComplete").checked

        const index = findBookIndex(bookIdToEdit)
        
        if(index !== -1) {
            books[index] = generateBookObject(bookIdToEdit, title, author, year, isComplete)
            document.getElementById("sectionTitle").innerText = "Tambah Buku Baru"
            document.dispatchEvent(new Event(RENDER_EVENT))
            saveData()
        }

        bookIdToEdit = null
        document.getElementById("bookForm").reset()
        changeSubmitText(false)
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

    function searchBookByTitle() {
        const searchTitle = document.getElementById("searchBookTitle").value.toLowerCase()
        const incompleteBookList = document.getElementById("incompleteBookList")
        const completeBookList = document.getElementById("completeBookList")

        incompleteBookList.innerText = ""
        completeBookList.innerText = ""

        for(const book of books) {
            if(book.title.toLowerCase().includes(searchTitle)) {
                const bookElement = makeBook(book)
                if(book.isComplete) {
                    completeBookList.append(bookElement)
                } else {
                    incompleteBookList.append(bookElement)
                }
            }
        }
    }

    document.addEventListener(RENDER_EVENT, function() {
        const uncompletedBookList = document.getElementById("incompleteBookList")
        const completedBookList = document.getElementById("completeBookList")

        uncompletedBookList.innerHTML = ""
        completedBookList.innerHTML = ""

        for (const book of books) {
            const bookElement = makeBook(book)
            
            if(book.isComplete) {
                completedBookList.append(bookElement)
            } else {
                uncompletedBookList.append(bookElement)
            }
        }
    })

    document.addEventListener(SAVED_EVENT, function() {
        console.log(localStorage.getItem(STORAGE_KEY))
    })