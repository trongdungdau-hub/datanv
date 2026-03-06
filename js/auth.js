if (!localStorage.getItem('users')) { localStorage.setItem('users', JSON.stringify([])); }
function getUsers() { return JSON.parse(localStorage.getItem('users')); }
function saveUsers(users) { localStorage.setItem('users', JSON.stringify(users)); }

function showLogin() { document.getElementById('loginForm').style.display = 'block'; document.getElementById('registerForm').style.display = 'none'; document.getElementById('forgotForm').style.display = 'none'; }
function showRegister() { document.getElementById('loginForm').style.display = 'none'; document.getElementById('registerForm').style.display = 'block'; document.getElementById('forgotForm').style.display = 'none'; }
function showForgot() { document.getElementById('loginForm').style.display = 'none'; document.getElementById('registerForm').style.display = 'none'; document.getElementById('forgotForm').style.display = 'block'; }

function login() { 
    var u = document.getElementById('loginUsername').value.trim(); var p = document.getElementById('loginPassword').value; var r = document.getElementById('rememberMe').checked; 
    if (!u || !p) return alert('Nhập đủ thông tin!'); 
    var user = getUsers().find(x => x.username === u && x.password === p); 
    if (!user) return alert('Sai tài khoản/mật khẩu!'); 
    if (r) localStorage.setItem('rememberedUser', JSON.stringify({ username: u, password: p })); else localStorage.removeItem('rememberedUser'); 
    sessionStorage.setItem('currentUser', u); showDashboard(u); 
}

function register() { 
    var u = document.getElementById('regUsername').value.trim(); var p = document.getElementById('regPassword').value; var c = document.getElementById('regConfirm').value; 
    if (!u || !p || !c) return alert('Điền đủ thông tin!'); if (p !== c) return alert('Mật khẩu không khớp!'); 
    var users = getUsers(); if (users.find(x => x.username === u)) return alert('Tài khoản đã tồn tại!'); 
    users.push({ username: u, password: p }); saveUsers(users); alert('Đăng ký thành công!'); showLogin(); 
}

function resetPassword() { 
    var u = document.getElementById('forgotUsername').value.trim(); var np = document.getElementById('forgotNewPassword').value; var c = document.getElementById('forgotConfirm').value; 
    if (!u || !np || !c) return alert('Điền đủ thông tin!'); if (np !== c) return alert('Mật khẩu không khớp!'); 
    var users = getUsers(); var idx = users.findIndex(x => x.username === u); if (idx === -1) return alert('Tài khoản không tồn tại!'); 
    users[idx].password = np; saveUsers(users); alert('Đổi MK thành công!'); showLogin(); 
}

function logout() { sessionStorage.removeItem('currentUser'); window.location.reload(); }

function showDashboard(username) { 
    document.body.style.background = '#f4f7f6'; document.getElementById('authWrapper').style.display = 'none'; document.getElementById('dashboard').style.display = 'block'; 
    document.getElementById('employeeSection').style.display = 'none'; document.getElementById('pdfSection').style.display = 'none'; document.getElementById('usernameDisplay').innerText = username; 
}
