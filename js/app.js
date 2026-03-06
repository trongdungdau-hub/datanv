window.onload = async function() {
    var remembered = localStorage.getItem('rememberedUser');
    if (remembered) { try { var acc = JSON.parse(remembered); document.getElementById('loginUsername').value = acc.username; document.getElementById('loginPassword').value = acc.password; login(); } catch (e) {} } 
    else { var cU = sessionStorage.getItem('currentUser'); if (cU) showDashboard(cU); else showLogin(); }
    
    try { 
        var res = await fetch(SCRIPT_URL); 
        empData = await res.json(); 
        document.getElementById('statusLoading').style.display = 'none'; 
        renderTable(); 
    } catch(e) { document.getElementById('statusLoading').innerText = '❌ Lỗi tải dữ liệu. Vui lòng F5 lại!'; }
};
