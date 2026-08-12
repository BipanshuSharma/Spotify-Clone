const { ImageKit } = require('@imagekit/nodejs');

function getImageKitClient() {
   const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
   if (!privateKey) {
      throw new Error('Missing IMAGEKIT_PRIVATE_KEY environment variable');
   }
   return new ImageKit({ privateKey });
}

async function uploadFile(file) {
   const client = getImageKitClient();
   const result = await client.files.upload({
      file,
      fileName: 'music_' + Date.now(),
      folder: 'yt-complete-backend/music'
   });
   return result;
}

module.exports = { uploadFile };