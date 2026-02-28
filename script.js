
let token = null;
let userRole = null;
let projectPage = 0;
const pageSize = 5;

// Password show/hide
function togglePassword(id) {
  const input = document.getElementById(id);
  input.type = input.type === "password" ? "text" : "password";
}

// Registration
async function register() {
  const name = document.getElementById('reg-name').value.trim();
  const username = document.getElementById('reg-username').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;
  const confirm = document.getElementById('reg-confirm-password').value;

  if (!name || !username || !email || !password || !confirm) {
    document.getElementById('register-message').innerText = "All fields required";
    return;
  }
  if(password !== confirm) {
    document.getElementById('register-message').innerText = "Passwords do not match";
    return;
  }

  const res = await fetch('http://localhost:5000/users/register', {
    method:'POST',
    headers: { 'Content-Type':'application/json' },
    body: JSON.stringify({ name, username, email, password })
  });
  const data = await res.json();
  document.getElementById('register-message').innerText = data.message;
}

// Login
async function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  userRole = document.getElementById('role').value;

  if(!username || !password){
    document.getElementById('login-message').innerText = "Enter username and password";
    return;
  }

  const res = await fetch('http://localhost:5000/users/login', {
    method:'POST',
    headers:{ 'Content-Type':'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  document.getElementById('login-message').innerText = data.message;
  if(res.ok) {
    token = data.token;
    showSections();
  }
}

// Show sections based on role
function showSections() {
  if(userRole === 'student'){
    document.getElementById('project-section').classList.remove('hidden');
    document.getElementById('feedback-section').classList.remove('hidden');
  } else if(userRole === 'supervisor' || userRole==='coordinator') {
    document.getElementById('review-section').classList.remove('hidden');
    if(userRole==='coordinator') document.getElementById('project-section').classList.remove('hidden');
  } else if(userRole==='admin') {
    document.getElementById('project-section').classList.remove('hidden');
  }
}

// Create project
async function createProject() {
  const title = document.getElementById('project-title').value.trim();
  const description = document.getElementById('project-description').value.trim();
  const supervisor = document.getElementById('project-supervisor').value.trim();

  if(!title || !description){
    document.getElementById('project-message').innerText = "Title and description required";
    return;
  }

  const res = await fetch('http://localhost:5000/projects', {
    method:'POST',
    headers: { 'Content-Type':'application/json', 'Authorization':`Bearer ${token}` },
    body: JSON.stringify({ title, description, supervisor })
  });
  const data = await res.json();
  document.getElementById('project-message').innerText = data.message;
  if(res.ok){
    document.getElementById('project-title').value='';
    document.getElementById('project-description').value='';
    document.getElementById('project-supervisor').value='';
  }
}

// Pagination - Get projects
async function getProjects() {
  const res = await fetch('http://localhost:5000/projects', {
    headers:{ 'Authorization': `Bearer ${token}` }
  });
  const allProjects = await res.json();
  renderProjects(allProjects);
}

function renderProjects(allProjects){
  const start = projectPage*pageSize;
  const pageProjects = allProjects.slice(start, start+pageSize);
  const tbody = document.querySelector('#project-table tbody');
  tbody.innerHTML='';
  pageProjects.forEach(p=>{
    const tr = document.createElement('tr');
    tr.innerHTML=`<td>${p.project_id}</td><td>${p.title}</td><td>${p.description}</td><td>${p.supervisor||''}</td><td>${p.status}</td>`;
    tbody.appendChild(tr);
  });
}

function nextProjects(){
  projectPage++;
  getProjects();
}
function prevProjects(){
  if(projectPage>0) projectPage--;
  getProjects();
}

// Feedback
async function submitFeedback(){
  const projectId = document.getElementById('feedback-project-id').value;
  const feedbackText = document.getElementById('feedback-text').value.trim();
  if(!projectId || !feedbackText){
    document.getElementById('feedback-message').innerText="All fields required";
    return;
  }
  const res = await fetch('http://localhost:5000/feedback',{
    method:'POST',
    headers:{ 'Content-Type':'application/json','Authorization':`Bearer ${token}` },
    body: JSON.stringify({ projectId, feedbackText })
  });
  const data = await res.json();
  document.getElementById('feedback-message').innerText=data.message;
  if(res.ok){
    document.getElementById('feedback-project-id').value='';
    document.getElementById('feedback-text').value='';
  }
}

// Review
async function submitReview(){
  const projectId = document.getElementById('review-project-id').value;
  const reviewText = document.getElementById('review-text').value.trim();
  if(!projectId || !reviewText){
    document.getElementById('review-message').innerText="All fields required";
    return;
  }
  const res = await fetch('http://localhost:5000/reviews',{
    method:'POST',
    headers:{ 'Content-Type':'application/json','Authorization':`Bearer ${token}` },
    body: JSON.stringify({ projectId, reviewText })
  });
  const data = await res.json();
  document.getElementById('review-message').innerText=data.message;
  if(res.ok){
    document.getElementById('review-project-id').value='';
    document.getElementById('review-text').value='';
  }
}

// Logout
function logout() {
  token = null;
  userRole = null;
  projectPage = 0;

  // Hide all role sections
  document.getElementById('project-section').classList.add('hidden');
  document.getElementById('feedback-section').classList.add('hidden');
  document.getElementById('review-section').classList.add('hidden');

  // Show login and registration
  document.getElementById('login-section').classList.remove('hidden');
  document.getElementById('register-section').classList.remove('hidden');

  // Hide logout button
  document.getElementById('logout-btn').classList.add('hidden');

  // Clear messages
  document.getElementById('login-message').innerText = '';
  document.getElementById('register-message').innerText = '';
  document.getElementById('project-message').innerText = '';
  document.getElementById('feedback-message').innerText = '';
  document.getElementById('review-message').innerText = '';
}

// Update showSections to display logout button
function showSections() {
  // Hide login and registration
  document.getElementById('login-section').classList.add('hidden');
  document.getElementById('register-section').classList.add('hidden');

  // Show logout
  document.getElementById('logout-btn').classList.remove('hidden');

  // Role-specific sections
  if(userRole === 'student'){
    document.getElementById('project-section').classList.remove('hidden');
    document.getElementById('feedback-section').classList.remove('hidden');
  } else if(userRole === 'supervisor' || userRole==='coordinator') {
    document.getElementById('review-section').classList.remove('hidden');
    if(userRole==='coordinator') document.getElementById('project-section').classList.remove('hidden');
  } else if(userRole==='admin') {
    document.getElementById('project-section').classList.remove('hidden');
  }

  highlightActiveSection();
}

// Highlight active section visually
function highlightActiveSection() {
  const sections = document.querySelectorAll('main section');
  sections.forEach(sec => sec.classList.remove('active-section'));
  if(userRole==='student'){
    document.getElementById('project-section').classList.add('active-section');
  } else if(userRole==='supervisor' || userRole==='coordinator'){
    document.getElementById('review-section').classList.add('active-section');
  } else if(userRole==='admin'){
    document.getElementById('project-section').classList.add('active-section');
  }
}