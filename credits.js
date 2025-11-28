/* ========================================
   积分系统独立脚本 - 完全封装，避免冲突
   ======================================== */

(function() {
    'use strict';
    
    // 积分系统状态
    const CreditsSystem = {
        currentBalance: 1280,
        selectedPackage: null,
        selectedPayment: 'wechat',
        
        // 套餐配置
        packages: [
            { id: 1, amount: 500, price: 49, label: '入门' },
            { id: 2, amount: 1200, price: 99, label: '热门', badge: '最受欢迎' },
            { id: 3, amount: 3000, price: 199, label: '超值' },
            { id: 4, amount: 6000, price: 349, label: 'VIP' }
        ],
        
        // 初始化
        init: function() {
            this.createModal();
            this.bindEvents();
            this.updateBalance();
        },
        
        // 创建模态框
        createModal: function() {
            const modalHTML = `
                <div id="creditsModal" class="credits-modal">
                    <div class="credits-overlay"></div>
                    <div class="credits-dialog">
                        <div class="credits-dialog-header">
                            <button class="credits-close-btn" onclick="CreditsSystem.closeModal()">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="18" y1="6" x2="6" y2="18"/>
                                    <line x1="6" y1="6" x2="18" y2="18"/>
                                </svg>
                            </button>
                            <div class="credits-header-content">
                                <h2 class="credits-header-title">购买积分</h2>
                                <p class="credits-header-balance">
                                    当前余额：<span class="credits-current">${this.currentBalance.toLocaleString()}</span> 积分
                                </p>
                            </div>
                        </div>
                        
                        <div class="credits-dialog-body">
                            <div class="credits-packages-grid" id="creditsPackagesGrid">
                                ${this.renderPackages()}
                            </div>
                            
                            <div class="credits-payment-section">
                                <h3 class="credits-payment-title">选择支付方式</h3>
                                <div class="credits-payment-options" id="creditsPaymentOptions">
                                    <div class="credits-payment-option selected" data-method="wechat">
                                        <svg class="credits-payment-icon" viewBox="0 0 24 24" fill="#09BB07">
                                            <path d="M8.5 5C4.4 5 1 7.9 1 11.5c0 2.1 1.2 3.9 3.1 5.1-.2.7-.7 2.3-.8 2.6 0 0 0 .1.1.1s.2 0 .3-.1c.5-.3 2.4-1.6 2.8-1.9.6.1 1.3.2 2 .2 4.1 0 7.5-2.9 7.5-6.5S12.6 5 8.5 5z"/>
                                            <path d="M22.5 14.8c0-2.9-2.7-5.2-6-5.2-3.3 0-6 2.3-6 5.2s2.7 5.2 6 5.2c.5 0 1-.1 1.5-.2.3.2 1.7 1.2 2.1 1.4.1 0 .1.1.2.1s.1 0 .1-.1c-.1-.2-.5-1.5-.6-2 1.5-.9 2.7-2.3 2.7-4.4z"/>
                                        </svg>
                                        <span class="credits-payment-name">微信支付</span>
                                        <div class="credits-payment-check">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                                                <polyline points="20 6 9 17 4 12"/>
                                            </svg>
                                        </div>
                                    </div>
                                    
                                    <div class="credits-payment-option" data-method="alipay">
                                        <svg class="credits-payment-icon" viewBox="0 0 24 24" fill="#1677FF">
                                            <path d="M23 8.5c0-1-1-2.5-3.4-2.5H4.4C2 6 1 7.5 1 8.5v7c0 1 1 2.5 3.4 2.5h15.2c2.4 0 3.4-1.5 3.4-2.5v-7zm-3.9 5.9c-1.2.6-2.9 1.2-5.1 1.7-2.2.5-4.3.6-6.1.3-.9-.1-1.7-.4-2.3-.8-.6-.4-.9-.9-.9-1.5 0-.5.2-.9.5-1.2.3-.3.8-.5 1.3-.5.6 0 1.1.2 1.5.6.4.4.6.9.6 1.5v.2c1.2.3 2.5.5 3.9.5 1.4 0 2.7-.2 4-.6v-2.1c-1.3.4-2.6.6-4 .6-1.4 0-2.7-.2-3.9-.5-.1-.4-.4-.7-.7-1-.3-.3-.8-.4-1.3-.4-.5 0-1 .2-1.3.5-.3.3-.5.7-.5 1.2 0 1.1.8 2 2.3 2.6v-1.2c0-.4-.1-.7-.3-1-.2-.3-.5-.4-.8-.4-.3 0-.6.1-.8.4-.2.3-.3.6-.3 1v1.4c.6.3 1.3.5 2.1.6 1.7.3 3.7.2 5.8-.3 2.1-.5 3.8-1.1 4.9-1.7v-2c0-.6-.4-1-.9-1h-8.2c.3-.6.9-1 1.5-1h7.6c1 0 1.9.4 1.9 1v4.9z"/>
                                        </svg>
                                        <span class="credits-payment-name">支付宝</span>
                                        <div class="credits-payment-check">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                                                <polyline points="20 6 9 17 4 12"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="credits-dialog-footer">
                            <button class="credits-buy-btn" id="creditsBuyBtn" disabled>
                                <div class="credits-buy-btn-content">
                                    <span>请选择套餐</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        },
        
        // 渲染套餐
        renderPackages: function() {
            return this.packages.map(pkg => `
                <div class="credits-package" data-package-id="${pkg.id}">
                    ${pkg.badge ? `<div class="credits-package-badge">${pkg.badge}</div>` : ''}
                    <div class="credits-package-amount">${pkg.amount.toLocaleString()}</div>
                    <div class="credits-package-label">积分</div>
                    <div class="credits-package-price">¥${pkg.price}</div>
                    <div class="credits-package-unit">¥${(pkg.price / pkg.amount).toFixed(3)}/积分</div>
                </div>
            `).join('');
        },
        
        // 绑定事件
        bindEvents: function() {
            const self = this;
            
            // 套餐选择
            document.addEventListener('click', function(e) {
                const packageEl = e.target.closest('.credits-package');
                if (packageEl) {
                    self.selectPackage(parseInt(packageEl.dataset.packageId));
                }
            });
            
            // 支付方式选择
            document.addEventListener('click', function(e) {
                const paymentEl = e.target.closest('.credits-payment-option');
                if (paymentEl) {
                    self.selectPayment(paymentEl.dataset.method);
                }
            });
            
            // 购买按钮
            const buyBtn = document.getElementById('creditsBuyBtn');
            if (buyBtn) {
                buyBtn.addEventListener('click', function() {
                    self.handlePurchase();
                });
            }
            
            // 遮罩层关闭
            document.addEventListener('click', function(e) {
                if (e.target.classList.contains('credits-overlay')) {
                    self.closeModal();
                }
            });
            
            // ESC键关闭（使用命名空间避免冲突）
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    const modal = document.getElementById('creditsModal');
                    if (modal && modal.classList.contains('show')) {
                        self.closeModal();
                    }
                }
            });
        },
        
        // 选择套餐
        selectPackage: function(packageId) {
            this.selectedPackage = this.packages.find(p => p.id === packageId);
            
            // 更新UI
            document.querySelectorAll('.credits-package').forEach(el => {
                el.classList.toggle('selected', parseInt(el.dataset.packageId) === packageId);
            });
            
            // 更新按钮
            this.updateBuyButton();
        },
        
        // 选择支付方式
        selectPayment: function(method) {
            this.selectedPayment = method;
            
            // 更新UI
            document.querySelectorAll('.credits-payment-option').forEach(el => {
                el.classList.toggle('selected', el.dataset.method === method);
            });
        },
        
        // 更新购买按钮
        updateBuyButton: function() {
            const buyBtn = document.getElementById('creditsBuyBtn');
            if (!buyBtn) return;
            
            const content = buyBtn.querySelector('.credits-buy-btn-content');
            
            if (this.selectedPackage) {
                buyBtn.disabled = false;
                content.innerHTML = `<span>支付 ¥${this.selectedPackage.price}</span>`;
            } else {
                buyBtn.disabled = true;
                content.innerHTML = '<span>请选择套餐</span>';
            }
        },
        
        // 处理购买
        handlePurchase: function() {
            if (!this.selectedPackage) {
                this.showNotification('请选择积分套餐', 'warning');
                return;
            }
            
            const buyBtn = document.getElementById('creditsBuyBtn');
            const content = buyBtn.querySelector('.credits-buy-btn-content');
            
            // 显示加载状态
            buyBtn.disabled = true;
            content.innerHTML = `
                <div class="credits-buy-loading"></div>
                <span>处理中...</span>
            `;
            
            // 模拟支付处理
            setTimeout(() => {
                // 更新积分
                this.currentBalance += this.selectedPackage.amount;
                this.updateBalance();
                
                // 显示成功通知
                this.showNotification(`成功购买 ${this.selectedPackage.amount.toLocaleString()} 积分！`, 'success');
                
                // 关闭模态框
                setTimeout(() => {
                    this.closeModal();
                    // 重置按钮
                    buyBtn.disabled = false;
                    this.updateBuyButton();
                }, 800);
            }, 1500);
        },
        
        // 更新余额显示
        updateBalance: function() {
            const badge = document.querySelector('.credits-value');
            if (badge) {
                badge.textContent = this.currentBalance.toLocaleString();
            }
            
            const modalBalance = document.querySelector('.credits-current');
            if (modalBalance) {
                modalBalance.textContent = this.currentBalance.toLocaleString();
            }
        },
        
        // 打开模态框
        openModal: function() {
            const modal = document.getElementById('creditsModal');
            if (modal) {
                modal.classList.add('show');
                document.body.style.overflow = 'hidden';
            }
        },
        
        // 关闭模态框
        closeModal: function() {
            const modal = document.getElementById('creditsModal');
            if (modal) {
                modal.classList.remove('show');
                document.body.style.overflow = '';
                
                // 重置选择
                this.selectedPackage = null;
                document.querySelectorAll('.credits-package').forEach(el => {
                    el.classList.remove('selected');
                });
                this.updateBuyButton();
            }
        },
        
        // 显示通知
        showNotification: function(message, type = 'success') {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 16px 24px;
                background: ${type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #f59e0b, #d97706)'};
                color: white;
                border-radius: 12px;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
                z-index: 10001;
                font-weight: 600;
                animation: notificationSlideIn 0.3s ease-out;
            `;
            notification.textContent = message;
            
            // 添加动画
            const style = document.createElement('style');
            style.textContent = `
                @keyframes notificationSlideIn {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes notificationSlideOut {
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
            if (!document.querySelector('#creditsNotificationStyle')) {
                style.id = 'creditsNotificationStyle';
                document.head.appendChild(style);
            }
            
            document.body.appendChild(notification);
            
            // 3秒后移除
            setTimeout(() => {
                notification.style.animation = 'notificationSlideOut 0.3s ease-out';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, 3000);
        }
    };
    
    // 暴露到全局（仅暴露必要的接口）
    window.CreditsSystem = {
        openModal: function() { CreditsSystem.openModal(); },
        closeModal: function() { CreditsSystem.closeModal(); }
    };
    
    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            CreditsSystem.init();
        });
    } else {
        CreditsSystem.init();
    }
    
})();


