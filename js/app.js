// Gắn các hàm quan trọng vào window để HTML gọi được (chống lỗi is not defined)
window.login = login; window.register = register; window.resetPassword = resetPassword; window.logout = logout;
window.showLogin = showLogin; window.showRegister = showRegister; window.showForgot = showForgot;
window.goToEmployeeSection = goToEmployeeSection; window.goBackToDashboard = goBackToDashboard; window.goBackToEmployeeSection = goBackToEmployeeSection; 
window.openAddModal = openAddModal; window.openEditModal = openEditModal; window.closeFormModal = closeFormModal; window.saveEmployeeData = saveEmployeeData;
window.openImportModal = openImportModal; window.closeImportModal = closeImportModal;
window.openPDFManager = openPDFManager; window.downloadAllImages = downloadAllImages; window.handleFileSelect = handleFileSelect; window.openCropModal = openCropModal; window.closeCropModal = closeCropModal; window.saveCrop = saveCrop; window.downloadFinalPDF = downloadFinalPDF;

window.onload = async () => {
    const remembered = localStorage.getItem('rememberedUser');
    if (remembered) { try { const { username, password } = JSON.parse(remembered); document.getElementById('loginUsername').value = username; document.getElementById('loginPassword').value = password; login(); } catch (e) {} } 
    else { const cU = sessionStorage.getItem('currentUser'); if (cU) showDashboard(cU); else showLogin(); }
    
    try { 
        let res = await fetch(SCRIPT_URL); 
        empData = await res.json(); 
        document.getElementById('statusLoading').style.display = 'none'; 
        renderTable(); 
    } catch(e) { document.getElementById('statusLoading').innerText = '❌ Lỗi tải dữ liệu. Vui lòng F5 lại!'; }
};

window.onpopstate = function(event) {
    if (event.state) {
        if (event.state.page === 'dashboard') { showDashboard(sessionStorage.getItem('currentUser')); }
        else if (event.state.page === 'employee') { goToEmployeeSection(); }
    } else { showDashboard(sessionStorage.getItem('currentUser')); }
};
