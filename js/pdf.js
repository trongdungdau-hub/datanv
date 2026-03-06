function openPDFManager(idx) {
    currentIndex = idx;
    document.getElementById('pdfTitle').innerText = "HỒ SƠ: " + empData[idx][0];
    ['45','46','47','48','49'].forEach(id => {
        document.getElementById('up'+id).value = ''; document.getElementById('crop'+id).disabled = true;
        if(croppedImages[id].blob) { URL.revokeObjectURL(croppedImages[id].blob); croppedImages[id] = { blob: null, original: null }; }
    });
    document.getElementById('employeeSection').style.display = 'none';
    document.getElementById('pdfSection').style.display = 'block';
    refreshPDF();
}

async function getGasImg(url) { if(!url) return null; let m = url.match(/id=([a-zA-Z0-9_-]+)/) || url.match(/\/d\/([a-zA-Z0-9_-]+)/); if(!m) return null; try { let r = await fetch(SCRIPT_URL + "?action=getImage&id=" + m[1]); let j = await r.json(); if(j.ok && j.data){ let bin = window.atob(j.data.split(',')[1]); let b = new Uint8Array(bin.length); for(let i=0; i<bin.length; i++) b[i]=bin.charCodeAt(i); return b.buffer; } } catch(e){} return null; }
async function downloadAllImages() { let emp = empData[currentIndex]; let links = []; emp.forEach(c => { if(c && String(c).includes('drive.google.com')) links.push(c); }); if(links.length === 0) { alert('❌ Nhân viên này không có file ảnh!'); return; } let btn = document.getElementById('btnDlAll'); let txt = btn.innerHTML; btn.innerHTML = '⏳ Đang kéo...'; btn.disabled = true; for(let i=0; i<links.length; i++) { let b = await getGasImg(links[i]); if(b) download(b, `${emp[0]}_Anh_${i+1}.jpg`, "image/jpeg"); } btn.innerHTML = '<i class="fas fa-check"></i> Xong'; setTimeout(() => { btn.innerHTML = txt; btn.disabled = false; }, 3000); }
function handleFileSelect(fId) { const inp = document.getElementById('up'+fId); const btn = document.getElementById('crop'+fId); if(inp.files.length > 0) { btn.disabled = false; if(croppedImages[fId].blob) { URL.revokeObjectURL(croppedImages[fId].blob); croppedImages[fId] = { blob: null, original: null }; } } else { btn.disabled = true; } refreshPDF(); }
function openCropModal(fId) { const inp = document.getElementById('up'+fId); if(!inp.files.length) return; currentCropField = fId; const r = new FileReader(); r.onload = (e) => { document.getElementById('cropImage').src = e.target.result; document.getElementById('cropModal').style.display = 'flex'; if(cropper) cropper.destroy(); setTimeout(() => { cropper = new Cropper(document.getElementById('cropImage'), { aspectRatio: NaN, viewMode: 1, autoCropArea: 1 }); }, 100); }; r.readAsDataURL(inp.files[0]); }
function closeCropModal() { document.getElementById('cropModal').style.display = 'none'; if(cropper) { cropper.destroy(); cropper = null; } }
function saveCrop() { if(!cropper || !currentCropField) return; cropper.getCroppedCanvas({ maxWidth: 1024, maxHeight: 1024, fillColor: '#fff' }).toBlob((blob) => { const r = new FileReader(); r.onload = (e) => { if(croppedImages[currentCropField].blob) URL.revokeObjectURL(croppedImages[currentCropField].blob); croppedImages[currentCropField] = { blob: URL.createObjectURL(blob), original: e.target.result }; refreshPDF(); }; r.readAsArrayBuffer(blob); closeCropModal(); }, 'image/jpeg', 0.95); }
async function getImageBufferForField(fId) { if(croppedImages[fId] && croppedImages[fId].original) return croppedImages[fId].original; const inp = document.getElementById('up'+fId); if(inp.files.length > 0) return await new Promise((res) => { let r = new FileReader(); r.onload = () => res(r.result); r.readAsArrayBuffer(inp.files[0]); }); return null; }
function formatSal(v){ if(!v) return ""; let s = String(v).toUpperCase().trim(); let m = s.replace(/[,.]/g,'').match(/\d+/); if(!m) return s; let n = parseInt(m[0],10); return (s.includes('USD') || n<100000) ? `${n.toLocaleString('vi-VN')} USD` : `${n.toLocaleString('vi-VN')} VND`; }
function fillField(form, fieldName, value, customFont) { try { let field = form.getTextField(fieldName); if (field && value) { field.setText(String(value)); field.setFontSize(10); field.updateAppearances({font: customFont}); } } catch(e) {} }

async function refreshPDF() {
    if(currentIndex === -1) return;
    let emp = empData[currentIndex]; let loadingDiv = document.getElementById('loadingPDF'); loadingDiv.style.display = 'flex'; loadingDiv.innerText = "⏳ Đang tải form...";
    try {
        const doc = await PDFLib.PDFDocument.load(await fetch("template.pdf?v="+Math.random()).then(r=>r.arrayBuffer()));
        doc.registerFontkit(window.fontkit);
        
        // TRẢ LẠI FONT ONLINE CỦA MÀY (KHÔNG BỊ LỖI 404 NHƯ FONT.TTF)
        const fontBytes = await fetch("https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf").then(r=>r.arrayBuffer());
        const customFont = await doc.embedFont(fontBytes);
        const form = doc.getForm();
        
        form.updateFieldAppearances({font: customFont}); 

        loadingDiv.innerText = "⏳ Đang điền dữ liệu...";
        for(let i=0; i<=44; i++){
            if([3, 4, 17, 18, 25, 26, 27, 30].includes(i)) continue;
            let val = emp[i] ? String(emp[i]) : "";
            if([5,20,41].includes(i) && val){ try { let d=new Date(val); if(!isNaN(d)) val=`${("0"+d.getDate()).slice(-2)}/${("0"+(d.getMonth()+1)).slice(-2)}/${d.getFullYear()}`; } catch(e){} }
            if(i===9 || i===12) val = formatSal(val);
            fillField(form, i.toString(), val, customFont);
        }
        
        let dobRaw = emp[3];
        if (dobRaw) {
            let d = new Date(dobRaw);
            if (String(dobRaw).includes('/')) { let parts = String(dobRaw).split('/'); if(parts[0].length === 2) d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`); }
            if (!isNaN(d)) {
                let dd = ("0" + d.getDate()).slice(-2); let mm = ("0" + (d.getMonth() + 1)).slice(-2); let yyyy = d.getFullYear().toString();
                fillField(form, '3', `${dd}/${mm}/${yyyy}`, customFont); fillField(form, '3_nam', yyyy, customFont); fillField(form, '3_thang', mm, customFont); fillField(form, '3_ngay', dd, customFont);
            }
        }

        let addr18 = emp[18];
        if (addr18) {
            let parts = String(addr18).split('|'); let tinh = parts[0] || ''; let phuong = parts[1] || ''; let chitiet = parts[2] || ''; let full18 = [chitiet, phuong, tinh].filter(Boolean).join(', ');
            fillField(form, '18', full18, customFont); fillField(form, '18_tinh', tinh, customFont); fillField(form, '18_phuong', phuong, customFont); fillField(form, '18_chitiet', chitiet, customFont);
        }
        fillField(form, '22', String(emp[38]||''), customFont); 

        [25,26,27,30].forEach(i => { if(emp[i]){ let p = String(emp[i]).split('|'); fillField(form, `${i}_thoigian`, p[0]||'', customFont); fillField(form, `${i}_tentruong`, p[1]||'', customFont); } });
        try { let gt=String(emp[4]||'').toLowerCase(); if(gt.includes('nam')) form.getCheckBox('Nam').check(); else form.getCheckBox('Nữ').check(); } catch(e){}
        try { let hn=String(emp[17]||'').toLowerCase(); if(hn.includes('đã')||hn.includes('da ket')) form.getCheckBox('DaKetHon').check(); else form.getCheckBox('ChuaKetHon').check(); } catch(e){}

        loadingDiv.innerText = "⏳ Đang ghép ảnh...";
        let inputs = [ {id:'45'}, {id:'46'}, {id:'47'}, {id:'48'}, {id:'49'} ]; const allFields = form.getFields(); let drawTasks = [];
        for(let item of inputs) {
            const fieldId = item.id; const buffer = await getImageBufferForField(fieldId); if(!buffer) continue;
            const targetField = allFields.find(f => f.getName().trim() === fieldId);
            if(targetField) { const widgets = targetField.acroField.getWidgets(); if(widgets.length > 0) { const widget = widgets[0]; const rect = widget.getRectangle(); const pRef = widget.P(); if(pRef) { const pageIndex = doc.getPages().findIndex(p => p.ref === pRef); if(pageIndex >= 0) { drawTasks.push({ buffer: buffer, rect: rect, pageIndex: pageIndex }); } } } }
        }

        form.flatten(); 
        for(let task of drawTasks) {
            if(task.pageIndex >= 0) { const page = doc.getPages()[task.pageIndex]; let img; try { img = await doc.embedJpg(task.buffer); } catch { img = await doc.embedPng(task.buffer); } page.drawImage(img, { x: task.rect.x, y: task.rect.y, width: task.rect.width, height: task.rect.height }); }
        }

        currentPDFBytes = await doc.save();
        const blob = new Blob([currentPDFBytes], { type: 'application/pdf' }); const url = URL.createObjectURL(blob);
        document.getElementById('pdfFrame').src = url; loadingDiv.style.display = 'none';
    } catch(e) { alert("Lỗi tải PDF: " + e.message); console.error(e); document.getElementById('loadingPDF').style.display = 'none'; }
}

function downloadFinalPDF() {
    if(!currentPDFBytes) return; let emp = empData[currentIndex]; download(currentPDFBytes, `HoSo_${emp[0]}.pdf`, "application/pdf");
    let cccd = emp[19] || ('NO_CCCD_' + currentIndex); exportedList[cccd] = true; localStorage.setItem('exportedData', JSON.stringify(exportedList)); renderTable(); goBackToEmployeeSection();
}
