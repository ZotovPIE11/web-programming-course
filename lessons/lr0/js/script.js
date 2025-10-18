// DOM элементы
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');
const galleryZoomBtns = document.querySelectorAll('.gallery-zoom');
const modal = document.getElementById('imageModal');
const modalImage = document.querySelector('.modal-image');
const modalClose = document.querySelector('.modal-close');
const contactForm = document.getElementById('contactForm');
const navLinks = document.querySelectorAll('.nav-link');

// Мобильное меню
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Закрытие мобильного меню при клике на ссылку
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Плавная прокрутка для навигационных ссылок
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80; // Учитываем высоту фиксированного хедера
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Фильтрация галереи
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Убираем активный класс со всех кнопок
        filterBtns.forEach(b => b.classList.remove('active'));
        // Добавляем активный класс к нажатой кнопке
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        galleryItems.forEach(item => {
            const category = item.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                item.style.display = 'block';
                item.style.animation = 'fadeInUp 0.5s ease';
            } else {
                item.style.display = 'none';
            }
        });
    });
};

// Модальное окно для увеличения изображений
galleryZoomBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const imageSrc = btn.getAttribute('data-src');
        modalImage.src = imageSrc;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Блокируем прокрутку фона
    });
});

// Закрытие модального окна
modalClose.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Восстанавливаем прокрутку
});

// Закрытие модального окна при клике вне изображения
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Закрытие модального окна по клавише Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Валидация и отправка формы обратной связи
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Получаем данные формы
    const formData = new FormData(contactForm);
    const name = formData.get('name').trim();
    const email = formData.get('email').trim();
    const phone = formData.get('phone').trim();
    const message = formData.get('message').trim();
    
    // Валидация
    let isValid = true;
    let errorMessage = '';
    
    // Очищаем предыдущие ошибки
    clearFormErrors();
    
    if (!name) {
        showFieldError('name', 'Имя обязательно для заполнения');
        isValid = false;
    }
    
    if (!email) {
        showFieldError('email', 'Email обязателен для заполнения');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showFieldError('email', 'Введите корректный email');
        isValid = false;
    }
    
    if (!message) {
        showFieldError('message', 'Сообщение обязательно для заполнения');
        isValid = false;
    }
    
    if (phone && !isValidPhone(phone)) {
        showFieldError('phone', 'Введите корректный номер телефона');
        isValid = false;
    }
    
    if (isValid) {
        // Имитация отправки формы
        showSuccessMessage('Спасибо! Ваше сообщение отправлено. Я свяжусь с вами в ближайшее время.');
        contactForm.reset();
    }
});

// Функции валидации
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const formGroup = field.closest('.form-group');
    
    // Создаем элемент ошибки
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = '#ff6b6b';
    errorElement.style.fontSize = '14px';
    errorElement.style.marginTop = '5px';
    
    // Добавляем стиль ошибки к полю
    field.style.borderColor = '#ff6b6b';
    
    // Добавляем сообщение об ошибке
    formGroup.appendChild(errorElement);
}

function clearFormErrors() {
    // Убираем все сообщения об ошибках
    const errorElements = document.querySelectorAll('.field-error');
    errorElements.forEach(el => el.remove());
    
    // Сбрасываем стили полей
    const fields = contactForm.querySelectorAll('input, textarea');
    fields.forEach(field => {
        field.style.borderColor = '#e0e0e0';
    });
}

function showSuccessMessage(message) {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4ecdc4;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Удаляем уведомление через 5 секунд
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Анимация появления элементов при прокрутке
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
        }
    });
}, observerOptions);

// Наблюдаем за элементами для анимации
const animatedElements = document.querySelectorAll('.about-content, .gallery-item, .contact-content');
animatedElements.forEach(el => {
    observer.observe(el);
});

// Изменение стиля хедера при прокрутке
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// Добавляем CSS для анимаций
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .hamburger.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
`;
document.head.appendChild(style);

