import React, { useState, useRef } from 'react';

const ResumeUpload = ({ onFileUpload, isUploading }) => {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const pdfFiles = files.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length > 0) {
      onFileUpload(pdfFiles[0]);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      onFileUpload(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="resume-upload">
      <div
        className={`upload-area ${dragOver ? 'drag-over' : ''} ${isUploading ? 'uploading' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileSelect}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept=".pdf"
          style={{ display: 'none' }}
        />
        
        <div className="upload-content">
          {isUploading ? (
            <>
              <div className="upload-spinner">🔄</div>
              <span className="upload-text">Analyzing resume...</span>
            </>
          ) : (
            <>
              <div className="upload-icon">📄</div>
              <span className="upload-text">
                Drop your resume here or <strong>click to upload</strong>
              </span>
              <span className="upload-subtitle">PDF files only</span>
            </>
          )}
        </div>
      </div>
      
      <div className="upload-tips">
        <div className="tip-item">
          <span className="tip-icon">💡</span>
          <span>I'll analyze your resume for ATS optimization</span>
        </div>
        <div className="tip-item">
          <span className="tip-icon">⚡</span>
          <span>Get instant feedback on improvements</span>
        </div>
        <div className="tip-item">
          <span className="tip-icon">🎯</span>
          <span>Receive tailored suggestions for your field</span>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;