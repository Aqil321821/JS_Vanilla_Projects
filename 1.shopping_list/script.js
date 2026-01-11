//grab all relevent items
const form = document.getElementById('item-form');
const input = document.getElementById('item-input');
const list = document.getElementById('item-list');
const filter = document.getElementById('filter');
const clearAll = document.getElementById('clear');

//add items to list
function addItem(e) {
  e.preventDefault();
  const newItem = input.value.trim();
  //validate input
  if (!newItem) {
    alert('Plz fill the fields');
    return;
  }
  //make list item from value
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(newItem));
  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);
  list.appendChild(li);
  checkUI();
  input.value = '';
}

function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;
  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

function removeItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    if (confirm('Are You sure to delte?')) {
      e.target.parentElement.parentElement.remove();
    }
  }
  checkUI();
}

function removeAll() {
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
  checkUI();
}

function checkUI() {
  const items = list.querySelectorAll('li');
  if (items.length === 0) {
    clearAll.style.display = 'none';
    filter.style.display = 'none';
  } else {
    clearAll.style.display = 'block';
    filter.style.display = 'block';
  }
}



function filterItems(e) {
  const items = list.querySelectorAll('li');
  const text = e.target.value.toLowerCase();
  items.forEach((item) => {
    const currentItem = item.firstChild.textContent.toLowerCase();
    // console.log(currentItem);
    if (currentItem.indexOf(text) != -1) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}


//event listenrs
form.addEventListener('submit', addItem);
list.addEventListener('click', removeItem);
clearAll.addEventListener('click', removeAll);
filter.addEventListener('input', filterItems);
document.addEventListener('DOMContentLoaded', checkUI);
