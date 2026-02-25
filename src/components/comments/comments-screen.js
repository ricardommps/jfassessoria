'use client';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import { Avatar, Box, Divider, IconButton, Stack, TextField, Typography } from '@mui/material';
import { useRef, useState } from 'react';
import { fDate } from 'src/utils/format-time';

export default function CommentsScreen({ comments, onSend, onClose }) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const containerRef = useRef(null);

  if (!comments || comments.length === 0) return null;

  const handleSend = async () => {
    if (!message.trim() || isSending) return;

    setIsSending(true);
    try {
      await onSend(message.trim());
      setMessage('');
      containerRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Stack height="100vh">
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={1} px={2} py={1.5}>
        <IconButton onClick={onClose}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="subtitle1" fontWeight={600}>
          Comentários
        </Typography>
      </Stack>

      <Divider />

      {/* Lista de comentários */}
      <Box flex={1} overflow="auto" px={2} py={1}>
        <Stack spacing={2}>
          {comments.map((comment) => {
            const isAdmin = comment.isAdmin;

            return (
              <Stack
                key={comment.id}
                direction="row"
                justifyContent={isAdmin ? 'flex-start' : 'flex-end'}
                spacing={1.5}
              >
                {/* Avatar */}
                <Avatar
                  src={isAdmin ? '/assets/illustrations/logo_loading.png' : comment.author.avatar}
                  alt={isAdmin ? 'Joana Foltz' : comment.author.name}
                  sx={{ width: 40, height: 40 }}
                />

                {/* Balão */}
                <Box
                  sx={{
                    maxWidth: '75%',
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    backgroundColor: isAdmin ? '#3a3a3a' : '#1976d2',
                    color: '#fff',
                  }}
                >
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    {isAdmin ? 'Joana Foltz' : comment.author.name}
                  </Typography>

                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {comment.content}
                  </Typography>

                  <Typography variant="caption" sx={{ mt: 0.5, opacity: 0.6, display: 'block' }}>
                    {fDate(comment.createdAt, 'dd/MM • HH:mm')}
                  </Typography>
                </Box>
              </Stack>
            );
          })}
        </Stack>

        <div ref={containerRef} />
      </Box>

      <Divider />

      {/* Input */}
      <Stack direction="row" alignItems="center" spacing={1} p={1.5}>
        <TextField
          fullWidth
          placeholder="Adicione um comentário…"
          variant="standard"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          multiline
          maxRows={4}
        />
        <IconButton color="primary" onClick={handleSend} disabled={!message.trim() || isSending}>
          {isSending ? <Typography variant="body2">Enviando...</Typography> : <SendIcon />}
        </IconButton>
      </Stack>
    </Stack>
  );
}
