document.addEventListener('DOMContentLoaded', () => {
    
    /* =======================================
       1. PRELOADER ENGINE
       ======================================= */
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.display = 'none';
    }
    document.body.classList.remove('loading');
    
    // Initialize hero animations immediately
    setTimeout(() => {
        if (typeof initHeroAnimations === 'function') {
            initHeroAnimations();
        }
    }, 50);

    /* =======================================
       2. SCROLL PROGRESS BAR
       ======================================= */
    const scrollProgress = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = `${scrolled}%`;
    });

    /* =======================================
       3. NAVBAR & THEME TOGGLE
       ======================================= */
    const navbar = document.getElementById('navbar');
    const themeToggle = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;
    const themeIcon = themeToggle.querySelector('i');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const backToTop = document.getElementById('back-to-top');

    // Theme Init
    const savedTheme = localStorage.getItem('chamunda-theme-v2') || 'light';
    htmlEl.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const current = htmlEl.getAttribute('data-theme');
        const nextTheme = current === 'light' ? 'dark' : 'light';
        htmlEl.setAttribute('data-theme', nextTheme);
        localStorage.setItem('chamunda-theme-v2', nextTheme);
        updateThemeIcon(nextTheme);
    });

    function updateThemeIcon(theme) {
        if(theme === 'dark') {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        }
    }

    // Scroll Logic
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
        
        if (backToTop) {
            if (window.scrollY > 600) backToTop.classList.add('visible');
            else backToTop.classList.remove('visible');
        }
    });

    if (backToTop) {
        backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // Mobile Menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    /* =======================================
       4. HERO PARALLAX & PARTICLES & TYPEWRITER
       ======================================= */
    const heroBg = document.getElementById('hero-bg');
    
    // Parallax
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const scroll = window.scrollY;
            if(scroll < window.innerHeight) {
                heroBg.style.transform = `translateY(${scroll * 0.4}px)`;
            }
        });
    }

    // Particles Engine
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        for(let i=0; i<30; i++) {
            const p = document.createElement('div');
            p.classList.add('particle');
            const size = Math.random() * 4 + 2;
            p.style.width = `${size}px`;
            p.style.height = `${size}px`;
            p.style.left = `${Math.random() * 100}%`;
            p.style.top = `${Math.random() * 100 + 100}%`;
            p.style.animationDuration = `${Math.random() * 10 + 10}s`;
            p.style.animationDelay = `${Math.random() * 5}s`;
            particlesContainer.appendChild(p);
        }
    }

    // Typewriter
    const sentences = [
        "Curated Luxury Experiences.",
        "Unforgettable Global Journeys.",
        "Bespoke Honeymoon Packages.",
        "The Pinnacle of Travel."
    ];
    let sentIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeTarget = document.getElementById('typewriter');

    function typeWriter() {
        if(!typeTarget) return;
        const currentSentence = sentences[sentIndex];
        
        if(isDeleting) {
            typeTarget.textContent = currentSentence.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typeTarget.textContent = currentSentence.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if(!isDeleting && charIndex === currentSentence.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            sentIndex = (sentIndex + 1) % sentences.length;
            typeSpeed = 500;
        }

        setTimeout(typeWriter, typeSpeed);
    }

    function initHeroAnimations() {
        typeWriter();
    }

    /* =======================================
       5. AUTOCOMPLETE SEARCH MOCK
       ======================================= */
    const destInput = document.getElementById('dest-input');
    const autoList = document.getElementById('autocomplete-list');
    const locations = ["Kashmir, India", "Bali, Indonesia", "Dubai, UAE", "Zurich, Switzerland", "Male, Maldives", "Goa, India", "Jaipur, Rajasthan", "Phuket, Thailand", "Singapore", "Manali, India"];

    if(destInput) {
        destInput.addEventListener('input', (e) => {
            const val = e.target.value.toLowerCase();
            autoList.innerHTML = '';
            if(!val) {
                autoList.classList.remove('active');
                return;
            }
            const matches = locations.filter(loc => loc.toLowerCase().includes(val));
            if(matches.length > 0) {
                matches.forEach(match => {
                    const li = document.createElement('li');
                    li.innerHTML = `<i class="fa-solid fa-location-dot text-gold mr-2"></i> ${match}`;
                    li.addEventListener('click', () => {
                        destInput.value = match;
                        autoList.classList.remove('active');
                        // Automatically trigger search
                        const mainSearch = document.getElementById('main-search');
                        if (mainSearch) {
                            mainSearch.dispatchEvent(new Event('submit', { cancelable: true }));
                        }
                    });
                    autoList.appendChild(li);
                });
                autoList.classList.add('active');
            } else {
                autoList.classList.remove('active');
            }
        });
        
        document.addEventListener('click', (e) => {
            if(e.target !== destInput) autoList.classList.remove('active');
        });
    }

    /* =======================================
       6. INTERSECTION OBSERVER REVEAL & COUNTERS
       ======================================= */
    const revealEls = document.querySelectorAll('.reveal');
    const counters = document.querySelectorAll('.counter');
    
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    
    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('active');
                obs.unobserve(entry.target);
                
                // If it's a counter, animate it
                if(entry.target.classList.contains('stat-card')) {
                    const counterEl = entry.target.querySelector('.counter');
                    if(counterEl) runCounter(counterEl);
                }
            }
        });
    }, observerOptions);

    revealEls.forEach(el => revealObserver.observe(el));

    function runCounter(el) {
        const target = +el.getAttribute('data-target');
        const duration = 2000;
        const stepTime = Math.abs(Math.floor(duration / target));
        let curr = 0;
        
        // Fast counter logic for large numbers
        const inc = target > 1000 ? Math.ceil(target / 100) : 1;
        
        const timer = setInterval(() => {
            curr += inc;
            if(curr >= target) {
                el.innerText = target.toLocaleString() + '+';
                clearInterval(timer);
            } else {
                el.innerText = curr.toLocaleString() + '+';
            }
        }, stepTime);
    }

    /* =======================================
       6. DESTINATION MODALS
       ======================================= */
    const modalOverlay = document.getElementById('modal-overlay');
    const destModal = document.getElementById('dest-modal');
    const modalClose = document.querySelector('.modal-close');
    const modalBody = document.querySelector('.modal-body');

    window.destData = {
        'Kashmir': { img: 'assets/images/kashmir.png', desc: 'Experience the paradise on earth. Explore Dal Lake, Gulmarg, and stay in premium houseboats.', price: '₹15,999' },
        'Maldives': { img: 'assets/images/maldives.png', desc: 'The ultimate tropical luxury escape. Overwater bungalows and private turquoise waters.', price: '₹1,20,000' },
        'Bali': { img: 'assets/images/bali.png', desc: 'Spiritual awakening and lush tropical jungles meet extreme 5-star luxury.', price: '₹45,000' },
        'Switzerland': { img: 'assets/images/manali.png', desc: 'Breathtaking alpine scenery, luxury ski resorts, and the finest chocolates.', price: '₹1,50,000' },
        'Dubai': { img: 'assets/images/singapore.png', desc: 'Ultra-modern luxury, massive shopping hubs, and desert safaris.', price: '₹55,000' },
        'Thailand': { img: 'assets/images/thailand.png', desc: 'Emerald waters, limestone cliffs, and ultra-premium beach resorts.', price: '₹35,000' },
        'Goa': { img: 'assets/images/goa-deal.png', desc: 'Ultra-Luxury Beach Resort, vibrant nightlife, and Portuguese heritage.', price: '₹25,000' },
        'Rajasthan': { img: 'assets/images/rajasthan.png', desc: 'Royal heritage, magnificent palaces, and golden deserts.', price: '₹40,000' },
        'Singapore': { img: 'assets/images/singapore.png', desc: 'Futuristic gardens, infinity pools, and luxury escapades.', price: '₹85,000' },
        'Manali': { img: 'assets/images/manali.png', desc: 'Snow-capped peaks, luxury mountain retreats, and pine forests.', price: '₹18,000' }
    };

    window.openDestinationModal = function(name) {
        localStorage.setItem('selectedDest', name);
        const data = window.destData[name] || window.destData['Kashmir'];
        
        modalBody.innerHTML = `
            <img src="${data.img}" class="modal-header-img" alt="${name}">
            <div class="modal-text-content">
                <h2>${name}</h2>
                <p style="font-size: 1.2rem; margin-bottom: 20px; color: var(--clr-text-muted)">${data.desc}</p>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top: 30px; padding-top:20px; border-top:1px solid rgba(128,128,128,0.2)">
                    <div>
                        <span style="display:block; font-size:0.9rem; text-transform:uppercase;">Starting from</span>
                        <span style="font-size: 2rem; font-weight:700; color: var(--clr-luxury-gold)">${data.price}</span>
                    </div>
                    <a href="book-package.html?pkg=${name.toLowerCase()}" class="btn btn-primary btn-lg ripple" style="text-decoration:none;">Book Package</a>
                </div>
            </div>
        `;
        destModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    if(modalClose) {
        modalClose.addEventListener('click', () => {
            destModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }

    /* =======================================
       8. PACKAGE FILTERING
       ======================================= */
    const filterTabs = document.querySelectorAll('.filter-tab');
    const pkgCards = document.querySelectorAll('.pkg-card');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const filter = tab.getAttribute('data-filter');
            
            pkgCards.forEach(card => {
                card.style.transform = 'scale(0.8)';
                card.style.opacity = '0';
                
                setTimeout(() => {
                    if(filter === 'all' || card.getAttribute('data-category').includes(filter)) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.transform = 'scale(1)';
                            card.style.opacity = '1';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                }, 300);
            });
        });
    });

    /* =======================================
       9. COUNTDOWN TIMER
       ======================================= */
    const timerEl = document.querySelector('.timer');
    if(timerEl) {
        const deadline = new Date(timerEl.getAttribute('data-deadline')).getTime();
        const dEl = timerEl.querySelector('.days');
        const hEl = timerEl.querySelector('.hours');
        const mEl = timerEl.querySelector('.mins');
        const sEl = timerEl.querySelector('.secs');

        setInterval(() => {
            const now = new Date().getTime();
            const t = deadline - now;
            if(t < 0) return;

            dEl.innerText = String(Math.floor(t / (1000 * 60 * 60 * 24))).padStart(2, '0');
            hEl.innerText = String(Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
            mEl.innerText = String(Math.floor((t % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
            sEl.innerText = String(Math.floor((t % (1000 * 60)) / 1000)).padStart(2, '0');
        }, 1000);
    }

    /* =======================================
       10. GALLERY LIGHTBOX
       ======================================= */
    const masonryItems = document.querySelectorAll('.masonry-item img');
    const galleryLightbox = document.getElementById('gallery-lightbox');
    const lbImg = document.getElementById('lightbox-img');
    const lbClose = document.querySelector('.lightbox-close');
    const lbNext = document.querySelector('.lightbox-next');
    const lbPrev = document.querySelector('.lightbox-prev');
    let currImgIdx = 0;

    masonryItems.forEach((img, idx) => {
        img.parentNode.addEventListener('click', () => {
            currImgIdx = idx;
            lbImg.src = img.src;
            galleryLightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function navigateLb(dir) {
        currImgIdx += dir;
        if(currImgIdx < 0) currImgIdx = masonryItems.length - 1;
        if(currImgIdx >= masonryItems.length) currImgIdx = 0;
        lbImg.style.transform = 'scale(0.8)';
        lbImg.style.opacity = '0';
        setTimeout(() => {
            lbImg.src = masonryItems[currImgIdx].src;
            lbImg.style.transform = 'scale(1)';
            lbImg.style.opacity = '1';
        }, 200);
    }

    if(galleryLightbox) {
        lbClose.addEventListener('click', () => {
            galleryLightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
        lbNext.addEventListener('click', () => navigateLb(1));
        lbPrev.addEventListener('click', () => navigateLb(-1));
    }

    /* =======================================
       11. TESTIMONIAL CAROUSEL
       ======================================= */
    const track = document.getElementById('testimonial-track');
    if(track) {
        const slides = document.querySelectorAll('.testimonial-slide');
        const dotsContainer = document.getElementById('testi-dots');
        let currentSlide = 0;
        
        slides.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if(i===0) dot.classList.add('active');
            dot.style.width = '12px'; dot.style.height = '12px'; dot.style.borderRadius = '50%';
            dot.style.background = i===0 ? 'var(--clr-luxury-gold)' : 'rgba(128,128,128,0.3)';
            dot.style.cursor = 'pointer';
            dot.style.transition = 'all 0.3s';
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });
        
        function goToSlide(idx) {
            currentSlide = idx;
            if(currentSlide < 0) currentSlide = slides.length - 1;
            if(currentSlide >= slides.length) currentSlide = 0;
            
            track.style.transform = `translateX(-${currentSlide * 100}%)`;
            
            const dotsArr = dotsContainer.children;
            for(let d of dotsArr) {
                d.style.background = 'rgba(128,128,128,0.3)';
                d.classList.remove('active');
            }
            dotsArr[currentSlide].style.background = 'var(--clr-luxury-gold)';
            dotsArr[currentSlide].classList.add('active');
        }
        
        document.querySelector('.prev-testi').addEventListener('click', () => goToSlide(currentSlide - 1));
        document.querySelector('.next-testi').addEventListener('click', () => goToSlide(currentSlide + 1));
    }

    /* =======================================
       12. FAQ ACCORDION
       ======================================= */
    const accHeaders = document.querySelectorAll('.accordion-header');
    accHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isActive = header.classList.contains('active');
            
            accHeaders.forEach(h => {
                h.classList.remove('active');
                h.nextElementSibling.style.maxHeight = null;
            });
            
            if(!isActive) {
                header.classList.add('active');
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    /* =======================================
       13. BOOKING FORM & BUTTON STATES (WHATSAPP)
       ======================================= */
    const bookingForm = document.getElementById('booking-form');
    if(bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = bookingForm.querySelector('.submit-btn');
            const btnText = btn.querySelector('.btn-text');
            const loader = btn.querySelector('.loader-spinner');
            const status = document.getElementById('form-status');
            
            // Get form values
            const inputs = bookingForm.querySelectorAll('.input-field');
            const name = inputs[0].value;
            const email = inputs[1].value;
            const destination = inputs[2].value || 'Not specified';
            const details = inputs[3].value;
            
            // Construct WhatsApp message
            const waNumber = '918780715492';
            const message = `*New Travel Inquiry* %0A%0A*Name:* ${name}%0A*Email:* ${email}%0A*Destination:* ${destination}%0A*Details:* ${details}`;
            const waLink = `https://wa.me/${waNumber}?text=${message}`;
            
            btnText.style.opacity = '0';
            loader.classList.remove('hide');
            btn.disabled = true;
            
            setTimeout(() => {
                btnText.style.opacity = '1';
                loader.classList.add('hide');
                btn.disabled = false;
                bookingForm.reset();
                status.textContent = "Redirecting to WhatsApp...";
                status.style.color = "#10b981";
                
                // Open WhatsApp in new tab
                window.open(waLink, '_blank');
                
                setTimeout(() => status.textContent = "", 5000);
            }, 1000); // reduced delay to 1s for better UX
        });
    }

    /* =======================================
       14. LIVE CHAT WIDGET
       ======================================= */
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const chatClose = document.getElementById('chat-close');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatBody = document.getElementById('chat-body');
    const typingInd = document.getElementById('chat-typing');

    if(chatToggle) {
        chatToggle.addEventListener('click', () => {
            chatWindow.classList.add('active');
            const badge = chatToggle.querySelector('.chat-badge');
            if (badge) badge.style.display = 'none';
        });
        
        chatClose.addEventListener('click', () => chatWindow.classList.remove('active'));
        
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const txt = chatInput.value.trim();
            if(!txt) return;
            
            appendMsg(txt, 'user');
            chatInput.value = '';
            
            typingInd.classList.add('active');
            chatBody.scrollTop = chatBody.scrollHeight;
            
            setTimeout(() => {
                typingInd.classList.remove('active');
                appendMsg("Thank you! Our VIP Concierge will respond to your query momentarily.", 'bot');
            }, 1500);
        });
        
        function appendMsg(text, type) {
            const div = document.createElement('div');
            div.className = `msg-bubble ${type}`;
            div.innerText = text;
            chatBody.insertBefore(div, chatBody.lastElementChild);
            chatBody.scrollTop = chatBody.scrollHeight;
        }
    }

    /* =======================================
       15. LOAD MORE DESTINATIONS
       ======================================= */
    const loadMoreBtn = document.getElementById('load-more-dest');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            this.innerText = "Loading 115 Destinations...";
            this.style.opacity = "0.7";
            this.disabled = true;
            
            setTimeout(() => {
                const showcase = document.querySelector('.destination-showcase');
                if (showcase) {
                    const extraDests = [
                        { name: "London, UK", img: "assets/images/kashmir.png", tags: ["<i class='fa-solid fa-cloud-rain'></i> Classic"], filter: "grayscale(0.5)", stars: "4.7" },
                        { name: "Sydney, AU", img: "assets/images/maldives.png", tags: ["<i class='fa-solid fa-anchor'></i> Harbor"], filter: "hue-rotate(45deg)", stars: "4.8" },
                        { name: "Cape Town, SA", img: "assets/images/bali.png", tags: ["<i class='fa-solid fa-mountain-sun'></i> Scenic"], filter: "contrast(1.2)", stars: "4.9" },
                        { name: "New York, USA", img: "assets/images/manali.png", tags: ["<i class='fa-solid fa-city'></i> Urban"], filter: "hue-rotate(90deg)", stars: "4.6" },
                        { name: "Santorini, GR", img: "assets/images/goa.png", tags: ["<i class='fa-solid fa-water'></i> Coastal"], filter: "sepia(0.3)", stars: "4.9" },
                        { name: "Kyoto, JP", img: "assets/images/singapore.png", tags: ["<i class='fa-solid fa-torii-gate'></i> Heritage"], filter: "hue-rotate(-45deg)", stars: "4.8" }
                    ];
                    
                    // Generate 115 remaining items to reach 124 total
                    for(let i=0; i<115; i++) {
                        const dest = extraDests[i % extraDests.length];
                        const div = document.createElement('div');
                        div.className = "dest-card reveal blur-reveal"; 
                        div.onclick = () => { if(typeof openDestinationModal === 'function') openDestinationModal(dest.name); };
                        div.innerHTML = `
                            <img src="${dest.img}" alt="${dest.name} - Part ${i+1}" loading="lazy" style="filter: ${dest.filter}; width: 100%; height: 100%; object-fit: cover;">
                            <div class="dest-overlay">
                                <div class="dest-tags"><span class="tag glassmorphism">${dest.tags[0]}</span></div>
                                <div class="dest-info">
                                    <h3>${dest.name}</h3>
                                    <div class="dest-meta"><span class="stars"><i class="fa-solid fa-star"></i> ${dest.stars}</span></div>
                                </div>
                            </div>
                        `;
                        showcase.appendChild(div);
                        
                        // Stagger the first few for visual effect, load rest instantly
                        if (i < 24) {
                            setTimeout(() => div.classList.add('active'), 20 + (i * 15));
                        } else {
                            setTimeout(() => div.classList.add('active'), 500);
                        }
                    }
                }
                
                // Hide the button since everything is loaded
                this.style.display = 'none';
            }, 800);
        });
    }

    /* =======================================
       16. VIDEO TOUR MODAL
       ======================================= */
    const playBtn = document.getElementById('play-video');
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            let modal = document.getElementById('dynamic-video-modal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'dynamic-video-modal';
                modal.style.position = 'fixed';
                modal.style.top = '0';
                modal.style.left = '0';
                modal.style.width = '100%';
                modal.style.height = '100%';
                modal.style.backgroundColor = 'rgba(0,0,0,0.9)';
                modal.style.zIndex = '99999';
                modal.style.display = 'flex';
                modal.style.alignItems = 'center';
                modal.style.justifyContent = 'center';
                modal.style.opacity = '0';
                modal.style.transition = 'opacity 0.3s ease';
                modal.style.backdropFilter = 'blur(10px)';
                
                modal.innerHTML = `
                    <button id="close-dynamic-video" style="position:absolute; top:40px; right:40px; background:transparent; border:none; color:white; font-size:2.5rem; cursor:pointer; transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'"><i class="fa-solid fa-xmark"></i></button>
                    <div style="width:90%; max-width:1200px; aspect-ratio:16/9; background:#000; border-radius:15px; overflow:hidden; box-shadow: 0 25px 60px rgba(0,0,0,0.8); position:relative; transform: scale(0.9); transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);" id="video-inner-container">
                        <video id="html5-brand-video" style="width:100%; height:100%; object-fit:cover;" controls autoplay muted loop playsinline poster="assets/images/hero_bg.png">
                            <!-- We use a direct MP4 file. You can replace this URL with 'assets/videos/your-video.mp4' later -->
                            <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                    </div>
                `;
                
                document.body.appendChild(modal);
                document.body.style.overflow = 'hidden';
                
                const closeModal = () => {
                    modal.style.opacity = '0';
                    document.getElementById('video-inner-container').style.transform = 'scale(0.9)';
                    const vid = document.getElementById('html5-brand-video');
                    if(vid) vid.pause(); // Stop playing when closed
                    setTimeout(() => {
                        modal.remove();
                        document.body.style.overflow = 'auto';
                    }, 300);
                };
                
                document.getElementById('close-dynamic-video').addEventListener('click', closeModal);
                modal.addEventListener('click', (e) => {
                    if(e.target === modal) closeModal();
                });
            }
            
            setTimeout(() => {
                modal.style.opacity = '1';
                document.getElementById('video-inner-container').style.transform = 'scale(1)';
                const vid = document.getElementById('html5-brand-video');
                if(vid) vid.play().catch(e => console.log('Autoplay blocked', e));
            }, 10);
        });
    }

    /* =======================================
       17. RIPPLE EFFECT ENGINE
       ======================================= */
    document.querySelectorAll('.ripple').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    /* =======================================
       18. NEWSLETTER SUBSCRIPTION
       ======================================= */
    document.querySelectorAll('.newsletter-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = this.querySelector('button[type="submit"]');
            const input = this.querySelector('input');
            const originalIcon = btn.innerHTML;
            
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
            btn.classList.add('opacity-80');
            
            setTimeout(() => {
                btn.innerHTML = '<i class="fa-solid fa-check"></i>';
                btn.style.background = '#10b981';
                btn.style.color = '#fff';
                input.value = '';
                input.placeholder = 'Subscribed successfully!';
                
                setTimeout(() => {
                    btn.innerHTML = originalIcon;
                    btn.style.background = '';
                    btn.style.color = '';
                    btn.classList.remove('opacity-80');
                    input.placeholder = 'Your email address';
                }, 3000);
            }, 1200);
        });
    });

    /* =======================================
       23. ADMIN DASHBOARD STORAGE HELPER
       ======================================= */
    window.saveBooking = function(bookingData) {
        let bookings = JSON.parse(localStorage.getItem('chamunda_bookings')) || [];
        bookingData.id = 'BKG-' + Math.floor(100000 + Math.random() * 900000); // 6-digit ID
        bookingData.timestamp = new Date().toISOString();
        bookingData.status = 'Pending';
        bookings.unshift(bookingData); // Add to top
        localStorage.setItem('chamunda_bookings', JSON.stringify(bookings));
    };

    /* =======================================
       23B. GLOBAL INQUIRY ROUTING (ADMIN HOOKUP)
       ======================================= */
    document.querySelectorAll('form').forEach(form => {
        const id = form.id;
        if(['booking-form', 'vip-booking-form', 'romance-form', 'vip-offer-form', 'flight-checkout-form', 'package-payment-form'].includes(id)) {
            form.addEventListener('submit', () => {
                let name = 'Luxury Client';
                let email = 'N/A';
                let dest = document.title.split('|')[0].trim();
                
                // Attempt heuristic extraction
                const textInputs = form.querySelectorAll('input[type="text"]');
                const emailInputs = form.querySelectorAll('input[type="email"]');
                if(textInputs.length > 0) name = textInputs[0].value;
                if(emailInputs.length > 0) email = emailInputs[0].value;

                // Don't duplicate VIP Booking (it has precise logic on book.html)
                if(id === 'vip-booking-form') return;

                if(window.saveBooking) {
                    window.saveBooking({
                        type: id.replace(/-/g, ' ').toUpperCase(),
                        name: name,
                        email: email,
                        phone: 'On File',
                        destination: dest,
                        date: 'TBD',
                        guests: 'TBD',
                        price: 'Pending Quote'
                    });
                }
            });
        }
    });

    /* =======================================
       24. CINEMATIC UI ENHANCEMENTS
       ======================================= */
    
    // 3D Card Tilt Effect
    const cards = document.querySelectorAll('.dest-card, .pkg-card, .offer-card, .article-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.transition = 'none';
            card.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
            card.style.transition = 'transform 0.5s ease';
            card.style.zIndex = '1';
        });
    });

    // Custom Luxury Cursor (Desktop Only)
    if(window.matchMedia("(pointer: fine)").matches) {
        const cursorDot = document.createElement('div');
        const cursorRing = document.createElement('div');
        cursorDot.classList.add('custom-cursor-dot');
        cursorRing.classList.add('custom-cursor-ring');
        document.body.appendChild(cursorDot);
        document.body.appendChild(cursorRing);

        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        });

        // Smooth trailing effect for ring
        function animateRing() {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
            requestAnimationFrame(animateRing);
        }
        animateRing();

        // Hover expansions
        const hoverElements = document.querySelectorAll('a, button, .dest-card, input');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorRing.style.width = '50px';
                cursorRing.style.height = '50px';
                cursorRing.style.marginLeft = '-25px';
                cursorRing.style.marginTop = '-25px';
                cursorRing.style.borderColor = 'rgba(212, 175, 55, 0.8)';
                cursorRing.style.background = 'rgba(212, 175, 55, 0.1)';
            });
            el.addEventListener('mouseleave', () => {
                cursorRing.style.width = '30px';
                cursorRing.style.height = '30px';
                cursorRing.style.marginLeft = '-15px';
                cursorRing.style.marginTop = '-15px';
                cursorRing.style.borderColor = 'rgba(212, 175, 55, 0.5)';
                cursorRing.style.background = 'transparent';
            });
        });
    }

    /* =======================================
       25. GLOBAL WISHLIST ENGINE
       ======================================= */
    // Dynamically inject a heart icon into all destination and package cards
    const allCards = document.querySelectorAll('.dest-card, .pkg-card');
    allCards.forEach(card => {
        // Find overlay to inject into
        let overlay = card.querySelector('.dest-overlay') || card;
        
        // Extract basic data from card
        let titleEl = card.querySelector('h3');
        let title = titleEl ? titleEl.textContent : 'Luxury Destination';
        let imgEl = card.querySelector('img');
        let img = imgEl ? imgEl.src : 'assets/images/default.jpg';
        let link = window.location.pathname.split('/').pop();
        if(card.onclick) {
            let funcStr = card.onclick.toString();
            let match = funcStr.match(/window\.location\.href='([^']+)'/);
            if(match) link = match[1];
        }
        
        let heartBtn = document.createElement('button');
        heartBtn.className = 'global-wishlist-btn';
        heartBtn.innerHTML = '<i class="fa-regular fa-heart"></i>';
        
        // Check if already in wishlist
        let currentWishlist = JSON.parse(localStorage.getItem('chamunda_wishlist')) || [];
        if(currentWishlist.some(w => w.name === title)) {
            heartBtn.innerHTML = '<i class="fa-solid fa-heart"></i>';
            heartBtn.classList.add('active');
        }

        heartBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent opening the card link
            let wishlist = JSON.parse(localStorage.getItem('chamunda_wishlist')) || [];
            
            let existingIndex = wishlist.findIndex(w => w.name === title);
            if(existingIndex !== -1) {
                // Remove
                wishlist.splice(existingIndex, 1);
                heartBtn.innerHTML = '<i class="fa-regular fa-heart"></i>';
                heartBtn.classList.remove('active');
            } else {
                // Add
                wishlist.push({ name: title, image: img, link: link });
                heartBtn.innerHTML = '<i class="fa-solid fa-heart"></i>';
                heartBtn.classList.add('active');
                
                // Provide visual feedback
                heartBtn.style.transform = 'scale(1.3)';
                setTimeout(() => heartBtn.style.transform = '', 200);
            }
            localStorage.setItem('chamunda_wishlist', JSON.stringify(wishlist));
        });
        
        // Make it absolute top-right
        heartBtn.style.position = 'absolute';
        heartBtn.style.top = '15px';
        heartBtn.style.right = '15px';
        heartBtn.style.background = 'rgba(0,0,0,0.5)';
        heartBtn.style.color = '#fff';
        heartBtn.style.border = 'none';
        heartBtn.style.width = '35px';
        heartBtn.style.height = '35px';
        heartBtn.style.borderRadius = '50%';
        heartBtn.style.backdropFilter = 'blur(5px)';
        heartBtn.style.cursor = 'pointer';
        heartBtn.style.zIndex = '50';
        heartBtn.style.display = 'flex';
        heartBtn.style.alignItems = 'center';
        heartBtn.style.justifyContent = 'center';
        heartBtn.style.transition = 'all 0.3s';
        
        card.style.position = 'relative'; // Ensure absolute positioning works
        card.appendChild(heartBtn); // Append to card instead of overlay so it's always top level
    });

    /* =======================================
       26. YATRA-STYLE OTA UPGRADES
       ======================================= */
    // A. Dynamic Search Engine Morphing
    const dynamicTabs = document.querySelectorAll('#dynamic-search-tabs .search-tab');
    const searchGrid = document.getElementById('search-grid-dynamic');
    const mainSearchForm = document.getElementById('main-search');
    let currentSearchMode = 'tours';

    if (dynamicTabs.length > 0 && searchGrid && mainSearchForm) {
        const searchTemplates = {
            tours: `
                <div class="search-group">
                    <label><i class="fa-solid fa-location-dot"></i> Destination</label>
                    <div class="autocomplete-wrapper">
                        <input type="text" id="dest-input" placeholder="Where to?" autocomplete="off" required>
                    </div>
                </div>
                <div class="search-button-group">
                    <button type="submit" class="btn btn-primary btn-search ripple"><i class="fa-solid fa-magnifying-glass"></i> Search</button>
                </div>
            `,
            flights: `
                <div class="search-group"><label><i class="fa-solid fa-plane-departure"></i> From</label><input type="text" placeholder="Origin City" required></div>
                <div class="search-group"><label><i class="fa-solid fa-plane-arrival"></i> To</label><input type="text" placeholder="Destination City" required></div>
                <div class="search-group"><label><i class="fa-regular fa-calendar"></i> Depart</label><input type="date" required></div>
                <div class="search-group"><label><i class="fa-solid fa-user-group"></i> Travellers</label><input type="number" min="1" value="1" required></div>
                <div class="search-button-group"><button type="submit" class="btn btn-primary btn-search ripple"><i class="fa-solid fa-magnifying-glass"></i> Search</button></div>
            `,
            hotels: `
                <div class="search-group"><label><i class="fa-solid fa-location-dot"></i> City/Hotel</label><input type="text" placeholder="Where are you going?" required></div>
                <div class="search-group"><label><i class="fa-regular fa-calendar-check"></i> Check-in</label><input type="date" required></div>
                <div class="search-group"><label><i class="fa-regular fa-calendar-xmark"></i> Check-out</label><input type="date" required></div>
                <div class="search-group"><label><i class="fa-solid fa-bed"></i> Rooms</label><input type="number" min="1" value="1" required></div>
                <div class="search-button-group"><button type="submit" class="btn btn-primary btn-search ripple"><i class="fa-solid fa-magnifying-glass"></i> Search</button></div>
            `,
            cruise: `
                <div class="search-group"><label><i class="fa-solid fa-anchor"></i> Port</label><input type="text" placeholder="Departure Port" required></div>
                <div class="search-group"><label><i class="fa-regular fa-calendar"></i> Month</label><input type="month" required></div>
                <div class="search-button-group"><button type="submit" class="btn btn-primary btn-search ripple"><i class="fa-solid fa-magnifying-glass"></i> Search</button></div>
            `,
            rail: `
                <div class="search-group"><label><i class="fa-solid fa-train"></i> From Station</label><input type="text" placeholder="Leaving from" required></div>
                <div class="search-group"><label><i class="fa-solid fa-train"></i> To Station</label><input type="text" placeholder="Going to" required></div>
                <div class="search-group"><label><i class="fa-regular fa-calendar"></i> Date</label><input type="date" required></div>
                <div class="search-button-group"><button type="submit" class="btn btn-primary btn-search ripple"><i class="fa-solid fa-magnifying-glass"></i> Search</button></div>
            `
        };

        dynamicTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                dynamicTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                currentSearchMode = tab.getAttribute('data-tab');
                
                // Morph inputs
                searchGrid.style.opacity = '0';
                setTimeout(() => {
                    searchGrid.innerHTML = searchTemplates[currentSearchMode];
                    searchGrid.style.opacity = '1';
                }, 200);
            });
        });

        mainSearchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Redirect based on current active tab mode
            if(currentSearchMode === 'tours') window.location.href = 'destinations.html';
            else if(currentSearchMode === 'flights') window.location.href = 'flights.html';
            else if(currentSearchMode === 'hotels') window.location.href = 'hotels.html';
            else if(currentSearchMode === 'cruise') window.location.href = 'cruise.html';
            else if(currentSearchMode === 'rail') window.location.href = 'rail.html';
        });
    }

});
