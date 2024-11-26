const books = []
const RENDER_EVENT = "render-book"

document.addEventListener("DOMContentLoaded", function() {
    const submitForm = document.getElementById("bookForm")
    submitForm.addEventListener("submit", function(event) {
        event.preventDefault()
        addBook()
    })
})

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

function addBook() {
    const id = generateId()
    const title = document.getElementById("bookFormTitle").value
    const author = document.getElementById("bookFormAuthor").value
    const year = document.getElementById("bookFormYear").value
    const isCompleted = document.getElementById("bookFormIsComplete").checked
    
    const bookObject = generateBookObject(id, title, author, year, isCompleted)
    books.push(bookObject)

    document.dispatchEvent(new Event(RENDER_EVENT))
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

    const container = document.createElement("div")
    container.append(textContainer)
    container.setAttribute("id", `book-${bookObject.id}`)

    return container
}

document.addEventListener(RENDER_EVENT, function() {
    const uncompletedBookList = document.getElementById("incompleteBookList")
    uncompletedBookList.innerHTML = ""

    for (const book of books) {
        const bookElement = makeBook(book)
        uncompletedBookList.append(bookElement)
    }
})

