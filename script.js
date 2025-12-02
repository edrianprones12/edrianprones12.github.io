// Navigation burger menu
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');
const navbar = document.querySelector('.navbar');

// Toggle navigation menu
burger.addEventListener('click', () => {
    nav.classList.toggle('active');
    navLinks.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });
    burger.classList.toggle('toggle');
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        if (nav.classList.contains('active')) {
            nav.classList.remove('active');
            burger.classList.remove('toggle');
        }

        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });

            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        }
    });
});

// Update active navigation link on scroll
function updateActiveLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === currentSection) {
            link.classList.add('active');
        }
    });
}

// Navbar scroll effect
function handleScroll() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    updateActiveLink();
}

window.addEventListener('scroll', handleScroll);

// Comment form and card logic
const commentForm = document.getElementById('comment-form');
const commentCard = document.getElementById('comment-card');

function displayComment(comment) {
    if (!comment) return;
    commentCard.querySelector('.comment-name').textContent = comment.name;
    commentCard.querySelector('.comment-email').textContent = comment.email;
    commentCard.querySelector('.comment-message').textContent = comment.message;
    commentCard.querySelector('.comment-date').textContent = new Date(comment.created_at || comment.date).toLocaleString();
}

function fetchLatestComment() {
    fetch('get_latest_comment.php')
        .then(response => response.json())
        .then(comment => {
            displayComment(comment);
        })
        .catch(() => {
            console.error('Failed to fetch latest comment.');
        });
}

// Notification system
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// DOMContentLoaded - all combined logic
document.addEventListener('DOMContentLoaded', () => {
    updateActiveLink();
    handleScroll();
    typewriterLoop();
    initEducationSlider();

    if (commentForm) {
        commentForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(commentForm);

            fetch('comment.php', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        const comment = data.comment;

                        // DEBUG: Show in console
                        console.log('Returned comment:', comment);

                        // Update comment section
                        if (commentCard) {
                            commentCard.querySelector('.comment-name').textContent = `${comment.name}`;
                            commentCard.querySelector('.comment-email').textContent = ` ${comment.email}`;
                            commentCard.querySelector('.comment-message').textContent = ` ${comment.message}`;
                            commentCard.querySelector('.comment-date').textContent = `${new Date(comment.created_at).toLocaleString()}`;
                        }

                        showNotification('Message sent successfully!', 'success');
                        commentForm.reset();
                    } else {
                        alert(data.message || 'Submission failed.');
                    }
                })
                .catch(error => {
                    console.error('Error submitting comment:', error);
                    showNotification('Something went wrong. Please try again.', 'error');
                });

        });

        // Fetch latest comment on page load
        fetchLatestComment();
    }
});

// Animate on scroll
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Parallax for hero
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const scrolled = window.scrollY;
    if (hero) hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
});

// Typewriter
const typewriterPhrases = [
    "Web Developer",
    "Creative Designer",
    "IT Student",
    "Photographer & Editor"
];
const typewriterElement = document.querySelector('.typewriter span');
let twPhraseIndex = 0;
let twCharIndex = 0;
let twIsDeleting = false;
const twTypeSpeed = 100;
const twPauseAfterType = 1200;
const twPauseAfterErase = 500;

function typewriterLoop() {
    if (!typewriterElement) return;
    const currentPhrase = typewriterPhrases[twPhraseIndex];
    let displayText = currentPhrase.substring(0, twCharIndex);
    typewriterElement.innerHTML = displayText + '<span class="typewriter-cursor">|</span>';

    if (!twIsDeleting && twCharIndex < currentPhrase.length) {
        twCharIndex++;
        setTimeout(typewriterLoop, twTypeSpeed);
    } else if (twIsDeleting && twCharIndex > 0) {
        twCharIndex--;
        setTimeout(typewriterLoop, twTypeSpeed);
    } else {
        if (!twIsDeleting) {
            twIsDeleting = true;
            setTimeout(typewriterLoop, twPauseAfterType);
        } else {
            twIsDeleting = false;
            twPhraseIndex = (twPhraseIndex + 1) % typewriterPhrases.length;
            setTimeout(typewriterLoop, twPauseAfterErase);
        }
    }
}

// Education slider with swipe
function initEducationSlider() {
    const cards = document.querySelectorAll('.education-card');
    const dots = document.querySelectorAll('.slider-dot');
    const slider = document.querySelector('.education-slider');
    let current = 0;
    let startX = 0;
    let endX = 0;
    let isDragging = false;

    function showCard(idx, direction = 0) {
        if (idx === current) return;
        const outCard = cards[current];
        const inCard = cards[idx];
        cards.forEach(card => card.classList.remove('swipe-left', 'swipe-right'));
        if (direction < 0) outCard.classList.add('swipe-left');
        else if (direction > 0) outCard.classList.add('swipe-right');

        setTimeout(() => {
            cards.forEach((card, i) => card.classList.toggle('active', i === idx));
            dots.forEach((dot, i) => dot.classList.toggle('active', i === idx));
        }, 350);
        current = idx;
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const idx = parseInt(dot.getAttribute('data-index'));
            showCard(idx, idx > current ? 1 : -1);
        });
    });

    slider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });
    slider.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        endX = e.touches[0].clientX;
    });
    slider.addEventListener('touchend', () => {
        if (!isDragging) return;
        const diff = endX - startX;
        if (Math.abs(diff) > 50) {
            if (diff < 0 && current < cards.length - 1) showCard(current + 1, 1);
            else if (diff > 0 && current > 0) showCard(current - 1, -1);
        }
        isDragging = false;
        startX = endX = 0;
    });

    slider.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        isDragging = true;
        e.preventDefault();
    });
    slider.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        endX = e.clientX;
    });
    slider.addEventListener('mouseup', () => {
        if (!isDragging) return;
        const diff = endX - startX;
        if (Math.abs(diff) > 50) {
            if (diff < 0 && current < cards.length - 1) showCard(current + 1, 1);
            else if (diff > 0 && current > 0) showCard(current - 1, -1);
        }
        isDragging = false;
        startX = endX = 0;
    });
    slider.addEventListener('mouseleave', () => {
        isDragging = false;
        startX = endX = 0;
    });

    cards.forEach((card, i) => card.classList.remove('active', 'swipe-left', 'swipe-right'));
    cards[0].classList.add('active');
    dots[0].classList.add('active');
    current = 0;
}
