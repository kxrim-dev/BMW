document.addEventListener('DOMContentLoaded', function() {
    window.onload = function() {
        // Wartet, bis die Seite vollständig geladen ist (einschließlich aller Medien)
        setTimeout(function() {
            window.scrollTo(0, 0);  // Setzt die Scroll-Position auf den oberen Rand der Seite
        }, 0);
    };
    const fadeInElements = document.querySelectorAll('.fade-in');

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    fadeInElements.forEach(element => {
        observer.observe(element);
    });
});
