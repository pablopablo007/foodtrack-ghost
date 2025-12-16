
import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
    onImageSelect: (file: File | null, preview: string | null) => void;
    currentImage?: string;
    label?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, currentImage, label = "Imagen del producto" }) => {
    const [preview, setPreview] = useState<string | null>(currentImage || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Por favor selecciona una imagen válida');
                return;
            }

            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                alert('La imagen no debe superar los 10MB');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const previewUrl = reader.result as string;
                setPreview(previewUrl);
                onImageSelect(file, previewUrl);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        onImageSelect(null, null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
                {label}
            </label>

            <div className="relative">
                {preview ? (
                    <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-slate-200 group">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                                type="button"
                                onClick={handleClick}
                                className="bg-white text-slate-700 px-4 py-2 rounded-lg font-bold hover:bg-slate-100 transition-colors flex items-center gap-2"
                            >
                                <Upload size={16} />
                                Cambiar
                            </button>
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition-colors flex items-center gap-2"
                            >
                                <X size={16} />
                                Quitar
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={handleClick}
                        className="w-full h-48 border-2 border-dashed border-slate-300 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all flex flex-col items-center justify-center gap-3 group"
                    >
                        <div className="w-16 h-16 rounded-full bg-slate-100 group-hover:bg-orange-100 flex items-center justify-center transition-colors">
                            <ImageIcon className="text-slate-400 group-hover:text-orange-600 transition-colors" size={32} />
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-slate-700 group-hover:text-orange-600 transition-colors">
                                Click para subir imagen
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                                PNG, JPG, GIF o WEBP (máx. 10MB)
                            </p>
                        </div>
                    </button>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>
        </div>
    );
};

export default ImageUpload;
