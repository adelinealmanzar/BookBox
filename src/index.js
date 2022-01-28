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
let commentInput = document.querySelector('#comment-input')

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
    let averageCalc = (reviewTotal/bookObj.reviews.length)
    stars.textContent = `${averageCalc.toFixed(1)} out of 5`
    reviewCount.textContent = (bookObj.reviews.length === 1) ? `${bookObj.reviews.length} review` : `${bookObj.reviews.length} reviews`

    fillStarsBasedOnRating(averageCalc)
}

function fillStarsBasedOnRating(avgCalc) {
    const starIcons = document.querySelector('.star-icons')

    let roundedCalc = Math.round(avgCalc)
    switch (roundedCalc) {
        case 1:
            starIcons.textContent = "★☆☆☆☆";
            break;
        case 2:
            starIcons.textContent = "★★☆☆☆";
            break;
        case 3:
            starIcons.textContent = "★★★☆☆";
            break;
        case 4:
            starIcons.textContent = "★★★★☆";
            break;
        case 5:
            starIcons.textContent = "★★★★★";
            break;
    }
}

function removeAllChildren(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild)
    }
}



function renderBookReviews(book) {
    book.reviews.forEach(review => {
        let newDiv = document.createElement('div')
        newDiv.classList = 'comment-div'

        let newRatingP = document.createElement('p')
        newRatingP.textContent = `${review.rating} stars`

        let newCommentP = document.createElement('p')
        newCommentP.textContent = review.comment
        newCommentP.classList = 'comment-p'

        let deleteButton = document.createElement('button')
        deleteButton.textContent =' X '
        deleteButton.classList = 'btn'
        
        deleteButton.addEventListener('click', e => {
            updateDBWithDelete(e, book, review)
            renderReviewAvg(mkBookObjToPatch(newReviewsArray, book))
        })

        // Function to double click
        newCommentP.addEventListener('dblclick', e => {
            e.preventDefault()
            let toEditComment = e.target.innerText
            let toEditRating = e.target.previousSibling.innerText[0]

            commentInput.value = toEditComment
            document.querySelector('input').value = parseInt(toEditRating)

            e.target.parentNode.remove()
            updateDBWithDelete(e, book, review)
        })

        newDiv.append(newRatingP, newCommentP, deleteButton)
        reviewListUl.appendChild(newDiv)
    })
}


function updateDBWithDelete(e, book, review) {
    let commentIndex = book.reviews.map(element => element.comment).indexOf(review.comment)
    newReviewsArray = book.reviews.slice(0,commentIndex).concat(book.reviews.slice(commentIndex + 1, book.reviews.length))

    // Patch new book object with newly-created reviews array
    postNewBookRating(mkBookObjToPatch(newReviewsArray, book))
    e.target.parentNode.remove()
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
        return data
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
        newBookLi.classList = 'book-li'

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

    postNewBookRating(mkBookObjToPatch(bookReviewsArr, book))
    renderBookInfo(book)
    })
    form.reset()
    commentInput.textContent = ''
})

// let commentPColl= document.getElementsByClassName('comment-p')
// console.log(commentPColl)
// let commentPArr = Array.from(commentPColl)
// console.log(commentPColl.firstChild.innerText)

// console.log(Array.isArray(commentPColl))
// for (let i=0; i < commentPColl.children.length; i++) {
//     console.log(commentPColl.children[i])
// }