import { Alert, Snackbar } from '@mui/material'

export default function NotificationSnackbar({ notice, onClose }) {
  return (
    <Snackbar
      open={Boolean(notice.message)}
      autoHideDuration={4500}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={onClose} severity={notice.severity} variant="filled" sx={{ width: '100%' }}>
        {notice.message}
      </Alert>
    </Snackbar>
  )
}
