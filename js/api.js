// Link Google Apps Script
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxWaVZbc24TCQHZoowqhW9tTEf5gtewczPfLMYrKMqDKLfjT9C3jUPYsQyXdNpCRleA/exec";

// Ép biến thành toàn cục (Global) để các file JS khác đều dùng chung được
window.empData = []; 
window.currentIndex = -1; 
window.currentPDFBytes = null;
window.exportedList = JSON.parse(localStorage.getItem('exportedData') || '{}');
window.croppedImages = { '45': { blob: null, original: null }, '46': { blob: null, original: null }, '47': { blob: null, original: null }, '48': { blob: null, original: null }, '49': { blob: null, original: null } };
window.cropper = null; 
window.currentCropField = null;
