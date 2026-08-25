/**
 * Dr. Ashish Bajaj — Academic Portfolio & Research
 * Interactive Logic, Theme Engine, Filtering, Modals & Toast System
 */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. Toast Notification System
     -------------------------------------------------------------------------- */
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message, iconClass = 'fa-solid fa-circle-check') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="${iconClass}"></i><span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-exit');
      setTimeout(() => toast.remove(), 250);
    }, 2800);
  }

  /* --------------------------------------------------------------------------
     2. Dynamic Typing Animation
     -------------------------------------------------------------------------- */
  const typedEl = document.getElementById('typedIntro');
  const phrases = [
    'Researcher • Teacher • Engineer',
    'Robust NLP & Adversarial ML',
    'LLM Safety & AI Reliability',
    'Explainable & Trustworthy AI',
    'Assistant Professor @ TIET'
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function typeEffect() {
    if (!typedEl) return;
    const currentPhrase = phrases[phraseIdx];

    if (isDeleting) {
      typedEl.textContent = currentPhrase.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 45;
    } else {
      typedEl.textContent = currentPhrase.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIdx === currentPhrase.length) {
      isDeleting = true;
      typingSpeed = 1600; // Pause at full phrase
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      typingSpeed = 400; // Pause before typing next
    }

    setTimeout(typeEffect, typingSpeed);
  }

  setTimeout(typeEffect, 400);

  /* --------------------------------------------------------------------------
     3. Theme Switcher (Dark / Light Theme Engine)
     -------------------------------------------------------------------------- */
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const htmlRoot = document.documentElement;

  // Initialize theme from saved preference or default to dark
  const savedTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(savedTheme);

  function applyTheme(theme) {
    if (theme === 'light') {
      htmlRoot.setAttribute('data-theme', 'light');
      document.body.classList.add('light');
      if (themeIcon) {
        themeIcon.className = 'fa-solid fa-sun';
      }
    } else {
      htmlRoot.setAttribute('data-theme', 'dark');
      document.body.classList.remove('light');
      if (themeIcon) {
        themeIcon.className = 'fa-solid fa-moon';
      }
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('theme', newTheme);
      showToast(newTheme === 'light' ? 'Switched to Light Theme' : 'Switched to Dark Theme', 'fa-solid fa-circle-half-stroke');
    });
  }

  /* --------------------------------------------------------------------------
     4. Scroll Progress & Sticky Header & Back-to-Top
     -------------------------------------------------------------------------- */
  const scrollProgress = document.getElementById('scrollProgress');
  const siteHeader = document.getElementById('siteHeader');
  const backToTopBtn = document.getElementById('backToTop');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

    if (scrollProgress) {
      scrollProgress.style.width = `${progress}%`;
    }

    if (siteHeader) {
      if (scrollTop > 40) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    if (backToTopBtn) {
      if (scrollTop > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Scroll-Spy active navigation links
    let currentActiveId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
        currentActiveId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href === `#${currentActiveId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* --------------------------------------------------------------------------
     5. Mobile Menu Drawer
     -------------------------------------------------------------------------- */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const menuIcon = document.getElementById('menuIcon');

  function toggleMobileMenu() {
    if (!mobileDrawer) return;
    const isOpen = mobileDrawer.classList.toggle('open');
    if (mobileMenuBtn) {
      mobileMenuBtn.setAttribute('aria-expanded', isOpen);
    }
    if (menuIcon) {
      menuIcon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    }
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  }

  // Close drawer on link click
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (mobileDrawer && mobileDrawer.classList.contains('open')) {
        toggleMobileMenu();
      }
    });
  });

  /* --------------------------------------------------------------------------
     6. Copy to Clipboard Utilities
     -------------------------------------------------------------------------- */
  async function copyTextToClipboard(text, successMessage = 'Copied to clipboard!') {
    try {
      await navigator.clipboard.writeText(text);
      showToast(successMessage);
      return true;
    } catch (err) {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showToast(successMessage);
      return true;
    }
  }

  // Hero Copy Email Button
  const copyEmailBtn = document.getElementById('copyEmail');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      copyTextToClipboard('ashish.bajaj@thapar.edu', 'Email copied: ashish.bajaj@thapar.edu');
    });
  }

  // Inline Copy Buttons
  document.querySelectorAll('.copy-inline-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.dataset.copy;
      if (textToCopy) {
        copyTextToClipboard(textToCopy, `Copied: ${textToCopy}`);
      }
    });
  });

  // Profile Card Share / Copy Info
  const copyProfileLink = document.getElementById('copyProfileLink');
  if (copyProfileLink) {
    copyProfileLink.addEventListener('click', () => {
      const profileInfo = `Dr. Ashish Bajaj\nAssistant Professor, Dept. of Computer Science & Engineering\nThapar Institute of Engineering & Technology, Patiala, India\nEmail: ashish.bajaj@thapar.edu | bajaj.ashish25@gmail.com\nGitHub: https://github.com/Ashish25096`;
      copyTextToClipboard(profileInfo, 'Contact details copied to clipboard!');
    });
  }

  /* --------------------------------------------------------------------------
     7. Publications Explorer: Category Tabs, Search & Clear
     -------------------------------------------------------------------------- */
  const pubTabs = document.querySelectorAll('.pub-tab');
  const pubFilterInput = document.getElementById('pubFilter');
  const clearFilterBtn = document.getElementById('clearFilter');
  const pubCards = document.querySelectorAll('.pub-card');
  const pubCountBadge = document.getElementById('pubCount');
  const noPubsFound = document.getElementById('noPubsFound');
  const resetSearchBtn = document.getElementById('resetSearchBtn');

  let currentCategory = 'all';

  function filterPublications() {
    const searchTerm = pubFilterInput ? pubFilterInput.value.trim().toLowerCase() : '';
    let visibleCount = 0;

    if (clearFilterBtn) {
      clearFilterBtn.style.display = searchTerm.length > 0 ? 'block' : 'none';
    }

    pubCards.forEach(card => {
      const cardCategory = card.dataset.category || '';
      const cardKeywords = (card.dataset.keywords || '').toLowerCase();
      const cardTitle = (card.querySelector('.pub-title')?.textContent || '').toLowerCase();
      const cardAuthors = (card.querySelector('.pub-authors')?.textContent || '').toLowerCase();
      const cardVenue = (card.querySelector('.pub-venue')?.textContent || '').toLowerCase();

      const matchesCategory = (currentCategory === 'all' || cardCategory === currentCategory);
      const matchesSearch = searchTerm === '' || 
                            cardKeywords.includes(searchTerm) || 
                            cardTitle.includes(searchTerm) || 
                            cardAuthors.includes(searchTerm) || 
                            cardVenue.includes(searchTerm);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'block';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (pubCountBadge) {
      pubCountBadge.textContent = `Showing ${visibleCount} publication${visibleCount === 1 ? '' : 's'}`;
    }

    if (noPubsFound) {
      noPubsFound.style.display = visibleCount === 0 ? 'flex' : 'none';
    }
  }

  // Category Tab clicks
  pubTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      pubTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentCategory = tab.dataset.category || 'all';
      filterPublications();
    });
  });

  // Search input typing
  if (pubFilterInput) {
    pubFilterInput.addEventListener('input', filterPublications);
  }

  // Clear filter button
  if (clearFilterBtn) {
    clearFilterBtn.addEventListener('click', () => {
      if (pubFilterInput) {
        pubFilterInput.value = '';
        pubFilterInput.focus();
      }
      filterPublications();
    });
  }

  if (resetSearchBtn) {
    resetSearchBtn.addEventListener('click', () => {
      if (pubFilterInput) pubFilterInput.value = '';
      currentCategory = 'all';
      pubTabs.forEach(t => {
        t.classList.toggle('active', t.dataset.category === 'all');
      });
      filterPublications();
    });
  }

  // Abstract expand/collapse toggle
  document.querySelectorAll('.toggle-abstract').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const abstractEl = document.getElementById(targetId);
      if (abstractEl) {
        const isOpen = abstractEl.classList.toggle('open');
        const icon = btn.querySelector('i');
        if (icon) {
          icon.className = isOpen ? 'fa-solid fa-angle-up' : 'fa-solid fa-angle-down';
        }
      }
    });
  });

  /* --------------------------------------------------------------------------
     8. Modals Management (Bio Modal, BibTeX Modal, CV Modal)
     -------------------------------------------------------------------------- */
  const bioModal = document.getElementById('bioModal');
  const bibtexModal = document.getElementById('bibtexModal');
  const cvModal = document.getElementById('cvModal');

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Close when clicking close buttons or backdrop
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  document.querySelectorAll('.modal-close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-backdrop');
      closeModal(modal);
    });
  });

  const closeBioFooterBtn = document.getElementById('closeBioFooterBtn');
  if (closeBioFooterBtn) closeBioFooterBtn.addEventListener('click', () => closeModal(bioModal));

  const closeBibtexFooterBtn = document.getElementById('closeBibtexFooterBtn');
  if (closeBibtexFooterBtn) closeBibtexFooterBtn.addEventListener('click', () => closeModal(bibtexModal));

  const closeCvModalBtn = document.getElementById('closeCvModal');
  if (closeCvModalBtn) closeCvModalBtn.addEventListener('click', () => closeModal(cvModal));

  // Escape key closes open modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      [bioModal, bibtexModal, cvModal].forEach(m => closeModal(m));
    }
  });

  // Bio Modal Triggers
  const bioTriggers = [
    document.getElementById('quickBioBtn'),
    document.getElementById('heroBioBtn'),
    document.getElementById('mobileBioBtn')
  ];

  bioTriggers.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(bioModal);
      });
    }
  });

  // Copy Bio text buttons in modal
  document.querySelectorAll('.copy-bio-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const text = targetEl.textContent.trim();
        copyTextToClipboard(text, 'Bio copied to clipboard!');
      }
    });
  });

  // BibTeX Citation Modal Triggers
  const bibtexContent = document.getElementById('bibtexContent');
  const copyBibtexModalBtn = document.getElementById('copyBibtexModalBtn');

  document.querySelectorAll('.bibtex-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const bibtex = btn.dataset.bibtex || '';
      if (bibtexContent) {
        bibtexContent.querySelector('code').textContent = bibtex;
      }
      openModal(bibtexModal);
    });
  });

  if (copyBibtexModalBtn) {
    copyBibtexModalBtn.addEventListener('click', () => {
      const code = bibtexContent ? bibtexContent.querySelector('code').textContent : '';
      if (code) {
        copyTextToClipboard(code, 'BibTeX citation copied to clipboard!');
      }
    });
  }

  // CV Modal Trigger
  const downloadCvBtn = document.getElementById('downloadCV');
  if (downloadCvBtn) {
    downloadCvBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(cvModal);
    });
  }

  // Print CV
  const printCvBtn = document.getElementById('printCvBtn');
  if (printCvBtn) {
    printCvBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Download CV as TXT
  const downloadTxtCvBtn = document.getElementById('downloadTxtCvBtn');
  if (downloadTxtCvBtn) {
    downloadTxtCvBtn.addEventListener('click', () => {
      const cvText = `================================================================================
DR. ASHISH BAJAJ — CURRICULUM VITAE
Assistant Professor, Department of Computer Science & Engineering
Thapar Institute of Engineering & Technology, Patiala, Punjab, India
Email: ashish.bajaj@thapar.edu | bajaj.ashish25@gmail.com
GitHub: https://github.com/Ashish25096
================================================================================

1. ACADEMIC QUALIFICATIONS
--------------------------------------------------------------------------------
* Ph.D. in Information Technology (2024)
  Delhi Technological University (DTU), New Delhi, India
  Research Area: Adversarial Machine Learning & Robust Natural Language Processing

* M.Tech. in Information Technology (2021)
  Guru Gobind Singh Indraprastha University (GGSIPU), New Delhi, India

* B.Tech. in Computer Science & Engineering (2019)

2. RESEARCH INTERESTS & SPECIALIZATIONS
--------------------------------------------------------------------------------
* Robust and Trustworthy Natural Language Processing
* Adversarial Machine Learning & Defense Mechanisms
* Large Language Model (LLM) Safety, Alignment & Guardrails
* Explainable AI (XAI) & Interpretability Metrics
* Transformer-Based Model Evaluation & Stress-Testing

3. OPEN-SOURCE RESEARCH TOOLKITS & FRAMEWORKS
--------------------------------------------------------------------------------
* HOMOCHAR: Adversarial character perturbation framework for NLP models.
  URL: https://github.com/Ashish25096/HOMOMCHAR
* INFLEXA: Adversarial robustness research and evaluation benchmarking suite.
  URL: https://github.com/Ashish25096/INFLEXA
* Text-Muddler: Modular text perturbation & out-of-distribution testing toolkit.
  URL: https://github.com/Ashish25096/Text-Muddler

4. COURSES TAUGHT
--------------------------------------------------------------------------------
* Artificial Intelligence & Machine Learning
* Deep Learning & Neural Architectures
* Natural Language Processing & Pretrained LLMs
* Data Structures & Algorithms
* Python & C++ Scientific Programming

================================================================================
Generated from Dr. Ashish Bajaj's Academic Portfolio
================================================================================`;

      const blob = new Blob([cvText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Dr-Ashish-Bajaj-CV.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('CV downloaded successfully!', 'fa-solid fa-file-arrow-down');
    });
  }

  /* --------------------------------------------------------------------------
     9. Direct Contact Actions
     -------------------------------------------------------------------------- */
  const sendMailtoBtn = document.getElementById('sendMailto');
  const sendCopyBtn = document.getElementById('send');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');

  function getMessageDetails() {
    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const subject = (subjectInput && subjectInput.value.trim()) || 'Research Inquiry / Academic Collaboration';
    const message = messageInput ? messageInput.value.trim() : '';
    return { name, email, subject, message };
  }

  if (sendMailtoBtn) {
    sendMailtoBtn.addEventListener('click', () => {
      const { name, email, subject, message } = getMessageDetails();
      if (!name || !email || !message) {
        showToast('Please fill in your name, email, and message.', 'fa-solid fa-triangle-exclamation');
        return;
      }

      const bodyText = `From: ${name} (${email})\n\nMessage:\n${message}`;
      const mailtoUrl = `mailto:ashish.bajaj@thapar.edu?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
      window.location.href = mailtoUrl;
      showToast('Opening your email client...', 'fa-solid fa-paper-plane');
    });
  }

  if (sendCopyBtn) {
    sendCopyBtn.addEventListener('click', () => {
      const { name, email, subject, message } = getMessageDetails();
      if (!name || !email || !message) {
        showToast('Please fill in your name, email, and message.', 'fa-solid fa-triangle-exclamation');
        return;
      }

      const formattedMessage = `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`;
      copyTextToClipboard(formattedMessage, 'Message inquiry copied to clipboard!');
    });
  }

});
