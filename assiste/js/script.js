// ============ Mobile Menu Toggle ============
document.querySelector('button[aria-expanded]')?.addEventListener('click', function () {
  const mobileMenu = document.getElementById('mobile-menu');
  const isExpanded = this.getAttribute('aria-expanded') === 'true';
  this.setAttribute('aria-expanded', !isExpanded);
  mobileMenu.classList.toggle('hidden');
});

// ============ FAQ Toggle ============
document.querySelectorAll('[id^="question"]').forEach((button, index) => {
  button.addEventListener('click', function () {
    const answer = document.getElementById(`answer${index + 1}`);
    const arrow = document.getElementById(`arrow${index + 1}`);

    const visible = answer.style.display === 'block';
    answer.style.display = visible ? 'none' : 'block';
    arrow.style.transform = visible ? 'rotate(-180deg)' : 'rotate(0deg)';
  });
});

// ============ On Page Load ============
window.onload = () => {
  // Check login
  if (!localStorage.getItem("isLoggedIn") && !window.location.href.includes("login.html")) {
    window.location.href = "login.html";
    return;
  }

  const yearSpan = document.getElementById('years');
  if (yearSpan) yearSpan.innerText = new Date().getFullYear();

  if (document.getElementById("customLevel")) {
    levelAll();
  }
};

// ============ Load All Levels ============
function levelAll() {
  fetch(`https://openapi.programming-hero.com/api/levels/all`)
    .then(res => res.json())
    .then(data => viewLevel(data.data));
}

function viewLevel(data) {
  const levels = document.getElementById("customLevel");
  levels.innerHTML = "";

  data.forEach(({ level_no }) => {
    const btn = document.createElement("button");
    btn.id = `level-${level_no}`;
    btn.className = "btn btn-outline btn-primary text-xs text-center px-3 py-2 my-2 mx-2";
    btn.innerHTML = `<i class="fas fa-book-open"></i> Lesson-${level_no}`;
    btn.onclick = () => categoryId(level_no);
    levels.appendChild(btn);
  });
}

// ============ Load Vocabulary By Level ============
function categoryId(id) {
  fetch(`https://openapi.programming-hero.com/api/level/${id}`)
    .then(res => res.json())
    .then(({ data }) => {
      document.querySelectorAll("#customLevel button").forEach(btn => btn.classList.remove("btn-active"));
      const activeBtn = document.getElementById(`level-${id}`);
      if (activeBtn) activeBtn.classList.add("btn-active");

      if (data && data.length > 0) {
        cardBody(data);
      } else {
        cardBodyEmpty();
      }
    });
}

// ============ Render Vocabulary Cards ============
function cardBody(data) {
  const cards = document.getElementById("cardSection");
  cards.innerHTML = "";

  data.forEach(({ word, meaning, pronunciation }) => {
    const card = document.createElement("div");
    card.className = "p-4";

    card.innerHTML = `
      <div class="rounded shadow-lg flex flex-col bg-white h-56">
        <div class="px-6 py-4 mb-auto text-center">
          <p class="font-medium text-lg">${word}</p>
          <p class="text-gray-500 text-sm">${meaning} / ${pronunciation}</p>
        </div>
        <div class="px-6 py-3 flex justify-between bg-gray-100">
          <button class="btn" onclick="showInfoModal('${word}', '${meaning}', '${pronunciation}')">
            <i class="fa-solid fa-circle-info text-xl"></i>
          </button>
          <button class="btn" onclick="playPronunciation('${word}', '${meaning}')">
            <i class="fa-solid fa-volume-high text-xl"></i>
          </button>
        </div>
      </div>
    `;
    cards.appendChild(card);
  });
}

// ============ Show Empty Message ============
function cardBodyEmpty() {
  document.getElementById("cardSection").innerHTML = `
    <div class="text-center py-20 text-slate-700">
      <i class="fa-solid fa-triangle-exclamation text-7xl mb-4"></i>
      <p class="text-lg">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
      <h3 class="text-3xl font-medium mt-5">নেক্সট <span class="text-blue-600">Lesson</span> এ যান</h3>
    </div>
  `;
}

// ============ Show Info Modal ============
function showInfoModal(word, meaning, pronunciation) {
  const modal = document.createElement('div');
  modal.className = 'fixed z-50 inset-0 bg-black bg-opacity-60 flex items-center justify-center';
  modal.innerHTML = `
    <div class="bg-white max-w-md p-6 rounded shadow-xl relative" role="dialog">
      <button onclick="this.closest('div[role=dialog]').remove()" 
        class="absolute top-2 right-2 text-gray-600 text-2xl">&times;</button>
      <h2 class="text-lg font-bold mb-2">${word} <span class="text-sm text-gray-500">(${pronunciation})</span></h2>
      <p class="mb-2"><strong>Meaning:</strong> ${meaning}</p>
      <p><strong>Example:</strong> The kids were <b>${word.toLowerCase()}</b> to open their gifts.</p>
    </div>
  `;
  document.body.appendChild(modal);
}

// ============ Pronunciation (Word + Meaning) ============
function playPronunciation(word, meaning = "") {
  const text = `${word}. অর্থ হলো: ${meaning}.`;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US'; // or 'bn-BD' if needed
  window.speechSynthesis.speak(utterance);
}

// ============ Form Validation ============
function validateForm() {
  const username = document.getElementById("login_username").value.trim();
  const password = document.getElementById("login_password").value.trim();
  const errorContainer = document.getElementById("errorContainer");
  errorContainer.textContent = "";

  // Empty field check
  if (!username || !password) {
    errorContainer.textContent = "Username and password cannot be empty!";
    return false;
  }

  // Password length check
  if (password.length < 6) {
    errorContainer.textContent = "Password must be at least 6 characters!";
    return false;
  }

  // Success — pretend login is valid
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("userEmail", username); // optional: store user email/name
  alert("Login successful!");
  window.location.href = "index.html";
  return false; // prevent default form submit
}

// ============ Logout ============
function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userEmail");
  alert("You have been logged out!");
  window.location.href = "login.html";
}

// ============ Check Login ============
function checkLogin() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (!isLoggedIn) {
    window.location.href = "login.html";
  }
}
