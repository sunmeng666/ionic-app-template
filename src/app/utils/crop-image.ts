import smartcrop from 'smartcrop';

export function cropImage(source, options = {width: 300, height: 300}): Promise<string> {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = source;
        img.onload = () => {
            smartcrop.crop(img, options)
                .then((result) => {
                    const crop = result.topCrop;
                    canvas.width = options.width;
                    canvas.height = options.height;
                    ctx.drawImage(img, crop.x, crop.y, crop.width, crop.height, 0, 0, canvas.width, canvas.height);
                    const croppedImg = canvas.toDataURL('image/jpeg', 0.85) as string;
                    resolve(croppedImg);
                });
        };
    });
}
