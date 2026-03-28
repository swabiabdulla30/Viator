/* =====================================================
   VIATOR – Auth Module
   ===================================================== */

/* ── Toast Notification ── */
function showToast(msg, type = 'success') {
    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    const container = document.getElementById('toast-container') || (() => {
        const el = document.createElement('div');
        el.id = 'toast-container';
        el.className = 'toast-container';
        document.body.appendChild(el);
        return el;
    })();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span class="toast-icon">${icons[type] || '💬'}</span><span class="toast-msg">${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3200);
}

/* ── Nav Helpers ── */
function initNavbar() {
    const session = SessionDB.get();
    const navActions = document.getElementById('nav-actions');
    if (!navActions) return;

    if (session) {
        const initial = session.name ? session.name[0].toUpperCase() : '?';
        navActions.innerHTML = `
      <a href="create-post.html" class="btn-premium nav-share-btn" id="nav-create-btn" style="padding: 0.7rem 1.5rem; font-size: 0.65rem; margin-top:0;">
        SHARE STORY
      </a>
      <div class="nav-dropdown" id="user-dropdown">
        <div class="nav-avatar" id="nav-avatar-btn" title="${session.name}">${initial}</div>
        <div class="nav-dropdown-menu">
          <a href="profile.html?id=${session.id}">👤 My Profile</a>
          <a href="bookmarks.html">🔖 Bookmarks</a>
          ${session.role === 'admin' ? '<a href="admin-dashboard.html">🛡️ Admin Panel</a>' : ''}
          <div class="divider"></div>
          <button onclick="logout()">🚪 Log Out</button>
        </div>
      </div>`;
        
        // Mobile menu sync
        const mobileActions = document.querySelector('.mobile-nav-actions');
        if (mobileActions) {
            mobileActions.innerHTML = `
                <a href="create-post.html" class="btn-premium" style="margin-top:0;">SHARE STORY <span class="arrow">→</span></a>
                <div style="margin-top: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem;">
                    <a href="profile.html?id=${session.id}" style="font-size: 1.2rem; border: none; padding: 0.5rem 0;">My Profile</a>
                    <a href="bookmarks.html" style="font-size: 1.2rem; border: none; padding: 0.5rem 0;">Bookmarks</a>
                    <button onclick="logout()" style="background: none; border: none; color: var(--danger); font-family: var(--font-head); font-size: 1.2rem; text-align: left; padding: 0.5rem 0; cursor: pointer;">Log Out</button>
                </div>
            `;
        }
        document.getElementById('nav-avatar-btn')?.addEventListener('click', () => {
            document.getElementById('user-dropdown').classList.toggle('open');
        });
        document.addEventListener('click', e => {
            if (!document.getElementById('user-dropdown')?.contains(e.target)) {
                document.getElementById('user-dropdown')?.classList.remove('open');
            }
        });
    } else {
        navActions.innerHTML = `
      <a href="login.html" class="btn-text nav-login-link">Log In</a>
      <a href="create-post.html" class="btn-outline nav-signup-link">SHARE STORY</a>`;
      
        // Mobile menu sync (logged out)
        const mobileActions = document.querySelector('.mobile-nav-actions');
        if (mobileActions) {
            mobileActions.innerHTML = `
                <a href="create-post.html" class="btn-premium" style="margin-top:0;">SHARE STORY <span class="arrow">→</span></a>
                <div style="margin-top: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem;">
                    <a href="login.html" style="font-size: 1.2rem; border: none; padding: 0.5rem 0;">Log In</a>
                </div>
            `;
        }
    }
}

/* ── Auth Functions ── */
function register({ name, email, password }) {
    if (!name || !email || !password) return { success: false, error: 'All fields are required.' };
    if (password.length < 8) return { success: false, error: 'Password must be at least 8 characters.' };
    if (UserDB.getByEmail(email)) return { success: false, error: 'An account with this email already exists.' };
    const user = UserDB.create({ name, email, password });
    SessionDB.set(user);
    return { success: true, user };
}

function login({ email, password }) {
    const user = UserDB.getByEmail(email);
    if (!user) return { success: false, error: 'No account found with this email.' };
    if (!UserDB.verifyPassword(user, password)) return { success: false, error: 'Incorrect password.' };
    if (user.status === 'banned') return { success: false, error: 'Your account has been suspended. Contact support.' };
    SessionDB.set(user);
    return { success: true, user };
}

function logout() {
    SessionDB.clear();
    window.location.href = 'index.html';
}

/* ── Route Guards ── */
function requireAuth(redirectTo = 'login.html') {
    if (!SessionDB.isLoggedIn()) {
        window.location.href = redirectTo + '?next=' + encodeURIComponent(window.location.href);
        return false;
    }
    return true;
}

function requireAdmin() {
    if (!SessionDB.isLoggedIn()) { window.location.href = 'admin-login.html'; return false; }
    if (!SessionDB.isAdmin()) { window.location.href = 'index.html'; return false; }
    return true;
}

function redirectIfLoggedIn(dest = 'feed.html') {
    if (SessionDB.isLoggedIn()) { window.location.href = dest; }
}

function redirectIfAdminLoggedIn(dest = 'admin-dashboard.html') {
    if (SessionDB.isLoggedIn() && SessionDB.isAdmin()) { window.location.href = dest; }
}

/* ── Shared Navbar HTML ── */
function getNavbarHTML(activePage = '') {
    const links = `
        <a href="feed.html">Explore</a>
        <a href="#contact">Contact</a>
    `;
    return `
    <nav class="navbar">
      <div class="container">
        <a href="index.html" class="nav-logo">
          <svg class="nav-logo-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4L12 20L20 4H16.5L12 14L7.5 4H4Z" fill="currentColor"/>
            <path d="M12 8L11 11H13L12 8Z" fill="white"/>
          </svg>
          <span>VIATOR</span>
        </a>
        <div class="nav-links" id="nav-links">${links}</div>
        <div class="nav-actions" id="nav-actions"></div>
        <div class="hamburger" id="hamburger">
          <span></span><span></span><span></span>
        </div>
      </div>
    </nav>
    <div class="mobile-nav">
      ${links}
      <div class="mobile-nav-actions" style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--border);">
         <!-- Actions injected here via initNavbar -->
      </div>
    </div>`;
}

/* ── Avatar Render ── */
function renderAvatar(user, size = 36) {
    const initial = user?.name ? user.name[0].toUpperCase() : '?';
    if (user?.avatar) {
        return `<img src="${user.avatar}" alt="${user.name}" style="width:${size}px;height:${size}px;border-radius:50%;object-fit:cover;">`;
    }
    return `<div class="nav-avatar" style="width:${size}px;height:${size}px;font-size:${size * 0.38}px;">${initial}</div>`;
}

/* ── Image to Base64 ── */
function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/* ── Confirm Modal ── */
function confirmAction(message, onConfirm) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay open';
    overlay.innerHTML = `
    <div class="modal" style="max-width:400px;">
      <div class="modal-header">
        <h3 class="modal-title">Confirm Action</h3>
        <button class="modal-close" id="confirm-cancel">✕</button>
      </div>
      <p style="color:var(--text-secondary);margin-bottom:1.5rem;">${message}</p>
      <div style="display:flex;gap:0.75rem;justify-content:flex-end;">
        <button class="btn btn-ghost" id="confirm-cancel-2">Cancel</button>
        <button class="btn btn-danger" id="confirm-ok">Confirm</button>
      </div>
    </div>`;
    document.body.appendChild(overlay);
    const close = () => overlay.remove();
    overlay.querySelector('#confirm-cancel').onclick = close;
    overlay.querySelector('#confirm-cancel-2').onclick = close;
    overlay.querySelector('#confirm-ok').onclick = () => { close(); onConfirm(); };
}

/* ── Contact Modal ── */
function showContactModal() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    setTimeout(() => overlay.classList.add('open'), 10); // slight delay for transition
    overlay.style.zIndex = '3000'; // ensure it's above navbar
    overlay.innerHTML = `
    <div class="modal" style="max-width:500px; padding: 3rem 2rem;">
      <div class="modal-header">
        <h3 class="modal-title" style="font-family: var(--font-head); font-size: 2rem; font-weight: 400;">Get in Touch</h3>
        <button class="modal-close" id="contact-cancel">✕</button>
      </div>
      <p style="color:var(--text-muted); margin-bottom: 2rem; font-size: 0.9rem;">Have a question or a story idea? Drop us a message and our editorial team will get back to you.</p>
      
      <form id="contact-form" class="auth-form" style="display:flex; flex-direction:column; gap:1.5rem;">
        <div class="form-group" style="margin-bottom:0;">
          <label class="form-label">Name</label>
          <input type="text" class="form-input" required placeholder="Your Name">
        </div>
        <div class="form-group" style="margin-bottom:0;">
          <label class="form-label">Email</label>
          <input type="email" class="form-input" required placeholder="your.email@example.com">
        </div>
        <div class="form-group" style="margin-bottom:0;">
          <label class="form-label">Message</label>
          <textarea class="form-input form-textarea" required placeholder="How can we help you?" style="min-height: 120px; resize: vertical; border-bottom: 1px solid rgba(26,26,26,0.2); width: 100%; font-family: var(--font-sans);"></textarea>
        </div>
        <button type="submit" class="btn-premium" style="margin-top: 1rem; width: 100%;">SEND MESSAGE <span class="arrow">→</span></button>
      </form>
    </div>`;

    document.body.appendChild(overlay);
    
    const close = () => {
        overlay.classList.remove('open');
        setTimeout(() => overlay.remove(), 300);
    };

    overlay.querySelector('#contact-cancel').onclick = close;
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) close();
    });

    overlay.querySelector('#contact-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        btn.innerHTML = 'SENDING...';
        btn.disabled = true;

        // Simulate network request
        setTimeout(() => {
            close();
            showToast('Message sent successfully! We will be in touch soon.', 'success');
        }, 800);
    });
}

/* ── Common Init on page load ── */
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    // highlight active nav link
    const path = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav-links-item').forEach(a => {
        if (a.getAttribute('href') === path) a.classList.add('active');
    });

    // Contact Modal Hook (Event Delegation)
    document.body.addEventListener('click', (e) => {
        const link = e.target.closest('a[href="#contact"]');
        if (link) {
            e.preventDefault();
            // Close mobile menu if it is open
            const mobileNav = document.querySelector('.mobile-nav');
            const hamburger = document.querySelector('.hamburger');
            if (mobileNav && mobileNav.classList.contains('open')) {
                mobileNav.classList.remove('open');
                if (hamburger) hamburger.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
            showContactModal();
        }
    });
});
