import { useRef, useState, DragEvent, ChangeEvent } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Box, Paper, Typography, Snackbar } from '@mui/material';
import axios from 'axios';

const TextLoader = () => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (!file.name.endsWith('.epub')) {
      setError("Допустим только .epub файл");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:3000/api/text/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      setFileName(res.data.path);

      const downloadFile = async (filename: string) => {
        const link = document.createElement("a");
        link.href = `http://localhost:3000/api/text/${encodeURIComponent(filename)}/`;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
      };

      await downloadFile(file.name);
    } catch (err) {
      console.error(err);
      setError("Ошибка при загрузке файла");
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <input
        type="file"
        accept=".epub"
        ref={inputRef}
        onChange={handleInputChange}
        style={{ display: 'none' }}
      />

      <Paper
        elevation={dragActive ? 10 : 3}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        sx={{
          width: 300,
          height: 300,
          border: '2px dashed #0A84FF',
          borderRadius: 4,
          bgcolor: dragActive ? '#333' : '#222',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          textAlign: 'center',
          userSelect: 'none',
        }}
      >
        <CloudUploadIcon sx={{ fontSize: 60, color: '#0A84FF', mb: 2 }} />
        <Typography variant="body1" color="text.primary">
          Перетащи сюда .epub файл<br />или нажми, чтобы выбрать
        </Typography>
        {fileName && (
          <Typography variant="caption" color="text.secondary" mt={2}>
            Загружено: {fileName}
          </Typography>
        )}
      </Paper>

      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError("")}
        message={error}
      />
    </Box>
  );
};

export default TextLoader;
