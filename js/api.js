// Dùng 'var' để tất cả các file khác đều gọi được dữ liệu này
var SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxWaVZbc24TCQHZoowqhW9tTEf5gtewczPfLMYrKMqDKLfjT9C3jUPYsQyXdNpCRleA/exec";
var empData = []; 
var currentIndex = -1; 
var currentPDFBytes = null;
var exportedList = JSON.parse(localStorage.getItem('exportedData') || '{}');
var croppedImages = { '45': { blob: null, original: null }, '46': { blob: null, original: null }, '47': { blob: null, original: null }, '48': { blob: null, original: null }, '49': { blob: null, original: null } };
var cropper = null; 
var currentCropField = null;
