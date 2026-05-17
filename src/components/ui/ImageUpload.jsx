import { useRef } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/config';

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
      // Create a unique filename with timestamp
      const fileName = `${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `posts/${fileName}`);

      // Upload file to Firebase Storage
      await uploadBytes(storageRef, file);

      // Get the public download URL
      const downloadURL = await getDownloadURL(storageRef);

      onUpload?.(downloadURL);
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
  // If we receive a full URL, just use it directly
  if (publicId?.startsWith('http')) {
    return <img src={publicId} alt={alt} className={className} />;
  }

  // Fallback for any non-URL publicId
  return <img src={publicId} alt={alt} className={className} />;
};

export default ImageUpload;