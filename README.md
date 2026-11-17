# LOOPING - Screen Recorder & Video Splitter 🎬

A powerful, 100% offline, cross-platform Desktop Screen Recorder and Video Splitter for **Windows** and **Linux**.

---

## 🇱🇰 සිංහලෙන් විස්තරය (Overview in Sinhala)

මෙම මෘදුකාංගය **Windows** සහ **Linux** පරිගණක සඳහා ස්වාධීනව (`.exe` හෝ Linux package ලෙස) install කර offline භාවිතා කළ හැකි පරිදි සම්පූර්ණයෙන්ම සකසා ඇත. කිසිදු command line (cmd) එකක් run කිරීමට අවශ්‍ය නොවේ!

### ප්‍රධාන පහසුකම් (Features):
1. **Full Screen Record**: ඔබේ මොනිටරයේ සම්පූර්ණ තිරයම පටිගත කිරීමේ හැකියාව.
2. **Select Area / Region Record**: තිරයේ ඔබට අවශ්‍ය කොටස පමණක් drag කර select කර නිශ්චිත ප්‍රමාණය (Custom Area) පටිගත කිරීම. Pixel-accurate canvas cropping සහ interactive resize/drag handles සහිතයි.
3. **Sound Options (ශබ්ද විකල්ප)**:
   - 🔇 **No Sound (ශබ්ද රහිතව)**: වීඩියෝව පමණි.
   - 🎤 **Microphone Only**: ඔබේ කටහඬ පමණක් පටිගත කිරීම (Microphone Device තෝරාගත හැක, Live Level VU Meter සහිතයි).
   - 🔊 **System Audio**: පරිගණකයේ වාදනය වන ශබ්ද (YouTube, Games, Songs).
   - 🎙️+🔊 **Both (දෙකම එකට)**: මයික්‍රෆෝනය සහ පරිගණක ශබ්දය දෙකම එකට mix කර පටිගත කිරීම.
4. **Built-in Video Splitter (වීඩියෝ කපන පහසුකම)**:
   - පටිගත කිරීම අවසන් වූ සැනින් වීඩියෝව standard format එකකට finalize වී Video Splitter වෙත ගෙන යා හැක.
   - **Mode 1 (Cut Markers)**: වීඩියෝවේ කැමති තැන් වලට Markers තබා එකවර කොටස් කිහිපයකට (Part 1, Part 2, Part 3) කපා වෙන් කිරීම (Lossless FFmpeg - තත්පර ගණනකින් කිසිදු quality අඩුවීමකින් තොරව සිදුවේ).
   - **Mode 2 (Trim Start & End)**: වීඩියෝවේ මුල සහ අග ලකුණු කර අවශ්‍ය කොටස පමණක් කපාගැනීම.
   - **Mode 3 (Equal Parts)**: වීඩියෝව සමාන කොටස් වලට (උදා: 2, 3, 5) එකවර බෙදීම.
   - පරිගණකයේ ඇති ඕනෑම වීඩියෝවක් (`.mp4`, `.webm`, `.mkv`, etc.) ඇතුළත් කර Split කිරීමේ හැකියාව.
5. **Mini Floating Pill Bar & Hotkeys**:
   - රෙකෝඩ් වන විට ප්‍රධාන කවුළුව කුඩා වී කුඩා Floating Bar එකක් තිරය මත පෙන්වයි.
   - **F9**: Record ආරම්භ කිරීම / අවසන් කිරීම (Global Shortcut).
   - **F10**: Record Pause / Resume කිරීම.
6. **Language Toggle**: English සහ සිංහල අතර මාරු වීමේ හැකියාව.

---

## 📦 Installable Executables (භාවිතා කිරීමට සූදානම් ගොනු)

ගොනු පිහිටා ඇත්තේ `d:\Projects\screen recorder\release\` ෆෝල්ඩරයේ ය:

1. **Windows Installer (.exe)**:
   - ගොනුව: `release\LOOPING Setup 1.0.0.exe`
   - සාමාන්‍ය මෘදුකාංගයක් මෙන් double-click කර Desktop Shortcut සහිතව Install කරගත හැක.

2. **Windows Portable (.exe)**:
   - ගොනුව: `release\LOOPING 1.0.0.exe`
   - Install කිරීමටවත් අවශ්‍ය නැත. Double-click කර ඕනෑම තැනක සිට කෙලින්ම Run කළ හැක.

3. **Linux Package**:
   - ගොනුව: `release\looping-1.0.0.tar.gz` (සහ `release\linux-unpacked\looping`)
   - Extract කර `./looping` ධාවනය කරන්න.
