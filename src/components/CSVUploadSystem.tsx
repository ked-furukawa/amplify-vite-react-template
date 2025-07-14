import React, { useState, useRef } from 'react';
import { uploadData } from 'aws-amplify/storage';

// CSV Upload System styles
const csvUploadStyles = `
  .csv-upload-system {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    background-color: #f8f9fa;
    min-height: 100vh;
  }

  .header {
    text-align: center;
    margin-bottom: 30px;
    padding: 20px;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    color: white;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .header h1 {
    margin: 0;
    font-size: 2.5rem;
    font-weight: 700;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }

  .upload-container {
    background: white;
    border-radius: 10px;
    padding: 30px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin-bottom: 30px;
  }

  .upload-area {
    border: 2px dashed #d1d5db;
    border-radius: 10px;
    padding: 40px 20px;
    text-align: center;
    transition: all 0.3s ease;
    cursor: pointer;
    margin-bottom: 20px;
  }

  .upload-area:hover {
    border-color: #6366f1;
    background-color: #f8faff;
  }

  .upload-area.drag-over {
    border-color: #6366f1;
    background-color: #f0f4ff;
  }

  .upload-icon {
    font-size: 3rem;
    color: #9ca3af;
    margin-bottom: 1rem;
  }

  .upload-text {
    font-size: 1.2rem;
    color: #6b7280;
    margin-bottom: 0.5rem;
  }

  .upload-subtext {
    font-size: 0.9rem;
    color: #9ca3af;
  }

  .file-input {
    display: none;
  }

  .file-info {
    background: #f3f4f6;
    padding: 15px;
    border-radius: 8px;
    margin: 15px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .file-details {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .file-icon {
    font-size: 1.5rem;
    color: #059669;
  }

  .file-name {
    font-weight: 600;
    color: #374151;
  }

  .file-size {
    color: #6b7280;
    font-size: 0.9rem;
  }

  .remove-file {
    background: #ef4444;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.8rem;
    transition: background-color 0.2s;
  }

  .remove-file:hover {
    background: #dc2626;
  }

  .upload-section {
    border-top: 1px solid #e5e7eb;
    padding-top: 20px;
  }

  .data-type-selector {
    margin-bottom: 20px;
  }

  .data-type-selector label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #374151;
  }

  .data-type-select {
    width: 100%;
    padding: 12px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 1rem;
    background: white;
  }

  .data-type-select:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  .upload-controls {
    display: flex;
    gap: 15px;
    align-items: center;
  }

  .upload-btn {
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    color: white;
    border: none;
    padding: 12px 30px;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    flex: 1;
    max-width: 200px;
  }

  .upload-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
  }

  .upload-btn:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .progress-container {
    margin: 20px 0;
  }

  .progress-bar {
    width: 100%;
    height: 8px;
    background: #e5e7eb;
    border-radius: 4px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #6366f1, #8b5cf6);
    transition: width 0.3s ease;
  }

  .progress-text {
    text-align: center;
    margin-top: 8px;
    color: #6b7280;
    font-size: 0.9rem;
  }

  .status-container {
    background: white;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .status-item {
    display: flex;
    align-items: center;
    padding: 12px;
    margin: 8px 0;
    border-radius: 8px;
    font-size: 0.9rem;
  }

  .status-success {
    background: #d1fae5;
    color: #065f46;
    border-left: 4px solid #10b981;
  }

  .status-error {
    background: #fee2e2;
    color: #991b1b;
    border-left: 4px solid #ef4444;
  }

  .status-info {
    background: #dbeafe;
    color: #1e40af;
    border-left: 4px solid #3b82f6;
  }

  .status-icon {
    margin-right: 8px;
    font-size: 1.1rem;
  }

  .file-list {
    background: white;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-top: 20px;
  }

  .file-list h3 {
    margin-bottom: 15px;
    color: #374151;
    font-size: 1.2rem;
  }

  .file-history-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    border-bottom: 1px solid #e5e7eb;
    last-child: {
      border-bottom: none;
    }
  }

  .file-history-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .file-history-name {
    font-weight: 600;
    color: #374151;
  }

  .file-history-date {
    font-size: 0.8rem;
    color: #6b7280;
  }

  .file-history-status {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 600;
  }

  .status-uploaded {
    background: #d1fae5;
    color: #065f46;
  }

  .status-processing {
    background: #fef3c7;
    color: #92400e;
  }

  .status-failed {
    background: #fee2e2;
    color: #991b1b;
  }

  .data-preview {
    background: white;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-top: 20px;
  }

  .preview-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
  }

  .preview-table th,
  .preview-table td {
    padding: 8px 12px;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
  }

  .preview-table th {
    background: #f9fafb;
    font-weight: 600;
    color: #374151;
  }

  .preview-table td {
    color: #6b7280;
  }
`;

interface UploadStatus {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  timestamp: Date;
}

interface FileUpload {
  id: string;
  file: File;
  dataType: string;
  status: 'uploading' | 'uploaded' | 'error';
  progress: number;
  uploadDate: Date;
  error?: string;
}

interface CSVPreview {
  headers: string[];
  rows: string[][];
}

const CSVUploadSystem: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dataType, setDataType] = useState<string>('deliveryData');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadHistory, setUploadHistory] = useState<FileUpload[]>([]);
  const [statusMessages, setStatusMessages] = useState<UploadStatus[]>([]);
  const [csvPreview, setCsvPreview] = useState<CSVPreview | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dataTypeOptions = [
    { value: 'deliveryData', label: '納品データ (deliveryData.csv)' },
    { value: 'invoiceData', label: '請求書データ (invoiceData.csv)' },
    { value: 'accountsReceivable', label: '売掛管理データ (accountsReceivable.csv)' },
    { value: 'paymentData', label: '入金データ (paymentData.csv)' },
    { value: 'orderItems', label: '注文データ (orderItems.csv)' },
    { value: 'documentVerification', label: '書類照合データ (documentVerification.csv)' },
    { value: 'paymentSchedule', label: '支払予定データ (paymentSchedule.csv)' },
    { value: 'accountsPayable', label: '買掛管理データ (accountsPayable.csv)' }
  ];

  const addStatusMessage = (message: string, type: UploadStatus['type']) => {
    const newStatus: UploadStatus = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date()
    };
    setStatusMessages(prev => [newStatus, ...prev].slice(0, 10)); // Keep last 10 messages
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const csvFiles = Array.from(files).filter(file => 
      file.type === 'text/csv' || file.name.endsWith('.csv')
    );

    if (csvFiles.length === 0) {
      addStatusMessage('CSVファイルのみアップロード可能です', 'error');
      return;
    }

    if (csvFiles.some(file => file.size > 10 * 1024 * 1024)) { // 10MB limit
      addStatusMessage('ファイルサイズは10MB以下にしてください', 'error');
      return;
    }

    setSelectedFiles(csvFiles);
    addStatusMessage(`${csvFiles.length}個のCSVファイルが選択されました`, 'info');

    // Preview first file
    if (csvFiles.length > 0) {
      previewCSV(csvFiles[0]);
    }
  };

  const previewCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length > 0) {
        const headers = lines[0].split(',').map(h => h.trim());
        const rows = lines.slice(1, 6).map(line => 
          line.split(',').map(cell => cell.trim())
        ); // Show first 5 rows
        
        setCsvPreview({ headers, rows });
      }
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setCsvPreview(null);
    addStatusMessage('ファイルが削除されました', 'info');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const uploadToS3 = async () => {
    if (selectedFiles.length === 0) {
      addStatusMessage('アップロードするファイルを選択してください', 'error');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `${dataType}/${timestamp}-${file.name}`;

        addStatusMessage(`${file.name} をアップロード中...`, 'info');

        const result = await uploadData({
          key: fileName,
          data: file,
          options: {
            onProgress: ({ transferredBytes, totalBytes }) => {
              if (totalBytes) {
                const fileProgress = (transferredBytes / totalBytes) * 100;
                const totalProgress = ((i + fileProgress / 100) / selectedFiles.length) * 100;
                setUploadProgress(totalProgress);
              }
            }
          }
        }).result;

        // Add to upload history
        const newUpload: FileUpload = {
          id: Date.now().toString() + i,
          file,
          dataType,
          status: 'uploaded',
          progress: 100,
          uploadDate: new Date()
        };

        setUploadHistory(prev => [newUpload, ...prev]);
        addStatusMessage(`${file.name} が正常にアップロードされました`, 'success');
      }

      setSelectedFiles([]);
      setCsvPreview(null);
      setUploadProgress(100);
      addStatusMessage('すべてのファイルのアップロードが完了しました', 'success');

    } catch (error) {
      console.error('Upload error:', error);
      addStatusMessage(`アップロードエラー: ${error}`, 'error');
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 3000);
    }
  };

  const formatDateTime = (date: Date): string => {
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <style>{csvUploadStyles}</style>
      <div className="csv-upload-system">
        <div className="header">
          <h1>📊 CSV ファイル アップロード</h1>
          <p>S3バケットにCSVファイルをアップロードしてデータを管理します</p>
        </div>

        {/* Upload Container */}
        <div className="upload-container">
          <div 
            className={`upload-area ${isDragOver ? 'drag-over' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="upload-icon">📁</div>
            <div className="upload-text">
              ファイルをドラッグ&ドロップまたはクリックして選択
            </div>
            <div className="upload-subtext">
              CSV形式のファイルのみ対応（最大10MB）
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="file-input"
              multiple
              accept=".csv"
              onChange={(e) => handleFileSelect(e.target.files)}
            />
          </div>

          {/* Selected Files */}
          {selectedFiles.length > 0 && (
            <div>
              {selectedFiles.map((file, index) => (
                <div key={index} className="file-info">
                  <div className="file-details">
                    <span className="file-icon">📄</span>
                    <div>
                      <div className="file-name">{file.name}</div>
                      <div className="file-size">{formatFileSize(file.size)}</div>
                    </div>
                  </div>
                  <button 
                    className="remove-file"
                    onClick={() => removeFile(index)}
                  >
                    削除
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload Section */}
          <div className="upload-section">
            <div className="data-type-selector">
              <label htmlFor="dataType">データタイプを選択:</label>
              <select
                id="dataType"
                className="data-type-select"
                value={dataType}
                onChange={(e) => setDataType(e.target.value)}
              >
                {dataTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="upload-controls">
              <button
                className="upload-btn"
                onClick={uploadToS3}
                disabled={selectedFiles.length === 0 || isUploading}
              >
                {isUploading ? 'アップロード中...' : 'S3にアップロード'}
              </button>
            </div>

            {/* Progress Bar */}
            {isUploading && (
              <div className="progress-container">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <div className="progress-text">
                  {Math.round(uploadProgress)}% 完了
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CSV Preview */}
        {csvPreview && (
          <div className="data-preview">
            <h3>📋 データプレビュー（最初の5行）</h3>
            <table className="preview-table">
              <thead>
                <tr>
                  {csvPreview.headers.map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {csvPreview.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Status Messages */}
        {statusMessages.length > 0 && (
          <div className="status-container">
            <h3>📢 ステータス</h3>
            {statusMessages.map((status) => (
              <div key={status.id} className={`status-item status-${status.type}`}>
                <span className="status-icon">
                  {status.type === 'success' ? '✅' : 
                   status.type === 'error' ? '❌' : 'ℹ️'}
                </span>
                <div>
                  <div>{status.message}</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                    {formatDateTime(status.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload History */}
        {uploadHistory.length > 0 && (
          <div className="file-list">
            <h3>📂 アップロード履歴</h3>
            {uploadHistory.map((upload) => (
              <div key={upload.id} className="file-history-item">
                <div className="file-history-info">
                  <div className="file-history-name">{upload.file.name}</div>
                  <div className="file-history-date">
                    {formatDateTime(upload.uploadDate)} - {upload.dataType}
                  </div>
                </div>
                <span className={`file-history-status status-${upload.status}`}>
                  {upload.status === 'uploaded' ? 'アップロード済み' :
                   upload.status === 'uploading' ? 'アップロード中' : 'エラー'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CSVUploadSystem; 