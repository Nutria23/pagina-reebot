import './style.css'

document.addEventListener('DOMContentLoaded', () => {

    // 1. Intersection Observer for scroll animations (fade-in-up)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in-up');
    fadeElements.forEach(el => {
        observer.observe(el);
    });

    // 2. Interactive Interactive Image Slider (Antes/Ahora)
    const sliderContainer = document.querySelector('.slider-container');
    const sliderMask = document.querySelector('.slider-mask');
    const sliderHandle = document.querySelector('.slider-handle');

    if (sliderContainer && sliderMask && sliderHandle) {
        let isDragging = false;

        const startDrag = (e) => {
            isDragging = true;
            sliderContainer.classList.add('dragging');
        };

        const stopDrag = () => {
            isDragging = false;
            sliderContainer.classList.remove('dragging');
        };

        const handleDrag = (e) => {
            if (!isDragging) return;

            // Get x position of mouse or touch
            let x = 0;
            if (e.type === 'mousemove') {
                x = e.clientX;
            } else if (e.type === 'touchmove') {
                x = e.touches[0].clientX;
            }

            const rect = sliderContainer.getBoundingClientRect();
            // Calculate percentage (0 to 1)
            let percent = (x - rect.left) / rect.width;
            
            // Clamp between 0 and 1
            percent = Math.max(0, Math.min(1, percent));
            
            // Calculate offset in pixels to snap the mask and handle
            const percentWidth = percent * 100;
            
            sliderMask.style.clipPath = `polygon(0 0, ${percentWidth}% 0, ${percentWidth}% 100%, 0 100%)`;
            sliderMask.style.webkitClipPath = `polygon(0 0, ${percentWidth}% 0, ${percentWidth}% 100%, 0 100%)`;
            sliderHandle.style.left = `${percentWidth}%`;
        };

        sliderHandle.addEventListener('mousedown', startDrag);
        sliderHandle.addEventListener('touchstart', startDrag, {passive: true});
        
        window.addEventListener('mouseup', stopDrag);
        window.addEventListener('touchend', stopDrag);
        window.addEventListener('touchcancel', stopDrag);

        window.addEventListener('mousemove', handleDrag);
        window.addEventListener('touchmove', handleDrag, {passive: true});
    }

    // 3. Floating panel toggles and tabs interactivity
    const toggles = document.querySelectorAll('.toggle');
    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
        });
    });

    const panelTabs = document.querySelectorAll('.panel-header .tabs span');
    panelTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            panelTabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
        });
    });

    // 4. Scroll to Top Button
    const scrollTopBtn = document.querySelector('.scroll-top');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        scrollTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 5. 3D Parallax Tilt Effect - Handled by Vanilla-Tilt.js library
    // (Manual implementation removed to avoid conflicts and improve performance)
    // 6. FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // 7. Cursor Glow Follow
    const cursorGlow = document.getElementById('cursor-glow');
    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });

    // 8. Mobile Menu Logic
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const closeOverlay = document.getElementById('close-overlay');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const overlayLinks = document.querySelectorAll('.overlay-links a');

    const toggleMenu = () => {
        mobileOverlay.classList.toggle('active');
        document.body.style.overflow = mobileOverlay.classList.contains('active') ? 'hidden' : '';
    };

    mobileToggle.addEventListener('click', toggleMenu);
    closeOverlay.addEventListener('click', toggleMenu);
    
    // Close menu when clicking a link
    overlayLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // 9. Smooth Scrolling for all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = 100; // Offset for fixed/absolute header
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 10. Product Filtering Logic
    const filterButtons = document.querySelectorAll('.tab-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            productCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 11. CART SYSTEM
    class CartManager {
        constructor() {
            this.items = JSON.parse(localStorage.getItem('zrx_cart')) || [];
            this.drawer = document.getElementById('cart-drawer');
            this.itemsContainer = document.getElementById('cart-drawer-items');
            this.totalAmountEl = document.getElementById('cart-total-amount');
            
            this.updateBadges();
            this.renderItems();
            this.initEventListeners();
            
            console.log('CartManager initialized with', this.items.length, 'items');
        }

        addItem(product) {
            this.items.push(product);
            this.save();
            this.updateBadges();
            this.renderItems();
            this.showToast(`Añadido: ${product.name}`);
            this.toggleDrawer(true);
        }

        removeItem(index) {
            this.items.splice(index, 1);
            this.save();
            this.updateBadges();
            this.renderItems();
        }

        save() {
            localStorage.setItem('zrx_cart', JSON.stringify(this.items));
        }

        updateBadges() {
            const badges = document.querySelectorAll('.badge');
            badges.forEach(badge => {
                badge.textContent = this.items.length;
                badge.style.display = this.items.length > 0 ? 'flex' : 'none';
            });
            
            const mobileCartLink = document.querySelector('.overlay-links a[href="#"]:last-child');
            if (mobileCartLink && mobileCartLink.textContent.includes('Carrito')) {
                mobileCartLink.textContent = `Carrito (${this.items.length})`;
            }
        }

        toggleDrawer(show) {
            if (!this.drawer) return;
            if (show) {
                this.drawer.classList.add('active');
                document.body.style.overflow = 'hidden';
            } else {
                this.drawer.classList.remove('active');
                document.body.style.overflow = '';
            }
        }

        renderItems() {
            if (!this.itemsContainer) return;
            
            if (this.items.length === 0) {
                this.itemsContainer.innerHTML = `
                    <div class="empty-cart-msg">
                        <p>Tu carrito está vacío.</p>
                        <a href="productos.html" class="btn btn-secondary" style="margin-top:20px; font-size:0.8rem;">Ver Productos</a>
                    </div>
                `;
                if (this.totalAmountEl) this.totalAmountEl.textContent = '€0.00';
                return;
            }

            let total = 0;
            this.itemsContainer.innerHTML = this.items.map((item, index) => {
                const price = parseFloat(item.price) || 0;
                total += price;
                return `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <p>€${price.toFixed(2)}</p>
                        </div>
                        <button class="remove-item" data-index="${index}">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3"><path d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                    </div>
                `;
            }).join('');

            if (this.totalAmountEl) {
                this.totalAmountEl.textContent = `€${total.toFixed(2)}`;
            }

            // Remove item listeners
            this.itemsContainer.querySelectorAll('.remove-item').forEach(btn => {
                btn.onclick = (e) => {
                    e.stopPropagation();
                    this.removeItem(parseInt(btn.dataset.index));
                };
            });
        }

        initEventListeners() {
            // Open drawer links
            document.querySelectorAll('.carrito-btn, .overlay-links a[href="#"]:last-child').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggleDrawer(true);
                });
            });

            // Close actions
            document.getElementById('close-cart-drawer')?.addEventListener('click', () => this.toggleDrawer(false));
            document.getElementById('cart-drawer-overlay')?.addEventListener('click', () => this.toggleDrawer(false));

            // Checkout action
            document.querySelector('.checkout-btn')?.addEventListener('click', () => {
                if (this.items.length === 0) return;
                alert('Redirigiendo a pasarela de pago segura...');
                // this.items = []; this.save(); this.updateBadges(); this.renderItems(); this.toggleDrawer(false);
            });

            // Add to cart buttons
            document.body.addEventListener('click', (e) => {
                const btn = e.target.closest('.btn-add-cart');
                if (btn) {
                    e.preventDefault();
                    e.stopPropagation();
                    const product = {
                        id: btn.dataset.id,
                        name: btn.dataset.name,
                        price: btn.dataset.price
                    };
                    this.addItem(product);
                }
            });
        }

        showToast(message) {
            const toast = document.createElement('div');
            toast.className = 'cart-toast';
            toast.textContent = message;
            document.body.appendChild(toast);
            setTimeout(() => toast.classList.add('show'), 10);
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }
    }

    // 12. DISCORD AUTH SYSTEM
    class DiscordAuth {
        constructor(clientId) {
            this.clientId = clientId;
            this.redirectUri = window.location.origin + window.location.pathname;
            this.user = JSON.parse(localStorage.getItem('discord_user')) || null;
            
            this.checkCallback();
            this.updateUI();
            this.initEventListeners();
            this.checkProfilePage();
        }

        login() {
            if (window.location.protocol === 'file:') {
                alert("Error: Discord Login solo funciona si abres la web con un servidor (Vite, Live Server, etc.).");
                return;
            }
            // Updated scope to include email
            const scope = 'identify email'; 
            const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${this.clientId}&redirect_uri=${encodeURIComponent(this.redirectUri)}&response_type=token&scope=${scope}`;
            window.location.href = authUrl;
        }

        logout() {
            this.user = null;
            localStorage.removeItem('discord_user');
            localStorage.removeItem('discord_token');
            this.updateUI();
            this.showToast("Sesión cerrada.");
            if (window.location.pathname.includes('perfil.html')) {
                window.location.href = 'index.html';
            }
        }

        async checkCallback() {
            const hash = window.location.hash;
            if (!hash.includes('access_token')) return;

            const fragment = new URLSearchParams(hash.slice(1));
            const accessToken = fragment.get('access_token');

            if (accessToken) {
                history.replaceState(null, "", window.location.pathname);
                localStorage.setItem('discord_token', accessToken);
                await this.fetchUser(accessToken);
            }
        }

        async fetchUser(token) {
            this.showToast("Autenticando...");
            try {
                const response = await fetch('https://discord.com/api/users/@me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    this.user = await response.json();
                    localStorage.setItem('discord_user', JSON.stringify(this.user));
                    this.updateUI();
                    this.checkProfilePage();
                    this.showToast(`Bienvenido, ${this.user.username}!`);
                } else {
                    console.error('Failed to fetch Discord user');
                    this.showToast("Error al obtener usuario.");
                }
            } catch (err) {
                console.error('Auth error:', err);
            }
        }

        updateUI() {
            document.querySelectorAll('.user-dropdown').forEach(dropdown => {
                const container = dropdown.parentElement;
                
                if (this.user) {
                    const avatar = this.user.avatar 
                        ? `https://cdn.discordapp.com/avatars/${this.user.id}/${this.user.avatar}.png`
                        : `https://api.dicebear.com/7.x/avataaars/svg?seed=${this.user.username}`;
                    
                    dropdown.innerHTML = `
                        <img src="${avatar}" alt="avatar" class="user-avatar-img">
                        <span class="username">${this.user.global_name || this.user.username}</span>
                        <svg class="chevron" width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                    `;

                    // Ensure dropdown menu exists
                    if (!container.querySelector('.user-dropdown-menu')) {
                        const menu = document.createElement('div');
                        menu.className = 'user-dropdown-menu';
                        menu.innerHTML = `
                            <a href="perfil.html" class="dropdown-item">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                                Perfil
                            </a>
                            <div class="dropdown-divider"></div>
                            <div class="dropdown-item logout">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                                Cerrar Sesión
                            </div>
                        `;
                        container.appendChild(menu);
                        
                        // Menu Item listeners
                        menu.querySelector('.logout').onclick = () => this.logout();
                    }
                } else {
                    dropdown.innerHTML = `
                         <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                         <span class="username">Entrar</span>
                    `;
                    container.querySelector('.user-dropdown-menu')?.remove();
                }
            });

            const mobileLink = document.querySelector('.overlay-links a[href="#"]:nth-last-child(2)');
            if (mobileLink) {
                mobileLink.textContent = this.user ? `Cerrar Sesión (${this.user.username})` : 'Mi Cuenta (Discord)';
            }
        }

        initEventListeners() {
            document.body.addEventListener('click', (e) => {
                const btn = e.target.closest('.user-dropdown');
                if (btn) {
                    e.preventDefault();
                    if (this.user) {
                        const menu = btn.parentElement.querySelector('.user-dropdown-menu');
                        menu?.classList.toggle('active');
                    } else {
                        this.login();
                    }
                } else if (!e.target.closest('.user-dropdown-menu')) {
                    document.querySelectorAll('.user-dropdown-menu').forEach(m => m.classList.remove('active'));
                }
            });

            const mobileLink = document.querySelector('.overlay-links a[href="#"]:nth-last-child(2)');
            if (mobileLink) {
                mobileLink.onclick = (e) => {
                    e.preventDefault();
                    if (this.user) this.logout(); else this.login();
                };
            }
        }

        checkProfilePage() {
            const path = window.location.pathname;
            // More robust check for profile page in various environments
            const isProfilePage = path.includes('perfil');
            
            if (!isProfilePage) return;
            
            console.log("Checking Profile Page. User:", this.user);
            if (!this.user) {
                // If on profile page without user, redirect
                window.location.href = 'index.html';
                return;
            }

            // Populate identity data
            const avatar = this.user.avatar 
                ? `https://cdn.discordapp.com/avatars/${this.user.id}/${this.user.avatar}.png`
                : `https://api.dicebear.com/7.x/avataaars/svg?seed=${this.user.username}`;
            
            const avatarImg = document.getElementById('prof-avatar');
            if (avatarImg) avatarImg.src = avatar;

            const nameEl = document.getElementById('prof-name');
            if (nameEl) nameEl.textContent = this.user.global_name || this.user.username;

            const idEl = document.getElementById('prof-id');
            if (idEl) idEl.textContent = this.user.id;

            const emailEl = document.getElementById('prof-email');
            if (emailEl) emailEl.textContent = this.user.email || 'Email no disponible';

            // Populate Join Date (Placeholder or real if available)
            const joinEl = document.getElementById('prof-join-date');
            if (joinEl) joinEl.textContent = "Joined Dec 2025"; // Matching image

            // Copy ID logic
            const copyBtn = document.getElementById('btn-copy-id');
            if (copyBtn) {
                copyBtn.onclick = () => {
                    navigator.clipboard.writeText(this.user.id);
                    this.showToast("ID copiado al portapapeles!");
                };
            }

            // Tab logic
            const tabBtns = document.querySelectorAll('.profile-tab-btn');
            const tabContents = document.querySelectorAll('.profile-tab-content');

            tabBtns.forEach(btn => {
                btn.onclick = () => {
                    const tab = btn.dataset.tab;
                    tabBtns.forEach(b => b.classList.remove('active'));
                    tabContents.forEach(c => c.classList.remove('active'));
                    btn.classList.add('active');
                    const targetContent = document.getElementById(`tab-${tab}`);
                    if (targetContent) targetContent.classList.add('active');
                };
            });
        }

        showToast(m) {
            const t = document.createElement('div');
            t.className = 'cart-toast'; t.textContent = m;
            document.body.appendChild(t);
            setTimeout(() => t.classList.add('show'), 10);
            setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 3000);
        }
    }

    // Init with Fail-Safe
    let cart, auth;
    try {
        cart = new CartManager();
    } catch (e) {
        console.error("CartManager failed to initialize:", e);
    }

    try {
        auth = new DiscordAuth('1363671717725339808');
    } catch (e) {
        console.error("DiscordAuth failed to initialize:", e);
    }
});
