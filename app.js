/* ========================================
   JASA WEBSITE PALUGADA — app.js
   Interactive functionality & animations
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. NAVBAR — scroll effect & hamburger
  // ==========================================
  const navbar = document.getElementById('navbar');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNavLink();
  });

  hamburgerBtn.addEventListener('click', () => {
    hamburgerBtn.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  // Close mobile menu on link click
  document.querySelectorAll('.mobile-link, .mobile-menu .btn').forEach(link => {
    link.addEventListener('click', () => {
      hamburgerBtn.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });

  // Active nav link on scroll
  function updateActiveNavLink() {
    const sections = ['home', 'layanan', 'demo', 'proses', 'portofolio', 'kontak'];
    const scrollPos = window.scrollY + 100;

    sections.forEach(id => {
      const section = document.getElementById(id);
      const navLink = document.querySelector(`.nav-link[href="#${id}"]`);
      if (section && navLink) {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        if (scrollPos >= top && scrollPos < bottom) {
          document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
          navLink.classList.add('active');
        }
      }
    });
  }

  // ==========================================
  // 2. COUNTER ANIMATION
  // ==========================================
  const counters = document.querySelectorAll('.stat-num[data-target]');
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    counters.forEach(counter => {
      const target = parseInt(counter.dataset.target);
      const duration = 1800;
      const step = target / (duration / 16);
      let current = 0;

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          counter.textContent = target;
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current);
        }
      }, 16);
    });
  }

  // ==========================================
  // 3. SCROLL REVEAL ANIMATION
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // Trigger counter when hero-stats is in view
  const heroStats = document.getElementById('hero-stats');
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) animateCounters();
    });
  }, { threshold: 0.5 });
  if (heroStats) statsObserver.observe(heroStats);

  // ==========================================
  // 4. DEMO TABS
  // ==========================================
  const tabs = document.querySelectorAll('.demo-tab');
  const panels = document.querySelectorAll('.demo-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;

      // Update tabs
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update panels
      panels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === `panel-${targetTab}`) {
          panel.classList.add('active');
        }
      });
    });
  });

  // ==========================================
  // 5. FORM SUBMISSION
  // ==========================================
  const form = document.getElementById('order-form');
  const submitBtn = document.getElementById('submit-form');
  const submitText = document.getElementById('submit-text');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nama = document.getElementById('inp-name').value.trim();
    const wa = document.getElementById('inp-wa').value.trim();
    const layanan = document.getElementById('inp-layanan').value;
    const pesan = document.getElementById('inp-pesan').value.trim();

    // Basic validation
    let valid = true;
    const required = [
      { el: document.getElementById('inp-name'), val: nama },
      { el: document.getElementById('inp-wa'), val: wa },
      { el: document.getElementById('inp-layanan'), val: layanan },
      { el: document.getElementById('inp-pesan'), val: pesan },
    ];

    required.forEach(({ el, val }) => {
      if (!val) {
        el.style.borderColor = '#ef4444';
        el.style.background = '#fff5f5';
        valid = false;
        setTimeout(() => {
          el.style.borderColor = '';
          el.style.background = '';
        }, 2000);
      }
    });

    if (!valid) {
      showNotification('⚠️ Mohon lengkapi semua field yang wajib diisi.', 'error');
      return;
    }

    // Simulate sending
    submitBtn.disabled = true;
    submitText.textContent = 'Mengirim...';
    submitBtn.style.opacity = '0.7';

    setTimeout(() => {
      // Compose WhatsApp message
      const budget = document.getElementById('inp-budget').value;
      const email = document.getElementById('inp-email').value;
      const layananText = document.getElementById('inp-layanan').options[document.getElementById('inp-layanan').selectedIndex].text;
      const budgetText = budget ? document.getElementById('inp-budget').options[document.getElementById('inp-budget').selectedIndex].text : '-';

      const waMsg = encodeURIComponent(
        `Halo tim Web Palugada! 👋 (manajemensystem.my.id)\n\n` +
        `Saya telah mengisi Formulir Konsultasi / Pemesanan di website Anda:\n\n` +
        `📋 *DATA PEMESAN:*\n` +
        `• Nama Lengkap: ${nama}\n` +
        `• No. WhatsApp: ${wa}\n` +
        `• Email: ${email || '-'}\n` +
        `• Jenis Layanan: ${layananText}\n` +
        `• Rencana Budget: ${budgetText}\n\n` +
        `📝 *DETAIL KEBUTUHAN / REQUEST:*\n` +
        `"${pesan}"\n\n` +
        `Mohon segera ditindaklanjuti untuk info penawaran dan langkah selanjutnya ya. Terima kasih! 🙏`
      );

      const waNumber = '6282169299119'; // Nomor WA bisnis resmi Web Palugada
      window.open(`https://wa.me/${waNumber}?text=${waMsg}`, '_blank');

      // Reset form
      form.reset();
      submitBtn.disabled = false;
      submitText.textContent = 'Kirim Konsultasi Gratis';
      submitBtn.style.opacity = '';

      showNotification('✅ Berhasil! Mengalihkan ke WhatsApp...', 'success');
    }, 1200);
  });

  // ==========================================
  // 6. NOTIFICATION TOAST
  // ==========================================
  function showNotification(message, type = 'success') {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = message;
    toast.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 9999;
      padding: 14px 20px;
      border-radius: 12px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 0.9rem;
      font-weight: 600;
      max-width: 340px;
      box-shadow: 0 8px 30px rgba(0,0,0,.15);
      animation: toastIn 0.4s ease;
      background: ${type === 'success' ? '#ecfdf5' : '#fff5f5'};
      color: ${type === 'success' ? '#065f46' : '#7f1d1d'};
      border: 1.5px solid ${type === 'success' ? '#6ee7b7' : '#fca5a5'};
    `;

    const styleEl = document.createElement('style');
    styleEl.textContent = `@keyframes toastIn { from { opacity:0; transform:translateY(-10px) scale(.95); } to { opacity:1; transform:translateY(0) scale(1); } }`;
    document.head.appendChild(styleEl);

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'none';
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.4s ease';
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

  // ==========================================
  // 7. SMOOTH SCROLL for anchor links
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ==========================================
  // 8. INTERACTIVE DEMO HOVER FX
  // ==========================================
  document.querySelectorAll('.dash-bar').forEach(bar => {
    bar.addEventListener('mouseenter', () => {
      bar.style.opacity = '1';
      bar.style.transform = 'scaleY(1.05)';
      bar.style.transformOrigin = 'bottom';
    });
    bar.addEventListener('mouseleave', () => {
      bar.style.opacity = '0.8';
      bar.style.transform = 'scaleY(1)';
    });
  });

  document.querySelectorAll('.demo-add-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.textContent = '✓ Ditambahkan!';
      btn.style.background = '#10b981';
      setTimeout(() => {
        btn.textContent = '+ Keranjang';
        btn.style.background = '';
      }, 1500);
    });
  });

  // ==========================================
  // 9. LAYANAN CARD stagger on scroll
  // ==========================================
  const layananCards = document.querySelectorAll('.layanan-card');
  layananCards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.05}s`;
  });

  // ==========================================
  // 10. TYPING EFFECT for hero tagline badge
  // ==========================================
  const badge = document.querySelector('#hero-badge');
  if (badge) {
    const originalText = badge.innerHTML;
    badge.style.opacity = '1';
  }

  // ==========================================
  // 11. PARALLAX subtle on hero shapes
  // ==========================================
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const shapes = document.querySelectorAll('.hero-bg-shapes .shape');
    shapes.forEach((shape, i) => {
      const speed = (i + 1) * 0.15;
      shape.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }, { passive: true });

  // ==========================================
  // 12. INPUT INTERACTION
  // ==========================================
  document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(input => {
    input.addEventListener('input', () => {
      input.style.borderColor = '';
      input.style.background = '';
    });
  });

  console.log('🚀 Jasa Website Palugada — Loaded!');
});
