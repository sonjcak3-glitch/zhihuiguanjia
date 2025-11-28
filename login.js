document.addEventListener('DOMContentLoaded', function() {
    // 登录方式切换
    const tabButtons = document.querySelectorAll('.tab-button');
    const passwordForm = document.getElementById('passwordForm');
    const codeForm = document.getElementById('codeForm');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            
            // 更新按钮状态
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // 切换表单
            if (tab === 'password') {
                passwordForm.style.display = 'flex';
                codeForm.style.display = 'none';
            } else {
                passwordForm.style.display = 'none';
                codeForm.style.display = 'flex';
            }
        });
    });
    
    // 密码显示/隐藏切换
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            
            // 切换图标
            const icon = togglePassword.querySelector('.eye-icon');
            if (type === 'text') {
                icon.innerHTML = `
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                `;
            } else {
                icon.innerHTML = `
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                `;
            }
        });
    }
    
    // 发送验证码
    const sendCodeBtn = document.getElementById('sendCodeBtn');
    const phoneCodeInput = document.getElementById('phoneCode');
    let countdown = 60;
    let timer = null;
    
    if (sendCodeBtn && phoneCodeInput) {
        sendCodeBtn.addEventListener('click', function() {
            const phone = phoneCodeInput.value;
            
            // 验证手机号
            if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
                showNotification('请输入正确的手机号', 'error');
                return;
            }
            
            // 发送验证码
            sendCodeBtn.disabled = true;
            showNotification('验证码已发送', 'success');
            
            // 倒计时
            countdown = 60;
            timer = setInterval(() => {
                countdown--;
                sendCodeBtn.textContent = `${countdown}秒后重试`;
                
                if (countdown <= 0) {
                    clearInterval(timer);
                    sendCodeBtn.disabled = false;
                    sendCodeBtn.textContent = '获取验证码';
                }
            }, 1000);
        });
    }
    
    // 密码登录表单提交
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            
            // 验证手机号
            if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
                showNotification('请输入正确的手机号', 'error');
                return;
            }
            
            handleLogin(this, { phone, password });
        });
    }
    
    // 验证码登录表单提交
    if (codeForm) {
        codeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const phone = document.getElementById('phoneCode').value;
            const code = document.getElementById('verifyCode').value;
            
            // 验证手机号
            if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
                showNotification('请输入正确的手机号', 'error');
                return;
            }
            
            // 验证验证码
            if (!code || code.length !== 6) {
                showNotification('请输入6位验证码', 'error');
                return;
            }
            
            handleLogin(this, { phone, code });
        });
    }
    
    // 输入框焦点动画
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });
    
});

// 统一登录处理
function handleLogin(form, data) {
    const loginButton = form.querySelector('.login-button');
    const originalText = loginButton.innerHTML;
    
    loginButton.innerHTML = `
        <svg class="loading-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
        </svg>
        登录中...
    `;
    loginButton.disabled = true;
    
    // 添加旋转动画
    if (!document.getElementById('spinner-style')) {
        const style = document.createElement('style');
        style.id = 'spinner-style';
        style.textContent = `
            .loading-spinner {
                width: 18px;
                height: 18px;
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // 模拟登录延迟
    setTimeout(() => {
        loginButton.innerHTML = originalText;
        loginButton.disabled = false;
        
        // 显示成功提示
        showNotification('登录成功！', 'success');
        
        // 延迟跳转到主页
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }, 2000);
}

// 通知提示函数
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
        color: white;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        font-size: 14px;
        font-weight: 600;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
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
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

