function solution() {
}

window.addEventListener(`DOMContentLoaded`, displayArticles);

const main = document.getElementById(`main`);

async function displayArticles() {
    const allArticles = await getAllArticles();
    main.replaceChildren();

    Object.entries(allArticles).forEach(article => {
        let mainDiv = document.createElement(`div`);
        mainDiv.classList.add(`accordion`);
        mainDiv.innerHTML = `<div class="head">
<span>${article[1].title}</span>
<button class="button" id="${article[1]._id}">More</button>
</div>
<div class="extra">
<p></p>
</div>`
        main.appendChild(mainDiv);
    });
    Array.from(document.querySelectorAll(`.button`)).forEach(b => b.addEventListener(`click`, displayContent));
}

async function displayContent(e) {
    let button = e.target;
    let id = button.id;
    let articleData = await getArticleById(id);

    let articleDiv = button.parentElement.parentElement;

    let textDiv = articleDiv.querySelector('.extra');
    textDiv.querySelector(`p`).textContent = articleData.content;

    button.textContent = button.textContent == 'More' ? 'Less' : 'More';
    textDiv.style.display = textDiv.style.display == 'none' || textDiv.style.display == '' ?
        textDiv.style.display = 'block' : textDiv.style.display = 'none';
}

async function getAllArticles() {
    const url = `http://localhost:3030/jsonstore/advanced/articles/list`;

    const res = await fetch(url);
    const data = await res.json();

    return data;
}

async function getArticleById(id) {
    const url = `http://localhost:3030/jsonstore/advanced/articles/details/${id}`;

    const res = await fetch(url);
    const data = await res.json();

    return data;
}