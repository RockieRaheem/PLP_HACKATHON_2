import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { httpsCallable } from "firebase/functions";
import { storage, functions } from "../../firebase";

const PdfUploader = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const processPdf = httpsCallable(functions, "processPdfDocument");

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file || file.type !== "application/pdf") {
      alert("Please upload a PDF file");
      return;
    }

    setIsProcessing(true);

    try {
      // Upload to Firebase Storage
      const storageRef = ref(storage, `pdfs/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Process PDF content
      const result = await processPdf({ fileUrl: downloadURL });

      setUploadedFiles((prev) => [
        ...prev,
        {
          name: file.name,
          url: downloadURL,
          content: result.data.extractedText,
          analysis: result.data.analysis,
        },
      ]);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to process PDF");
    }

    setIsProcessing(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  });

  const startPdfChat = (file) => {
    // You can implement navigation to chat with specific PDF context
    console.log("Starting chat with PDF:", file.name);
    // This could set context for the chat interface
  };

  return (
    <div className="pdf-uploader">
      <h3>📄 Upload Your Study Materials</h3>
      <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>📎 Drop your PDF here...</p>
        ) : (
          <div className="dropzone-content">
            <p>📁 Drag & drop a PDF file here, or click to select</p>
            <small>Supported: PDF files up to 10MB</small>
          </div>
        )}
      </div>

      {isProcessing && (
        <div className="processing">
          <div className="spinner"></div>
          <p>Processing PDF... This may take a moment</p>
        </div>
      )}

      <div className="uploaded-files">
        {uploadedFiles.map((file, index) => (
          <div key={index} className="file-card">
            <div className="file-info">
              <h4>📄 {file.name}</h4>
              <p className="file-analysis">{file.analysis}</p>
            </div>
            <button 
              onClick={() => startPdfChat(file)}
              className="chat-btn"
            >
              💬 Ask Questions About This Document
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PdfUploader;
