const apiUrl = 'https://jsonplaceholder.typicode.com/todos';
const errorElement = document.getElementById('error-msg');

function showError(message) {
  errorElement.textContent = message;
}

// Add todo to DOM
const addTodoToDOM = (todo) => {
  const div = document.createElement('div');
  div.classList.add('todo');
  div.textContent = todo.title;
  div.dataset.id = todo.id;

  if (todo.completed) {
    div.classList.add('done');
  }

  document.getElementById('todo-list').appendChild(div);
};

// Get todos
const getTodos = () => {
  fetch(apiUrl + '?_limit=5')
    .then((res) => {
      if (!res.ok) throw new Error(`Server Error: ${res.status}`);
      return res.json();
    })
    .then((data) => data.forEach(addTodoToDOM))
    .catch((err) => {
      console.error(err);
      showError('Failed to load todos. Check Connection!');
    });
};

// Create todo (POST)
const createTodo = (e) => {
  e.preventDefault();

  const input = e.target.firstElementChild;
  if (!input.value.trim()) {
    alert('Please fill the field');
    return;
  }

  const newTodo = {
    title: input.value.trim(),
    completed: false,
  };

  e.target.reset();

  fetch(apiUrl, {
    method: 'POST',
    body: JSON.stringify(newTodo),
    headers: { 'Content-Type': 'application/json' },
  })
    .then((res) => {
      if (!res.ok) throw new Error('Failed to add todo');
      return res.json();
    })
    .then(addTodoToDOM)
    .catch((err) => {
      console.error(err);
      showError('Failed to add todo. Check Connection!');
    });
};

// Toggle completed (PUT)
const toggleCompleted = (e) => {
  if (e.target.classList.contains('todo')) {
    e.target.classList.toggle('done');
    updateTodo(e.target.dataset.id, e.target.classList.contains('done'));
  }
};

const updateTodo = (id, completed) => {
  fetch(`${apiUrl}/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ completed }),
    headers: { 'Content-Type': 'application/json' },
  })
    .then((res) => res.json())
    .then((data) => console.log('Updated:', data))
    .catch(() => showError('Update failed. Check Connection!'));
};

// Delete todo
const deleteTodo = (e) => {
  if (e.target.classList.contains('todo')) {
    const id = e.target.dataset.id;

    fetch(`${apiUrl}/${id}`, { method: 'DELETE' })
      .then(() => e.target.remove())
      .catch(() => showError('Delete failed. Check Connection!'));
  }
};

// Init
const init = () => {
  document.addEventListener('DOMContentLoaded', getTodos);
  document.querySelector('#todo-form').addEventListener('submit', createTodo);
  document.querySelector('#todo-list').addEventListener('click', toggleCompleted);
  document.querySelector('#todo-list').addEventListener('dblclick', deleteTodo);
};

init();
