const postsContainer = document.getElementById('posts-container');
const loading = document.querySelector('.loader');
const filter = document.getElementById('filter');

let limit = 5;
let page = 1;

// Fetch posts from API
async function getPosts() {
  try {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`);
    // Handle non-200 responses
    if (!res.ok) {
      throw new Error('Failed to fetch posts');
    }
    const data = await res.json();
    return data;
  } catch (error) {
    // Log the error for debugging and show a message to the user
    console.error('Error fetching data:', error);
    alert('Something went wrong! Please try again later.');
    return []; // Return an empty array if the fetch fails
  }
}

// Show posts in DOM
async function showPosts() {
  // Show loader while fetching
  loading.classList.add('show');

  const posts = await getPosts();

  // Hide loader after data is fetched
  loading.classList.remove('show');

  // Check if posts are available
  if (posts.length === 0) {
    const noPostsMessage = document.createElement('div');
    noPostsMessage.textContent = 'No more posts available.';
    postsContainer.appendChild(noPostsMessage);
    return; // If no posts, exit early
  }

  posts.forEach((post) => {
    const postEl = document.createElement('div');
    postEl.classList.add('post');
    postEl.innerHTML = `
      <div class="number">${post.id}</div>
      <div class="post-info">
        <h2 class="post-title">${post.title}</h2>
        <p class="post-body">${post.body}</p>
      </div>
    `;
    postsContainer.appendChild(postEl);
  });
}

// Show loader & fetch more posts
function showLoading() {
  loading.classList.add('show');
  setTimeout(() => {
    //remove loader
    loading.classList.remove('show');
    setTimeout(() => {
      page++;
      showPosts();
    }, 300);
  }, 1000);
}

// Filter posts by input
function filterPosts(e) {
  const term = e.target.value.toUpperCase();
  const posts = document.querySelectorAll('.post'); //node list

  posts.forEach((post) => {
    const title = post.querySelector('.post-title').innerText.toUpperCase();
    const body = post.querySelector('.post-body').innerText.toUpperCase();

    if (title.indexOf(term) > -1 || body.indexOf(term) > -1) {
      post.style.display = 'flex';
    } else {
      post.style.display = 'none';
    }
  });
}

// Show initial posts
showPosts();

//we have document root element that has values to deal with scroll

/*document.documentElement tumhe <html> element ka reference deta hai, jo page ka root element hota hai.
Is element ke andar tum document ka root level ka content, layout properties, aur scroll properties dekh sakte ho.*/

console.log(document.documentElement.scrollTop); // Shows the amount of scroll
console.log(document.documentElement.clientHeight); // Shows the visible height
console.log(document.documentElement.scrollHeight); // Shows the total content height

window.addEventListener('scroll', () => {
  console.log(document.documentElement.scrollTop); //element (root) kitna scroll hoa ha
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 5) {
    showLoading();
  }
});

filter.addEventListener('input', filterPosts);
