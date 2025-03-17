// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 为导航链接添加平滑滚动效果
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // 图片懒加载
    if ('loading' in HTMLImageElement.prototype) {
        // 浏览器支持原生懒加载
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // 回退方案 - 简单的懒加载实现
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const lazyLoad = function() {
            lazyImages.forEach(img => {
                if (isInViewport(img)) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
            });
        };
        
        // 检查元素是否在视口中
        function isInViewport(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }
        
        // 添加滚动事件监听器
        window.addEventListener('scroll', lazyLoad);
        window.addEventListener('resize', lazyLoad);
        window.addEventListener('orientationchange', lazyLoad);
        
        // 初始加载
        lazyLoad();
    }
    
    // 添加页面过渡效果
    document.querySelectorAll('a').forEach(link => {
        if (link.hostname === window.location.hostname || link.hostname === '') {
            link.addEventListener('click', function(e) {
                // 排除带有target="_blank"的链接
                if (this.target === '_blank') return;
                
                e.preventDefault();
                const href = this.getAttribute('href');
                
                // 添加页面淡出效果
                document.body.style.opacity = '0';
                document.body.style.transition = 'opacity 0.3s ease';
                
                setTimeout(function() {
                    window.location.href = href;
                }, 300);
            });
        }
    });
    
    // 页面加载时的淡入效果
    document.body.style.opacity = '0';
    setTimeout(function() {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);

    // 懒加载功能
    const lazyImages = document.querySelectorAll('img.lazy');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.1
    });

    lazyImages.forEach(img => imageObserver.observe(img));
}); 