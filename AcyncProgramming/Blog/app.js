function attachEvents() {
    document.getElementById(`btnLoadPosts`).addEventListener(`click`, getPosts);
    document.getElementById(`btnViewPost`).addEventListener(`click`, displayByID)
}

attachEvents();

async function displayByID() {
    //get value
    //load posts,load his comments
    //render data

    const titleElement = document.getElementById(`post-title`);
    const bodyElement = document.getElementById(`post-body`);
    const ulEl = document.getElementById(`post-comments`);

    titleElement.textContent = `Loading...`;
    bodyElement.textContent = ``;
    ulEl.replaceChildren();

    const selectedId = document.getElementById(`posts`).value;

    const [post, comments] = await Promise.all([
        getPostById(selectedId),
        getComments(selectedId)
    ]);

    titleElement.textContent = post.title;
    bodyElement.textContent = post.body;


    comments.forEach(c => {
        const li = document.createElement(`li`);
        li.textContent = c.text;
        ulEl.appendChild(li);
    });
}

async function getPosts() {
    const url = `http://localhost:3030/jsonstore/blog/posts`;

    const res = await fetch(url);
    const data = await res.json();

    //parse data and populate list
    const selectEl = document.getElementById(`posts`);
    selectEl.replaceChildren();

    Object.values(data).forEach(p => {
        const optionEl = document.createElement(`option`);
        optionEl.textContent = p.title;
        optionEl.value = p.id;

        selectEl.appendChild(optionEl);
    });
}

async function getPostById(postId) {
    const url = `http://localhost:3030/jsonstore/blog/posts/${postId}`;

    const res = await fetch(url);
    const data = await res.json();

    return data;
}

async function getComments(postId) {
    const url = `http://localhost:3030/jsonstore/blog/comments`;

    const res = await fetch(url);
    const data = await res.json();

    return Object.values(data).filter(c => c.postId == postId);

}