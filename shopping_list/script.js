//grab all relevent items
const form = document.getElementById('item-form');
const input = document.getElementById('item-input');
const list = document.getElementById('item-list');
const filter = document.getElementById('filter');
const clearAll = document.getElementById('clear');
const formBtn = form.querySelector('button');
let isEditMode = false;

function checkUI() {
  input.value = '';
  const items = list.querySelectorAll('li');
  if (items.length === 0) {
    clearAll.style.display = 'none';
    filter.style.display = 'none';
  } else {
    clearAll.style.display = 'block';
    filter.style.display = 'block';
  }
  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = '#667eea';

  isEditMode = false;
}

function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}
function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;
  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
}
function addItemToDOM(item) {
  //make list item from value
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));
  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);
  list.appendChild(li);
}
function getItemsFromStorage() {
  let itemsFromStorage;
  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }
  return itemsFromStorage;
}

function addItemToLocalStorage(item) {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.push(item);
  //conver to json and set to local storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

//add items to list
function onAddItemSubmit(e) {
  e.preventDefault();
  const newItem = input.value.trim();
  //validate input
  if (!newItem) {
    alert('Plz fill the fields');
    return;
  }

  if (isEditMode) {
    const itemToEdit = list.querySelector('.edit-mode');
    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkItemExist(newItem)) {
      alert('Alraedy in list');
      return;
    }
  }

  addItemToDOM(newItem);
  addItemToLocalStorage(newItem);
  checkUI();
  input.value = '';
}

function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => {
    addItemToDOM(item);
  });
  checkUI();
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
}
function checkItemExist(item) {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);
}

function setItemToEdit(item) {
  isEditMode = true;
  list.querySelectorAll('li').forEach((i) => i.classList.remove('edit-mode'));
  item.classList.add('edit-mode');
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
  formBtn.style.backgroundColor = '#228B22';
  input.focus();
  input.value = item.textContent.trim();
}

function removeItemFromStorage(item) {
  let itemsFromStorage = getItemsFromStorage();
  //filter items
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);
  //reset local storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function removeItem(item) {
  // console.log(item);
  if (confirm('Are You sure to delte?')) {
    item.remove();
    //remove item from storage
    removeItemFromStorage(item.textContent);
  }
  checkUI();
}

function removeAll() {
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
  localStorage.clear();
  checkUI();
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

function init() {
  //event listenrs
  form.addEventListener('submit', onAddItemSubmit);
  list.addEventListener('click', onClickItem);
  clearAll.addEventListener('click', removeAll);
  filter.addEventListener('input', filterItems);
  document.addEventListener('DOMContentLoaded', checkUI);
  document.addEventListener('DOMContentLoaded', displayItems);
}

init();
