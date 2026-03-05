const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxWaVZbc24TCQHZoowqhW9tTEf5gtewczPfLMYrKMqDKLfjT9C3jUPYsQyXdNpCRleA/exec";
let empData = []; 
let currentIndex = -1; 
let currentPDFBytes = null;
let exportedList = JSON.parse(localStorage.getItem('exportedData') || '{}');
let croppedImages = { '45': { blob: null, original: null }, '46': { blob: null, original: null }, '47': { blob: null, original: null }, '48': { blob: null, original: null }, '49': { blob: null, original: null } };
let cropper = null; 
let currentCropField = null;
