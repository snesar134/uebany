document.addEventListener('DOMContentLoaded', function() {
    initQuantityButtons();
    initSizeSelector();
    initDarkMode();
    initImageGallery();
    initSmoothScrolling();
    initNewsletterValidation();
});

function initQuantityButtons() {
    const quantityBtns = document.querySelectorAll('.quantity-btn');
    if (!quantityBtns.length) return;
    
    quantityBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.quantity-input');
            let value = parseInt(input.value, 10);
            
            if (this.textContent === '+') {
                value = isNaN(value) ? 1 : value + 1;
            } else {
                value = isNaN(value) ? 1 : Math.max(1, value - 1);
            }
            
            input.value = value;
        });
    });
}

function initSizeSelector() {
    const sizeOptions = document.querySelectorAll('.size-option input');
    if (!sizeOptions.length) return;
    
    sizeOptions.forEach(option => {
        option.addEventListener('change', function() {
            const basePrice = 89.99;
            let priceAdjustment = 0;
            
            if (this.value === '7.75') priceAdjustment = -5;
            if (this.value === '8.25') priceAdjustment = 5;
            
            const priceElement = document.querySelector('.price');
            if (priceElement) {
                priceElement.textContent = `$${(basePrice + priceAdjustment).toFixed(2)}`;
            }
        });
    });
}

function initDarkMode() {
    const nav = document.querySelector('nav');
    if (!nav) return;
    
    const darkModeBtn = document.createElement('button');
    darkModeBtn.textContent = '🌙';
    darkModeBtn.classList.add('dark-mode-toggle');
    darkModeBtn.style.marginLeft = 'auto';
    darkModeBtn.style.background = 'none';
    darkModeBtn.style.border = 'none';
    darkModeBtn.style.fontSize = '1.2rem';
    darkModeBtn.style.cursor = 'pointer';
    nav.appendChild(darkModeBtn);
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.body.classList.add('dark-mode');
        darkModeBtn.textContent = '☀️';
    }

    darkModeBtn.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            this.textContent = '☀️';
        } else {
            localStorage.setItem('theme', 'light');
            this.textContent = '🌙';
        }
    });

    const style = document.createElement('style');
    style.textContent = `
        .dark-mode {
            background-color: #121212;
            color: #e0e0e0;
        }
        .dark-mode nav {
            background-color: #121212;
            border-bottom-color: #333;
        }
        .dark-mode nav a, .dark-mode h1, .dark-mode h2 {
            color: #e0e0e0;
        }
        .dark-mode .product, .dark-mode .product-gallery {
            background-color: #252525;
        }
        .dark-mode .btn {
            background-color: #444;
            color: #e0e0e0;
        }
        .dark-mode .quantity, .dark-mode .quantity-btn, .dark-mode .quantity-input {
            background-color: #333;
            color: #e0e0e0;
        }
        .dark-mode footer {
            border-top-color: #333;
        }
        .dark-mode .product-section {
            background-color: #222;
        }
    `;
    document.head.appendChild(style);
}

function initImageGallery() {
    const galleryNav = document.querySelector('.gallery-nav');
    const mainImage = document.querySelector('.main-product-image');
    if (!galleryNav || !mainImage) return;

    const images = [
        mainImage.src,
        mainImage.src.replace('Screenshot_5.jpg', 'Screenshot_6.jpg'),
        mainImage.src.replace('Screenshot_5.jpg', 'Screenshot_7.jpg'),
        mainImage.src.replace('Screenshot_5.jpg', 'Screenshot_8.jpg')
    ];
    
    let currentIndex = 0;
   
    const thumbnailContainer = document.createElement('div');
    thumbnailContainer.className = 'thumbnail-container';
    thumbnailContainer.style.display = 'flex';
    thumbnailContainer.style.justifyContent = 'center';
    thumbnailContainer.style.gap = '10px';
    thumbnailContainer.style.marginTop = '10px';

    images.forEach((src, index) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = src;
        thumbnail.style.width = '50px';
        thumbnail.style.height = '50px';
        thumbnail.style.objectFit = 'cover';
        thumbnail.style.cursor = 'pointer';
        thumbnail.style.borderRadius = '5px';
        thumbnail.style.border = index === 0 ? '2px solid black' : '1px solid #ccc';
        
        thumbnail.addEventListener('click', () => {
            mainImage.src = src;
            currentIndex = index;
            updateActiveThumbnail();
        });
        
        thumbnailContainer.appendChild(thumbnail);
    });

    mainImage.parentNode.insertBefore(thumbnailContainer, galleryNav);

    const arrows = galleryNav.querySelectorAll('.arrow');
    arrows.forEach(arrow => {
        arrow.style.cursor = 'pointer';
        arrow.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
        arrow.style.padding = '5px 10px';
        arrow.style.borderRadius = '50%';
        
        arrow.addEventListener('click', function() {
            if (this.textContent === '❮') {
                currentIndex = (currentIndex - 1 + images.length) % images.length;
            } else {
                currentIndex = (currentIndex + 1) % images.length;
            }
            mainImage.src = images[currentIndex];
            updateActiveThumbnail();
        });
    });
    
    function updateActiveThumbnail() {
        const thumbnails = thumbnailContainer.querySelectorAll('img');
        thumbnails.forEach((thumbnail, index) => {
            thumbnail.style.border = index === currentIndex ? '2px solid black' : '1px solid #ccc';
        });
    }
}

function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href.indexOf('#') === 0 && href.length > 1) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

function initNewsletterValidation() {
    const newsletterForm = document.querySelector('.newsletter button');
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('click', function(e) {
        e.preventDefault();
        const emailInput = this.previousElementSibling;
        const email = emailInput.value.trim();
        
        if (!isValidEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }

        this.textContent = 'Sending...';
        
        setTimeout(() => {
            emailInput.value = '';
            this.textContent = 'Thank you!';
            
            setTimeout(() => {
                this.textContent = 'Send';
            }, 2000);
            
        }, 1000);
    });
    
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const buyBtn = document.querySelector('.buy-btn');
    if (buyBtn) {
        buyBtn.addEventListener('click', function() {
            const size = document.querySelector('input[name="deck-size"]:checked').value;
            const quantity = document.querySelector('.quantity-input').value;

            alert(`Thank you for your purchase!\n\nYour order summary:\n- Skateboard Starter Kit\n- Size: ${size}\n- Quantity: ${quantity}`);
        });
    }
});

function initFontSizeControls() {
    const nav = document.querySelector('nav');
    if (!nav) return;
    
    const fontControls = document.createElement('div');
    fontControls.style.marginLeft = '20px';
    fontControls.style.display = 'flex';
    fontControls.style.alignItems = 'center';
    fontControls.innerHTML = `
        <span style="margin-right:5px">Font Size:</span>
        <button class="font-btn" data-size="smaller">A-</button>
        <button class="font-btn" data-size="normal">A</button>
        <button class="font-btn" data-size="larger">A+</button>
    `;
    
    const fontBtnStyle = `
        .font-btn {
            background: none;
            border: 1px solid #ccc;
            border-radius: 3px;
            margin: 0 2px;
            cursor: pointer;
            padding: 2px 5px;
        }
        .font-btn:hover {
            background-color: #f0f0f0;
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = fontBtnStyle;
    document.head.appendChild(style);
    
    nav.appendChild(fontControls);
    
    document.querySelectorAll('.font-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const size = this.dataset.size;
            let fontSize;
            
            if (size === 'smaller') fontSize = '0.9rem';
            else if (size === 'normal') fontSize = '1rem';
            else if (size === 'larger') fontSize = '1.2rem';
            
            document.body.style.fontSize = fontSize;
            localStorage.setItem('font-size', fontSize);
        });
    });

    const savedFontSize = localStorage.getItem('font-size');
    if (savedFontSize) {
        document.body.style.fontSize = savedFontSize;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initFontSizeControls();
});