import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'

export default function DeleteProductDialog({ product, deleting, onClose, onConfirm }) {
  return (
    <Dialog
      open={Boolean(product)}
      onClose={deleting ? undefined : onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>Delete product?</DialogTitle>
      <DialogContent>
        <Typography color="text.secondary">
          This will permanently remove <strong>{product?.name}</strong> from your catalog.
        </Typography>
      </DialogContent>
      <DialogActions className="dialog-actions">
        <Button onClick={onClose} color="inherit" disabled={deleting}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={deleting}
          startIcon={
            deleting ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <DeleteOutlineRoundedIcon />
            )
          }
        >
          {deleting ? 'Deleting…' : 'Delete product'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
