// Mock data for reviews
const reviews = [
    {
        id: 1,
        title: "The Shawshank Redemption",
        rating: 5,
        category: "Movies",
        text: "A masterpiece of storytelling that keeps you engaged from start to finish. The performances are outstanding, and the direction is impeccable.",
        author: "John Doe",
        date: "March 15, 2024"
    },
    {
        id: 2,
        title: "Local Italian Restaurant",
        rating: 4,
        category: "Restaurants",
        text: "Authentic Italian cuisine with a modern twist. The pasta dishes are exceptional, and the service is top-notch.",
        author: "Jane Smith",
        date: "March 14, 2024"
    },
    {
        id: 3,
        title: "Wireless Headphones",
        rating: 4.5,
        category: "Products",
        text: "Great sound quality and comfortable to wear for long periods. Battery life could be better, but overall a solid purchase.",
        author: "Mike Johnson",
        date: "March 13, 2024"
    },
    {
        id: 4,
        title: "The Great Gatsby",
        rating: 5,
        category: "Books",
        text: "A timeless classic that captures the essence of the American Dream. Fitzgerald's prose is simply beautiful.",
        author: "Sarah Wilson",
        date: "March 12, 2024"
    },
    {
        id: 5,
        title: "Sushi Master",
        rating: 3,
        category: "Restaurants",
        text: "The sushi was fresh but the service was slow. The prices are a bit high for what you get.",
        author: "David Chen",
        date: "March 11, 2024"
    }
];

// DOM Elements
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const sortBy = document.getElementById('sort-by');
const ratingFilters = document.querySelectorAll('.rating-filter input[type="checkbox"]');
const reviewsContainer = document.getElementById('reviews-container');
const navLinks = document.querySelectorAll('.nav-links a');
const reviewForm = document.getElementById('review-form');
const submitReviewForm = document.getElementById('submit-review-form');

// Filter state
let currentFilters = {
    search: '',
    category: 'all',
    sort: 'newest',
    ratings: [1, 2, 3, 4, 5]
};

// Theme handling
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;
const themeIcon = themeToggle.querySelector('i');

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Star rating functionality
const starInputs = document.querySelectorAll('.star-rating input');
const starLabels = document.querySelectorAll('.star-rating label');

starInputs.forEach((input, index) => {
    input.addEventListener('change', () => {
        updateStarDisplay(index);
    });
});

function updateStarDisplay(selectedIndex) {
    starLabels.forEach((label, index) => {
        const icon = label.querySelector('i');
        if (index <= selectedIndex) {
            icon.className = 'fas fa-star';
        } else {
            icon.className = 'far fa-star';
        }
    });
}

// Initialize the page
function initializePage() {
    renderReviews();
    setupEventListeners();
    showReviews(); // Start with reviews page visible
}

// Set up event listeners
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', (e) => {
        currentFilters.search = e.target.value.toLowerCase();
        renderReviews();
    });

    // Category filter
    categoryFilter.addEventListener('change', (e) => {
        currentFilters.category = e.target.value;
        renderReviews();
    });

    // Sort functionality
    sortBy.addEventListener('change', (e) => {
        currentFilters.sort = e.target.value;
        renderReviews();
    });

    // Rating filters
    ratingFilters.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateRatingFilters();
            renderReviews();
        });
    });

    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.textContent.trim();
            handleNavigation(page);
        });
    });

    // Submit Review Form
    reviewForm.addEventListener('submit', handleSubmitReview);
}

// Update rating filters based on checkbox states
function updateRatingFilters() {
    currentFilters.ratings = Array.from(ratingFilters)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => parseInt(checkbox.value));
}

// Filter and sort reviews
function getFilteredReviews() {
    return reviews
        .filter(review => {
            const matchesSearch = review.title.toLowerCase().includes(currentFilters.search) ||
                                review.text.toLowerCase().includes(currentFilters.search);
            const matchesCategory = currentFilters.category === 'all' || 
                                  review.category.toLowerCase() === currentFilters.category;
            const matchesRating = currentFilters.ratings.includes(Math.floor(review.rating));
            
            return matchesSearch && matchesCategory && matchesRating;
        })
        .sort((a, b) => {
            switch(currentFilters.sort) {
                case 'highest':
                    return b.rating - a.rating;
                case 'lowest':
                    return a.rating - b.rating;
                case 'oldest':
                    return new Date(a.date) - new Date(b.date);
                case 'newest':
                default:
                    return new Date(b.date) - new Date(a.date);
            }
        });
}

// Render star rating
function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i - 0.5 <= rating) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Render reviews
function renderReviews() {
    const filteredReviews = getFilteredReviews();
    reviewsContainer.innerHTML = filteredReviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <h3>${review.title}</h3>
                <div class="rating">
                    ${renderStars(review.rating)}
                </div>
            </div>
            <div class="category">${review.category}</div>
            <p class="review-text">${review.text}</p>
            <div class="review-footer">
                <span class="author">By ${review.author}</span>
                <span class="date">${review.date}</span>
            </div>
        </div>
    `).join('');
}

// Handle navigation
function handleNavigation(page) {
    // Remove active class from all links
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Add active class to clicked link
    const activeLink = Array.from(navLinks).find(link => link.textContent.trim() === page);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // Handle different pages
    switch(page) {
        case 'Home':
            showReviews();
            break;
        case 'Review':
            showReviewForm();
            break;
        case 'About':
            showAbout();
            break;
    }
}

// Function to show reviews section
function showReviews() {
    const reviewsContainer = document.getElementById('reviews-container');
    const submitForm = document.getElementById('submit-review-form');
    
    reviewsContainer.style.display = 'grid';
    submitForm.style.display = 'none';
    
    // Hide other sections if they exist
    const aboutSection = document.getElementById('about-section');
    if (aboutSection) aboutSection.style.display = 'none';
    
    // Render reviews
    renderReviews();
}

// Function to show review form
function showReviewForm() {
    const reviewsContainer = document.getElementById('reviews-container');
    const submitForm = document.getElementById('submit-review-form');
    
    reviewsContainer.style.display = 'none';
    submitForm.style.display = 'block';
    
    // Hide about section if it exists
    const aboutSection = document.getElementById('about-section');
    if (aboutSection) aboutSection.style.display = 'none';
}

// Function to show about section
function showAbout() {
    const reviewsContainer = document.getElementById('reviews-container');
    const submitForm = document.getElementById('submit-review-form');
    
    reviewsContainer.style.display = 'none';
    submitForm.style.display = 'none';
    
    // Create and show about section if it doesn't exist
    let aboutSection = document.getElementById('about-section');
    if (!aboutSection) {
        aboutSection = document.createElement('div');
        aboutSection.id = 'about-section';
        aboutSection.className = 'about-section';
        aboutSection.innerHTML = `
            <h2>About CritiqueZone</h2>
            <p>CritiqueZone is a platform for sharing and discovering reviews across various categories. Our mission is to provide honest, helpful reviews to help you make informed decisions.</p>
            <h3>Our Features</h3>
            <ul>
                <li>Share reviews across multiple categories</li>
                <li>Filter and sort reviews to find what you're looking for</li>
                <li>Rate items with our intuitive star rating system</li>
                <li>Search for specific reviews</li>
            </ul>
            <h3>Contact Us</h3>
            <p>Have questions or feedback? Reach out to us at <a href="mailto:contact@critiquezone.com">contact@critiquezone.com</a></p>
        `;
        document.querySelector('.content').appendChild(aboutSection);
    }
    aboutSection.style.display = 'block';
}

// Handle submit review
function handleSubmitReview(e) {
    e.preventDefault();

    const title = document.getElementById('review-title').value;
    const category = document.getElementById('review-category').value;
    const rating = document.querySelector('input[name="rating"]:checked').value;
    const text = document.getElementById('review-text').value;
    const author = document.getElementById('review-author').value;
    const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Create new review object
    const newReview = {
        id: reviews.length + 1,
        title,
        category,
        rating: parseFloat(rating),
        text,
        author,
        date
    };

    // Add to reviews array
    reviews.unshift(newReview);

    // Reset form
    reviewForm.reset();

    // Show success message
    alert('Review submitted successfully!');

    // Switch to home view
    handleNavigation('Home');
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage); 