'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
// contact-form.js
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// Initialize logger
logger.log('info', 'Contact form script loaded');
logger.log('info', 'Form elements found', {
  form: !!form,
  inputs: formInputs.length,
  button: !!formBtn
});

// Initialize EmailJS
logger.log('info', 'Initializing EmailJS');
try {
  if (typeof EMAILJS_CONFIG === 'undefined') {
    throw new Error('EmailJS configuration not found. Please check config.js');
  }
  
  emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
  logger.log('info', 'EmailJS initialized successfully');
} catch (error) {
  logger.log('error', 'EmailJS initialization failed', error.message);
}

function checkFormValidity() {
  if (form.checkValidity()) {
    formBtn.removeAttribute("disabled");
  } else {
    formBtn.setAttribute("disabled", "");
  }
}

// Check on page load
checkFormValidity();

// Add multiple events for better responsiveness
formInputs.forEach(input => {
  input.addEventListener("input", checkFormValidity);
  input.addEventListener("change", checkFormValidity);
  input.addEventListener("keyup", checkFormValidity);
});

// Form submit handler with EmailJS
form.addEventListener("submit", async function(e) {
  e.preventDefault();
  
  logger.log('info', 'Form submission started');

  // Disable button during submission
  formBtn.setAttribute("disabled", "");
  formBtn.innerHTML = '<ion-icon name="hourglass"></ion-icon><span>Sending...</span>';
  
  try {
    logger.log('info', 'Creating template parameters');
    
    const templateParams = {
      to_name: EMAILJS_CONFIG.TO_NAME,
      fullname: form.fullname.value,
      email: form.email.value,
      message: form.message.value
    };

    logger.log('info', 'Sending email via EmailJS', {
      hasServiceId: !!EMAILJS_CONFIG.SERVICE_ID,
      hasTemplateId: !!EMAILJS_CONFIG.TEMPLATE_ID,
      formData: {
        fullname: templateParams.fullname ? '***PROVIDED***' : 'MISSING',
        email: templateParams.email ? '***PROVIDED***' : 'MISSING', 
        message: templateParams.message ? '***PROVIDED***' : 'MISSING'
      }
    });
    
    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams
    );
    
    logger.log('info', 'Email sent successfully', {
      status: response.status,
      text: response.text
    });
    
    formBtn.innerHTML = '<ion-icon name="checkmark"></ion-icon><span>Sent Successfully!</span>';
    formBtn.style.background = "#4CAF50";
    
    // Reset form after 2 seconds
    setTimeout(() => {
      form.reset();
      formBtn.innerHTML = '<ion-icon name="paper-plane"></ion-icon><span>Send Message</span>';
      formBtn.style.background = "";
      checkFormValidity();
      logger.log('info', 'Form reset completed');
    }, 2000);
    
  } catch (error) {
    logger.log('error', 'Email sending failed', {
      errorType: error.type || 'Unknown',
      status: error.status || 'No status',
      message: error.text || error.message
    });
    
    formBtn.innerHTML = '<ion-icon name="warning"></ion-icon><span>Failed - Try Again</span>';
    formBtn.style.background = "#f44336";
    
    // Reset button after 3 seconds
    setTimeout(() => {
      formBtn.innerHTML = '<ion-icon name="paper-plane"></ion-icon><span>Send Message</span>';
      formBtn.style.background = "";
      checkFormValidity();
      logger.log('info', 'Send button reset after error');
    }, 3000);
  }
});



// Export logs function for debugging
window.getEmailJSLogs = function() {
  return logger.getLogs();
};

window.clearEmailJSLogs = function() {
  logger.clearLogs();
};



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });


  // for skills page

  (function () {
    const filterSelect = document.querySelector('.filter-select');
    const filterBox = document.querySelector('.filter-select-box');
    const selectList = document.querySelectorAll('.select-item button[data-select-item]');
    const projectItems = document.querySelectorAll('[data-filter-item]');
    const selectValue = document.querySelector('[data-selecct-value]');

    if (!filterSelect || !selectList.length) return;

    // Toggle dropdown
    filterSelect.addEventListener('click', function (e) {
      e.stopPropagation();
      filterSelect.classList.toggle('open');
      filterBox.classList.toggle('open');
    });

    // Close when clicking outside
    document.addEventListener('click', function () {
      filterSelect.classList.remove('open');
      filterBox.classList.remove('open');
    });

    // Filtering function
    function filterByCategory(cat) {
      const lowerCat = (cat || 'all').toLowerCase();
      projectItems.forEach(item => {
        const itemCat = (item.getAttribute('data-category') || '').toLowerCase();
        if (lowerCat === 'all' || itemCat === lowerCat) {
          item.classList.add('active');
          item.style.display = ''; // restore default
        } else {
          item.classList.remove('active');
          item.style.display = 'none';
        }
      });
    }

    // Hook select items
    selectList.forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        // update visible label
        const value = btn.textContent.trim();
        selectValue.textContent = value;
        // mark active styling on dropdown list
        selectList.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        // perform filtering
        filterByCategory(value);
        // close dropdown
        filterSelect.classList.remove('open');
        filterBox.classList.remove('open');
      });
    });

    // initialize selecting 'All'
    const initial = Array.from(selectList).find(b => b.textContent.trim().toLowerCase() === 'all');
    if (initial) {
      initial.classList.add('active');
      selectValue.textContent = initial.textContent.trim();
      filterByCategory('All');
    }
  })();

  // portfolio




  (function () {
    'use strict';

    const BASE_RADIUS = 280;
    const RADIUS_MOBILE = 150;

    let currentAlbumImgs = [];
    let currentFsIndex = 0;
    let isTransitioning = false;

    // Initialize everything
    function init() {
      createOverlay();
      createFullscreen();
      setupEventListeners();
      console.log('Portfolio Gallery Initialized');
    }

    // Create overlay element
    function createOverlay() {
      if (document.querySelector('.portfolio-overlay')) return;

      const overlay = document.createElement('div');
      overlay.className = 'portfolio-overlay';
      overlay.innerHTML = `
      <div class="overlay-stage"></div>
      <div class="overlay-controls">
        <button class="overlay-btn overlay-back" style="display:none;">← Back</button>
        <button class="overlay-btn overlay-close">✕</button>
      </div>
      <div class="overlay-meta"></div>
    `;
      document.body.appendChild(overlay);
    }

    // Create fullscreen element
    function createFullscreen() {
      if (document.querySelector('.fullscreen-view')) return;

      const fullscreen = document.createElement('div');
      fullscreen.className = 'fullscreen-view';
      fullscreen.innerHTML = `
      <div class="fullscreen-inner">
        <div class="fs-controls">
          <button class="overlay-btn fs-back">← Back</button>
          <button class="overlay-btn fs-close">✕</button>
        </div>
        <div class="fs-image-container">
          <button class="nav-btn nav-left">◀</button>
          <img src="" alt="" class="fs-img">
          <button class="nav-btn nav-right">▶</button>
        </div>
        <div class="fullscreen-caption"></div>
      </div>
    `;
      document.body.appendChild(fullscreen);
    }

    // Setup all event listeners
    function setupEventListeners() {
      // Album click handlers
      document.addEventListener('click', function (e) {
        const albumTrigger = e.target.closest('[data-open-album]');
        if (albumTrigger) {
          e.preventDefault();
          const albumItem = albumTrigger.closest('.portfolio-item');
          if (albumItem) {
            openAlbum(albumItem);
          }
        }
      });

      // Overlay close button
      document.addEventListener('click', function (e) {
        if (e.target.closest('.overlay-close')) {
          e.preventDefault();
          closeOverlay();
        }
      });

      // Overlay back button
      document.addEventListener('click', function (e) {
        if (e.target.closest('.overlay-back')) {
          e.preventDefault();
          closeOverlay();
        }
      });

      // Fullscreen close button
      document.addEventListener('click', function (e) {
        if (e.target.closest('.fs-close')) {
          e.preventDefault();
          closeFullscreen();
          closeOverlay();
        }
      });

      // Fullscreen back button
      document.addEventListener('click', function (e) {
        if (e.target.closest('.fs-back')) {
          e.preventDefault();
          closeFullscreen();
          // showOverlay();
          setTimeout(() => {
            const overlay = document.querySelector('.portfolio-overlay');
            overlay.style.display = 'flex';
            overlay.classList.add('active');
          }, 100);

        }
      });

      // Navigation buttons
      document.addEventListener('click', function (e) {
        if (e.target.closest('.nav-left')) {
          e.preventDefault();
          navigatePhoto(-1);
        }
        if (e.target.closest('.nav-right')) {
          e.preventDefault();
          navigatePhoto(1);
        }
      });

      // Overlay background click
      document.addEventListener('click', function (e) {
        const overlay = document.querySelector('.portfolio-overlay');
        if (overlay && overlay.classList.contains('active') && e.target === overlay) {
          closeOverlay();
        }
      });

      // Fullscreen background click
      document.addEventListener('click', function (e) {
        const fullscreen = document.querySelector('.fullscreen-view');
        if (fullscreen && fullscreen.classList.contains('active') && e.target === fullscreen) {
          closeFullscreen();
          showOverlay();
        }
      });

      // Bloom item clicks
      document.addEventListener('click', function (e) {
        const bloomItem = e.target.closest('.bloom-item');
        if (bloomItem) {
          e.preventDefault();
          const index = Array.from(bloomItem.parentNode.children).indexOf(bloomItem);
          openFullscreen(index);
        }
      });

      // Keyboard events
      document.addEventListener('keydown', function (e) {
        // ESC key - closes everything to album grid
        if (e.key === 'Escape') {
          const fullscreen = document.querySelector('.fullscreen-view');
          const overlay = document.querySelector('.portfolio-overlay');

          if (fullscreen && fullscreen.classList.contains('active')) {
            e.preventDefault();
            closeFullscreen();
            closeOverlay();
          } else if (overlay && overlay.classList.contains('active')) {
            e.preventDefault();
            closeOverlay();
          }
        }

        // Backspace key - returns to bloomed view from fullscreen
        else if (e.key === 'Backspace') {
          const fullscreen = document.querySelector('.fullscreen-view');
          if (fullscreen && fullscreen.classList.contains('active')) {
            e.preventDefault();
            closeFullscreen();
            // showOverlay();
            setTimeout(() => {
              const overlay = document.querySelector('.portfolio-overlay');
              overlay.style.display = 'flex';
              overlay.classList.add('active');
            }, 100);
          }
      }

        // Arrow keys in fullscreen
        else if (e.key === 'ArrowLeft') {
        const fullscreen = document.querySelector('.fullscreen-view');
        if (fullscreen && fullscreen.classList.contains('active')) {
          e.preventDefault();
          navigatePhoto(-1);
        }
      } else if (e.key === 'ArrowRight') {
        const fullscreen = document.querySelector('.fullscreen-view');
        if (fullscreen && fullscreen.classList.contains('active')) {
          e.preventDefault();
          navigatePhoto(1);
        }
      }
    });
  }

    // Open album in overlay
    function openAlbum(albumItem) {
    if (isTransitioning) return;

    isTransitioning = true;
    const overlay = document.querySelector('.portfolio-overlay');
    const stage = overlay.querySelector('.overlay-stage');

    // Clear previous content
    stage.innerHTML = '';

    // Get album data
    const imgs = Array.from(albumItem.querySelectorAll('.deck-img'));
    currentAlbumImgs = imgs.map(img => ({
      src: img.getAttribute('src'),
      alt: img.getAttribute('alt')
    }));

    const title = albumItem.querySelector('.portfolio-title')?.textContent || '';
    const desc = albumItem.querySelector('.portfolio-text')?.textContent || '';

    // Create bloom items
    createBloomItems(stage, imgs);

    // Set metadata
    setOverlayMeta(overlay, title, desc);

    // Show overlay
    overlay.style.display = 'flex';
    setTimeout(() => {
      overlay.classList.add('active');
      isTransitioning = false;
    }, 50);

    // Start bloom animation
    setTimeout(() => {
      stage.querySelectorAll('.bloom-item').forEach(item => {
        item.classList.add('bloom-in');
      });
    }, 100);
  }

  // Create bloom items
  function createBloomItems(stage, imgs) {
    const n = imgs.length;
    const radius = window.innerWidth < 900 ? RADIUS_MOBILE : BASE_RADIUS;
    const angleStep = 360 / Math.max(n, 1);

    imgs.forEach((imgEl, i) => {
      const bloomItem = document.createElement('div');
      bloomItem.className = 'bloom-item';

      // Set size class
      if (i === 0) bloomItem.classList.add('size-large');
      else if (n <= 3) bloomItem.classList.add('size-medium');
      else bloomItem.classList.add(i % 2 === 0 ? 'size-medium' : 'size-small');

      // Create image
      const img = document.createElement('img');
      img.src = imgEl.getAttribute('src');
      img.alt = imgEl.getAttribute('alt') || `Photo ${i + 1}`;
      bloomItem.appendChild(img);

      // Calculate position
      const deg = (i * angleStep) - (angleStep * (n / 2)) + (Math.random() * 12 - 6);
      const rad = deg * Math.PI / 180;
      const dist = radius * (0.6 + 0.6 * (i / Math.max(1, n - 1)));
      const tx = Math.round(Math.cos(rad) * dist);
      const ty = Math.round(Math.sin(rad) * dist);
      const rot = Math.round((Math.random() * 30 - 15));

      bloomItem.style.setProperty('--tx', `${tx}px`);
      bloomItem.style.setProperty('--ty', `${ty}px`);
      bloomItem.style.setProperty('--rot', `${rot}deg`);
      bloomItem.style.transitionDelay = `${(i * 70) + 30}ms`;

      stage.appendChild(bloomItem);
    });
  }

  // Set overlay metadata
  function setOverlayMeta(overlay, title, desc) {
    const meta = overlay.querySelector('.overlay-meta');
    meta.innerHTML = `
      <h3 style="margin:0 0 .25rem;color:#fff;">${escapeHtml(title)}</h3>
      <div style="color:#ddd; max-width:760px; opacity:0.95;">${escapeHtml(desc)}</div>
    `;
  }

  // Show overlay (from fullscreen)
  function showOverlay() {
    if (isTransitioning) return;

    isTransitioning = true;
    const overlay = document.querySelector('.portfolio-overlay');
    overlay.style.display = 'flex';
    setTimeout(() => {
      overlay.classList.add('active');
      isTransitioning = false;
    }, 50);

    // Show back button
    overlay.querySelector('.overlay-back').style.display = 'inline-flex';

    // Re-animate bloom items
    setTimeout(() => {
      const stage = overlay.querySelector('.overlay-stage');
      stage.querySelectorAll('.bloom-item').forEach(item => {
        item.classList.add('bloom-in');
      });
    }, 100);
  }

  // Close overlay
  function closeOverlay() {
    if (isTransitioning) return;

    isTransitioning = true;
    const overlay = document.querySelector('.portfolio-overlay');

    // Remove bloom animations first
    const stage = overlay.querySelector('.overlay-stage');
    stage.querySelectorAll('.bloom-item').forEach(item => {
      item.classList.remove('bloom-in');
    });

    overlay.classList.remove('active');
    setTimeout(() => {
      overlay.style.display = 'none';
      stage.innerHTML = '';
      overlay.querySelector('.overlay-meta').innerHTML = '';
      overlay.querySelector('.overlay-back').style.display = 'none';

      // Reset state
      currentAlbumImgs = [];
      currentFsIndex = 0;
      isTransitioning = false;
    }, 300);
  }

  // Open fullscreen view
  function openFullscreen(index) {
    if (isTransitioning) return;

    isTransitioning = true;
    currentFsIndex = index;

    const fullscreen = document.querySelector('.fullscreen-view');
    const img = fullscreen.querySelector('.fs-img');
    const caption = fullscreen.querySelector('.fullscreen-caption');

    // Set image and caption
    const currentImg = currentAlbumImgs[index];
    img.src = currentImg.src;
    img.alt = currentImg.alt || '';
    caption.textContent = currentImg.alt || '';

    // Hide overlay first
    const overlay = document.querySelector('.portfolio-overlay');
    overlay.classList.remove('active');

    // Show fullscreen
    setTimeout(() => {
      fullscreen.style.display = 'flex';
      setTimeout(() => {
        fullscreen.classList.add('active');
        updateNavigation();
        isTransitioning = false;
      }, 50);
    }, 200);
  }

  // Close fullscreen view
  function closeFullscreen() {
    if (isTransitioning) return;

    isTransitioning = true;
    const fullscreen = document.querySelector('.fullscreen-view');

    fullscreen.classList.remove('active');
    setTimeout(() => {
      fullscreen.style.display = 'none';
      isTransitioning = false;
    }, 250);
  }

  // Navigate between photos
  function navigatePhoto(direction) {
    if (isTransitioning || currentAlbumImgs.length <= 1) return;

    currentFsIndex = (currentFsIndex + direction + currentAlbumImgs.length) % currentAlbumImgs.length;

    const fullscreen = document.querySelector('.fullscreen-view');
    const img = fullscreen.querySelector('.fs-img');
    const caption = fullscreen.querySelector('.fullscreen-caption');

    const currentImg = currentAlbumImgs[currentFsIndex];
    img.src = currentImg.src;
    img.alt = currentImg.alt || '';
    caption.textContent = currentImg.alt || '';

    updateNavigation();
  }

  // Update navigation buttons visibility
  function updateNavigation() {
    const fullscreen = document.querySelector('.fullscreen-view');
    const leftBtn = fullscreen.querySelector('.nav-left');
    const rightBtn = fullscreen.querySelector('.nav-right');

    if (currentAlbumImgs.length <= 1) {
      leftBtn.style.display = 'none';
      rightBtn.style.display = 'none';
    } else {
      leftBtn.style.display = 'inline-flex';
      rightBtn.style.display = 'inline-flex';
    }
  }

  // Escape HTML
  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Start the gallery
  init();
}) ();

// Theme toggle functionality
// Enhanced Theme toggle functionality
// const themeToggle = document.querySelector("[data-theme-toggle]");
// const body = document.body;

// // Check for saved theme preference or default to dark
// const currentTheme = localStorage.getItem("theme") || "dark";
// body.setAttribute("data-theme", currentTheme);
// updateThemeIcon(currentTheme);

// // Toggle theme function
// function toggleTheme() {
//   const currentTheme = body.getAttribute("data-theme");
//   const newTheme = currentTheme === "dark" ? "light" : "dark";
  
//   body.setAttribute("data-theme", newTheme);
//   localStorage.setItem("theme", newTheme);
//   updateThemeIcon(newTheme);
// }

// // Update theme icon based on current theme
// function updateThemeIcon(theme) {
//   const icon = themeToggle.querySelector("ion-icon");
//   if (theme === "dark") {
//     icon.setAttribute("name", "sunny");
//     icon.setAttribute("title", "Switch to light mode");
//   } else {
//     icon.setAttribute("name", "moon");
//     icon.setAttribute("title", "Switch to dark mode");
//   }
// }

// // Add event listener to theme toggle button
// if (themeToggle) {
//   themeToggle.addEventListener("click", toggleTheme);
// }
// // Force theme icon visibility on load
// document.addEventListener('DOMContentLoaded', function() {
//   const themeToggle = document.querySelector("[data-theme-toggle]");
//   const currentTheme = localStorage.getItem("theme") || "dark";
  
//   if (themeToggle) {
//     const icon = themeToggle.querySelector("ion-icon");
//     if (icon) {
//       // Force set the correct icon name
//       if (currentTheme === "dark") {
//         icon.setAttribute("name", "sunny");
//       } else {
//         icon.setAttribute("name", "moon");
//       }
      
//       // Force display
//       icon.style.display = "block";
//       icon.style.opacity = "1";
//       icon.style.visibility = "visible";
//     }
//   }
// });
 // Simple and reliable theme toggle
document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const body = document.body;
  
  // Get current theme or set default to dark
  let currentTheme = localStorage.getItem('theme') || 'dark';
  body.setAttribute('data-theme', currentTheme);
  
  // Set initial icon
  updateThemeIcon(currentTheme);
  
  // Theme toggle function
  function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon(currentTheme);
  }
  
  // Update icon function
  function updateThemeIcon(theme) {
    if (!themeToggle) return;
    
    const icon = themeToggle.querySelector('ion-icon');
    if (!icon) return;
    
    // Remove existing icon
    icon.remove();
    
    // Create new icon with correct name
    const newIcon = document.createElement('ion-icon');
    
    if (theme === 'dark') {
      newIcon.setAttribute('name', 'sunny');
      newIcon.setAttribute('title', 'Switch to light mode');
    } else {
      newIcon.setAttribute('name', 'moon');
      newIcon.setAttribute('title', 'Switch to dark mode');
    }
    
    themeToggle.appendChild(newIcon);
  }
  
  // Add click event
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
}); 


//deployment data
// js/main.js - YOUR MAIN FRONTEND CODE

class PortfolioApp {
    constructor() {
        this.init();
    }

    async init() {
        // Wait for DOM to load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.loadData());
        } else {
            this.loadData();
        }
    }

    async loadData() {
        try {
            // Example 1: Fetch GitHub stats
            const githubStats = await this.fetchGitHubStats();
            this.displayGitHubStats(githubStats);

            // Example 2: Fetch project data
            const projects = await this.fetchProjects();
            this.displayProjects(projects);

            // Example 3: Fetch contact info
            const contactInfo = await this.fetchContactInfo();
            this.displayContactInfo(contactInfo);

        } catch (error) {
            console.error('Error loading portfolio data:', error);
        }
    }

    // Call your Netlify function for GitHub data
    async fetchGitHubStats(username = 'your-username') {
        const response = await fetch(`/.netlify/functions/proxy?type=github&username=${username}`);
        if (!response.ok) throw new Error('Failed to fetch GitHub data');
        return await response.json();
    }

    // Call your Netlify function for projects
    async fetchProjects() {
        const response = await fetch('/.netlify/functions/proxy?type=projects');
        if (!response.ok) throw new Error('Failed to fetch projects');
        return await response.json();
    }

    // Display methods
    displayGitHubStats(data) {
        const statsElement = document.getElementById('github-stats');
        if (statsElement && data) {
            statsElement.innerHTML = `
                <div class="github-card">
                    <h3>GitHub Profile</h3>
                    <p>📊 Followers: ${data.followers}</p>
                    <p>💻 Public Repos: ${data.public_repos}</p>
                    <p>📍 ${data.location || 'Not specified'}</p>
                    <a href="${data.html_url}" target="_blank">View Profile</a>
                </div>
            `;
        }
    }

    displayProjects(projects) {
        const projectsElement = document.getElementById('projects');
        if (projectsElement && projects) {
            projectsElement.innerHTML = projects.map(project => `
                <div class="project-card">
                    <h4>${project.name}</h4>
                    <p>${project.description}</p>
                    <a href="${project.url}" target="_blank">View Project</a>
                </div>
            `).join('');
        }
    }
}

// Initialize your portfolio app
const portfolioApp = new PortfolioApp();

function getTimeBasedGreeting() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 17) return "Good afternoon";
    if (hour >= 17 && hour < 21) return "Good evening";
    return "Good night";
  }
  
  function updateGreeting() {
    const greeting = getTimeBasedGreeting();
    const greetingElement = document.querySelector('.dynamic-greeting');
    
    if (greetingElement) {
      greetingElement.style.opacity = '0';
      setTimeout(() => {
        // Use innerHTML to include the waving hand span
        greetingElement.innerHTML = `Hello, ${greeting}! <span class="greeting-hand">👋</span>`;
        greetingElement.style.opacity = '1';
      }, 200);
    }
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    updateGreeting();
    setInterval(updateGreeting, 60000);
  });
}