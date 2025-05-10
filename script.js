document.addEventListener('DOMContentLoaded', () => {
    const messageBubbles = document.querySelectorAll('.message-content.markdown-body');

    if (messageBubbles.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px', // Trigger a bit sooner, when 50px from bottom of viewport
            threshold: 0.05 // Start animation when 5% is visible
        };

        let observer; // Declare observer variable

        const handleIntersection = (entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Staggered animation using requestAnimationFrame for smoother effect
                    // Use data-attribute to ensure each element gets its own delay calculation relative to its position in the querySelectorAll list.
                    if (!entry.target.dataset.animationDelay) {
                         let elIndex = Array.from(messageBubbles).indexOf(entry.target);
                         entry.target.dataset.animationDelay = elIndex * 120; // 120ms delay
                    }
                    
                    requestAnimationFrame(() => {
                        setTimeout(() => {
                            entry.target.classList.add('is-visible');
                        }, parseInt(entry.target.dataset.animationDelay));
                    });
                    
                    // Optional: Stop observing after it's visible to save resources
                    // observer.unobserve(entry.target);
                }
                // Optional: To re-animate if they scroll out and back in, remove unobserve
                // else {
                //    entry.target.classList.remove('is-visible');
                //    // Reset data-attribute if you want re-staggering on re-entry.
                //    // delete entry.target.dataset.animationDelay; 
                // }
            });
        };

        // Check if IntersectionObserver is supported
        if ('IntersectionObserver' in window) {
            observer = new IntersectionObserver(handleIntersection, observerOptions);
            messageBubbles.forEach(bubble => {
                observer.observe(bubble);
            });
        } else {
            // Fallback for older browsers: make all bubbles visible immediately
            console.warn('IntersectionObserver not supported. Animating all bubbles at once.');
            messageBubbles.forEach((bubble, index) => {
                 setTimeout(() => {
                    bubble.classList.add('is-visible');
                }, index * 120); // Still apply stagger for consistency if desired
            });
        }
    }


    // Ensure hljs is available and highlightAll is a function before calling
    if (typeof hljs !== 'undefined' && typeof hljs.highlightAll === 'function') {
        try {
            hljs.highlightAll();
        } catch (e) {
            console.error("Error highlighting code:", e);
        }
    } else {
        // This message can be helpful during development
        // console.warn('Highlight.js or highlightAll function not available.');
    }

    // Smooth scroll for anchor links - (though no internal links in current HTML)
    // This is mostly for completeness or if you add such links later
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            try {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            } catch (error) {
                console.error('Error scrolling to anchor:', error);
            }
        });
    });
});