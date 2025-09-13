// Lightbox functionality
let currentImageIndex = 0;
let images = [];

// DOM Elements
let lightbox, lightboxImg, lightboxClose, lightboxPrev, lightboxNext;

function initializeLightbox() {
    // Create lightbox elements if they don't exist
    if (!document.getElementById('lightbox')) {
        const lightboxHTML = `
            <div id="lightbox" class="lightbox">
                <span class="lightbox-close">&times;</span>
                <img id="lightbox-img" src="" alt="">
                <span class="lightbox-prev">&#10094;</span>
                <span class="lightbox-next">&#10095;</span>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    }

    // Cache DOM elements
    lightbox = document.getElementById('lightbox');
    lightboxImg = document.getElementById('lightbox-img');
    lightboxClose = document.querySelector('.lightbox-close');
    lightboxPrev = document.querySelector('.lightbox-prev');
    lightboxNext = document.querySelector('.lightbox-next');

    // Add event listeners
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', showNextImage);
    lightboxPrev.addEventListener('click', showPrevImage);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', handleKeyDown);
}

function updateLightbox() {
    if (!images || images.length === 0) {
        console.error('No images available for lightbox');
        return;
    }
    
    const currentImage = images[currentImageIndex];
    if (currentImage && currentImage.src) {
        lightboxImg.src = currentImage.src;
    } else {
        console.error('Invalid image data at index:', currentImageIndex);
    }
}

function showLightbox(index) {
    if (index >= 0 && index < images.length) {
        currentImageIndex = index;
        updateLightbox();
        document.body.style.overflow = 'hidden';
        lightbox.classList.add('show');
    }
}

function closeLightbox() {
    lightbox.classList.remove('show');
    document.body.style.overflow = 'auto';
}

function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    updateLightbox();
}

function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    updateLightbox();
}

function handleKeyDown(e) {
    if (!lightbox.classList.contains('show')) return;
    
    switch(e.key) {
        case 'Escape':
            closeLightbox();
            break;
        case 'ArrowLeft':
            showPrevImage();
            break;
        case 'ArrowRight':
            showNextImage();
            break;
    }
}

// Initialize lightbox when the DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLightbox);
} else {
    initializeLightbox();
}
