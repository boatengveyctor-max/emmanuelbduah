# Add gallery images here

1. Copy your image into this folder. Use `.jpg`, `.jpeg`, `.png`, or `.webp` and a simple filename, for example `my-second-design.png`.
2. Open `script.js` and find `const customDesigns = [` in the Filterable Graphic Design Gallery section.
3. Paste a copy of the commented example object inside the square brackets, before the closing `];`.
4. Separate entries with a comma. For example, put a comma after the closing `}` of the previous image entry. Do not paste the JavaScript code fence or paste the object outside the array.
5. Change `src`, `title`, `subtitle`, `category`, and `alt` to match your image.

Valid categories are `flyers`, `branding`, and `digital-art`. Image paths must start with `img/designs/`. The gallery builds cards safely, updates filter counts, and opens each image in the existing lightbox.
