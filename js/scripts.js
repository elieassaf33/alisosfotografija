document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navContainer = document.querySelector('.nav-container');
    const portfolioDropdown = document.querySelector('.portfolio-dropdown');

    // Toggle mobile menu
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            if (navContainer) navContainer.classList.toggle('active');
        });
    }

    // Handle portfolio dropdown on mobile
    if (portfolioDropdown && window.innerWidth <= 768) {
        portfolioDropdown.addEventListener('click', (e) => {
            if (e.target.closest('.portfolio-dropdown')) {
                portfolioDropdown.classList.toggle('active');
            }
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (menuToggle && navContainer && portfolioDropdown) {
            if (!e.target.closest('.nav-container') && !e.target.closest('.menu-toggle')) {
                menuToggle.classList.remove('active');
                navContainer.classList.remove('active');
                portfolioDropdown.classList.remove('active');
            }
        }
    });

    // Update dropdown behavior on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && portfolioDropdown && menuToggle && navContainer) {
            portfolioDropdown.classList.remove('active');
            menuToggle.classList.remove('active');
            navContainer.classList.remove('active');
        }
    });
      const links = document.querySelectorAll('header nav a');

  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const url = this.href;

      // Only apply for internal links
      if (!url.includes(location.hostname)) return;

      e.preventDefault();           // stop immediate navigation
      document.body.classList.add('fade-out'); // trigger fade out

      // Navigate after transition
      setTimeout(() => {
        window.location.href = url;
      }, 400); // matches CSS transition duration
    });
  });
document.querySelectorAll('.faq-question').forEach(button => {
  button.addEventListener('click', () => {
    const answer = button.nextElementSibling; // should be the .faq-answer
    const icon = button.querySelector('.faq-icon');

    // Close all other answers
    document.querySelectorAll('.faq-answer').forEach(a => {
      if (a !== answer) {
        a.classList.remove('open');
        const otherIcon = a.previousElementSibling.querySelector('.faq-icon');
        if(otherIcon) otherIcon.textContent = '+';
      }
    });

    // Toggle current answer
    answer.classList.toggle('open');
    icon.textContent = answer.classList.contains('open') ? '-' : '+';
  });
});


});
