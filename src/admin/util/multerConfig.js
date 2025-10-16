import multer from 'multer';

// Usar memoria en lugar de disco (necesario para servicios cloud como Render)
// Los archivos estarán disponibles en req.file.buffer
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml', 'image/png', 'image/gif'];
    
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no permitido. Solo se aceptan JPG, JPEG, WEBP, SVG, PNG y GIF.'), false);
    }
};

export const uploadEventImage = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});
