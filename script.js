// ==================== COOKIE UTILITIES ====================
function getCookie(name) {
    const nameEQ = name + "=";
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(nameEQ) === 0) {
            return cookie.substring(nameEQ.length);
        }
    }
    return null;
}

function setCookie(name, value, days = 7) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

// ==================== LOGIN HANDLER ====================
function handleLogin(event) {
    event.preventDefault();
    
    const id = document.getElementById('id').value.trim();
    const password = document.getElementById('password').value.trim();
    const remember = document.getElementById('remember').checked;

    if (!id || !password) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }

    // Practitioner ID validation (alphanumeric, 4-10 characters)
    if (!/^[A-Z0-9]{4,10}$/.test(id)) {
        showMessage('Practitioner ID must be 4-10 alphanumeric characters', 'error');
        return;
    }

    // Password validation (minimum 8 characters)
    if (password.length < 8) {
        showMessage('Password must be at least 8 characters long', 'error');
        return;
    }

    // Demo credentials
    const validCredentials = [
        { id: 'IDTB110190', password: 'Shengyao!@#$%12345', role: 'doctor' },
        { id: 'IDTB110191', password: 'Change!@#$1234', role: 'nurse' },
        { id: 'IDTB110192', password: 'Fuyao!@#$%^123456', role: 'admin' }
    ];

    const credential = validCredentials.find(cred => 
        cred.id === id && cred.password === password
    );

    if (credential) {
        setCookie('active_role', credential.role, 7);
        setCookie('practitioner_id', id, 7);

        if (remember) {
            localStorage.setItem('rememberedId', id);
            localStorage.setItem('rememberMe', 'true');
        } else {
            localStorage.removeItem('rememberedId');
            localStorage.removeItem('rememberMe');
        }

        showMessage('Login successful! Redirecting...', 'success');
        setTimeout(() => {
            showDashboard(credential.role, id);
        }, 1500);
    } else {
        showMessage('Invalid Practitioner ID or password', 'error');
    }
}

// ==================== MESSAGE DISPLAY ====================
function showMessage(message, type) {
    let messageBox = document.getElementById('messageBox');
    if (!messageBox) {
        messageBox = document.createElement('div');
        messageBox.id = 'messageBox';
        messageBox.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 25px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 2000;
            animation: slideIn 0.3s ease;
            max-width: 400px;
            text-align: center;
        `;
        document.body.appendChild(messageBox);
    }

    messageBox.textContent = message;
    messageBox.style.display = 'block';
    
    if (type === 'success') {
        messageBox.style.backgroundColor = '#4caf50';
        messageBox.style.color = 'white';
    } else if (type === 'error') {
        messageBox.style.backgroundColor = '#f44336';
        messageBox.style.color = 'white';
    } else {
        messageBox.style.backgroundColor = '#2196f3';
        messageBox.style.color = 'white';
    }

    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 4000);
}


function showSection(sectionName) {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    if (sectionName === 'forgot') {
        alert('Password reset functionality coming soon');
        document.getElementById('login-section').style.display = 'block';
    } else if (sectionName === 'signup') {
        alert('Sign up functionality coming soon');
        document.getElementById('login-section').style.display = 'block';
    } else {
        document.getElementById('login-section').style.display = 'block';
    }
}

// ====================cOOKIE ====================
window.addEventListener('DOMContentLoaded', function() {
    const activeRole = getCookie('active_role');
    const practitionerId = getCookie('practitioner_id');

    if (activeRole && practitionerId) {
        showMessage('You are already logged in', 'info');
        showDashboard(activeRole, practitionerId);
    } else {
        const rememberMe = localStorage.getItem('rememberMe');
        const rememberedId = localStorage.getItem('rememberedId');
        
        if (rememberMe === 'true' && rememberedId) {
            document.getElementById('id').value = rememberedId;
            document.getElementById('remember').checked = true;
        }
    }

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }

        .dashboard-section {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 400px;
            margin-bottom: 60px;
        }

        .dashboard-container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
            padding: 40px;
            width: 100%;
            max-width: 500px;
            text-align: center;
        }

        .welcome-banner {
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #667eea;
        }

        .welcome-banner h2 {
            color: #667eea;
            font-size: 28px;
            margin-bottom: 15px;
        }

        .welcome-banner p {
            color: #666;
            font-size: 16px;
            margin: 10px 0;
        }

        .dashboard-info {
            color: #666;
            font-size: 16px;
            line-height: 1.6;
        }

        .btn-logout {
            background: linear-gradient(135deg, #f44336 0%, #e53935 100%);
            color: white;
            padding: 12px 25px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 20px;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .btn-logout:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(244, 67, 54, 0.4);
        }
    `;
    document.head.appendChild(style);
});

// ==================== FORM SUBMISSION ====================
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin(e);
    });
}
