  // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
 import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
 import{getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js"

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAC3Bj67tDaxSlc7Wa7R9XaE7YslXIYRhQ",
    authDomain: "perf-counter.firebaseapp.com",
    projectId: "perf-counter",
    storageBucket: "perf-counter.firebasestorage.app",
    messagingSenderId: "365791137165",
    appId: "1:365791137165:web:a31ef9358c1f9c16df01c4",
    measurementId: "G-1H39QY5T04"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

 function showMessage(message, divId){
    var messageDiv=document.getElementById(divId);
    messageDiv.style.display="block";
    messageDiv.innerHTML=message;
    messageDiv.style.opacity=1;
    setTimeout(function(){
        messageDiv.style.opacity=0;
    },5000);
 }
 const signUp=document.getElementById('submitSignUp');
 signUp.addEventListener('click', (event)=>{
    event.preventDefault();
    const email=document.getElementById('rEmail').value;
    const password=document.getElementById('rPassword').value;
    const firstName=document.getElementById('fName').value;
    const lastName=document.getElementById('lName').value;

    const auth=getAuth();
    const db=getFirestore();

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential)=>{
        const user=userCredential.user;
        const userData={
            email: email,
            firstName: firstName,
            lastName:lastName
        };
        showMessage('Account Created Successfully', 'signUpMessage');
        const docRef=doc(db, "users", user.uid);
        setDoc(docRef,userData)
        .then(()=>{
            window.location.href='index.html';
        })
        .catch((error)=>{
            console.error("error writing document", error);

        });
    })
    .catch((error)=>{
        const errorCode=error.code;
        if(errorCode=='auth/email-already-in-use'){
            showMessage('Email Address Already Exists !!!', 'signUpMessage');
        }
        else{
            showMessage('unable to create User', 'signUpMessage');
        }
    })
 });

 const signIn=document.getElementById('submitSignIn');
 signIn.addEventListener('click', (event)=>{
    event.preventDefault();
    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;
    const auth=getAuth();

    signInWithEmailAndPassword(auth, email,password)
    .then((userCredential)=>{
        showMessage('login is successful', 'signInMessage');
        const user=userCredential.user;
        localStorage.setItem('loggedInUserId', user.uid);
        window.location.href='homepage.html';
    })
    .catch((error)=>{
        const errorCode=error.code;
        if(errorCode==='auth/invalid-credential'){
            showMessage('Incorrect Email or Password', 'signInMessage');
        }
        else{
            showMessage('Account does not Exist', 'signInMessage');
        }
    })
 })

 const signUpButton=document.getElementById('signUpButton');
const signInButton=document.getElementById('signInButton');
const signInForm=document.getElementById('signIn');
const signUpForm=document.getElementById('signup');

signUpButton.addEventListener('click',function(){
    signInForm.style.display="none";
    signUpForm.style.display="block";
})
signInButton.addEventListener('click', function(){
    signInForm.style.display="block";
    signUpForm.style.display="none";
})
// --- NAME & TITLE LOGIC ---
  function checkUrlForName() {
    const params = new URLSearchParams(window.location.search);
    let name = params.get('name');
    if (!name && window.location.hash) name = window.location.hash.substring(1); 
    if (name) {
        name = decodeURIComponent(name);
        document.getElementById('app-title').innerText = name + "'s Counter";
        document.title = name + "'s Counter";
    }
  }
  checkUrlForName();

  // --- DATA MANAGEMENT ---
  (function autoName() {
  const params = new URLSearchParams(window.location.search);
  // If "name" isn't in the URL, redirect to include it
  if (!params.has('name')) {
    params.set('name', "Taha");
    window.location.search = params.toString();
  }
    })();


  // --- CHART LOGIC ---
  let myChartInstance = null;

  function renderChart() {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    
    const labels = [];
    const payData = [];
    const fullData = [];
    const postData = [];


    for (let i = 1; i <= 31; i++) {
        labels.push(i);
        
        const day = allData[i];
        const calls = day.calls || 0;
        const coll = day.coll|| 0;
        
        const payPerc = calls > 0 ? (day.pay / calls * 100) : 0;
        const fullPerc = calls > 0 ? (day.full / calls * 100) : 0;
        const postPerc = calls > 0 ? (day.post  / coll * 100) : 0;

        payData.push(payPerc);
        fullData.push(fullPerc);
        postData.push(postPerc);

    }

    if (myChartInstance) {
        myChartInstance.destroy();
    }

    myChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Pay %',
                    data: payData,
                    borderColor: '#f59e0b', 
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    borderWidth: 2,
                    tension: 0.4, 
                    pointRadius: 1, 
                    pointHoverRadius: 4,
                    fill: true
                },
                {
                    label: 'Full %',
                    data: fullData,
                    borderColor: '#3b82f6', 
                    backgroundColor: 'rgba(59, 130, 246, 0.05)',
                    borderWidth: 2,
                    tension: 0.4,
                    pointRadius: 1,
                    fill: true
                },
                {
                    label: 'Rem %',
                    data: postData,
                    borderColor: '#22c55e', 
                    backgroundColor: 'rgba(100, 100, 50, 0.05)',
                    borderWidth: 2,
                    tension: 0.4,
                    pointRadius: 1,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    labels: { color: '#94a3b8', font: { size: 10, weight: 'bold' } }
                },
                tooltip: {
                    backgroundColor: '#1e293b',
                    titleColor: '#fff',
                    bodyColor: '#cbd5e1',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: '#64748b', font: { size: 9 } }
                },
                y: {
                    beginAtZero: true,
                    max: 100, 
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#64748b', font: { size: 9 }, stepSize: 25 }
                }
            }
        }
    });
  }



  // Default structure for a single day
  const defaultDay = {
    calls: 0, pay: 0, full: 0, coll: 0, rem: 0, post:0, credits: 0, ap: 0, pp: 0
  };

  // Main Data Store: { "1": {...}, "2": {...} }
  let allData = JSON.parse(localStorage.getItem('counterData_v4')) || {};
  
  // Ensure all 31 days exist in structure (lazy init)
  for(let i=1; i<=31; i++) {
    if(!allData[i]) allData[i] = {...defaultDay};
  }

  // Active State
  let selectedDays = [new Date().getDate()]; // Default to today
  let lastUpdateTimestamp = parseInt(localStorage.getItem('lastUpdateTimestamp')) || Date.now();

  // --- CALENDAR UI ---
  const calendarGrid = document.getElementById('calendar-grid');

  function renderCalendar() {
    calendarGrid.innerHTML = '';
    for (let i = 1; i <= 31; i++) {
        const btn = document.createElement('div');
        btn.className = 'day-btn';
        btn.innerText = i;
        
        // Check if day has data (sum of values > 0)
        const daySum = Object.values(allData[i]).reduce((a, b) => a + b, 0);
        if (daySum > 0) btn.classList.add('has-data');
        
        // Check if active
        if (selectedDays.includes(i)) btn.classList.add('active');

        btn.onclick = () => toggleDay(i);
        calendarGrid.appendChild(btn);
    }
  }

  function toggleDay(day) {
    if (selectedDays.includes(day) && selectedDays.length > 1) {
        selectedDays = selectedDays.filter(d => d !== day);
    } else if (selectedDays.includes(day) && selectedDays.length === 1) {
        return; 
    } else {

        
        if(selectedDays.includes(day)) {
            selectedDays = selectedDays.filter(d => d !== day);
        } else {
            selectedDays.push(day);
        }
    }
    
    // Safety: If none selected, select today or day 1
    if (selectedDays.length === 0) selectedDays = [day];

    updateUI();
  }
  
function toggleSelectAll() {
    // 1. Grab all day elements that have the 'has-data' class
    const daysWithData = Array.from(document.querySelectorAll('.day-btn.has-data'))
                             .map(el => parseInt(el.textContent));

    // 2. Check if we already have all 'has-data' days selected
    const allDataSelected = daysWithData.every(day => selectedDays.includes(day));

    if (allDataSelected) {
        // If all are already selected, reset to just today (or empty)
        selectedDays = [new Date().getDate()];
    } else {
        // Otherwise, select only the days that actually have data
        selectedDays = daysWithData;
    }

    updateUI();
}

  // --- CORE LOGIC ---

  function getAggregatedData() {
      let result = {...defaultDay};
      selectedDays.forEach(day => {
          const dData = allData[day];
          Object.keys(result).forEach(key => {
              result[key] += (dData[key] || 0);
          });
      });
      return result;
  }

  function saveData() {
      localStorage.setItem('counterData_v4', JSON.stringify(allData));
      renderCalendar(); // Updates "has-data" dots
  }

// Map the button types to the actual Input IDs in the DOM
const INPUT_MAP = {
    'ready': 'ready-val',
    'In': 'in-val',
    'call-len': 'call-len-val'
};

function formatTime(totalMinutes) {
    const secondsTotal = Math.round(totalMinutes * 60);
    const h = Math.floor(secondsTotal / 3600);
    const m = Math.floor((secondsTotal % 3600) / 60);
    const s = secondsTotal % 60;

    const pad = (num) => num.toString().padStart(2, '0');

    if (h > 0) {
        return `${pad(h)}:${pad(m)}:${pad(s)}`;
    } else {
        return `${pad(m)}:${pad(s)}`;
    }
}
function updateEstimation() {
    const ready = parseFloat(document.getElementById('ready-val').value) || 0;
    const inCall = parseFloat(document.getElementById('in-val').value) || 0;
    const callLen = parseFloat(document.getElementById('call-len-val').value) || 0;
    
    const displayElement = document.getElementById('est-avail');

    // Avoid division by zero
    if (inCall === 0) {
        displayElement.innerText = "00:00"; 
        return;
    }


    const totalMinutes = (ready * callLen) / inCall;

    displayElement.innerText = formatTime(totalMinutes);
}

document.addEventListener('DOMContentLoaded', () => {
    const inputs = ['ready-val', 'in-val', 'call-len-val'];
    inputs.forEach(id => {
        document.getElementById(id).addEventListener('input', updateEstimation);
    });
    
    // Run once on load to set initial state
    updateEstimation();
});

  function change(key, amt) {
    // Only allow editing if exactly ONE day is selected
    if (selectedDays.length !== 1) {
        alert("Please select a single day to edit data.");
        return;
    }

    const day = selectedDays[0];
    allData[day][key] = Math.max(0, (allData[day][key] || 0) + amt);
    
    // Pulse animation
    const el = document.getElementById(key + '-val');
    el.classList.remove('update-pulse');
    void el.offsetWidth;
    el.classList.add('update-pulse');

    // Update Timestamp
    lastUpdateTimestamp = Date.now();
    localStorage.setItem('lastUpdateTimestamp', lastUpdateTimestamp);
    
    saveData();
    updateUI();
  }

  // Handle Manual Input for Credits
  document.getElementById('credits-val').addEventListener('change', (e) => {
      if (selectedDays.length !== 1) {
          e.target.value = getAggregatedData().credits; // Revert
          alert("Please select a single day to edit data.");
          return;
      }
      const day = selectedDays[0];
      allData[day].credits = parseInt(e.target.value) || 0;
      saveData();
      updateUI();
  });

  function updateUI() {
    renderCalendar();
    
    const data = getAggregatedData();
    const isMulti = selectedDays.length > 1;

    // View Label
    const viewLabel = document.getElementById('view-label');
    const lockMsg = document.getElementById('lock-msg');
    const controls = document.querySelectorAll('.controls');

    if (isMulti) {
        viewLabel.innerText = `Viewing Total (${selectedDays.length} Days)`;
        lockMsg.style.display = 'block';
        controls.forEach(c => c.classList.add('locked'));
	  document.getElementById('credits-val').disabled = true;

    } else {
        viewLabel.innerText = `Day ${selectedDays[0]}`;
        lockMsg.style.display = 'none';
        controls.forEach(c => c.classList.remove('locked'));
        document.getElementById('credits-val').disabled = false;

    }

    // Update Counters
    document.getElementById('calls-val').innerText = data.calls;
    document.getElementById('pay-val').innerText = data.pay;
    document.getElementById('full-val').innerText = data.full;
    document.getElementById('coll-val').innerText = data.coll;
    document.getElementById('rem-val').innerText = data.rem;
    document.getElementById('post-val').innerText = data.post;
    document.getElementById('ap-val').innerText = data.ap;
    document.getElementById('pp-val').innerText = data.pp;
    document.getElementById('credits-val').value = data.credits;

    // Update Percentages
    const payRaw = data.calls ? (data.pay / data.calls * 100) : 0;
    const fullRaw = data.calls ? (data.full / data.calls * 100) : 0;
    const remRaw = data.coll ? (data.rem / data.coll * 100) : 0;
    const postRaw = data.post? (data.post/ data.coll * 100) : 0;
    const apval= data.ap? (data.ap * 2) : 0;
    const ppval= data.pp? (data.pp) : 0;

    document.getElementById('pay-perc').innerText = payRaw.toFixed(1) + "%";
    document.getElementById('full-perc').innerText = fullRaw.toFixed(1) + "%";
    document.getElementById('rem-perc').innerText = remRaw.toFixed(1) + "%";
    document.getElementById('post-perc').innerText = postRaw.toFixed(1) + "%";
    document.getElementById('ap-val-mon').innerText = apval.toFixed(1) + "$";
    document.getElementById('pp-val-mon').innerText = ppval.toFixed(1) + "$";


    // Update Tiers
    updateTierUI('pay-tier', payRaw, 'pay', data.calls > 0);
    updateTierUI('full-tier', fullRaw, 'full', data.calls > 0);
    updateTierUI('rem-tier', remRaw, 'rem', data.coll > 0);
    updateTierUI('post-tier', postRaw, 'post', data.post> 0);


    // Color Logic
// Pay Logic
// document.getElementById('pay-perc').style.color = payRaw >= 78 ? 'var(--success)' : (payRaw >= 66 ? 'var(--warning)' : 'var(--danger)');

// Full Logic
// document.getElementById('full-perc').style.color = fullRaw >= 55 ? 'var(--success)' : (fullRaw >= 48 ? 'var(--warning)' : 'var(--danger)');

// Remaining Logic
// document.getElementById('rem-perc').style.color = remRaw >= 75 ? 'var(--success)' : (remRaw >= 65 ? 'var(--warning)' : 'var(--danger)');
    
// Remaining Logic
// document.getElementById('post-perc').style.color = postRaw >= 75 ? 'var(--success)' : (postRaw >= 65 ? 'var(--warning)' : 'var(--danger)');

    const credEl = document.getElementById('cred-perc');
    if (isMulti) {
    	if (data.credits > 4000) credEl.style.color = 'var(--danger)';
    	else if (data.credits >= 2000) credEl.style.color = 'var(--warning)';
    	else credEl.style.color = 'var(--success)';
    } else {
    	if (data.credits > 180) credEl.style.color = 'var(--danger)';
    	else if (data.credits >= 100) credEl.style.color = 'var(--warning)';
    	else credEl.style.color = 'var(--success)';
    }
    renderChart();

  }

  function getTierInfo(value, type) {
    let tier = 1;
    let color = 'var(--tier-1)';

    if (type === 'pay') {
        if (value >= 78) tier = 5;
        else if (value >= 73) tier = 4;
        else if (value >= 66) tier = 3;
        else if (value >= 60) tier = 2;
    } 
    else if (type === 'full') {
        if (value >= 55) tier = 5;
        else if (value >= 52) tier = 4;
        else if (value >= 48) tier = 3;
        else if (value >= 45) tier = 2;
    }
    else if (type === 'rem') {
        if (value >= 75) tier = 5;
        else if (value >= 70) tier = 4;
        else if (value >= 65) tier = 3;
        else if (value >= 60) tier = 2;
    }
    else if (type === 'post') {
        if (value >= 75) tier = 5;
        else if (value >= 70) tier = 4;
        else if (value >= 65) tier = 3;
        else if (value >= 60) tier = 2;
    }

    switch(tier) {
        case 1: color = 'var(--tier-1)'; break;
        case 2: color = 'var(--tier-2)'; break;
        case 3: color = 'var(--tier-3)'; break;
        case 4: color = 'var(--tier-4)'; break;
        case 5: color = 'var(--tier-5)'; break;
    }

    return { tier, color };
  }

  function updateTierUI(id, perc, type, hasData) {
    const badge = document.getElementById(id);
    const { tier, color } = getTierInfo(perc, type);
    
    if (hasData) { 
       badge.style.display = 'inline-block';
       badge.innerText = `TIER ${tier}`;
       badge.style.color = color;
       badge.style.borderColor = color;
    } else {
       badge.style.display = 'none';
    }
  }

  // --- JSON EXPORT / IMPORT ---

  function exportData() {
      const json = JSON.stringify(allData);
      navigator.clipboard.writeText(json).then(() => {
          const btn = document.getElementById('data-cpy');
          const original = btn.innerText;
          btn.innerText = "Copied! ✅";
          setTimeout(() => btn.innerText = original, 2000);
      });
  }

  function importData() {
      const input = prompt("Paste your JSON Data here (or leave it empty to reset)");
if (input === null) return;
// If input is null (Cancel) or empty string, reset the data
  if (!input || input.trim() === "") {
    if (confirm("No data provided. Reset all days to default?")) {
      allData = {};
      for (let i = 1; i <= 31; i++) {
        allData[i] = { ...defaultDay };
      }
      saveData();
      selectedDays = [new Date().getDate()];
      updateUI();
      alert("Data has been reset.");
    }
    return;
  }
      try {
          const parsed = JSON.parse(input);
          // Basic validation: Check if it looks like our object (keys 1-31 exist or can be added)
          if (typeof parsed === 'object') {
              allData = parsed;
              // Ensure structure integrity
              for(let i=1; i<=31; i++) {
                 if(!allData[i]) allData[i] = {...defaultDay};
              }
              saveData();
              selectedDays = [new Date().getDate()]; // Reset view
              updateUI();
              alert("Data loaded successfully!");
          } else {
              throw new Error("Invalid format");
          }
      } catch (e) {
          alert("Error: Invalid JSON data.");
      }
  }

  // --- SCREENSHOT ---
  document.getElementById('copy-btn').onclick = function() {
    const btn = this;
    const area = document.getElementById('metrics-capture-area');
    
    // Temporarily hide lock message for screenshot
    const lockMsg = document.getElementById('lock-msg');
    const wasVisible = lockMsg.style.display !== 'none';
    lockMsg.style.display = 'none';

    html2canvas(area, { 
        backgroundColor: '#0f172a',
        scale: 3,
        borderRadius: 28
    }).then(canvas => {
      // Restore lock message
      if (wasVisible) lockMsg.style.display = 'block';

      canvas.toBlob(blob => {
        const item = new ClipboardItem({ [blob.type]: blob });
        navigator.clipboard.write([item]).then(() => {
          btn.innerText = "Copied! ✅";
          btn.style.background = "var(--success)";
          setTimeout(() => {
            btn.innerText = "Screenshot";
            btn.style.background = "var(--primary)";
          }, 2000);
        });
      });
    });
  };

  // --- TIMER ---
  function updateTimer() {
    const now = Date.now();
    const diffInSeconds = Math.floor((now - lastUpdateTimestamp) / 1000);
    const hrs = Math.floor(diffInSeconds / 3600);
    const mins = Math.floor((diffInSeconds % 3600) / 60);
    const secs = diffInSeconds % 60;
    const formattedTime = 
        `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    document.getElementById('last-updated').innerText = `Last Updated: ${formattedTime} ago`;
  }
  setInterval(updateTimer, 1000);

  // Init
  updateUI();
  updateTimer();