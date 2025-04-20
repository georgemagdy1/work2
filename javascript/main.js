      // وظائف التنقل بين الصفحات
      function showHomePage() {
        document.getElementById('home-page').style.display = 'block';
        document.getElementById('english-page').style.display = 'none';
        document.getElementById('materials-page').style.display = 'none';
    }
    
    function showEnglishPage() {
        document.getElementById('home-page').style.display = 'none';
        document.getElementById('english-page').style.display = 'block';
        document.getElementById('materials-page').style.display = 'none';
    }
    
    function showMaterialsPage(levelTitle) {
        document.getElementById('home-page').style.display = 'none';
        document.getElementById('english-page').style.display = 'none';
        document.getElementById('materials-page').style.display = 'block';
        
        // تعيين عنوان المستوى في صفحة المواد
        document.getElementById('level-title').textContent = levelTitle;
        
        // إعادة تعيين التبويب النشط إلى الصوت
        switchMaterialTab('audio');
    }
    
    // وظيفة للتبديل بين تبويبات المواد (الصوت و PDF)
    function switchMaterialTab(tabName) {
        // إخفاء جميع المحتويات
        document.getElementById('audio-content').classList.remove('active');
        document.getElementById('pdf-content').classList.remove('active');
        
        // إلغاء تنشيط جميع التبويبات
        const tabs = document.querySelectorAll('.materials-tabs .tab');
        tabs.forEach(tab => tab.classList.remove('active'));
        
        // تنشيط التبويب والمحتوى المختارين
        document.getElementById(tabName + '-content').classList.add('active');
        
        // تنشيط التبويب المناسب
        if (tabName === 'audio') {
            tabs[0].classList.add('active');
        } else {
            tabs[1].classList.add('active');
        }
    }
    
    // ==================== حماية الموقع الشاملة ====================
    
    // منع النقر الأيمن وحفظ الصفحة
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        alert('هذا المحتوى محمي ولا يسمح بالنسخ أو التحميل');
        return false;
    });
    
    // منع اختيار النص
    document.addEventListener('selectstart', function(e) {
        // السماح باختيار النص في حقول الإدخال والنماذج فقط
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            return false;
        }
    });
    
    // منع النسخ
    document.addEventListener('copy', function(e) {
        // السماح بالنسخ في حقول الإدخال والنماذج فقط
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            alert('لا يسمح بنسخ المحتوى');
            return false;
        }
    });
    
    // منع مفاتيح الاختصار
    document.addEventListener('keydown', function(e) {
        // منع F12, Ctrl+Shift+I, Ctrl+Shift+C, Ctrl+U, PrintScreen, Ctrl+S, Ctrl+Shift+S
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && e.key === 'I') || 
            (e.ctrlKey && e.shiftKey && e.key === 'C') || 
            (e.ctrlKey && e.key === 'u') ||
            (e.key === 'PrintScreen') ||
            (e.ctrlKey && e.key === 's') ||
            (e.ctrlKey && e.shiftKey && e.key === 'S') ||
            (e.ctrlKey && e.key === 'p')) {
            e.preventDefault();
            alert('هذا المحتوى محمي ولا يسمح بالتقاط الصور أو فتح أدوات المطور أو الحفظ أو الطباعة');
            return false;
        }
    });
    
    // منع لقطات الشاشة (لا يعمل في جميع المتصفحات)
    document.addEventListener('keyup', function(e) {
        if (e.key === 'PrintScreen') {
            navigator.clipboard.writeText('');
            alert('لا يسمح بالتقاط صور للشاشة');
        }
    });
    
    // منع سحب وإسقاط الملفات
    document.addEventListener('dragstart', function(e) {
        if (e.target.tagName === 'IMG' || e.target.tagName === 'IFRAME' || e.target.tagName === 'OBJECT') {
            e.preventDefault();
            return false;
        }
    });
      
    document.addEventListener('drop', function(e) {
        e.preventDefault();
        return false;
    });
    
    // ==================== حماية متقدمة لملفات PDF ====================
    
    document.addEventListener('DOMContentLoaded', function() {
        // إضافة أنماط CSS للحماية
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .pdf-viewer-container {
                user-select: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                position: relative;
                overflow: hidden;
            }
            
            .pdf-viewer {
                pointer-events: auto;
            }
            
            .pdf-protection-layer {
                background: transparent;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 999;
            }
    
            .pdf-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10;
                background-color: transparent;
            }
    
            /* منع اختيار النص في الموقع كله */
            body {
                user-select: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
            }
    
            /* السماح باختيار النص في النماذج فقط */
            input, textarea {
                user-select: text;
                -webkit-user-select: text;
                -moz-user-select: text;
                -ms-user-select: text;
            }
        `;
        document.head.appendChild(styleElement);
        
        // حماية متقدمة لملفات PDF
        function protectPDFElements() {
            // حماية جميع إطارات PDF
            const pdfFrames = document.querySelectorAll('iframe[src$=".pdf"], object[data$=".pdf"], embed[src$=".pdf"]');
            pdfFrames.forEach(frame => {
                const container = frame.parentElement;
                
                // تأكد أن الحاوية لديها وضع نسبي
                if (window.getComputedStyle(container).position === 'static') {
                    container.style.position = 'relative';
                }
                
                // إنشاء طبقة حماية إذا لم تكن موجودة
                if (!container.querySelector('.pdf-protection-layer')) {
                    const protectionLayer = document.createElement('div');
                    protectionLayer.className = 'pdf-protection-layer';
                    
                    // منع النقر بزر الماوس الأيمن
                    protectionLayer.addEventListener('contextmenu', function(e) {
                        e.preventDefault();
                        alert('هذا المحتوى محمي ولا يسمح بالنسخ أو التحميل');
                        return false;
                    });
                    
                    // منع السحب والإفلات
                    protectionLayer.addEventListener('dragstart', function(e) {
                        e.preventDefault();
                        return false;
                    });
                    
                    // السماح بالتمرير
                    protectionLayer.addEventListener('wheel', function(e) {
                        // السماح بتمرير الصفحة تحت طبقة الحماية
                        e.stopPropagation(); 
                    }, true);
                    
                    container.appendChild(protectionLayer);
                }
                
                // تعديل مسار PDF لمنع التحميل المباشر
                if (frame.tagName === 'IFRAME' && frame.src.includes('.pdf')) {
                    if (!frame.src.includes('view=1')) {
                        // إضافة معلمات للعرض فقط
                        const separator = frame.src.includes('?') ? '&' : '?';
                        const newSrc = frame.src + separator + 'view=1&download=0&print=0';
                        
                        // تحديث المصدر مع الحماية
                        frame.src = newSrc;
                    }
                } else if (frame.tagName === 'OBJECT' && frame.data.includes('.pdf')) {
                    if (!frame.data.includes('view=1')) {
                        // إضافة معلمات للعرض فقط
                        const separator = frame.data.includes('?') ? '&' : '?';
                        const newData = frame.data + separator + 'view=1&download=0&print=0';
                        
                        // تحديث المصدر مع الحماية
                        frame.data = newData;
                    }
                }
            });
            
            // حماية عارض PDF داخلي
            const pdfViewerContainers = document.querySelectorAll('.pdf-viewer-container');
            pdfViewerContainers.forEach(container => {
                // إنشاء طبقة حماية إذا لم تكن موجودة
                if (!container.querySelector('.pdf-protection-layer')) {
                    const protectionLayer = document.createElement('div');
                    protectionLayer.className = 'pdf-protection-layer';
                    container.appendChild(protectionLayer);
                }
            });
            
            // إعادة تعيين جميع طبقات الحماية للسماح بالتمرير
            const pdfOverlays = document.querySelectorAll('.pdf-overlay');
            pdfOverlays.forEach(overlay => {
                overlay.style.pointerEvents = 'none';
            });
        }
    
        // حماية جميع روابط PDF
        function protectPDFLinks() {
            document.querySelectorAll('a[href$=".pdf"]').forEach(link => {
                // إضافة مستمع للنقر إذا لم يكن موجودًا
                if (!link.hasAttribute('data-protected')) {
                    link.setAttribute('data-protected', 'true');
                    
                    link.addEventListener('click', function(e) {
                        e.preventDefault();
                        
                        // إظهار المحتوى في صفحة مضمنة بدلاً من التحميل
                        const pdfViewer = document.getElementById('pdf-content') || document.querySelector('.pdf-viewer-container');
                        if (pdfViewer) {
                            // إظهار PDF في العارض المخصص
                            const iframe = pdfViewer.querySelector('iframe') || document.createElement('iframe');
                            const pdfUrl = this.href + (this.href.includes('?') ? '&' : '?') + 'view=1&download=0&print=0';
                            iframe.src = pdfUrl;
                            iframe.style.width = '100%';
                            iframe.style.height = '100%';
                            iframe.style.border = 'none';
                            
                            if (!pdfViewer.contains(iframe)) {
                                // مسح أي محتوى سابق
                                pdfViewer.innerHTML = '';
                                pdfViewer.appendChild(iframe);
                                
                                // إضافة طبقة حماية
                                const protectionLayer = document.createElement('div');
                                protectionLayer.className = 'pdf-protection-layer';
                                pdfViewer.appendChild(protectionLayer);
                            }
                            
                            // عرض صفحة المواد إذا كانت مخفية
                            if (pdfViewer.style.display === 'none') {
                                showMaterialsPage('عرض المستند');
                                switchMaterialTab('pdf');
                            }
                        } else {
                            alert('هذا المحتوى محمي ولا يمكن تحميله');
                        }
                        
                        return false;
                    });
                }
            });
        }
        
        // تحريف طريقة الحفظ الأصلية للمتصفح
        const originalSaveAs = window.saveAs;
        if (originalSaveAs) {
            window.saveAs = function() {
                alert('هذا المحتوى محمي ولا يسمح بحفظه');
                return false;
            };
        }
        
        // تحريف الطباعة
        const originalPrint = window.print;
        window.print = function() {
            alert('طباعة هذا المحتوى غير مسموح بها');
            return false;
        };
        
        // تحريف طلبات الشبكة للتحميل
        const originalFetch = window.fetch;
        window.fetch = function(url, options) {
            if (url && typeof url === 'string' && url.includes('.pdf')) {
                console.log('تم اكتشاف محاولة تحميل: ' + url);
                if (!url.includes('view=1')) {
                    url = url + (url.includes('?') ? '&' : '?') + 'view=1&download=0&print=0';
                }
            }
            return originalFetch.call(this, url, options);
        };
        
        const originalXHROpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            if (url && typeof url === 'string' && url.includes('.pdf') && !url.includes('view=1')) {
                url = url + (url.includes('?') ? '&' : '?') + 'view=1&download=0&print=0';
            }
            return originalXHROpen.apply(this, arguments);
        };
        
        // تنفيذ الحماية عند تحميل الصفحة
        protectPDFElements();
        protectPDFLinks();
        
        // تنفيذ الحماية كل 1 ثانية للتأكد من تطبيقها على العناصر المضافة ديناميكيًا
        setInterval(function() {
            protectPDFElements();
            protectPDFLinks();
        }, 1000);
        
        // حماية طبقة إضافية للصوت
        const audioPlayers = document.querySelectorAll('.audio-player');
        audioPlayers.forEach(player => {
            player.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                alert('هذا المحتوى محمي ولا يسمح بالنسخ أو التحميل');
                return false;
            });
            
            // منع السحب والإفلات للصوت
            player.addEventListener('dragstart', function(e) {
                e.preventDefault();
                return false;
            });
        });
        
        // تعطيل محاولات حفظ الصفحة
        window.addEventListener('beforeunload', function(e) {
            // تنظيف أي بيانات مؤقتة
            sessionStorage.removeItem('pdfViewerData');
        });
    });
    
    // تحريف خصائص حماية إضافية
    Object.defineProperty(window, 'onbeforeprint', {
        get: function() {
            return null;
        },
        set: function() {
            console.log('تم محاولة الطباعة ومنعها');
            alert('الطباعة غير مسموح بها');
            return null;
        }
    });
    
    // تعطيل نسخ الصور
    document.addEventListener('mousedown', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            return false;
        }
    });
    
    // منع النسخ من لوحة المفاتيح
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && (e.key === 'c' || e.key === 'x' || e.key === 'a')) {
            // السماح بالنسخ في حقول الإدخال والنماذج فقط
            if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                e.preventDefault();
                return false;
            }
        }
    });
    
    // منع إمكانية تنزيل الملفات من الروابط المباشرة
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') {
            const href = e.target.getAttribute('href');
            
            // فحص إذا كان الرابط يؤدي لتحميل محتوى
            if (href && href.match(/\.(pdf|mp3|jpg|png|docx|xlsx)$/i)) {
                const isModifiedClick = e.ctrlKey || e.shiftKey || e.metaKey || (e.button && e.button === 1);
                
                // منع النقر بمفتاح التحكم أو مفتاح التحويل (لمنع "حفظ باسم")
                if (isModifiedClick) {
                    e.preventDefault();
                    alert('هذا المحتوى محمي ولا يمكن تحميله');
                    return false;
                }
            }
        }
    });
    
    // ==================== تحريف طرق المتصفح للحماية ====================
    
    // تحريف كائن navigator للمساعدة في منع التحميل
    if (navigator.registerProtocolHandler) {
        const originalRegisterProtocolHandler = navigator.registerProtocolHandler;
        navigator.registerProtocolHandler = function() {
            return false;
        };
    }
    
    // إضافة مراقب للتغييرات في DOM لتطبيق الحماية على العناصر الجديدة
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                // البحث عن عناصر PDF جديدة
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // عنصر DOM
                        const pdfElements = node.querySelectorAll ? 
                            node.querySelectorAll('iframe[src$=".pdf"], object[data$=".pdf"], embed[src$=".pdf"], a[href$=".pdf"]') : 
                            [];
                        
                        if (pdfElements.length > 0 || 
                            (node.tagName === 'IFRAME' && node.src && node.src.includes('.pdf')) ||
                            (node.tagName === 'OBJECT' && node.data && node.data.includes('.pdf')) ||
                            (node.tagName === 'A' && node.href && node.href.includes('.pdf'))) {
                            
                            // تطبيق الحماية بشكل فوري
                            setTimeout(function() {
                                document.dispatchEvent(new CustomEvent('applyPDFProtection'));
                            }, 100);
                        }
                    }
                });
            }
        });
    });
    
    // تكوين المراقب
    observer.observe(document.body, { 
        childList: true, 
        subtree: true 
    });
    
    // إنشاء حدث مخصص للحماية
    document.addEventListener('applyPDFProtection', function() {
        const protectPDFElements = function() {
            // حماية جميع إطارات PDF
            const pdfFrames = document.querySelectorAll('iframe[src$=".pdf"], object[data$=".pdf"], embed[src$=".pdf"]');
            pdfFrames.forEach(frame => {
                const container = frame.parentElement;
                
                // تأكد أن الحاوية لديها وضع نسبي
                if (window.getComputedStyle(container).position === 'static') {
                    container.style.position = 'relative';
                }
                
                // إنشاء طبقة حماية إذا لم تكن موجودة
                if (!container.querySelector('.pdf-protection-layer')) {
                    const protectionLayer = document.createElement('div');
                    protectionLayer.className = 'pdf-protection-layer';
                    
                    // منع النقر بزر الماوس الأيمن
                    protectionLayer.addEventListener('contextmenu', function(e) {
                        e.preventDefault();
                        alert('هذا المحتوى محمي ولا يسمح بالنسخ أو التحميل');
                        return false;
                    });
                    
                    container.appendChild(protectionLayer);
                }
            });
        };
        
        const protectPDFLinks = function() {
            document.querySelectorAll('a[href$=".pdf"]').forEach(link => {
                // إضافة مستمع للنقر إذا لم يكن موجودًا
                if (!link.hasAttribute('data-protected')) {
                    link.setAttribute('data-protected', 'true');
                    
                    link.addEventListener('click', function(e) {
                        e.preventDefault();
                        alert('هذا المحتوى محمي ولا يمكن تحميله مباشرة');
                        return false;
                    });
                }
            });
        };
        
        protectPDFElements();
        protectPDFLinks();
    });
    
    // تنفيذ الكود عند تحميل الصفحة
    window.onload = function() {
        showHomePage();
        
        // تطبيق الحماية المبدئية
        document.dispatchEvent(new CustomEvent('applyPDFProtection'));
    };
    if (!localStorage.getItem('loggedIn')) {
        window.location.href = 'login.html';
    }