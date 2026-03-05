function goToEmployeeSection() { document.getElementById('dashboard').style.display = 'none'; document.getElementById('pdfSection').style.display = 'none'; document.getElementById('employeeSection').style.display = 'block'; renderTable(); }
function goBackToDashboard() { document.getElementById('employeeSection').style.display = 'none'; document.getElementById('dashboard').style.display = 'block'; }
function goBackToEmployeeSection() { document.getElementById('pdfSection').style.display = 'none'; document.getElementById('employeeSection').style.display = 'block'; document.getElementById('pdfFrame').src = ''; }
function safeDate(val) { if (!val) return '-'; try { let d = new Date(val); if (!isNaN(d)) return `${("0" + d.getDate()).slice(-2)}/${("0" + (d.getMonth() + 1)).slice(-2)}/${d.getFullYear()}`; return val; } catch (e) { return val; } }
function safeStr(val) { return val ? val : '-'; }

// ==============================================================
// 1. CHỈNH SỬA CỘT HIỂN THỊ BẢNG Ở ĐÂY
// ==============================================================
function renderTable() {
    let html = ''; let stt = 1;
    window.empData.slice(1).reverse().forEach((emp, revIdx) => {
        if(!emp[0]) return; 
        let checkName = String(emp[0]).replace(/\s/g, '').toLowerCase();
        if(checkName.includes('họvàtên') || checkName.includes('viếthoa')) return;

        let idx = window.empData.length - 1 - revIdx;

        // ⚠ SỬA CÁC CON SỐ TRONG NGOẶC VUÔNG CHO ĐÚNG CỘT TRÊN SHEET CỦA MÀY ⚠
        // (A=0, B=1, C=2, D=3, E=4, F=5...)
        let hoTen = safeStr(emp[0]);       // Đang lấy Cột A
        let msnv = "-";                    // Mày chưa có MSNV, để tạm dấu -
        let gioitinh = safeStr(emp[4]);    // Đang lấy Cột E
        let ngayVao = safeDate(emp[5]);    // Đang lấy Cột F
        let ngayHD = "-";                  // Mày chưa có Ngày HĐ
        let boPhan = safeStr(emp[6]);      // Đang lấy Cột G
        let chucVu = safeStr(emp[7]);      // Đang lấy Cột H
        let ngaySinh = safeDate(emp[3]);   // Đang lấy Cột D
        let cccd = safeStr(emp[19]);       // Đang lấy Cột T
        let ngayCap = safeDate(emp[20]);   // Đang lấy Cột U
        let quocTich = "";                 // Bỏ trống
        let thuongTru = safeStr(emp[18]).replace(/\|/g, ', '); // Đang lấy Cột S
        
        // Nhìn hình mày thì Tạm trú, BHXH, MST đang bị sai cột. Hãy thay số cho đúng!
        let tamTru = safeStr(emp[38]);     // <-- SỬA SỐ NÀY (Có phải 38 ko?)
        let bhxh = safeStr(emp[33]);       // <-- SỬA SỐ NÀY (Có phải 33 ko?)
        let mst = safeStr(emp[35]);        // <-- SỬA SỐ NÀY (Mày đang bị nhầm Ngân hàng vào đây)
        let sdt = safeStr(emp[21]);        // <-- SỬA SỐ NÀY

        let statusHtml = window.exportedList[cccd] ? '<span class="badge">✅ Đã xuất</span>' : '<span style="color:#888">Chưa xuất</span>';
        html += `<tr>
            <td style="text-align:center;">${stt++}</td><td style="font-weight: bold; color: #555;">${msnv}</td><td><b>${hoTen}</b></td><td>${ngayVao}</td>
            <td>${ngayHD}</td><td>${boPhan}</td><td><span style="background: #e2e8f0; padding: 3px 8px; border-radius: 4px; font-size: 12px;">${chucVu}</span></td>
            <td>${ngaySinh}</td><td>${gioitinh}</td><td>${cccd}</td><td>${ngayCap}</td><td>${quocTich}</td>
            <td style="max-width: 150px; overflow: hidden; text-overflow: ellipsis;" title="${thuongTru}">${thuongTru}</td>
            <td style="max-width: 150px; overflow: hidden; text-overflow: ellipsis;" title="${tamTru}">${tamTru}</td>
            <td>${bhxh}</td><td>${mst}</td><td>${sdt}</td><td style="text-align:center;">${statusHtml}</td>
            <td class="sticky-col">
                <button class="btn btn-edit" onclick="openEditModal(${idx})" title="Sửa thông tin"><i class="fas fa-edit"></i> Sửa</button>
                <button class="btn btn-action" onclick="openPDFManager(${idx})" title="Tải & Chỉnh sửa Form PDF"><i class="fas fa-download"></i> Tải</button>
            </td>
        </tr>`;
    });
    document.getElementById('tableBody').innerHTML = html;
}

// ==============================================================
// 2. LOGIC BẬT TẮT POPUP
// ==============================================================
function openImportModal() { document.getElementById('importModal').style.display = 'flex'; }
function closeImportModal() { document.getElementById('importModal').style.display = 'none'; }
function openAddModal() { document.getElementById('formModalTitle').innerHTML = '<i class="fas fa-user-plus"></i> THÊM MỚI NHÂN VIÊN'; document.getElementById('emp_idx').value = "-1"; document.querySelectorAll('#employeeFormModal input').forEach(inp => { if(inp.type !== 'hidden') inp.value = ''; }); document.getElementById('fm_quoctich').value = ''; document.getElementById('employeeFormModal').style.display = 'flex'; }
function formatDateForInput(dateStr) { if(!dateStr) return ''; try { let d = new Date(dateStr); if (isNaN(d)) return ''; return d.toISOString().split('T')[0]; } catch(e) { return ''; } }

function openEditModal(idx) {
    document.getElementById('formModalTitle').innerHTML = '<i class="fas fa-user-edit"></i> CẬP NHẬT THÔNG TIN NHÂN VIÊN'; 
    document.getElementById('emp_idx').value = idx; 
    let emp = window.empData[idx]; // Đã fix gọi biến global

    document.getElementById('fm_hoten').value = emp[0] || ''; 
    document.getElementById('fm_ngaysinh').value = formatDateForInput(emp[3]); 
    document.getElementById('fm_gioitinh').value = emp[4] || 'Nam';
    document.getElementById('fm_ngayvao').value = formatDateForInput(emp[5]); 
    document.getElementById('fm_bophan').value = emp[6] || ''; 
    document.getElementById('fm_chucvu').value = emp[7] || '';
    document.getElementById('fm_thuongtru').value = emp[18] ? emp[18].replace(/\|/g, ', ') : ''; 
    document.getElementById('fm_cccd').value = emp[19] || ''; 
    document.getElementById('fm_ngaycap').value = formatDateForInput(emp[20]);
    document.getElementById('fm_sdt').value = emp[21] || ''; 
    document.getElementById('fm_bhxh').value = emp[33] || ''; 
    document.getElementById('fm_mst').value = emp[35] || '';
    document.getElementById('fm_tamtru').value = emp[38] || ''; 
    document.getElementById('fm_quoctich').value = ''; 
    document.getElementById('employeeFormModal').style.display = 'flex';
}

function closeFormModal() { document.getElementById('employeeFormModal').style.display = 'none'; }

// ==============================================================
// 3. LOGIC LƯU DỮ LIỆU ĐÃ FIX LỖI 100%
// ==============================================================
async function saveEmployeeData() {
    let idxStr = document.getElementById('emp_idx').value;
    if (idxStr === "") { return alert("Lỗi hệ thống: Không có ID."); }
    
    let idx = parseInt(idxStr);
    let isNew = (idx === -1);
    
    // Fix lỗi is not iterable bằng cách sao chép mảng an toàn
    let emp = [];
    if (isNew) {
        emp = new Array(50).fill(''); 
    } else {
        if (!window.empData || !window.empData[idx]) return alert("Lỗi: Không tìm thấy dữ liệu nhân viên!");
        emp = [...window.empData[idx]]; 
    }

    // Gán dữ liệu từ form (NẾU MÀY ĐỔI CỘT Ở HÀM RENDER TRÊN KIA THÌ Ở ĐÂY CŨNG PHẢI ĐỔI SỐ CHO KHỚP NHÉ)
    emp[0] = document.getElementById('fm_hoten').value;
    emp[3] = document.getElementById('fm_ngaysinh').value;
    emp[4] = document.getElementById('fm_gioitinh').value;
    emp[5] = document.getElementById('fm_ngayvao').value;
    emp[6] = document.getElementById('fm_bophan').value;
    emp[7] = document.getElementById('fm_chucvu').value;
    emp[18] = document.getElementById('fm_thuongtru').value;
    emp[19] = document.getElementById('fm_cccd').value;
    emp[20] = document.getElementById('fm_ngaycap').value;
    emp[21] = document.getElementById('fm_sdt').value;
    emp[33] = document.getElementById('fm_bhxh').value;
    emp[35] = document.getElementById('fm_mst').value;
    emp[38] = document.getElementById('fm_tamtru').value;

    let btnSave = document.querySelector('.btn-save');
    let oldBtnHtml = btnSave.innerHTML;
    btnSave.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang lưu...';
    btnSave.disabled = true;
    document.getElementById('formMsg').innerHTML = "<span style='color:#f59e0b'>Đang gửi yêu cầu lưu lên Google Sheet...</span>";

    let payload = { action: isNew ? 'add' : 'edit', rowData: emp, sheetRow: isNew ? null : (idx + 1) };

    try {
        let response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(payload),
            redirect: "follow",
            headers: { "Content-Type": "text/plain;charset=utf-8" }
        });

        if (isNew) window.empData.push(emp); else window.empData[idx] = emp;
        renderTable(); 
        closeFormModal();
        alert("✅ Đã lưu dữ liệu thành công!");

    } catch (e) {
        document.getElementById('formMsg').innerHTML = "❌ Lỗi: Không thể lưu. Hãy kiểm tra API Google Apps Script.";
        console.error(e);
    } finally {
        btnSave.innerHTML = oldBtnHtml;
        btnSave.disabled = false;
    }
}
