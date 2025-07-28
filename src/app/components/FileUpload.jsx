"use client";
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/translations/translations';

const FileUpload = ({ label, name, onChange, error, required = true }) => {
  const { language } = useLanguage();
  const t = translations[language].registration;
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onChange(name, file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      onChange(name, file);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging ? 'border-teal-500 bg-teal-50' : 'border-gray-300 hover:border-gray-400'
        } ${error ? 'border-red-300' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          name={name}
          onChange={handleFileChange}
          accept=".jpg,.jpeg,.png,.pdf"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="mt-2 text-sm text-gray-600">
          {fileName || t.dragDrop}
        </p>
        <p className="text-xs text-gray-500 mt-1">{t.acceptedFormats}</p>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FileUpload;