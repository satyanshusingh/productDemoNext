import { Avatar, Box, Chip, Typography } from '@mui/material'
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined'

export default function AppHeader() {
  return (
    <Box className="topbar">
      <Box className="brand">
        <Avatar className="brand-mark">
          <CategoryOutlinedIcon fontSize="small" />
        </Avatar>
        <Typography className="brand-name">Product Inventory</Typography>
      </Box>
      <Chip label="PRODUCT CATALOG" size="small" className="topbar-tag" />
    </Box>
  )
}
