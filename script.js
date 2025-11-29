// 导航功能
document.addEventListener('DOMContentLoaded', function () {
    // 导航链接点击
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const target = this.getAttribute('href').substring(1);

            // 更新导航激活状态
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // 显示对应的section
            showSection(target);
        });
    });

    // Tab切换功能
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            const parentSection = this.closest('.creation-section');
            const targetTab = this.getAttribute('data-tab');

            // 更新tab按钮状态
            parentSection.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');

            // 更新panel显示
            parentSection.querySelectorAll('.creation-panel').forEach(panel => {
                panel.classList.remove('active');
            });
            parentSection.querySelector(`#${targetTab}`).classList.add('active');
        });
    });

    // 滑块值实时更新
    const sliders = document.querySelectorAll('.slider');
    sliders.forEach(slider => {
        slider.addEventListener('input', function () {
            const valueDisplay = this.parentElement.querySelector('.slider-value');
            valueDisplay.textContent = this.value + (valueDisplay.textContent.includes('%') ? '%' : '');
        });
    });

    // 文件上传处理
    setupFileUpload('imgUpload');
    setupFileUpload('productUpload');
    setupFileUpload('sceneUpload');
    setupFileUpload('characterUpload');

    // 比例按钮切换
    const ratioButtons = document.querySelectorAll('.ratio-btn');
    ratioButtons.forEach(button => {
        button.addEventListener('click', function () {
            this.parentElement.querySelectorAll('.ratio-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    // 作品集过滤
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // 这里可以添加实际的过滤逻辑
            console.log('筛选:', this.textContent);
        });
    });

    // 生成按钮点击效果
    const generateButtons = document.querySelectorAll('.btn-generate');
    generateButtons.forEach(button => {
        button.addEventListener('click', function () {
            // 添加加载状态
            const originalText = this.innerHTML;
            this.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg> 生成中...';
            this.disabled = true;

            // 模拟生成过程
            setTimeout(() => {
                this.innerHTML = originalText;
                this.disabled = false;
                showNotification('生成完成！');
            }, 3000);
        });
    });

    // 拖拽上传
    setupDragAndDrop();

    // 平滑滚动
    setupSmoothScroll();
});

// 显示指定section
function showSection(sectionId) {
    const sections = ['home', 'image', 'video', 'gallery'];
    const heroSection = document.querySelector('.hero-section');
    const featuresSection = document.querySelector('.features-section');

    sections.forEach(id => {
        const section = document.getElementById(id);
        if (section) {
            section.classList.remove('active');
        }
    });

    // 同步更新导航栏激活状态
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        // 检查链接的href是否匹配当前section
        if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
        }
    });

    if (sectionId === 'home') {
        heroSection.classList.add('active');
        featuresSection.style.display = 'block';
    } else {
        heroSection.classList.remove('active');
        featuresSection.style.display = 'none';
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// 返回首页
function backToHome() {
    showSection('home');

    // 重置导航
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#home') {
            link.classList.add('active');
        }
    });
}

// 滚动到创作区域
function scrollToCreation() {
    const featuresSection = document.querySelector('.features-section');
    featuresSection.scrollIntoView({ behavior: 'smooth' });
}

// 文件上传处理
function setupFileUpload(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;

    input.addEventListener('change', function (e) {
        const files = e.target.files;
        if (files.length > 0) {
            handleFiles(files, this);
        }
    });
}

// 处理上传的文件
function handleFiles(files, input) {
    const uploadArea = input.parentElement;
    const file = files[0];

    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function (e) {
            // 显示预览
            uploadArea.style.backgroundImage = `url(${e.target.result})`;
            uploadArea.style.backgroundSize = 'cover';
            uploadArea.style.backgroundPosition = 'center';

            // 隐藏文字
            const textElements = uploadArea.querySelectorAll('svg, p, span');
            textElements.forEach(el => el.style.display = 'none');

            showNotification('图片上传成功！');
        };
        reader.readAsDataURL(file);
    }
}

// 拖拽上传
function setupDragAndDrop() {
    const uploadAreas = document.querySelectorAll('.upload-area');

    uploadAreas.forEach(area => {
        area.addEventListener('dragover', function (e) {
            e.preventDefault();
            this.style.borderColor = 'var(--primary-color)';
            this.style.background = 'rgba(0, 113, 227, 0.05)';
        });

        area.addEventListener('dragleave', function (e) {
            e.preventDefault();
            this.style.borderColor = 'var(--border-color)';
            this.style.background = 'var(--background-secondary)';
        });

        area.addEventListener('drop', function (e) {
            e.preventDefault();
            this.style.borderColor = 'var(--border-color)';
            this.style.background = 'var(--background-secondary)';

            const files = e.dataTransfer.files;
            const input = this.querySelector('input[type="file"]');
            if (input && files.length > 0) {
                handleFiles(files, input);
            }
        });
    });
}

// 平滑滚动
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}


// 添加动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 监听滚动，为导航栏添加阴影
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 0) {
        navbar.style.boxShadow = 'var(--shadow-sm)';
    } else {
        navbar.style.boxShadow = 'none';
    }
});

// 预加载优化
window.addEventListener('load', function () {
    // 添加页面加载完成的类
    document.body.classList.add('loaded');

    // 性能优化：懒加载作品集图片
    const galleryItems = document.querySelectorAll('.gallery-item');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '50px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    galleryItems.forEach(item => observer.observe(item));
});

// 添加键盘快捷键支持
document.addEventListener('keydown', function (e) {
    // ESC键返回首页
    if (e.key === 'Escape') {
        backToHome();
    }

    // Ctrl/Cmd + Enter 生成
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const activeSection = document.querySelector('.creation-section.active');
        if (activeSection) {
            const generateBtn = activeSection.querySelector('.btn-generate');
            if (generateBtn && !generateBtn.disabled) {
                generateBtn.click();
            }
        }
    }
});

// 表单自动保存
let autoSaveTimer;
const textInputs = document.querySelectorAll('.text-input');

textInputs.forEach(input => {
    input.addEventListener('input', function () {
        clearTimeout(autoSaveTimer);
        autoSaveTimer = setTimeout(() => {
            // 这里可以实现自动保存逻辑
            console.log('自动保存:', this.value);
        }, 2000);
    });
});

// 响应式导航菜单（移动端）
function createMobileMenu() {
    const navContainer = document.querySelector('.nav-container');
    const menuButton = document.createElement('button');
    menuButton.className = 'mobile-menu-btn';
    menuButton.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
    `;

    if (window.innerWidth <= 768) {
        navContainer.appendChild(menuButton);
    }
}

window.addEventListener('resize', createMobileMenu);
createMobileMenu();

// 创建粒子效果
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // 随机位置
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';

        // 随机延迟
        particle.style.animationDelay = Math.random() * 15 + 's';

        // 随机持续时间
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';

        // 随机颜色（在主题色之间变化）
        const colors = [
            'rgba(0, 217, 255, 0.6)',
            'rgba(255, 0, 110, 0.6)',
            'rgba(139, 92, 246, 0.6)'
        ];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.boxShadow = `0 0 10px ${colors[Math.floor(Math.random() * colors.length)]}`;

        container.appendChild(particle);
    }
}

// 光标跟随光效
function initCursorGlow() {
    const cursorGlow = document.getElementById('cursorGlow');
    if (!cursorGlow) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorGlow.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
        cursorGlow.style.opacity = '0';
    });

    // 平滑跟随
    function updateCursorPosition() {
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;

        cursorGlow.style.left = currentX + 'px';
        cursorGlow.style.top = currentY + 'px';

        requestAnimationFrame(updateCursorPosition);
    }

    updateCursorPosition();
}

// 页面加载动画
function addPageLoadAnimation() {
    const elements = document.querySelectorAll('.feature-card, .hero-content, .section-header');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('fade-in-up');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    elements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

// 按钮点击涟漪效果
document.addEventListener('click', function (e) {
    if (e.target.matches('button') || e.target.closest('button')) {
        const button = e.target.matches('button') ? e.target : e.target.closest('button');
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        if (button.style.position !== 'absolute' && button.style.position !== 'relative') {
            button.style.position = 'relative';
        }
        button.style.overflow = 'hidden';

        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
});

// 添加涟漪动画
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// 鼠标悬停磁吸效果
const magneticElements = document.querySelectorAll('.btn-primary, .btn-generate, .feature-card');

magneticElements.forEach(el => {
    el.addEventListener('mousemove', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;

        this.style.transform = `translate(${deltaX * 10}px, ${deltaY * 10}px) scale(1.02)`;
    });

    el.addEventListener('mouseleave', function () {
        this.style.transform = '';
    });
});

// 滚动视差效果
window.addEventListener('scroll', function () {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.visual-card');

    parallaxElements.forEach((el, index) => {
        const speed = (index + 1) * 0.1;
        el.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// 能量充能动画（生成按钮）
document.querySelectorAll('.btn-generate').forEach(btn => {
    btn.addEventListener('mouseenter', function () {
        this.style.animation = 'energyWave 1s ease-in-out infinite';
    });

    btn.addEventListener('mouseleave', function () {
        this.style.animation = '';
    });
});

// 打字机效果（可选，用于演示）
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// 随机闪烁的星光效果
function createStars() {
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars-container';
    starsContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    `;
    document.body.appendChild(starsContainer);

    for (let i = 0; i < 30; i++) {
        const star = document.createElement('div');
        star.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: white;
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: starTwinkle ${Math.random() * 3 + 2}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
            box-shadow: 0 0 4px white;
        `;
        starsContainer.appendChild(star);
    }
}

createStars();

// 性能优化：节流函数
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 应用节流到滚动事件
window.addEventListener('scroll', throttle(function () {
    // 滚动相关的性能优化代码
}, 100));

// 通知提示
function showNotification(message) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 40px;
        background: var(--secondary-color);
        color: white;
        padding: 16px 24px;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-size: 14px;
        font-weight: 500;
    `;

    document.body.appendChild(notification);

    // 3秒后移除
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

/* =========================================
   New Creation Interface Logic
   ========================================= */

// State Variables
let currentImageMode = 'text2img';
let currentRatio = '1:1';
let isLinked = true;
let currentDuration = 10;
let customWidth = 1024;
let customHeight = 1024;
let lastGeneratedImageUrl = '';
let imageGenerations = [];
let isImageGenerating = false;

// Image Mode Switching
function switchImageMode(mode) {
    currentImageMode = mode;

    // Update buttons
    document.querySelectorAll('.mode-switch-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });

    // Show/Hide Reference Image Section
    const refSection = document.getElementById('refImageSection');
    const referenceCol = document.getElementById('referenceCol');

    if (mode === 'img2img') {
        refSection.style.display = 'flex';
        refSection.style.animation = 'fadeInUp 0.4s ease-out';

        // Show reference mode selector
        if (referenceCol) {
            referenceCol.style.display = 'flex';
        }
    } else {
        refSection.style.display = 'none';

        // Hide reference mode selector
        if (referenceCol) {
            referenceCol.style.display = 'none';
        }
    }
}

// Aspect Ratio Handling
function setRatio(ratio) {
    currentRatio = ratio;

    // Update buttons
    document.querySelectorAll('.ratio-item').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent === ratio || (ratio === 'custom' && btn.textContent === '自定义')) {
            btn.classList.add('active');
        }
    });

    const customDims = document.getElementById('customDimensions');
    const widthInput = document.getElementById('customWidth');
    const heightInput = document.getElementById('customHeight');

    if (ratio === 'custom') {
        customDims.style.display = 'block';
        customDims.style.animation = 'fadeInUp 0.3s ease-out';
    } else {
        customDims.style.display = 'none';

        // Update dimensions based on ratio
        const [w, h] = ratio.split(':').map(Number);
        const base = 1024;

        if (w === h) {
            customWidth = base;
            customHeight = base;
        } else if (w > h) {
            if (ratio === '16:9') { customWidth = 1920; customHeight = 1080; }
            else if (ratio === '21:9') { customWidth = 2560; customHeight = 1080; }
            else if (ratio === '3:2') { customWidth = 1215; customHeight = 810; }
            else if (ratio === '4:3') { customWidth = 1024; customHeight = 768; }
            else if (ratio === '3:4') { customWidth = 768; customHeight = 1024; }
            else if (ratio === '2:3') { customWidth = 810; customHeight = 1215; }
            else if (ratio === '9:16') { customWidth = 1080; customHeight = 1920; }
            else { customWidth = 1024; customHeight = 1024; }
        } else {
            if (ratio === '3:4') { customWidth = 768; customHeight = 1024; }
            else if (ratio === '2:3') { customWidth = 810; customHeight = 1215; }
            else if (ratio === '9:16') { customWidth = 1080; customHeight = 1920; }
            else { customWidth = 1024; customHeight = 1024; }
        }

        widthInput.value = customWidth;
        heightInput.value = customHeight;
    }
}

// Custom Dimension Logic
function updateDimensions(type) {
    const widthInput = document.getElementById('customWidth');
    const heightInput = document.getElementById('customHeight');

    let w = parseInt(widthInput.value) || 0;
    let h = parseInt(heightInput.value) || 0;

    if (isLinked && currentRatio !== 'custom') {
        if (type === 'width') {
            const ratio = customHeight / customWidth;
            h = Math.round(w * ratio);
            heightInput.value = h;
        } else {
            const ratio = customWidth / customHeight;
            w = Math.round(h * ratio);
            widthInput.value = w;
        }
    }

    customWidth = w;
    customHeight = h;
}

function toggleLink() {
    isLinked = !isLinked;
    const btn = document.getElementById('linkBtn');
    btn.classList.toggle('active', isLinked);

    if (isLinked) {
        const w = parseInt(document.getElementById('customWidth').value);
        const h = parseInt(document.getElementById('customHeight').value);
        customWidth = w;
        customHeight = h;
    }
}

// Prompt Optimization
function optimizePrompt() {
    const promptId = document.querySelector('.creation-section.active').id === 'image' ? 'imagePrompt' : 'videoPrompt';
    const input = document.getElementById(promptId);
    if (!input.value.trim()) {
        showNotification('请先输入一些描述词');
        return;
    }

    const originalText = input.value;
    input.value = '正在优化...';
    input.disabled = true;

    setTimeout(() => {
        const optimizations = [
            ", 8k resolution, highly detailed, photorealistic, cinematic lighting",
            ", cyberpunk style, neon lights, futuristic atmosphere",
            ", masterpiece, trending on artstation, vivid colors",
            ", professional photography, depth of field, sharp focus"
        ];
        const randomOpt = optimizations[Math.floor(Math.random() * optimizations.length)];
        input.value = originalText + randomOpt;
        input.disabled = false;
        showNotification('提示词优化完成！');
    }, 1500);
}

// Video Duration
function setDuration(seconds) {
    currentDuration = seconds;
    document.querySelectorAll('.duration-btn').forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.textContent) === seconds) {
            btn.classList.add('active');
        }
    });
}

// Generation Logic
async function generateImage() {
    const prompt = document.getElementById('imagePrompt').value;
    if (!prompt) {
        showNotification('请输入创意描述');
        return;
    }

    const btn = document.querySelector('#image .btn-generate-large');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="btn-text">正在生成...</span><div class="btn-shine"></div>';
    btn.disabled = true;

    if (!document.getElementById('spinStyle')) {
        const style = document.createElement('style');
        style.id = 'spinStyle';
        style.textContent = '@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }';
        document.head.appendChild(style);
    }

    isImageGenerating = true;
    renderImageGenerations();

    try {
        const width = customWidth;
        const height = customHeight;
        const IMAGE_COUNT = 4;
        const tasks = [];

        for (let i = 0; i < IMAGE_COUNT; i++) {
            tasks.push(requestSingleImage(prompt, width, height));
        }

        const results = await Promise.allSettled(tasks);
        const imageUrls = results
            .filter(r => r.status === 'fulfilled' && r.value)
            .map(r => r.value);

        if (!imageUrls.length) {
            throw new Error('生成失败，请稍后重试');
        }

        const modelSelect = document.getElementById('imageModel');
        const modelValue = modelSelect ? modelSelect.value : 'zd3.1';

        const generation = {
            id: Date.now() + '_' + Math.floor(Math.random() * 1000),
            prompt,
            width,
            height,
            model: modelValue,
            createdAt: new Date().toISOString(),
            images: imageUrls.map(url => ({ url }))
        };

        imageGenerations.push(generation);
        lastGeneratedImageUrl = imageUrls[0];
        showNotification('图片生成成功！');
    } catch (error) {
        console.error('生成图片出错:', error);
        showNotification(error && error.message ? `图片生成失败：${error.message}` : '图片生成失败，请稍后重试');
    } finally {
        isImageGenerating = false;
        btn.innerHTML = originalText;
        btn.disabled = false;
        renderImageGenerations();
    }
}

async function requestSingleImage(prompt, width, height) {
    const submitResponse = await fetch('/api/jimeng-submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt,
            width,
            height
        })
    });

    const submitData = await submitResponse.json();

    if (!submitResponse.ok || !submitData || !submitData.success || !submitData.taskId) {
        throw new Error(submitData && submitData.message ? submitData.message : '生成任务提交失败，请稍后重试');
    }

    const taskId = submitData.taskId;
    const maxAttempts = 60; // 最多轮询约2分钟
    const interval = 2000;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const resultResponse = await fetch(`/api/jimeng-result?taskId=${encodeURIComponent(taskId)}`);
        const resultData = await resultResponse.json();

        if (!resultResponse.ok) {
            throw new Error(resultData && resultData.message ? resultData.message : '查询任务失败');
        }

        const status = resultData.status;

        if (status === 'in_queue' || status === 'generating') {
            await new Promise(resolve => setTimeout(resolve, interval));
            continue;
        }

        if (resultData.success && status === 'done' && resultData.imageUrls && resultData.imageUrls.length > 0) {
            return resultData.imageUrls[0];
        }

        throw new Error(resultData && resultData.message ? resultData.message : '生成失败，请稍后重试');
    }

    throw new Error('生成超时，请稍后重试');
}

function openImageInNewTab(url) {
    if (!url) return;
    openImageModal(url);
}

function renderImageGenerations() {
    const previewCanvas = document.getElementById('imagePreviewCanvas');
    if (!previewCanvas) return;

    if (!imageGenerations.length && !isImageGenerating) {
        previewCanvas.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                    </svg>
                </div>
                <p>配置参数后点击生成</p>
            </div>
        `;
        return;
    }

    let html = '<div class="image-preview-stream">';

    if (isImageGenerating) {
        html += `
            <div class="preview-message preview-message-loading">
                <div class="preview-message-meta">
                    <span>AI 正在绘制中...</span>
                </div>
            </div>
        `;
    }

    imageGenerations.forEach(gen => {
        const date = new Date(gen.createdAt);
        const timeLabel = isNaN(date.getTime())
            ? ''
            : date.toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit' });

        html += `
            <div class="preview-message">
                <div class="preview-message-header">
                    <div class="preview-message-meta">
                        <span class="preview-message-time">${timeLabel}</span>
                        <span class="preview-message-model">${(gen.model || '').toUpperCase()}</span>
                    </div>
                    <button class="preview-message-pin-btn" onclick="addGenerationToGallery('${gen.id}')">
                        加入优质作品集
                    </button>
                </div>
                <div class="preview-images-grid">
        `;

        gen.images.forEach((img, index) => {
            const url = img.url;
            html += `
                <div class="preview-image-card">
                    <img src="${url}" alt="生成结果" class="preview-image" onclick="openImageModal('${url}')">
                    <div class="preview-image-actions">
                        <button class="preview-image-action-btn" onclick="openPromptModalById('${gen.id}')">查看提示词</button>
                        <button class="preview-image-action-btn" onclick="downloadImageByIndex('${gen.id}', ${index})">下载</button>
                        <button class="preview-image-action-btn" onclick="sendToImg2ImgByIndex('${gen.id}', ${index})">发到图生图</button>
                        <button class="preview-image-action-btn" onclick="sendToVideoRefByIndex('${gen.id}', ${index})">发到图生视频</button>
                    </div>
                </div>
            `;
        });

        html += `
                </div>
            </div>`;
    });

    html += '</div>';
    previewCanvas.innerHTML = html;
}

function openImageModal(url) {
    if (!url) return;
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    const dialog = document.createElement('div');
    dialog.className = 'modal-image-dialog';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'modal-close-btn';
    closeBtn.type = 'button';
    closeBtn.innerHTML = '<span>×</span>';
    closeBtn.addEventListener('click', () => {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    });

    const img = document.createElement('img');
    img.src = url;
    img.alt = '预览';

    dialog.appendChild(closeBtn);
    dialog.appendChild(img);
    overlay.appendChild(dialog);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
    });

    document.body.appendChild(overlay);
}

function openPromptModal(promptText) {
    if (!promptText) return;

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    const dialog = document.createElement('div');
    dialog.className = 'modal-prompt-dialog';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'modal-close-btn';
    closeBtn.type = 'button';
    closeBtn.innerHTML = '<span>×</span>';
    closeBtn.addEventListener('click', () => {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    });

    const title = document.createElement('div');
    title.className = 'modal-prompt-title';
    title.textContent = '生成提示词';

    const body = document.createElement('div');
    body.className = 'modal-prompt-body';
    body.textContent = promptText;

    dialog.appendChild(closeBtn);
    dialog.appendChild(title);
    dialog.appendChild(body);
    overlay.appendChild(dialog);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
    });

    document.body.appendChild(overlay);
}

function openPromptModalById(genId) {
    const gen = imageGenerations.find(g => g.id === genId);
    if (!gen) return;
    openPromptModal(gen.prompt || '');
}

function downloadImageByIndex(genId, index) {
    const gen = imageGenerations.find(g => g.id === genId);
    if (!gen || !gen.images[index]) return;
    downloadImageUrl(gen.images[index].url);
}

function sendToImg2Img(url, prompt) {
    if (!url) return;
    showSection('image');
    switchImageMode('img2img');

    const promptInput = document.getElementById('imagePrompt');
    if (promptInput && prompt) {
        promptInput.value = prompt;
    }

    const uploadInput = document.getElementById('refImgUpload');
    if (uploadInput && uploadInput.parentElement) {
        const uploadArea = uploadInput.parentElement;
        uploadArea.style.backgroundImage = `url(${url})`;
        uploadArea.style.backgroundSize = 'cover';
        uploadArea.style.backgroundPosition = 'center';

        const textElements = uploadArea.querySelectorAll('svg, span, p');
        textElements.forEach(el => {
            el.style.display = 'none';
        });
    }

    showNotification('已发送到图生图参考图');
}

function sendToImg2ImgByIndex(genId, index) {
    const gen = imageGenerations.find(g => g.id === genId);
    if (!gen || !gen.images[index]) return;
    sendToImg2Img(gen.images[index].url, gen.prompt);
}

function sendToVideoRef(url, prompt) {
    showSection('video');
    const promptInput = document.getElementById('videoPrompt');
    if (promptInput && prompt) {
        promptInput.value = prompt;
    }
    // 目前视频区域尚未有参考图上传位，先仅同步提示词
    showNotification('已发送到视频创作提示词');
}

function sendToVideoRefByIndex(genId, index) {
    const gen = imageGenerations.find(g => g.id === genId);
    if (!gen || !gen.images[index]) return;
    sendToVideoRef(gen.images[index].url, gen.prompt);
}

function addGenerationToGallery(genId) {
    const gen = imageGenerations.find(g => g.id === genId);
    if (!gen || !gen.images || !gen.images.length) return;
    gen.images.forEach(img => {
        if (img && img.url) {
            addToGallery(img.url);
        }
    });
    showNotification('已加入优质作品集');
}

function generateVideo() {
    const prompt = document.getElementById('videoPrompt').value;
    if (!prompt) {
        showNotification('请输入视频描述');
        return;
    }

    const btn = document.querySelector('#video .btn-generate-large');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="btn-text">正在生成...</span><div class="btn-shine"></div>';
    btn.disabled = true;

    const previewCanvas = document.getElementById('videoPreviewCanvas');
    previewCanvas.innerHTML = `
        <div class="loading-spinner" style="text-align: center;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 40px; height: 40px; animation: spin 1s linear infinite; color: var(--primary-color);">
                <circle cx="12" cy="12" r="10" opacity="0.25"/>
                <path d="M12 2a10 10 0 0 1 10 10" opacity="0.75"/>
            </svg>
            <p style="margin-top: 12px; color: var(--text-secondary);">正在渲染视频帧...</p>
        </div>
    `;

    setTimeout(() => {
        const imgUrl = `https://picsum.photos/1920/1080?random=${Math.random()}`;

        previewCanvas.innerHTML = `
            <div style="position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                <img src="${imgUrl}" alt="Generated Video Thumbnail" style="max-width: 100%; max-height: 100%; border-radius: 8px; opacity: 0.8;">
                <div style="position: absolute; width: 60px; height: 60px; background: rgba(255,255,255,0.9); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
                    <svg viewBox="0 0 24 24" fill="currentColor" style="width: 24px; height: 24px; color: var(--primary-color); margin-left: 4px;">
                        <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                </div>
            </div>
        `;

        btn.innerHTML = originalText;
        btn.disabled = false;
        showNotification('视频生成成功！');
    }, 4000);
}

function downloadImage() {
    if (!lastGeneratedImageUrl) {
        showNotification('没有可下载的图片');
        return;
    }

    downloadImageUrl(lastGeneratedImageUrl);
}

function addToGallery(imageUrl) {
    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid || !imageUrl) return;

    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.style.backgroundImage = `url(${imageUrl})`;
    item.style.backgroundSize = 'cover';
    item.style.backgroundPosition = 'center center';

    galleryGrid.prepend(item);
}

function downloadImageUrl(url) {
    if (!url) {
        showNotification('没有可下载的图片');
        return;
    }

    try {
        const link = document.createElement('a');
        link.href = url;
        link.download = 'ai-image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showNotification('开始下载...');
    } catch (e) {
        console.error('下载图片出错:', e);
        showNotification('下载失败，请右键图片另存为');
    }
}

function downloadVideo() {
    const video = document.querySelector('#videoPreviewCanvas img');
    if (video) {
        showNotification('开始下载视频...');
    } else {
        showNotification('没有可下载的视频');
    }
}

function regenerateImage() {
    const img = document.querySelector('#imagePreviewCanvas img');
    if (img) {
        generateImage();
    } else {
        showNotification('请先生成一张图片');
    }
}

function regenerateVideo() {
    const video = document.querySelector('#videoPreviewCanvas img');
    if (video) {
        generateVideo();
    } else {
        showNotification('请先生成视频');
    }
}

/* =========================================
   Custom Dropdown Logic
   ========================================= */

function initCustomSelects() {
    const selectWrappers = document.querySelectorAll('.custom-select-wrapper');

    selectWrappers.forEach(wrapper => {
        const select = wrapper.querySelector('select');
        if (!select) return;

        // Create custom elements
        const trigger = document.createElement('div');
        trigger.className = 'custom-select-trigger';

        const selectedText = document.createElement('span');
        selectedText.textContent = select.options[select.selectedIndex].text;

        const arrow = document.createElement('svg');
        arrow.className = 'custom-select-arrow';
        arrow.setAttribute('viewBox', '0 0 12 12');
        arrow.setAttribute('fill', 'currentColor');
        arrow.innerHTML = '<path d="M6 9L1 4h10z"/>';

        trigger.appendChild(selectedText);
        trigger.appendChild(arrow);

        // Create options container
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'custom-select-options';

        // Create options
        Array.from(select.options).forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'custom-select-option';
            if (index === select.selectedIndex) {
                optionDiv.classList.add('selected');
            }
            optionDiv.textContent = option.text;
            optionDiv.dataset.value = option.value;
            optionDiv.dataset.index = index;

            optionDiv.addEventListener('click', () => {
                // Update select value
                select.selectedIndex = index;
                select.dispatchEvent(new Event('change'));

                // Update UI
                selectedText.textContent = option.text;
                optionsContainer.querySelectorAll('.custom-select-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                optionDiv.classList.add('selected');

                // Close dropdown
                trigger.classList.remove('active');
                optionsContainer.classList.remove('active');
            });

            optionsContainer.appendChild(optionDiv);
        });

        // Toggle dropdown
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = trigger.classList.contains('active');

            // Close all other dropdowns
            document.querySelectorAll('.custom-select-trigger.active').forEach(t => {
                t.classList.remove('active');
            });
            document.querySelectorAll('.custom-select-options.active').forEach(o => {
                o.classList.remove('active');
            });

            // Toggle this dropdown
            if (!isActive) {
                trigger.classList.add('active');
                optionsContainer.classList.add('active');
            }
        });

        // Append to wrapper
        wrapper.appendChild(trigger);
        wrapper.appendChild(optionsContainer);
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
        document.querySelectorAll('.custom-select-trigger.active').forEach(t => {
            t.classList.remove('active');
        });
        document.querySelectorAll('.custom-select-options.active').forEach(o => {
            o.classList.remove('active');
        });
    });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initCustomSelects);

/* =========================================
   Refined Interface Logic
   ========================================= */

// Initialize refined interface features when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    // Creative Gallery Toggle
    const filterToggleBtns = document.querySelectorAll('.filter-toggle-btn');
    const filterWrapper = document.querySelector('.filter-toggle-wrapper');

    if (filterWrapper) {
        filterToggleBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                // Update active state
                filterToggleBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                // Update background position
                const filter = this.dataset.filter;
                if (filter === 'video') {
                    filterWrapper.classList.add('show-video');
                } else {
                    filterWrapper.classList.remove('show-video');
                }

                // Mock filtering
                console.log('Filtering by:', filter);
                showNotification(`已切换至${filter === 'video' ? '视频' : '图片'}作品`);
            });
        });
    }

    // More Features Button
    const btnMoreFeatures = document.getElementById('btnMoreFeatures');
    if (btnMoreFeatures) {
        btnMoreFeatures.addEventListener('click', function () {
            showNotification('即将上线，敬请期待！');
        });
    }
});
