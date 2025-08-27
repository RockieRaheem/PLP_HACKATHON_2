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

  return (
    <div className="pdf-uploader">
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop your PDF here...</p>
        ) : (
          <p>Drag & drop a PDF file here, or click to select</p>
        )}
      </div>

      {isProcessing && <div className="processing">Processing PDF...</div>}

      <div className="uploaded-files">
        {uploadedFiles.map((file, index) => (
          <div key={index} className="file-card">
            <h3>{file.name}</h3>
            <p>{file.analysis}</p>
            <button onClick={() => startPdfChat(file)}>
              Ask Questions About This Document
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
