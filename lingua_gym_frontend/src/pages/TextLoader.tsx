import { useRef, useState, DragEvent, ChangeEvent } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Box, Paper, Typography } from '@mui/material';

const TextLoader = () => {
  const [textContent, setTextContent] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = (file: File) => {
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = () => {
        setTextContent(reader.result as string);
      };
      reader.readAsText(file);
    } else {
      alert('Допустимы только текстовые файлы (.txt)');
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
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
    if (file) handleFile(file);
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
        accept=".txt"
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
          Перетащи сюда .txt файл<br />или нажми, чтобы выбрать
        </Typography>
      </Paper>
    </Box>
  );
};

export default TextLoader;
