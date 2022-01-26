const bookList = document.getElementById('books')
const title = document.getElementById('title')
const author = document.getElementById('author')
const pages = document.getElementById('pages')
const blurb = document.getElementById('blurb')
const coverImg = document.getElementById('cover')
const stars = document.getElementById('star-rating')
const reviewCount = document.getElementById('review-count')
const reviewListUl = document.getElementById('reviews-list')
const form = document.querySelector('form')

fetch('http://localhost:3000/Books')
    .then(res => res.json())
    .then(books => {
        renderBookInfo(books[0])
        renderBookList(books)
    })

function renderBookInfo(book){


    title.textContent = book.title
    title.name = book.id
    author.textContent = book.author
    pages.textContent = `${book.pages} pages`
    blurb.textContent = book.blurb
    coverImg.src = book.image

    renderReviewAvg(book)
    removeAllChildren(reviewListUl)
    renderBookReviews(book)
}

function renderReviewAvg(bookObj) {
    let reviewTotal = bookObj.reviews.reduce((total, review) => {
        return total += review.rating },0)
    stars.textContent = `${(reviewTotal/bookObj.reviews.length).toFixed(1)} out of 5`
    reviewCount.textContent = (bookObj.reviews.length === 1) ? `${bookObj.reviews.length} review` : `${bookObj.reviews.length} reviews`
}

function removeAllChildren(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild)
    }
}

function renderBookReviews(book) {
    book.reviews.forEach(review => {
        let newDiv = document.createElement('div')

        let newRatingP = document.createElement('p')
        newRatingP.textContent = `${review.rating} stars`

        let newCommentP = document.createElement('p') //TODO: maybe global scope
        newCommentP.textContent = `Comment: ${review.comment}`

        let deleteButton = document.createElement('button')
        deleteButton.textContent =' X '
        let commentIndex = book.reviews.map(element => element.comment).indexOf(review.comment)
        
        deleteButton.addEventListener('click', e => {
            newReviewsArray = book.reviews.slice(0,commentIndex).concat(book.reviews.slice(commentIndex + 1, book.reviews.length))

            // Patch new book object with newly-created reviews array
            postNewBookRating(mkBookObjToPatch(newReviewsArray, book))
            e.target.parentNode.remove()

            renderReviewAvg(mkBookObjToPatch(newReviewsArray, book))
        })

        newDiv.append(newRatingP, newCommentP, deleteButton)
        reviewListUl.appendChild(newDiv)
    })
}
function postNewBookRating(obj) {
    fetch(`http://localhost:3000/Books/${obj.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    })
    .then(res => res.json())
    .then(data => {
        console.log(data)
    })
}

function mkBookObjToPatch(reviewsArr, book) {
    let wholeBookObj = {
        "id": book.id,
        "title": book.title,
        "author": book.author,
        "genre": book.genre,
        "pages": book.pages,
        "blurb": book.blurb,
        "image": book.image,
        "reviews": reviewsArr
    }
    return wholeBookObj
}

function renderBookList(booksArr) {
    booksArr.forEach(book => {
        let newBookLi = document.createElement('li')
        newBookLi.textContent = book.title

        let bookID = book.id
        newBookLi.id = bookID
        bookList.append(newBookLi)

        newBookLi.addEventListener('click', e => renderBookInfo(book))
    })
}



form.addEventListener('submit', e => {
    e.preventDefault()
    let ratingInputValue = e.target.querySelector('input').value
    let commentInputValue = e.target.querySelector('textarea').value

    let newReviewObj = {
        "rating": parseInt(ratingInputValue, 10),
        "comment": commentInputValue
    }

    fetch(`http://localhost:3000/Books/${title.name}`)
    .then(res => res.json())
    .then(book => { 
       book.reviews.unshift(newReviewObj)
       let bookReviewsArr = book.reviews
       console.log(book.reviews)

    postNewBookRating(mkBookObjToPatch(bookReviewsArr, book))
    renderBookInfo(book)
    })
})

