document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ==========================================================================
    // CONFIGURATION
    // ==========================================================================
    // UPDATE THIS WITH THE TATTOO ARTIST'S WHATSAPP NUMBER (including country code)
    // Example: '5511999999999' for Brazil (+55), SP (11)
    const WHATSAPP_NUMBER = '5511999999999';

    // ==========================================================================
    // CUSTOM CURSOR
    // ==========================================================================
    const cursorOuter = document.getElementById('cursor-outer');
    const cursorInner = document.getElementById('cursor-inner');
    const isHoverable = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (isHoverable && cursorOuter && cursorInner) {
        let mouseX = 0, mouseY = 0;
        let outerX = 0, outerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Inner cursor follows mouse instantly
            cursorInner.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        });

        // Outer cursor follows with a slight inertia/delay
        const renderCursor = () => {
            const ease = 0.15; // Speed of inertia
            outerX += (mouseX - outerX) * ease;
            outerY += (mouseY - outerY) * ease;
            
            cursorOuter.style.transform = `translate(${outerX}px, ${outerY}px) translate(-50%, -50%)`;
            
            requestAnimationFrame(renderCursor);
        };
        renderCursor();

        // Add hover effects on interactive elements
        const hoverables = document.querySelectorAll('a, button, select, input, textarea, .filter-btn, .portfolio-item');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOuter.classList.add('custom-cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                cursorOuter.classList.remove('custom-cursor-hover');
            });
        });
    } else {
        // Hide cursors on touch screens
        if (cursorOuter) cursorOuter.style.display = 'none';
        if (cursorInner) cursorInner.style.display = 'none';
    }

    // ==========================================================================
    // NAVIGATION SCROLL EFFECT
    // ==========================================================================
    const header = document.getElementById('main-header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    // ==========================================================================
    // MOBILE MENU
    // ==========================================================================
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    const openMenu = () => {
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock scrolling
    };

    const closeMenu = () => {
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Unlock scrolling
    };

    if (mobileMenuToggle) mobileMenuToggle.addEventListener('click', openMenu);
    if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMenu);

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // ==========================================================================
    // PORTFOLIO FILTERING
    // ==========================================================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active to current
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    item.classList.remove('hidden');
                    // Add micro-animation delay on show
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    // Delay display: none to match fade transition
                    setTimeout(() => {
                        item.classList.add('hidden');
                    }, 300);
                }
            });
        });
    });

    // ==========================================================================
    // PORTFOLIO LIGHTBOX MODAL
    // ==========================================================================
    const lightbox = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCategory = document.getElementById('lightbox-category');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxClose = document.getElementById('lightbox-close');

    portfolioItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const category = item.querySelector('.item-category').textContent;
            const title = item.querySelector('.item-title').textContent;

            if (lightbox && lightboxImg && lightboxCategory && lightboxTitle) {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightboxCategory.textContent = category;
                lightboxTitle.textContent = title;
                
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    const closeLightbox = () => {
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    
    // Close lightbox on click outside the image
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
            closeMenu();
        }
    });

    // ==========================================================================
    // SCROLL REVEAL (INTERSECTION OBSERVER)
    // ==========================================================================
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // ==========================================================================
    // WHATSAPP BOOKING FORM HANDLER
    // ==========================================================================
    const bookingForm = document.getElementById('booking-form');

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Gather inputs
            const name = document.getElementById('input-name').value.trim();
            const phone = document.getElementById('input-phone').value.trim();
            const style = document.getElementById('select-style').value;
            const placement = document.getElementById('input-placement').value.trim();
            const size = document.getElementById('input-size').value.trim();
            const idea = document.getElementById('input-idea').value.trim();

            // Construct Whatsapp Message
            const message = 
`Olá Clara! Gostaria de solicitar um orçamento para uma tatuagem.

*Detalhes do Projeto:*
- *Nome:* ${name}
- *WhatsApp:* ${phone}
- *Estilo:* ${style}
- *Local do Corpo:* ${placement}
- *Tamanho Aproximado:* ${size}

*Descrição da Ideia:*
${idea}`;

            // URL Encode the message
            const encodedMessage = encodeURIComponent(message);
            
            // Build final WhatsApp link
            const waLink = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodedMessage}`;

            // Open in new tab
            window.open(waLink, '_blank');
        });
    }
});
