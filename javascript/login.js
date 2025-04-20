       // بيانات المستخدم للاختبار
       const testUsers = [
        {
            email: "admin@example.com",
            password: "Admin@1234"
        },
        {
            email: "user@example.com",
            password: "User@1234"
        }
    ];

    // نظام CAPTCHA
    function generateCaptcha() {
        const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let captcha = '';
        const captchaLength = 6;
        
        for (let i = 0; i < captchaLength; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            captcha += characters.charAt(randomIndex);
        }
        
        const captchaElement = document.getElementById('captcha-code');
        captchaElement.innerHTML = '';
        
        // إضافة خلفية عشوائية للتحقق البصري
        const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6'];
        
        for (let i = 0; i < captcha.length; i++) {
            const charSpan = document.createElement('span');
            charSpan.textContent = captcha.charAt(i);
            
            // تطبيق دوران عشوائي لكل حرف
            const rotation = Math.floor(Math.random() * 30) - 15;
            charSpan.style.setProperty('--rotate', `${rotation}deg`);
            
            // تطبيق لون عشوائي لكل حرف
            const color = colors[Math.floor(Math.random() * colors.length)];
            charSpan.style.color = color;
            
            captchaElement.appendChild(charSpan);
        }
        
        // تخزين قيمة الكابتشا في الجلسة
        sessionStorage.setItem('captchaCode', captcha);
    }

    // تحقق من قوة كلمة المرور
    function checkPasswordStrength(password) {
        const meter = document.getElementById('password-meter');
        const feedback = document.getElementById('password-feedback');
        
        let strength = 0;
        const regex = [];
        regex.push('[A-Z]'); // حرف كبير
        regex.push('[a-z]'); // حرف صغير
        regex.push('[0-9]'); // رقم
        regex.push('[^A-Za-z0-9]'); // رمز خاص

        // اختبار معايير قوة كلمة المرور
        for (let i = 0; i < regex.length; i++) {
            if (new RegExp(regex[i]).test(password)) {
                strength++;
            }
        }

        // زيادة القوة بناءً على الطول
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        
        // إظهار قوة كلمة المرور
        feedback.style.display = 'block';
        
        // تحديث الشريط والتعليقات
        switch (strength) {
            case 0:
            case 1:
                meter.style.width = '20%';
                meter.style.backgroundColor = '#e74c3c';
                feedback.textContent = 'ضعيفة جدًا';
                feedback.style.color = '#e74c3c';
                break;
            case 2:
            case 3:
                meter.style.width = '40%';
                meter.style.backgroundColor = '#e67e22';
                feedback.textContent = 'ضعيفة';
                feedback.style.color = '#e67e22';
                break;
            case 4:
                meter.style.width = '60%';
                meter.style.backgroundColor = '#f1c40f';
                feedback.textContent = 'متوسطة';
                feedback.style.color = '#f1c40f';
                break;
            case 5:
                meter.style.width = '80%';
                meter.style.backgroundColor = '#3498db';
                feedback.textContent = 'قوية';
                feedback.style.color = '#3498db';
                break;
            case 6:
                meter.style.width = '100%';
                meter.style.backgroundColor = '#2ecc71';
                feedback.textContent = 'قوية جدًا';
                feedback.style.color = '#2ecc71';
                break;
        }
    }

    // التحقق من بريد إلكتروني صالح
    function validateEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    // تأمين نموذج تسجيل الدخول
    document.addEventListener('DOMContentLoaded', function() {
        // تحديث سنة حقوق النشر
        document.getElementById('current-year').textContent = new Date().getFullYear();
        
        // توليد CAPTCHA عند تحميل الصفحة
        generateCaptcha();
        
        // زر تحديث CAPTCHA
        document.getElementById('refresh-captcha').addEventListener('click', function() {
            generateCaptcha();
        });
        
        // إظهار/إخفاء كلمة المرور
        document.getElementById('password-toggle').addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
        
        // فحص قوة كلمة المرور عند الكتابة
        document.getElementById('password').addEventListener('input', function() {
            checkPasswordStrength(this.value);
        });
        
        // معالجة نموذج تسجيل الدخول
        document.getElementById('login-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // إعادة تعيين رسائل الخطأ
            document.querySelectorAll('.message').forEach(msg => {
                msg.style.display = 'none';
            });
            
            // الحصول على القيم
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const captchaInput = document.getElementById('captcha-input').value.trim();
            const storedCaptcha = sessionStorage.getItem('captchaCode');
            const rememberMe = document.getElementById('remember-me').checked;
            
            // التحقق من البريد الإلكتروني
            if (!validateEmail(email)) {
                const emailError = document.getElementById('email-error');
                emailError.textContent = 'يرجى إدخال بريد إلكتروني صالح';
                emailError.style.display = 'block';
                return;
            }
            
            // التحقق من كلمة المرور
            if (password.length < 8) {
                const passwordError = document.getElementById('password-error');
                passwordError.textContent = 'يجب أن تكون كلمة المرور 8 أحرف على الأقل';
                passwordError.style.display = 'block';
                return;
            }
            
            // التحقق من CAPTCHA
            if (captchaInput.toUpperCase() !== storedCaptcha) {
                const captchaError = document.getElementById('captcha-error');
                captchaError.textContent = 'رمز التحقق غير صحيح';
                captchaError.style.display = 'block';
                generateCaptcha(); // إعادة توليد CAPTCHA
                document.getElementById('captcha-input').value = '';
                return;
            }
            
            // التحقق من بيانات المستخدم
            const validUser = testUsers.find(user => 
                user.email === email && user.password === password
            );
            
            if (!validUser) {
                const loginError = document.getElementById('login-error');
                loginError.textContent = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
                loginError.style.display = 'block';
                return;
            }
            
            // إظهار حالة التحميل
            const loginButton = document.getElementById('login-button');
            loginButton.classList.add('loading');
            loginButton.disabled = true;
            
            // محاكاة طلب تسجيل الدخول (تأخير للمحاكاة)
            setTimeout(function() {
                loginButton.classList.remove('loading');
                loginButton.disabled = false;
                
                // حفظ بيانات الدخول إذا تم اختيار "تذكرني"
                if (rememberMe) {
                    localStorage.setItem('rememberedEmail', email);
                } else {
                    localStorage.removeItem('rememberedEmail');
                }
                
                // عرض رسالة النجاح
                const successMsg = document.getElementById('login-success');
                successMsg.textContent = 'تم تسجيل الدخول بنجاح! جاري تحويلك...';
                successMsg.style.display = 'block';
                
                // التوجيه إلى الصفحة الرئيسية بعد تأخير
                setTimeout(function() {
                    window.location.href = 'index.html';
                }, 1500);
            }, 1500);
        });
        
        // تسجيل الدخول عبر Google
        document.querySelector('.btn-google').addEventListener('click', function() {
            alert('سيتم توجيهك إلى صفحة تسجيل الدخول عبر Google');
        });
        
        // تسجيل الدخول عبر Facebook
        document.querySelector('.btn-facebook').addEventListener('click', function() {
            alert('سيتم توجيهك إلى صفحة تسجيل الدخول عبر Facebook');
        });
        
        // تغيير اللغة
        document.querySelector('.language-btn').addEventListener('click', function() {
            alert('سيتم تغيير اللغة إلى الإنجليزية');
        });
        
        // تذكر بيانات الدخول إذا كانت محفوظة
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        if (rememberedEmail) {
            document.getElementById('email').value = rememberedEmail;
            document.getElementById('remember-me').checked = true;
        }
    });