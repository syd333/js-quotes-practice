document.addEventListener("DOMContentLoaded", function() {
    getAllQuotes()
});

const quotesUrl = 'http://localhost:3000/quotes?_embed=likes'

//defining variables
let submitBtn = document.createElement('button')

//event listeners 
//locating the form
let form = document.getElementById('new-quote-form')
form.addEventListener('submit', handleSubmitForm)

// fetching data (GET)
function getAllQuotes() {
    fetch(quotesUrl)
    .then(res => res.json())
    .then(quotes => quotes.forEach(quote => renderQuotes(quote)))
}

//adding to the data from form 
function postQuotes(quote) {
    fetch(quotesUrl, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    },
    body: JSON.stringify(quote)
    })
    .then(res => res.json())
    .then(quote => renderQuotes(quote))
}

//deleting from form
function deleteQuote(id){
fetch(`http://localhost:3000/quotes/${id}`, {
    method: 'DELETE'
})
    .then(res => res.json())
    .then(()=> {
        let oldQuote = document.getElementById(id)
        oldQuote.remove()
    })
}

// POST to likes
function likeQuotes(quote) {
    let like = {
    quoteId: quote.id
    }
    fetch('http://localhost:3000/likes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify(like)
    })
        .then(res => res.json())
        .then((newLike) => {
            let li = document.getElementById(quote.id)
            let span = li.querySelector('span')
            quote.likes.push(newLike)
            let likes = quote.likes.length
            span.textContent = likes
    })
}

//dom manipulation
// building the quote card
function renderQuotes(quote){
    // creating HTML elements
    let ul = document.getElementById('quote-list')
    let li = document.createElement('li')
    let p = document.createElement('p')
    let blockquote = document.createElement('blockquote')
    let footer = document.createElement('footer')
    let likeBtn = document.createElement('button')
    let deleteBtn = document.createElement('button')
    let br = document.createElement('br')
    let span = document.createElement('span')

    // adding attributes, classes, ids
    ul.id = 'quote-list'
    li.className = 'quote-card'
    li.id = quote.id
    p.textContent = quote.quote
    p.className = 'mb-0'
    footer.innerText = quote.author
    footer.className = 'blockquote-footer'
    blockquote.className = 'blockquote'
    span.innerText = quote.likes.length
    likeBtn.innerText = 'Likes: '
    likeBtn.className = 'btn-success'
    deleteBtn.innerText = 'Delete'
    deleteBtn.className = 'btn-danger'

    deleteBtn.addEventListener('click', () => deleteQuote(quote.id))
    likeBtn.addEventListener('click', () => likeQuotes(quote))

    //appending to DOM
    likeBtn.appendChild(span)
    blockquote.append(p, footer, br, likeBtn, deleteBtn)
    li.appendChild(blockquote)
    ul.appendChild(li)

}


//handling events
//handles the submit form 
function handleSubmitForm(e){
    e.preventDefault()
    let quote = {
        quote: e.target.quote.value,
        author: e.target.author.value,
        likes: []
    }
    postQuotes(quote)
}