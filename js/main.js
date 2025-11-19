/* createElemWithText
* creates an HTML element with optional text content and class name
* @param {string} elem - The type of element to create (default is 'p')
* @param {string} text - The text content for the element (default is '')
* @param {string} className - The class name to assign to the element (optional)
* @returns {HTMLElement}
* */
function createElemWithText(elem = 'p', text = '', className) {
	  const element = document.createElement(elem);
	  element.textContent = text;
	  if (className) {
		      element.className = className;
		    }
	  return element;
}

/* createSelectOptions
* returns an array of option elements for a select menu based on an array of user objects
* @param {Array} users - Array of user objects
* @returns {Array|undefined}
* */
function createSelectOptions(users) {
	  if (!users) return undefined;
	  const options = [];
	  for (const user of users) {
		      const option = document.createElement('option');
		      option.value = user.id;
		      option.textContent = user.name;
		      options.push(option);
		    }
	  return options;
}

/* toggleCommentSection
* toggles the visibility of the comment section for a given postId
* @param {number} postId - The ID of the post
* @returns {HTMLElement|undefined}
* */
function toggleCommentSection(postId) {
	if (postId === undefined) return undefined;
	const section = document.querySelector(`section[data-post-id='${postId}']`);
	if (!section) return null;
	section.classList.toggle('hide');
	return section;
}

/* toggleCommentButton
* toggles the text content of the comment button for a given postId
* @param {number} postId - The ID of the post
* @returns {HTMLElement|undefined}
* */
function toggleCommentButton(postId) {
	if (postId === undefined) return undefined;
	const button = document.querySelector(`button[data-post-id='${postId}']`);
	if (!button) return null;
	button.textContent = button.textContent === 'Show Comments' ? 'Hide Comments' : 'Show Comments';
	return button;
}

/* deleteChildElements
* deletes all child elements of a given parent element
* @param {HTMLElement} parentElement - The parent element
* @returns {HTMLElement|undefined}
*  */
function deleteChildElements(parentElement) {
	if (!parentElement?.tagName) return undefined;
	let child = parentElement.lastElementChild;
	while (child) {
		parentElement.removeChild(child);
		child = parentElement.lastElementChild;
	}
	return parentElement;
}

/* addButtonListeners
* adds click event listeners to all buttons in the main element
* @returns {NodeList|null}
* */
function addButtonListeners() {
	const mainElement = document.querySelector('main');
	if (!mainElement) return null;
	const buttons = mainElement.querySelectorAll('button');
	buttons.forEach((button) => {
		const postId = button.dataset.postId;
		if (postId) {
			button.addEventListener('click', (event) => {
				toggleComments(event, postId);
			});
		}
	});
	return buttons;
}

/* removeButtonListeners
* removes click event listeners from all buttons in the main element
* @returns {NodeList|null}
*  */
function removeButtonListeners() {
	const mainElement = document.querySelector('main');
	if (!mainElement) return null;
	const buttons = mainElement.querySelectorAll('button');
	buttons.forEach((button) => {
		const postId = button.dataset.postId;
		if (postId) {
			button.removeEventListener('click', (event) => {
				toggleComments(event, postId);
			});
		}
	});
	return buttons;
}

/* createComments
* creates a document fragment containing comment articles for a post
* @param {Array} comments - Array of comment objects
* @returns {DocumentFragment|undefined}
* */
function createComments(comments) {
	if (!comments) return undefined;
	const fragment = document.createDocumentFragment();
	for (const comment of comments) {
		const article = document.createElement('article');
		const h3 = createElemWithText('h3', comment.name);
		const pBody = createElemWithText('p', comment.body);
		const pEmail = createElemWithText('p', `From: ${comment.email}`);
		article.appendChild(h3);
		article.appendChild(pBody);
		article.appendChild(pEmail);
		fragment.appendChild(article);
	}
	return fragment;
}

/* populateSelectMenu
* populates the select menu with options based on an array of user objects
* @param {Array} users - Array of user objects
* @returns {HTMLElement|undefined}
*  */
function populateSelectMenu(users) {
	const selectMenu = document.getElementById('selectMenu');
	if (!users) return undefined;
	const options = createSelectOptions(users);
	options.forEach((option) => {
		selectMenu.appendChild(option);
	});
	return selectMenu;
}

/* getUsers
* fetches user data from the API
* @returns {Array|null}
* */
async function getUsers() {
	try {
		const response = await fetch('https://jsonplaceholder.typicode.com/users');
		if (!response.ok) throw new Error('Network response was not ok');
		return await response.json();
	} catch (error) {
		console.error('Fetch error:', error);
		return null;
	}
}

/* getUserPosts
* fetches posts for a specific userId from the API
* @param {number} userId - The ID of the user
* @returns {Array|undefined|null}
* */
async function getUserPosts(userId) {
	if (userId === undefined) return undefined;
	try {
		const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
		if (!response.ok) throw new Error('Network response was not ok');
		return await response.json();
	} catch (error) {
		console.error('Fetch error:', error);
		return null;
	}
}

/* getUser
* fetches user data for a specific userId from the API
* @param {number} userId - The ID of the user
* @returns {Object|undefined|null}
* */
async function getUser(userId) {
	if (userId === undefined) return undefined;
	try {
		const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
		if (!response.ok) throw new Error('Network response was not ok');
		return await response.json();
	} catch (error) {
		console.error('Fetch error:', error);
		return null;
	}
}

/* getPostComments
* fetches comments for a specific postId from the API
* @param {number} postId - The ID of the post
* @returns {Array|undefined|null}
* */
async function getPostComments(postId) {
	if (postId === undefined) return undefined;
	try {
		const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
		if (!response.ok) throw new Error('Network response was not ok');
		return await response.json();
	} catch (error) {
		console.error('Fetch error:', error);
		return null;
	}
}

/* displayComments
* creates a section element containing comments for a specific postId
* @param {number} postId - The ID of the post
* @returns {HTMLElement|undefined}
* */
async function displayComments(postId) {
	if (postId === undefined) return undefined;
	const section = document.createElement('section');
	section.dataset.postId = postId;
	section.classList.add('comments', 'hide');
	const comments = await getPostComments(postId);
	const fragment = createComments(comments);
	section.appendChild(fragment);
	return section;
}

/*  createPosts
* creates a document fragment containing articles for each post
* @param {Array} posts - Array of post objects
* @returns {DocumentFragment|undefined}
*  */
async function createPosts(posts) {
	if (!posts || posts.length < 1) return undefined;
	const fragment = document.createDocumentFragment();
	for (const post of posts) {
		const article = document.createElement('article');
		const h2 = createElemWithText('h2', post.title);
		const pBody = createElemWithText('p', post.body);
		const pPostId = createElemWithText('p', `Post ID: ${post.id}`);
		const author = await getUser(post.userId);
		const pAuthor = createElemWithText('p', `Author: ${author.name} with ${author.company.name}`);
		const pCatchPhrase = createElemWithText('p', author.company.catchPhrase);
		const button = createElemWithText('button', 'Show Comments');
		button.dataset.postId = post.id;
		article.appendChild(h2);
		article.appendChild(pBody);
		article.appendChild(pPostId);
		article.appendChild(pAuthor);
		article.appendChild(pCatchPhrase);
		article.appendChild(button);
		const section = await displayComments(post.id);
		article.appendChild(section);
		fragment.appendChild(article);
	}
	return fragment;
}

/*  displayPosts
* displays posts in the main element
* @param {Array} posts - Array of post objects to display
* @returns {DocumentFragment|null}
*  */
async function displayPosts(posts) {
	const main = document.querySelector('main');
	if (!main) return null;
	let element = await createPosts(posts);
	if (!element || element.childElementCount < 1) {
		element = createElemWithText('p', 'Select an Employee to display their posts.', 'default-text');
	}
	main.appendChild(element);
	return element;
}

/* toggleComments
* toggles the comment section and button text for a specific postId
* @param {Event} event - The click event object
* @param {number} postId - The ID of the post
* @returns {Array} [section, button]
*  */
function toggleComments(event, postId) {
	if (!event || postId === undefined) return undefined;
	event.target.listener = true;
	const section = toggleCommentSection(postId);
	const button = toggleCommentButton(postId);
	return [section, button];
}

/* refreshPosts
* refreshes the posts displayed in the main element
* @param {Array} posts - Array of post objects to display
* @returns {Array} [removeButtons, main, fragment, addButtons]
*  */
async function refreshPosts(posts) {
	if (!posts) return undefined;
	const removeButtons = removeButtonListeners();
	const mainElement = document.querySelector('main');
	const main = deleteChildElements(mainElement);
	const fragment = await displayPosts(posts);
	const addButtons = addButtonListeners();
	return [removeButtons, main, fragment, addButtons];
}

/* selectMenuChangeEventHandler
* handles the change event for the select menu
* @param {Event} event - The change event object
* @returns {Array} [userId, posts, refreshPostsArray]
* */
async function selectMenuChangeEventHandler(event) {
	if (!event) return undefined;
	const selectMenu = event.target;
	if(selectMenu) {
		selectMenu.disabled = true;
	}
	const userId = Number.isInteger(parseInt(event?.target?.value)) ? parseInt(event?.target?.value) : 1;
	const posts = await getUserPosts(userId);
	const refreshPostsArray = await refreshPosts(posts);
	if(selectMenu) {
		selectMenu.disabled = false;
	}
	return [userId, posts, refreshPostsArray];
}

/* initPage
* initializes the page by fetching users and populating the select menu
* @returns {Array} [users, selectMenu]
* */
async function initPage() {
	const users = await getUsers();
	const select = populateSelectMenu(users);
	return [users, select];
}

/*  initApp
* initializes the application by setting up the page and event listeners
* @returns {Array} [init, selectMenu]
*  */
function initApp() {
	const init = initPage();
	const selectMenu = document.getElementById('selectMenu');
	selectMenu.addEventListener('change', selectMenuChangeEventHandler);
	return [init, selectMenu];
}

/* Initialize the application when the DOM content is loaded */
document.addEventListener('DOMContentLoaded', initApp);