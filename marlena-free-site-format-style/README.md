# Free static site for marlenaskrabak.com

This is a lightweight, Squarespace-free rebuild that matches the structure of your current site:
- **painting**: a simple, keyboard-accessible carousel fed by `data/painting.json`
- **photo**: a masonry grid of photo series fed by `data/photo_series.json`
- **contact**: email and bio + a Netlify-ready contact form

## How to use
1. Drop your images into the matching folders under `/images` and update the JSON in `/data` with filenames and titles.
2. Edit copy in the HTML files (home statement / bio) as you like.
3. Deploy for free:
   - **GitHub Pages**: push this folder to a repo and enable Pages (root).  
   - **Netlify**: drag-and-drop the folder into the Netlify dashboard. The contact form will work out of the box.
   - **Vercel**: import the repo, no build step needed.

## Notes
- No external JS frameworks. Pure HTML/CSS/JS for speed and longevity.
- Accessibility: skip link, semantic elements, keyboard arrows for the carousel.
- You can rename pages or tweak navigation without breaking anything.

