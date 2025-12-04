document.addEventListener('DOMContentLoaded', () => {
    
// --- 1. Horizontal Scroll via Mouse Wheel ---
const container = document.getElementById('carousel-container');

container.addEventListener('wheel', (evt) => {
    evt.preventDefault();
    
    // Keeping scrollSpeed high (20) for rapid movement
    const scrollSpeed = 20; 

    container.scrollBy({
        left: evt.deltaY * scrollSpeed,
        // CHANGED: 'smooth' reintroduces the continuous animation 
        // needed for a good trackpad feel.
        behavior: 'smooth' 
    });
});
    // --- 2. Timeline "Year" Update Logic ---
    const yearDisplay = document.getElementById('year-display');
    const cards = document.querySelectorAll('.project-card');

    // Intersection Observer sees which card is currently centered in the view
    const observerOptions = {
        root: container,
        threshold: 0.6 // Trigger when 60% of the card is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Get the year from the data attribute
                const year = entry.target.getAttribute('data-year');
                
                // Animate/Update the text
                yearDisplay.style.opacity = 0;
                setTimeout(() => {
                    yearDisplay.textContent = year;
                    yearDisplay.style.opacity = 1;
                }, 200);
            }
        });
    }, observerOptions);

    cards.forEach(card => observer.observe(card));

    // --- 3. Modal Logic (About & Projects) ---
    
    // Elements
    const aboutBtn = document.getElementById('about-btn');
    const aboutModal = document.getElementById('about-modal');
    const projectModal = document.getElementById('project-modal');
    const closeBtns = document.querySelectorAll('.close-btn');

    // Open About
    aboutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        aboutModal.classList.remove('hidden');
    });

    // Close Modals (X button or clicking outside)
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            aboutModal.classList.add('hidden');
            projectModal.classList.add('hidden');
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target === aboutModal) aboutModal.classList.add('hidden');
        if (e.target === projectModal) projectModal.classList.add('hidden');
    });

    // --- 4. Project Click Logic (Global Function) ---
    window.openProject = function(element) {
        const title = element.getAttribute('data-title');
        const desc = element.getAttribute('data-desc');
        const imgSrc = element.getAttribute('data-img');

        // Populate Modal
        document.getElementById('modal-title').innerText = title;
        document.getElementById('modal-desc').innerText = desc;
        document.getElementById('modal-img').src = imgSrc;

        // Show Modal
        projectModal.classList.remove('hidden');
    };
});