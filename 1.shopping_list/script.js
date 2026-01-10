//grab all relevent items
const form = document.getElementById('item-form');
const input = document.getElementById('item-input');
const list = document.getElementById('item-list');

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

//event listenrs
form.addEventListener('submit', addItem);
