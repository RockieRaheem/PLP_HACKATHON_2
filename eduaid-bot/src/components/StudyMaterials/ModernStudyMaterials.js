import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import "./ModernStudyMaterials.css";

const ModernStudyMaterials = ({ userId }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid, list
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Load saved files from localStorage on component mount
  useEffect(() => {
    if (!userId) return;

    const storageKey = `uploadedFiles_${userId}`;
    try {
      const savedFiles = localStorage.getItem(storageKey);
      if (savedFiles) {
        const parsedFiles = JSON.parse(savedFiles);
        setUploadedFiles(parsedFiles);
        console.log(`Loaded ${parsedFiles.length} files for user ${userId}`);
      }
    } catch (error) {
      console.error("Error loading files from localStorage:", error);
    } finally {
      setDataLoaded(true);
    }
  }, [userId]);

  // Save files to localStorage whenever uploadedFiles changes (but only after initial load)
  useEffect(() => {
    if (!dataLoaded || !userId) return;

    const storageKey = `uploadedFiles_${userId}`;
    try {
      localStorage.setItem(storageKey, JSON.stringify(uploadedFiles));
      console.log(`Saved ${uploadedFiles.length} files for user ${userId}`);
    } catch (error) {
      console.error("Error saving files to localStorage:", error);
    }
  }, [uploadedFiles, dataLoaded, userId]);

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const fileType = getFileType(file.type);
    if (!fileType) {
      alert("Please upload a supported file (PDF, DOC, DOCX, TXT, or images)");
      return;
    }

    setIsProcessing(true);

    try {
      // Create local file URL for preview
      const fileUrl = URL.createObjectURL(file);

      let processedContent = "";
      let analysis = "";

      // Process file based on type (simplified local processing)
      if (fileType === "pdf") {
        processedContent = "PDF content will be processed locally";
        analysis = "This is a PDF document that contains study material.";
      } else if (fileType === "txt") {
        // For text files, we can actually read the content
        const text = await file.text();
        processedContent = text;
        analysis = `Text document with ${text.length} characters. Contains study notes and material.`;
      } else if (fileType === "image") {
        processedContent = "Image content detected";
        analysis =
          "This is an image file that may contain diagrams, charts, or text.";
      } else {
        processedContent = "Document content will be processed";
        analysis = "This document contains study material for review.";
      }

      const newFile = {
        id: Date.now(),
        name: file.name,
        url: fileUrl, // Using local URL instead of Firebase URL
        type: fileType,
        size: file.size,
        uploadDate: new Date().toISOString(),
        content: processedContent,
        analysis: analysis,
        category: detectCategory(file.name),
        tags: generateTags(file.name),
        progress: 0,
        notes: "",
        isStarred: false,
      };

      setUploadedFiles((prev) => [newFile, ...prev]);
      setShowUploadModal(false);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to process file. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "text/plain": [".txt"],
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    multiple: false,
  });

  const getFileType = (mimeType) => {
    if (mimeType === "application/pdf") return "pdf";
    if (mimeType.includes("word")) return "doc";
    if (mimeType === "text/plain") return "txt";
    if (mimeType.startsWith("image/")) return "image";
    return null;
  };

  const detectCategory = (fileName) => {
    const name = fileName.toLowerCase();
    if (
      name.includes("math") ||
      name.includes("algebra") ||
      name.includes("calculus")
    )
      return "Mathematics";
    if (
      name.includes("science") ||
      name.includes("physics") ||
      name.includes("chemistry") ||
      name.includes("biology")
    )
      return "Sciences";
    if (
      name.includes("english") ||
      name.includes("literature") ||
      name.includes("essay")
    )
      return "Languages";
    if (
      name.includes("history") ||
      name.includes("geography") ||
      name.includes("social")
    )
      return "Social Studies";
    if (name.includes("exam") || name.includes("test") || name.includes("quiz"))
      return "Exams";
    return "General";
  };

  const generateTags = (fileName) => {
    const tags = [];
    const name = fileName.toLowerCase();

    // Subject tags
    if (name.includes("kcse")) tags.push("KCSE");
    if (name.includes("waec")) tags.push("WAEC");
    if (name.includes("form")) tags.push("Secondary");
    if (name.includes("university")) tags.push("University");

    // Content type tags
    if (name.includes("note")) tags.push("Notes");
    if (name.includes("past") || name.includes("paper"))
      tags.push("Past Papers");
    if (name.includes("summary")) tags.push("Summary");

    return tags;
  };

  const filteredFiles = uploadedFiles.filter((file) => {
    const matchesCategory =
      filterCategory === "all" || file.category === filterCategory;
    const matchesSearch =
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (type) => {
    switch (type) {
      case "pdf":
        return "📄";
      case "doc":
        return "📝";
      case "txt":
        return "📋";
      case "image":
        return "🖼️";
      default:
        return "📁";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Mathematics":
        return "🧮";
      case "Sciences":
        return "🔬";
      case "Languages":
        return "📚";
      case "Social Studies":
        return "🌍";
      case "Exams":
        return "📊";
      default:
        return "📖";
    }
  };

  const toggleStar = (fileId) => {
    setUploadedFiles((prev) =>
      prev.map((file) =>
        file.id === fileId ? { ...file, isStarred: !file.isStarred } : file
      )
    );
  };

  const deleteFile = (fileId) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
    }
  };

  const categories = [
    "All Files",
    "Mathematics",
    "Sciences",
    "Languages",
    "Social Studies",
    "Exams",
    "General",
  ];

  return (
    <div className="modern-study-materials">
      {/* Header */}
      <div className="materials-header">
        <div className="header-content">
          <div className="header-main">
            <div className="page-title">
              <div className="title-icon">📚</div>
              <div>
                <h1>Study Materials</h1>
                <p>Organize, analyze, and access your educational resources</p>
              </div>
            </div>
            <div className="header-actions">
              <button
                className="upload-btn primary"
                onClick={() => setShowUploadModal(true)}
              >
                <span className="btn-icon">📤</span>
                Upload Materials
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="materials-controls">
        <div className="controls-left">
          <div className="search-container">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                id="search-input"
                type="text"
                placeholder="Search materials, tags, or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="category-filter">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="category-select"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all"
                    ? "All Categories"
                    : `${getCategoryIcon(category)} ${category}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="controls-right">
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              ⊞
            </button>
            <button
              className={`view-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
            >
              ☰
            </button>
          </div>
          <div className="materials-count">
            {filteredFiles.length} materials
          </div>
        </div>
      </div>

      {/* Materials Grid/List */}
      <div className="materials-content">
        {filteredFiles.length === 0 ? (
          <div className="empty-state">
            {uploadedFiles.length === 0 ? (
              <>
                <div className="empty-icon">📚</div>
                <h3>No study materials yet</h3>
                <p>
                  Upload your first document to get started with AI-powered
                  study assistance
                </p>
                <button
                  className="upload-btn primary"
                  onClick={() => setShowUploadModal(true)}
                >
                  <span className="btn-icon">📤</span>
                  Upload Your First Material
                </button>
              </>
            ) : (
              <>
                <div className="empty-icon">🔍</div>
                <h3>No materials found</h3>
                <p>Try adjusting your search or filter criteria</p>
                <button
                  className="clear-filters-btn"
                  onClick={() => {
                    setSearchQuery("");
                    setFilterCategory("all");
                  }}
                >
                  Clear Filters
                </button>
              </>
            )}
          </div>
        ) : (
          <div className={`materials-${viewMode}`}>
            {filteredFiles.map((file) => (
              <div key={file.id} className="material-card">
                <div className="card-header">
                  <div className="file-info">
                    <div className="file-icon">{getFileIcon(file.type)}</div>
                    <div className="file-details">
                      <h4 className="file-name">{file.name}</h4>
                      <div className="file-meta">
                        <span className="file-size">
                          {formatFileSize(file.size)}
                        </span>
                        <span className="file-date">
                          {new Date(file.uploadDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="card-actions">
                    <button
                      className={`action-btn star-btn ${
                        file.isStarred ? "starred" : ""
                      }`}
                      onClick={() => toggleStar(file.id)}
                    >
                      {file.isStarred ? "⭐" : "☆"}
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => deleteFile(file.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="card-content">
                  <div className="category-tag">
                    {getCategoryIcon(file.category)} {file.category}
                  </div>

                  {file.tags.length > 0 && (
                    <div className="tags-container">
                      {file.tags.map((tag, index) => (
                        <span key={index} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {file.analysis && (
                    <div className="analysis-preview">
                      <h5>AI Analysis Preview</h5>
                      <p>{file.analysis.substring(0, 120)}...</p>
                    </div>
                  )}
                </div>

                <div className="card-footer">
                  <button
                    className="action-btn secondary"
                    onClick={() => setSelectedFile(file)}
                  >
                    <span className="btn-icon">👁️</span>
                    View Details
                  </button>
                  <button
                    className="action-btn primary"
                    onClick={() => window.open(file.url, "_blank")}
                  >
                    <span className="btn-icon">📖</span>
                    Open File
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div
          className="upload-modal-overlay"
          onClick={() => setShowUploadModal(false)}
        >
          <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Upload Study Materials</h3>
              <button
                className="close-btn"
                onClick={() => setShowUploadModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-content">
              <div
                {...getRootProps()}
                className={`dropzone ${isDragActive ? "drag-active" : ""}`}
              >
                <input {...getInputProps()} />
                <div className="dropzone-content">
                  <div className="upload-icon">📁</div>
                  <h4>
                    {isDragActive
                      ? "Drop your files here"
                      : "Drag & drop your files here"}
                  </h4>
                  <p>or click to browse files</p>
                  <div className="supported-formats">
                    <span>Supported: PDF, DOC, DOCX, TXT, Images</span>
                  </div>
                </div>
              </div>

              {isProcessing && (
                <div className="processing-status">
                  <div className="spinner"></div>
                  <span>Processing your file...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* File Details Modal */}
      {selectedFile && (
        <div
          className="file-modal-overlay"
          onClick={() => setSelectedFile(null)}
        >
          <div className="file-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedFile.name}</h3>
              <button
                className="close-btn"
                onClick={() => setSelectedFile(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-content">
              <div className="file-details-grid">
                <div className="detail-item">
                  <span className="label">Category:</span>
                  <span className="value">
                    {getCategoryIcon(selectedFile.category)}{" "}
                    {selectedFile.category}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Size:</span>
                  <span className="value">
                    {formatFileSize(selectedFile.size)}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Upload Date:</span>
                  <span className="value">
                    {new Date(selectedFile.uploadDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Type:</span>
                  <span className="value">
                    {getFileIcon(selectedFile.type)}{" "}
                    {selectedFile.type.toUpperCase()}
                  </span>
                </div>
              </div>

              {selectedFile.tags.length > 0 && (
                <div className="tags-section">
                  <h4>Tags</h4>
                  <div className="tags-container">
                    {selectedFile.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedFile.analysis && (
                <div className="analysis-section">
                  <h4>AI Analysis</h4>
                  <div className="analysis-content">
                    {selectedFile.analysis}
                  </div>
                </div>
              )}

              <div className="modal-actions">
                <button
                  className="action-btn secondary"
                  onClick={() => setSelectedFile(null)}
                >
                  Close
                </button>
                <button
                  className="action-btn primary"
                  onClick={() => window.open(selectedFile.url, "_blank")}
                >
                  <span className="btn-icon">📖</span>
                  Open File
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernStudyMaterials;
