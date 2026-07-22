const Jimp = require('jimp');

async function processIcon() {
    try {
        console.log('Loading image...');
        const image = await Jimp.read('public/site-icon.png');
        
        // Resize image if it's too large (5.3MB is huge for a favicon)
        const size = Math.min(image.bitmap.width, image.bitmap.height);
        
        // Crop to square from center
        const x = (image.bitmap.width - size) / 2;
        const y = (image.bitmap.height - size) / 2;
        image.crop(x, y, size, size);
        
        // Resize to 512x512
        image.resize(512, 512);
        
        // Create a circular mask (everything outside circle becomes transparent)
        console.log('Applying circular mask...');
        image.circle();
        
        // Save it as favicon.png
        await image.writeAsync('public/favicon.png');
        console.log('Success! Saved as public/favicon.png');
    } catch (e) {
        console.error('Error processing image:', e);
    }
}

processIcon();
