import { useRef } from 'react';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';

export const ImageUpload = ({ children, onUpload, onUploadStart, onUploadEnd }) => {
  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onUploadStart?.();
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Upload failed');
      }

      const data = await response.json();
      // data.secure_url is the full path, data.public_id is the unique ID
      onUpload?.(data.secure_url);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      onUploadEnd?.();
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div onClick={handleClick} className="cursor-pointer inline-block">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      {children}
    </div>
  );
};

export const CloudinaryImage = ({ publicId, alt, className }) => {
  // If we receive a full URL instead of just a publicId, we shouldn't use AdvancedImage
  if (publicId?.startsWith('http')) {
    return <img src={publicId} alt={alt} className={className} />;
  }

  const cld = new Cloudinary({
    cloud: {
      cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    },
  });

  const img = cld.image(publicId);
  
  return (
    <AdvancedImage
      cldImg={img}
      alt={alt}
      className={className}
    />
  );
};