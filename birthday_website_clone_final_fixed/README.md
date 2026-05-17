# Birthday Surprise Website - Fixed Responsive Version

This is a **static HTML / CSS / JavaScript website** that can be hosted directly on **GitHub Pages**.

## Included files

- `index.html` – main page
- `style.css` – all styling and animations
- `script.js` – all page logic
- `data.js` – easiest file for editing text and image paths
- `assets/` – images + background music
- `.nojekyll` – helps GitHub Pages serve files exactly as-is

## Main fixes in this version

- Improved **second page** with more proper teddy-bear style characters
- Added **background music**
- Added **music toggle button**
- Better **Android / mobile responsive layout**
- Gift flow fixed properly:
  - after opening a gift, that gift is removed next time
  - gifts can be opened one by one
  - no duplicate screen opening bug
- Candle flame and blow animation still included

---

## How to change text

Open `data.js` and edit the values:

```js
passcode: "0307",
passcodeHint: "Hint: it's our favourite code",
passcodeTitle: "Enter your passcode",
birthdayName: "my love",
letterTitle: "Happy Birthday!",
letter: `Your custom message here`,
finalNote: `Your final note here`
```

---

## How to change images

Replace the images inside the `assets` folder.

Current image settings are:

```js
mainPhoto: "assets/main-photo.jpg",
letterPhoto: "assets/letter-photo.jpg",
gallery: [
  "assets/main-photo.jpg",
  "assets/letter-photo.jpg",
  "assets/main-photo.jpg"
]
```

If you use different filenames, update them in `data.js`.

---

## How to change music

Current music setting:

```js
musicFile: "assets/birthday-music.mp3",
musicVolume: 0.45,
```

To use your own music:

1. Put your music file inside `assets/`
2. Change the file name in `data.js`

Example:

```js
musicFile: "assets/my-song.mp3"
```

> Note: On Android/mobile browsers, autoplay may wait until the first user interaction. After a tap/click, the music starts.

---

## Gift page flow

There are 3 gifts total.

- 1st opened gift → cake / make-a-wish flow
- 2nd opened gift → letter page
- 3rd opened gift → final page

Already-opened gifts are hidden when the gift page appears again.

---

## How to run locally

### Option 1
Open `index.html` directly in a browser.

### Option 2
Use **VS Code Live Server**.

---

## How to host on GitHub Pages

1. Create a new GitHub repository
2. Upload all files from this folder
3. Open repository **Settings**
4. Open **Pages**
5. Under **Build and deployment**:
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/root**
6. Save
7. Wait for GitHub Pages to publish your site

---

## Recommended image size

- Main photo: around **800 × 1000 px**
- Letter photo: around **800 × 1000 px**
- Gallery images: similar sizes for best results

---

## Notes

- This project is frontend only, so no backend is required.
- All file paths are relative, so it is GitHub-hosting friendly.
- For best performance on Android, keep images optimized (not too large).
