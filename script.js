document.addEventListener('DOMContentLoaded', () => {
    
// --- 1. Horizontal Scroll via Mouse Wheel & Trackpad ---
	const container = document.getElementById('carousel-container');

    // NEW: Define a uniform speed multiplier to increase scroll responsiveness
    const SPEED_MULTIPLIER = 1; 

    container.addEventListener('wheel', (evt) => {
        // Only run custom JS scrolling logic if screen width is > 768px (desktop/tablet)
        if (window.innerWidth > 1) {
            
            // Prevent default page scrolling
            evt.preventDefault();
            
            // --- Unified 1:1 Scroll Logic ---
            let scrollAmount = 0;

            // Use the larger of deltaX or deltaY for the horizontal movement
            // This ensures both vertical (wheel) and horizontal (trackpad) input scrolls the carousel.
            if (Math.abs(evt.deltaX) > Math.abs(evt.deltaY)) {
                scrollAmount = evt.deltaX;
            } else {
                scrollAmount = evt.deltaY;
            }
            
            // FIX: Apply the SPEED_MULTIPLIER to increase the scroll distance per tick
            container.scrollLeft += scrollAmount * SPEED_MULTIPLIER;
        }
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
                const year = entry.target.getAttribute('data-year');
                yearDisplay.style.opacity = 0;
                setTimeout(() => {
                    yearDisplay.textContent = year;
                    yearDisplay.style.opacity = 1;
                }, 200);
            }
        });
    }, observerOptions);

    cards.forEach(card => observer.observe(card));

    // --- 3. Modal Logic (About, Projects, & RESUME) ---
    
    // Elements
    const aboutBtn = document.getElementById('about-btn');
    const resumeViewBtn = document.getElementById('resume-view-btn'); // New Resume view button
    const aboutModal = document.getElementById('about-modal');
    const projectModal = document.getElementById('project-modal');
    const resumeModal = document.getElementById('resume-modal'); // New Resume modal
    const closeBtns = document.querySelectorAll('.close-btn');

    // Open About
    aboutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        aboutModal.classList.remove('hidden');
    });

    // Open Resume View (when 'Resume' text is clicked)
    resumeViewBtn.addEventListener('click', (e) => {
        e.preventDefault();
        resumeModal.classList.remove('hidden');
    });

    // Close Modals (X button)
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            aboutModal.classList.add('hidden');
            projectModal.classList.add('hidden');
            resumeModal.classList.add('hidden');
        });
    });

    // Close Modals (clicking outside)
    window.addEventListener('click', (e) => {
        if (e.target === aboutModal) aboutModal.classList.add('hidden');
        if (e.target === projectModal) projectModal.classList.add('hidden');
        if (e.target === resumeModal) resumeModal.classList.add('hidden');
    });

    // --- 4. Project Click Logic (Global Function) ---
    window.openProject = function(element) {
        const title = element.getAttribute('data-title');
        const desc = element.getAttribute('data-desc');
        const imgSrc = element.getAttribute('data-img');

        document.getElementById('modal-title').innerText = title;
        document.getElementById('modal-desc').innerText = desc;
        document.getElementById('modal-img').src = imgSrc;

        projectModal.classList.remove('hidden');
    };
});