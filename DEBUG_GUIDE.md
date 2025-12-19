# Groove App - Debug Guide

## 🔍 Current Status

### ✅ Working Features
- **PWA Installation** - Installable on iPhone (Safari) and Android (Chrome)
- **Audio Playback** - Web Audio API with real sound generation
- **Metronome** - Click sound generation (1000Hz sine wave)
- **Master EQ** - 5-band equalizer (60Hz, 250Hz, 1kHz, 4kHz, 16kHz)
- **Search & Filters** - Time signature dropdown, A-Z navigation
- **Theme Toggle** - Dark/Light mode switching
- **Subscription System** - 7-day trial tracking

### ⚠️ Known Issues

#### 1. Audio File Missing
**Problem:** `/Audio groove.mp3` is referenced but may not exist in all locations
**Fix:** Ensure audio file is in root directory
**Test:** 
```bash
Test-Path "E:\Downloads\sec+\DevOps\My Projects\Loop App\groove\Audio groove.mp3"
```

#### 2. Service Worker Caching
**Problem:** Service worker may cache old versions
**Fix:** Clear cache in DevTools → Application → Clear Storage
**Console Command:**
```javascript
navigator.serviceWorker.getRegistrations().then(regs => regs.forEach(reg => reg.unregister()))
```

#### 3. AudioContext State
**Problem:** Browser autoplay policy blocks audio until user interaction
**Fix:** Already implemented - AudioContext.resume() on first play
**Console Check:**
```javascript
console.log(audioContext.state) // Should be 'running' after first interaction
```

## 🧪 Testing Steps

### Test on Desktop (Chrome)
1. Open: `http://localhost:8000/mobile-frontend.html`
2. Open DevTools (F12) → Console
3. Click metronome play button
4. Check console for: "🎵 Metronome started at X BPM"
5. Verify you hear click sound
6. Click instrument play button
7. Check console for audio loading messages

### Test on Phone (Same WiFi)
1. **Find your IP:**
   ```powershell
   (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -like "10.*"}).IPAddress
   ```
   Current IP: `10.0.0.39`

2. **On iPhone (Safari):**
   - Open: `http://10.0.0.39:8000/mobile-frontend.html`
   - Tap Share → "Add to Home Screen"
   - Open installed app
   - Test metronome and audio

3. **On Android (Chrome):**
   - Open: `http://10.0.0.39:8000/mobile-frontend.html`
   - Tap menu → "Install app"
   - Open installed app
   - Test features

## 🐛 Common Issues & Solutions

### Issue: No Audio Playing
**Symptoms:** Buttons work but no sound
**Debug Steps:**
1. Check browser console for errors
2. Verify `audioContext.state === 'running'`
3. Check audio file exists
4. Test with headphones (phone speaker may be muted)

**Console Commands:**
```javascript
// Check AudioContext
console.log(audioContext.state);

// Manual resume
audioContext.resume();

// Check active sources
console.log(activeSources.size);
```

### Issue: PWA Not Installing
**Symptoms:** No "Install" option appears
**Causes:**
- Not served over HTTPS (local HTTP is OK for testing)
- Manifest.json not loading
- Service worker registration failed

**Debug:**
```javascript
// Check manifest
fetch('/manifest.json').then(r => r.json()).then(console.log);

// Check service worker
navigator.serviceWorker.getRegistrations().then(console.log);
```

### Issue: Metronome Not Clicking
**Symptoms:** Metronome starts but no sound
**Fix:**
1. Check metronome volume slider (should be > 0%)
2. Verify `metronomeClickBuffer` is generated
3. Check browser autoplay policy

**Console Commands:**
```javascript
// Check buffer
console.log(metronomeClickBuffer);

// Test manual click
playMetronomeClick();

// Check volume
console.log(document.getElementById('metronomeVolume').value);
```

### Issue: CSS Not Applied
**Symptoms:** Styling looks broken
**Cause:** CSS variables not supported
**Fix:** Use modern browser (Chrome 80+, Safari 14+, Firefox 75+)

## 🔧 Developer Tools

### Browser Console Commands
```javascript
// Toggle dark mode
document.body.classList.toggle('dark-mode');

// Get all instruments
document.querySelectorAll('.instrument-card');

// Stop all audio
activeSources.forEach(source => source.stop());
activeSources.clear();

// Reset trial
localStorage.removeItem('trialStartDate');
localStorage.removeItem('subscriptionActive');

// Force service worker update
navigator.serviceWorker.getRegistrations().then(regs => 
  regs.forEach(reg => reg.update())
);
```

### Check Loaded Resources
```javascript
// Check if audio files cached
caches.open('groove-v1').then(cache => 
  cache.keys().then(keys => console.log(keys.map(k => k.url)))
);

// Check audio buffers
console.log(audioBuffers);
console.log(audioBuffers.has('/Audio groove.mp3'));
```

## 📱 Flutter APK Debug (In Progress)

### Android SDK Issues
**Problem:** Android licenses not accepted
**Fix:**
```powershell
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-17.0.17.10-hotspot"
cd "C:\Android\sdk\cmdline-tools\latest\bin"
.\sdkmanager.bat --licenses
```
Type `y` for each license prompt (7 total)

### Flutter Doctor
```powershell
$env:PATH += ";C:\src\flutter\bin"
flutter doctor -v
```

Expected: All checkmarks except Android (in progress)

### Build Test APK
```powershell
cd "E:\Downloads\sec+\DevOps\My Projects\Loop App\groove\groove_flutter"
flutter build apk --debug
```

## 📊 Performance Monitoring

### Check Memory Usage
```javascript
// Check audio buffer memory
let totalBytes = 0;
audioBuffers.forEach(buffer => {
  totalBytes += buffer.length * buffer.numberOfChannels * 4; // 4 bytes per sample
});
console.log(`Audio buffers: ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);
```

### Monitor Active Audio
```javascript
// Log playing instruments
setInterval(() => {
  console.log(`Active sources: ${activeSources.size}`);
  console.log(`Cached buffers: ${audioBuffers.size}`);
}, 5000);
```

## 🚀 Next Steps

1. **Accept Android licenses** - Complete SDK setup
2. **Build Flutter UI** - Recreate interface in Dart
3. **Test on physical device** - Install APK
4. **Add more audio files** - Expand instrument library
5. **Implement upload** - Allow users to add custom loops

## 📞 Support

If issues persist:
1. Check browser console (F12)
2. Review this guide
3. Test on different browser
4. Clear cache and reload
5. Check network tab in DevTools

---
**Last Updated:** December 18, 2025
**Version:** PWA 1.0 | Flutter 0.1 (In Development)
