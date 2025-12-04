document.addEventListener('DOMContentLoaded', () => {
    
// --- 1. Horizontal Scroll via Mouse Wheel & Trackpad ---
	const container = document.getElementById('carousel-container');

    container.addEventListener('wheel', (evt) => {
        // Only run custom JS scrolling logic if screen width is > 768px (desktop/tablet)
        if (window.innerWidth > 768) {
            evt.preventDefault();
            
            // --- Device-Specific Speed Control & Detection ---
            const trackpadSpeed = 80; 
            const mouseWheelSpeed = 3;  
            let scrollSpeed;
            let scrollAmount = 0;

            // HEURISTIC: Distinguish between Mouse Wheel and Trackpad
            const isMouseWheel = evt.deltaMode === 1 || evt.deltaMode === 2 || (evt.deltaMode === 0 && Math.abs(evt.deltaY) > 30);
            
            if (isMouseWheel) {
                // SCROLL WHEEL (Mouse) Logic: Vertical wheel motion translates to horizontal scroll
                scrollSpeed = mouseWheelSpeed;
                
                // Prioritize horizontal input (deltaX), fall back to vertical (deltaY)
                if (Math.abs(evt.deltaY) > Math.abs(evt.deltaX)) {
                    scrollAmount = evt.deltaY;
                } else {
                    scrollAmount = evt.deltaX;
                }
                
            } else {
                // TRACKPAD (Heuristic) Logic: Only allow horizontal motion (deltaX)
                scrollSpeed = trackpadSpeed;

                // CRITICAL FIX: Only use deltaX for trackpads. IGNORE deltaY.
                if (Math.abs(evt.deltaX) > 0.1) {
                    scrollAmount = evt.deltaX;
                } else {
                    return; // Stop processing if it's vertical trackpad scroll (deltaY)
                }
            }

            // Apply the device-specific speed and direction
            container.scrollLeft += scrollAmount * scrollSpeed;
        }
        // Note: Mobile touch scroll is handled naturally by CSS (-webkit-overflow-scrolling: touch)
    });

    // --- 2. Timeline "Year" Update Logic ---
    // ... (rest of the code is unchanged) ...
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