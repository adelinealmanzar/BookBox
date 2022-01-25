const bookList = document.getElementById('books')
const title = document.getElementById('title')
const author = document.getElementById('author')
const pages = document.getElementById('pages')
const blurb = document.getElementById('blurb')
const coverImg = document.getElementById('cover')
const stars = document.getElementById('star-rating')
const reviewCount = document.getElementById('review-count')
const reviewListUl = document.getElementById('reviews-list')

fetch('http://localhost:3000/Books')
    .then(res => res.json())
    .then(books => {
        renderBookInfo(books[0])
        renderBookList(books)
    })

function renderBookInfo(book){
    let reviewTotal = book.reviews.reduce((total, review) => {
        return total += review.rating },0)

    title.textContent = book.title
    author.textContent = book.author
    pages.textContent = `${book.pages} pages`
    blurb.textContent = book.blurb
    coverImg.src = book.image
    stars.textContent = reviewTotal/book.reviews.length
    reviewCount.textContent = (book.reviews.length === 1) ? `${book.reviews.length} review` : `${book.reviews.length} reviews`
    let newDiv = document.createElement('div')
    removeAllChildren(reviewListUl)
    renderBookReviews(book)
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

        newDiv.append(newRatingP, newCommentP)
        reviewListUl.appendChild(newDiv)
    })
}

function renderBookList(booksArr) {
    booksArr.forEach(book => {
        let newBookLi = document.createElement('li')
        newBookLi.textContent = book.title
        newBookLi.id = book.id
        bookList.append(newBookLi)

        newBookLi.addEventListener('click', e => renderBookInfo(book))
    })
}