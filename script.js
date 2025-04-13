// Mock data for reviews
const reviews = [
    {
        id: 1,
        title: "Great Product!",
        rating: 5,
        category: "Electronics",
        text: "This product exceeded my expectations. The quality is outstanding and the features are exactly what I needed.",
        author: "John Doe",
        date: "2024-03-15"
    },
    {
        id: 2,
        title: "Disappointing Experience",
        rating: 2,
        category: "Books",
        text: "The book was not as described. The content was shallow and lacked depth.",
        author: "Jane Smith",
        date: "2024-03-14"
    },
    {
        id: 3,
        title: "Worth Every Penny",
        rating: 5,
        category: "Fashion",
        text: "The material is high quality and the fit is perfect. I would definitely recommend this to others.",
        author: "Mike Johnson",
        date: "2024-03-13"
    },
    {
        id: 4,
        title: "Average Product",
        rating: 3,
        category: "Home & Kitchen",
        text: "It's okay for the price, but there are better options available in the market.",
        author: "Sarah Wilson",
        date: "2024-03-12"
    },
    {
        id: 5,
        title: "Excellent Service",
        rating: 5,
        category: "Services",
        text: "The customer service was exceptional. They went above and beyond to help me.",
        author: "David Brown",
        date: "2024-03-11"
    }
];

// DOM Elements
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const sortOptions = document.getElementById('sort-by');
const ratingFilters = document.querySelectorAll('.rating-filter input');
const reviewsContainer = document.getElementById('reviews-container');
const navLinks = document.querySelectorAll('.nav-links a');
const mobileLinks = document.querySelectorAll('.mobile-menu a');
const reviewForm = document.getElementById('review-form');
const submitReviewForm = document.getElementById('submit-review-form');
const mobileMenu = document.getElementById('mobile-menu');
const hamburgerButton = document.getElementById('hamburger-btn');
const themeToggle = document.getElementById('theme-toggle');
const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
const resetFiltersBtn = document.getElementById('reset-filters');

// Filter state
let filterState = {
    search: '',
    category: 'all',
    sort: 'newest',
    ratings: []
};

// Theme handling
// Check for saved theme preference
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

// Theme toggle event listeners
themeToggle.addEventListener('click', toggleTheme);
mobileThemeToggle.addEventListener('click', toggleTheme);

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = theme === 'light' ? 'fa-moon' : 'fa-sun';
    themeToggle.innerHTML = `<i class="fas ${icon}"></i>`;
    mobileThemeToggle.innerHTML = `<i class="fas ${icon}"></i>`;
}

// Hamburger menu functionality
hamburgerButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    const icon = mobileMenu.classList.contains('active') ? 'fa-times' : 'fa-bars';
    hamburgerButton.innerHTML = `<i class="fas ${icon}"></i>`;
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !hamburgerButton.contains(e.target)) {
        mobileMenu.classList.remove('active');
        hamburgerButton.innerHTML = '<i class="fas fa-bars"></i>';
    }
});

// Search functionality
searchInput.addEventListener('input', (e) => {
    filterState.search = e.target.value.toLowerCase();
    filterAndRenderReviews();
});

// Category filter
categoryFilter.addEventListener('change', (e) => {
    filterState.category = e.target.value;
    filterAndRenderReviews();
});

// Sort options
sortOptions.addEventListener('change', (e) => {
    filterState.sort = e.target.value;
    filterAndRenderReviews();
});

// Rating filters
ratingFilters.forEach(filter => {
    filter.addEventListener('change', () => {
        filterState.ratings = Array.from(ratingFilters)
            .filter(f => f.checked)
            .map(f => parseInt(f.value));
        filterAndRenderReviews();
    });
});

// Reset Filters
resetFiltersBtn.addEventListener('click', () => {
    // Reset filter state
    filterState = {
        search: '',
        category: 'all',
        sort: 'newest',
        ratings: []
    };
    
    // Reset form inputs
    searchInput.value = '';
    categoryFilter.value = 'all';
    sortOptions.value = 'newest';
    ratingFilters.forEach(filter => {
        filter.checked = false;
    });
    
    // Re-render reviews
    filterAndRenderReviews();
});

// Navigation handling
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = e.target.getAttribute('href').substring(1);
        handleNavigation(page);
    });
});

// Mobile menu navigation
mobileLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = e.target.getAttribute('href').substring(1);
        handleNavigation(page);
        
        // Close mobile menu after navigation
        mobileMenu.classList.remove('active');
        hamburgerButton.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

function handleNavigation(page) {
    // Update active state for both desktop and mobile navigation
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${page}`) {
            link.classList.add('active');
        }
    });
    
    mobileLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${page}`) {
            link.classList.add('active');
        }
    });
    
    // Show/hide appropriate sections
    switch (page) {
        case 'home':
            showReviews();
            break;
        case 'review':
            showReviewForm();
            break;
        case 'about':
            showAbout();
            break;
    }
}

function showReviews() {
    document.querySelector('.reviews-section').style.display = 'block';
    document.getElementById('submit-review-form').style.display = 'none';
    document.querySelector('.about-section').style.display = 'none';
    filterAndRenderReviews();
}

function showReviewForm() {
    document.querySelector('.reviews-section').style.display = 'none';
    document.getElementById('submit-review-form').style.display = 'block';
    document.querySelector('.about-section').style.display = 'none';
}

function showAbout() {
    document.querySelector('.reviews-section').style.display = 'none';
    document.getElementById('submit-review-form').style.display = 'none';
    document.querySelector('.about-section').style.display = 'block';
}

// Filter and sort reviews
function filterAndRenderReviews() {
    let filteredReviews = reviews.filter(review => {
        const matchesSearch = review.title.toLowerCase().includes(filterState.search) ||
                            review.text.toLowerCase().includes(filterState.search);
        const matchesCategory = filterState.category === 'all' || review.category === filterState.category;
        const matchesRating = filterState.ratings.length === 0 || filterState.ratings.includes(review.rating);
        return matchesSearch && matchesCategory && matchesRating;
    });
    
    // Sort reviews
    filteredReviews.sort((a, b) => {
        switch (filterState.sort) {
            case 'newest':
                return new Date(b.date) - new Date(a.date);
            case 'oldest':
                return new Date(a.date) - new Date(b.date);
            case 'highest':
                return b.rating - a.rating;
            case 'lowest':
                return a.rating - b.rating;
            default:
                return 0;
        }
    });
    
    renderReviews(filteredReviews);
}

// Render star rating
function renderStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<i class="fas fa-star${i <= rating ? '' : '-o'}"></i>`;
    }
    return stars;
}

// Render reviews
function renderReviews(reviews) {
    reviewsContainer.innerHTML = reviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <h3>${review.title}</h3>
                <div class="rating">${renderStarRating(review.rating)}</div>
            </div>
            <div class="category">${review.category}</div>
            <p class="review-text">${review.text}</p>
            <div class="review-footer">
                <span>By ${review.author}</span>
                <span>${new Date(review.date).toLocaleDateString()}</span>
            </div>
        </div>
    `).join('');
}

// Form submission
submitReviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
        title: document.getElementById('review-title').value,
        category: document.getElementById('review-category').value,
        rating: parseInt(document.querySelector('input[name="rating"]:checked').value),
        text: document.getElementById('review-text').value,
        author: document.getElementById('review-author').value,
        date: new Date().toISOString().split('T')[0]
    };
    
    // Add new review to the beginning of the array
    reviews.unshift({
        id: reviews.length + 1,
        ...formData
    });
    
    // Reset form and show reviews
    submitReviewForm.reset();
    handleNavigation('home');
});

// Initialize page
function initializePage() {
    // Start with reviews page visible
    showReviews();
    
    // Set up event listeners
    searchInput.addEventListener('input', (e) => {
        filterState.search = e.target.value.toLowerCase();
        filterAndRenderReviews();
    });
    
    categoryFilter.addEventListener('change', (e) => {
        filterState.category = e.target.value;
        filterAndRenderReviews();
    });
    
    sortOptions.addEventListener('change', (e) => {
        filterState.sort = e.target.value;
        filterAndRenderReviews();
    });
    
    ratingFilters.forEach(filter => {
        filter.addEventListener('change', () => {
            filterState.ratings = Array.from(ratingFilters)
                .filter(f => f.checked)
                .map(f => parseInt(f.value));
            filterAndRenderReviews();
        });
    });
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage); 