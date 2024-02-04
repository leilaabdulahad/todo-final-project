const API_KEY = 'https://js1-todo-api.vercel.app/api/todos?apikey=1618d940-99dc-4e81-a806-740559df501d';
const addBtn = document.querySelector('#btn');
const output = document.querySelector('#out')
const input = document.querySelector('#input');
const errorMessage = document.querySelector('#errorMessage');
const posts = [];

// Delete and done btns
const buttons = (postId, completed) => {
  return `<button class="delete-btn" data-postid="${postId}">Delete</button>
          <button class="done-btn" data-postid="${postId}" data-completed="${completed}">${completed ? 'Revert' : 'Done'}</button>`;
};

// Get posts
const getPosts = async () => {
  const res = await fetch(API_KEY);

  if (res.status !== 200) {
    console.log('Error fetching data');
    return;
  }

  const data = await res.json();

  data.forEach(post => {
    posts.push(post);
    output.insertAdjacentHTML('beforeend', `<li data-postid="${post._id}" id="post${post._id}" ${post.completed ? 'style="background-color: lightgreen;"' : ''}>
      <span class="text">${post.title}</span>
      ${buttons(post._id, post.completed)}
    </li>`);
 
    document.querySelector(`.delete-btn[data-postid="${post._id}"]`).addEventListener('click', deletePost);
    document.querySelector(`.done-btn[data-postid="${post._id}"]`).addEventListener('click', doneClick);
  });
};

// Add posts
const addPost = async () => {
  const title = input.value.trim()
  if(!title){
      errorMessage.textContent = 'The field is empty, try again';
      return;
  }

  errorMessage.textContent = '';
  const post = {
    title: input.value,
  };

  const res = await fetch(API_KEY, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(post),
  });

  const data = await res.json();

  console.log(data);
  posts.push(data);
  output.insertAdjacentHTML('beforeend', `<li data-postid="${data._id}" id="post${data._id}">
    <span class="text">${post.title}</span>
    ${buttons(data._id, false)}
  </li>`);

  document.querySelector(`.delete-btn[data-postid="${data._id}"]`).addEventListener('click', deletePost);
  document.querySelector(`.done-btn[data-postid="${data._id}"]`).addEventListener('click', doneClick);

  input.value = '';
};

// Update posts
const updatePost = async (postId, completed) => {
  const updatedPost = {
    completed: !completed,
  };

  const res = await fetch(`https://js1-todo-api.vercel.app/api/todos/${postId}?apikey=1618d940-99dc-4e81-a806-740559df501d`, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(updatedPost),
  });

  const data = await res.json();
  document.querySelector(`#post${data._id}`).style.backgroundColor = data.completed ? 'lightgreen' : '';
  document.querySelector(`.done-btn[data-postid="${data._id}"]`).textContent = data.completed ? 'Revert' : 'Done';
};

// Get the modal and close button elements
const modal = document.getElementById('myModal');
const closeModalButton = document.getElementById('closeModal');

const showModal = () => {
  modal.style.display = 'block';
};

const hideModal = () => {
  modal.style.display = 'none';
};

// Close modal
closeModalButton.addEventListener('click', hideModal);

// Close the modal if the user clicks outside of it
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    hideModal();
  }
});

// Delete posts
const deletePost = async (e) => {
  const postId = e.target.dataset.postid;
  const postElement = document.querySelector(`#post${postId}`);
  const completed = postElement.style.backgroundColor === 'lightgreen';

  if (completed) {
    try {
      // If completed, delete
      const response = await fetch(`https://js1-todo-api.vercel.app/api/todos/${postId}?apikey=1618d940-99dc-4e81-a806-740559df501d`, {
        method: 'DELETE',
      });

      console.log(response);

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        e.target.parentElement.remove();
      } else {
        console.error('Error deleting post:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  } else {
    // If not completed, show modal
    showModal();
  }
};

// Done btn function
const doneClick = (e) => {
  const postId = e.target.dataset.postid;
  const postElement = document.querySelector(`#post${postId}`);
  const completed = postElement.style.backgroundColor === 'lightgreen';

  updatePost(postId, completed);
};

// Enable enter key
input.addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    event.preventDefault()
    addPost();
  }
});

addBtn.addEventListener('click', addPost);
getPosts();
