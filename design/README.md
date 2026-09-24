# Social preview

portfolio-preview.html is the editable source for public/social/portfolio-preview.png.
Open it locally after npm ci to load the existing self-hosted fonts and project screenshots.
Render at a 1200 × 630 CSS-pixel viewport with device scale factor 1, after fonts and images have loaded. Export the viewport as PNG to public/social/portfolio-preview.png.

The PNG is checked in; the normal production build does not require a browser or image-generation dependency. index.html contains the absolute image URL, dimensions and social metadata.
After publishing changes, refresh https://leonazdajic.github.io/ in LinkedIn Post Inspector. If replacing the image later, use a new filename and update both image meta tags to avoid stale image caches.
