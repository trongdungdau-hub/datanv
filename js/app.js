window.onload = async () => {
    const remembered = localStorage.getItem('rememberedUser');
    if (remembered) { try { const { username, password } = JSON.parse(remembered); document.getElementById('loginUsername').value = username; document.getElementById('loginPassword').value = password; window.login(); } catch (e) {} } 
    else { const cU = sessionStorage.getItem('currentUser'); if (cU) window.showDashboard(cU); else window.showLogin(); }
    
    try { 
        let res = await fetch(window.SCRIPT_URL); 
        window.empData = await res.json(); 
        document.getElementById('statusLoading').style.display = 'none'; 
        window.renderTable(); 
    } catch(e) { document.getElementById('statusLoading').innerText = '❌ Lỗi tải dữ liệu. Vui lòng F5 lại!'; }
};
