if (!localStorage.getItem('users')) { localStorage.setItem('users', JSON.stringify([])); }
window.getUsers = function() { return JSON.parse(localStorage.getItem('users')); }
window.saveUsers = function(users) { localStorage.setItem('users', JSON.stringify(users)); }

window.showLogin = function() { document.getElementById('loginForm').style.display = 'block'; document.getElementById('registerForm').style.display = 'none'; document.getElementById('forgotForm').style.display = 'none'; }
window.showRegister = function() { document.getElementById('loginForm').style.display = 'none'; document.getElementById('registerForm').style.display = 'block'; document.getElementById('forgotForm').style.display = 'none'; }
window.showForgot = function() { document.getElementById('loginForm').style.display = 'none'; document.getElementById('registerForm').style.display = 'none'; document.getElementById('forgotForm').style.display = 'block'; }

window.login = function() { 
    const u = document.getElementById('loginUsername').value.trim(); const p = document.getElementById('loginPassword').value; const r = document.getElementById('rememberMe').checked; 
    if (!u || !p) return alert('Nhập đủ thông tin!'); 
    const user = window.getUsers().find(x => x.username === u && x.password === p); 
    if (!user) return alert('Sai tài khoản/mật khẩu!'); 
    if (r) localStorage.setItem('rememberedUser', JSON.stringify({ username: u, password: p })); else localStorage.removeItem('rememberedUser'); 
    sessionStorage.setItem('currentUser', u); window.showDashboard(u); 
}
window.register = function() { 
    const u = document.getElementById('regUsername').value.trim(); const p = document.getElementById('regPassword').value; const c = document.getElementById('regConfirm').value; 
    if (!u || !p || !c) return alert('Điền đủ thông tin!'); if (p !== c) return alert('Mật khẩu không khớp!'); 
    const users = window.getUsers(); if (users.find(x => x.username === u)) return alert('Tài khoản đã tồn tại!'); 
    users.push({ username: u, password: p }); window.saveUsers(users); alert('Đăng ký thành công!'); window.showLogin(); 
}
window.resetPassword = function() { 
    const u = document.getElementById('forgotUsername').value.trim(); const np = document.getElementById('forgotNewPassword').value; const c = document.getElementById('forgotConfirm').value; 
    if (!u || !np || !c) return alert('Điền đủ thông tin!'); if (np !== c) return alert('Mật khẩu không khớp!'); 
    const users = window.getUsers(); const idx = users.findIndex(x => x.username === u); if (idx === -1) return alert('Tài khoản không tồn tại!'); 
    users[idx].password = np; window.saveUsers(users); alert('Đổi MK thành công!'); window.showLogin(); 
}
window.logout = function() { sessionStorage.removeItem('currentUser'); window.location.reload(); }
window.showDashboard = function(username) { 
    document.body.style.background = '#f4f7f6'; document.getElementById('authWrapper').style.display = 'none'; document.getElementById('dashboard').style.display = 'block'; 
    document.getElementById('employeeSection').style.display = 'none'; document.getElementById('pdfSection').style.display = 'none'; document.getElementById('usernameDisplay').innerText = username; 
}
