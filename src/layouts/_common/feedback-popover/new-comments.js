'use client';

import CommentIcon from '@mui/icons-material/Comment';
import { IconButton, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import { enqueueSnackbar } from 'notistack';
import { CommentsDialog } from 'src/components/comments';
import { useBoolean } from 'src/hooks/use-boolean';
import { useComments } from 'src/hooks/use-commnts';

export default function NewComments({ comments, finishedId, refetchNewComments }) {
  const theme = useTheme();
  const commentsShow = useBoolean();
  const { mutate: sendComment, isLoading } = useComments({
    invalidateQueries: ['history'], // ou qualquer query que precise atualizar
    onSuccess: () => commentsShow.onFalse(), // fecha o modal
  });

  if (!comments || comments.length === 0) return null;

  // Pega o último comentário
  const lastComment = comments[comments.length - 1];

  const handleSendComment = (message) => {
    if (!message.trim()) return;

    const payload = {
      finishedId,
      content: message.trim(),
      parentId: lastComment ? lastComment.id : null,
      authorUserId: lastComment?.author?.id ?? null, // 👈 AQUI
    };
    // {
    //   "finishedId": 123,
    //   "content": "Consegui completar!",
    //   "authorUserId": 10  // Admin cria comentário como se fosse o aluno 10
    // }
    sendComment(payload);
    commentsShow.onFalse(); // fecha o modal
    refetchNewComments(); // 🔄 recarrega newComments
    enqueueSnackbar('Comentário enviado com sucesso!', {
      autoHideDuration: 8000,
      variant: 'success',
    });
  };

  return (
    <>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          p: 1.5,
          alignItems: 'flex-start',
          borderBottom: `dashed 1px ${theme.palette.divider}`,
        }}
      >
        {/* Avatar */}
        <Avatar
          src={lastComment.author.avatar}
          alt={lastComment.author.name}
          sx={{ width: 40, height: 40 }}
        />

        {/* Conteúdo */}
        <Stack spacing={0.5} flexGrow={1}>
          {/* Nome */}
          {reader(lastComment.author.name)}

          {/* Email */}
          <Typography variant="caption" color="text.disabled">
            {lastComment.author.email}
          </Typography>

          {/* Data + Ícone de Comentário */}
          <Stack direction="row" alignItems="center" spacing={1} pt={0.5}>
            <Typography variant="subtitle2" color="info.main">
              {dayjs(lastComment.createdAt).format('DD/MM/YYYY')}
            </Typography>

            <IconButton
              aria-label="comments"
              sx={{ p: 0 }}
              color="inherit"
              onClick={commentsShow.onTrue}
            >
              <CommentIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
      </Stack>

      {commentsShow.value && (
        <CommentsDialog
          open={commentsShow.value}
          onClose={() => {
            commentsShow.onFalse(); // fecha o modal
            refetchNewComments(); // 🔄 recarrega newComments
          }}
          comments={comments}
          onSend={handleSendComment}
          isLoading={isLoading} // opcional para desabilitar botão durante envio
        />
      )}
    </>
  );
}

function reader(data) {
  return (
    <Box
      dangerouslySetInnerHTML={{ __html: data }}
      sx={{
        '& p': { typography: 'body2', m: 0 },
        '& a': { color: 'inherit', textDecoration: 'none' },
        '& strong': { typography: 'subtitle2' },
      }}
    />
  );
}
