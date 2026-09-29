document.addEventListener('DOMContentLoaded', () => {

    const container = document.getElementById('carousel-container');
    const isMobile = () => window.innerWidth <= 768;

    // --- 1. Mouse wheel / trackpad scrolls the carousel sideways (desktop only) ---
    container.addEventListener('wheel', (e) => {
        if (isMobile()) return;
        e.preventDefault();
        const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        container.scrollLeft += delta * (e.deltaMode === 1 ? 32 : 1);
    }, { passive: false });

    // --- 1b. Touch scroll with momentum (mobile) ---
    let touchLastX = 0;
    let touchLastTime = 0;
    let velocity = 0;
    let momentumRAF = null;

    container.addEventListener('touchstart', (evt) => {
        touchLastX = evt.touches[0].clientX;
        touchLastTime = Date.now();
        velocity = 0;
        if (momentumRAF) {
            cancelAnimationFrame(momentumRAF);
            momentumRAF = null;
        }
    }, { passive: true });

    container.addEventListener('touchmove', (evt) => {
        const now = Date.now();
        const x = evt.touches[0].clientX;
        const dx = touchLastX - x;        // positive = scrolling right
        const dt = now - touchLastTime || 1;

        // Exponentially smooth velocity (px/ms)
        const instantV = dx / dt;
        velocity = velocity * 0.6 + instantV * 0.4;

        container.scrollLeft += dx;
        touchLastX = x;
        touchLastTime = now;
    }, { passive: true });

    container.addEventListener('touchend', () => {
        const FRICTION = 0.92;     // multiplied each frame; higher = glides longer
        const MIN_VELOCITY = 0.08; // px/ms threshold to stop the animation

        function momentum() {
            if (Math.abs(velocity) < MIN_VELOCITY) {
                velocity = 0;
                return;
            }
            container.scrollLeft += velocity * 16; // ~16ms per frame at 60fps
            velocity *= FRICTION;
            momentumRAF = requestAnimationFrame(momentum);
        }

        momentumRAF = requestAnimationFrame(momentum);
    }, { passive: true });

    // --- 2. Year display follows the card closest to center ---
    const yearDisplay = document.getElementById('year-display');
    const cards = [...document.querySelectorAll('.project-card')];

    function updateYearDisplay() {
        const center = container.scrollLeft + container.clientWidth / 2;
        let closest = cards[0];
        let min = Infinity;

        cards.forEach(card => {
            const d = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
            if (d < min) { min = d; closest = card; }
        });

        const year = closest.dataset.year;
        if (year !== yearDisplay.textContent) {
            yearDisplay.style.opacity = 0;
            setTimeout(() => {
                yearDisplay.textContent = year;
                yearDisplay.style.opacity = 1;
            }, 200);
        }
    }

    container.addEventListener('scroll', updateYearDisplay, { passive: true });
    setTimeout(updateYearDisplay, 50);

    // --- 3. Modals ---
    const aboutModal = document.getElementById('about-modal');
    const projectModal = document.getElementById('project-modal');
    const resumeModal = document.getElementById('resume-modal');
    const allModals = document.querySelectorAll('.modal-overlay');
    const closeAll = () => allModals.forEach(m => m.classList.add('hidden'));

    document.getElementById('about-btn').addEventListener('click', (e) => {
        e.preventDefault();
        aboutModal.classList.remove('hidden');
    });

    // Desktop: preview in a modal. Mobile: let the link open the PDF in a new tab.
    document.getElementById('resume-view-btn').addEventListener('click', (e) => {
        if (isMobile()) return;
        e.preventDefault();
        const frame = document.getElementById('resume-iframe');
        if (!frame.getAttribute('src')) frame.src = frame.dataset.src;
        resumeModal.classList.remove('hidden');
    });

    document.querySelectorAll('.close-btn').forEach(btn => btn.addEventListener('click', closeAll));
    allModals.forEach(m => m.addEventListener('click', (e) => { if (e.target === m) closeAll(); }));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAll(); });

    // --- 4. Project modal (content comes from data attributes; see index.html) ---
    const el = (tag, text) => {
        const node = document.createElement(tag);
        node.textContent = text;
        return node;
    };

    window.openProject = function (box) {
        const d = box.dataset;

        document.getElementById('modal-title').textContent = d.title;
        document.getElementById('modal-summary').textContent = d.summary;
        document.getElementById('modal-points').replaceChildren(
            ...d.points.split('|').map(t => el('li', t.trim()))
        );
        document.getElementById('modal-tags').replaceChildren(
            ...d.tags.split('|').map(t => el('span', t.trim()))
        );
        document.getElementById('modal-gallery').classList.toggle('fit', d.fit === 'screen');
        document.getElementById('modal-gallery').replaceChildren(
            ...d.gallery.split('|').map(item => {
                const [src, caption] = item.split('::');
                const fig = document.createElement('figure');
                const img = new Image();
                img.src = src.trim();
                img.alt = caption || d.title;
                img.onerror = () => fig.remove(); // skip missing images
                fig.append(img);
                if (caption) fig.append(el('figcaption', caption.trim()));
                return fig;
            })
        );

        projectModal.querySelector('.modal-content').scrollTop = 0;
        projectModal.classList.remove('hidden');
    };

    // Keyboard access: Tab to a project image, Enter or Space opens it
    document.querySelectorAll('.image-box').forEach(box => {
        box.setAttribute('role', 'button');
        box.tabIndex = 0;
        box.setAttribute('aria-label', 'View ' + box.dataset.title);
        box.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.openProject(box);
            }
        });
    });
});
