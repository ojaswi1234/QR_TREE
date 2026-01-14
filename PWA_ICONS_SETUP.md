# PWA Icon Setup Instructions

You need to create two icon images for your PWA:

## Required Icons:
1. **icon-192x192.png** - 192x192 pixels
2. **icon-512x512.png** - 512x512 pixels

## How to Create Icons:

### Option 1: Use an online tool
1. Go to https://www.pwabuilder.com/imageGenerator
2. Upload any tree logo/image (at least 512x512px)
3. Download the generated icons
4. Place them in the `public` folder

### Option 2: Use existing image
1. Find a tree logo/icon image
2. Resize it to 192x192px and 512x512px
3. Save as PNG format
4. Name them exactly: `icon-192x192.png` and `icon-512x512.png`
5. Place in the `public` folder

### Option 3: Use a placeholder
You can use any square image for now (even a screenshot), just resize it properly.

## File Location:
```
public/
  ├── icon-192x192.png   ← Place here
  └── icon-512x512.png   ← Place here
```

Without these icons, the PWA will still work, but won't have an app icon when installed on devices.
