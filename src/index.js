const bookList = document.getElementById('books')
const title = document.getElementById('title')
const author = document.getElementById('author')
const pages = document.getElementById('pages')
const blurb = document.getElementById('blurb')
const coverImg = document.getElementById('cover')
const stars = document.getElementById('star-rating')
const reviewCount = document.getElementById('review-count')

fetch('http://localhost:3000/Books')
    .then(res => res.json())
    .then(books => {
        renderBook(books[0])
        books.forEach(book => {
            let newBookLi = document.createElement('li')
            newBookLi.textContent = book.title
            newBookLi.id = book.id
            bookList.append(newBookLi)

            newBookLi.addEventListener('click', e => renderBook(book))
        })
    })

function renderBook(book){
    let reviewTotal = book.reviews.reduce((total, review) => {
        return total += review.rating },0)

    title.textContent = book.title
    author.textContent = book.author
    pages.textContent = `${book.pages} pages`
    blurb.textContent = book.blurb
    coverImg.src = book.image
    stars.textContent = reviewTotal/book.reviews.length
    reviewCount.textContent = (book.reviews.length === 1) ? `${book.reviews.length} review` : `${book.reviews.length} reviews`
}