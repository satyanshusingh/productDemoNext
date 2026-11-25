import { Avatar, Box, Paper, Typography } from '@mui/material'
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined'
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'
import WarehouseOutlinedIcon from '@mui/icons-material/WarehouseOutlined'
import { formatCurrency, formatNumber } from '../utils/formatters'

function SummaryCard({ icon, label, value, note, tone }) {
  return (
    <Paper className="summary-card" elevation={0}>
      <Avatar className={`summary-icon ${tone}`}>{icon}</Avatar>
      <Box minWidth={0}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography className="summary-value">{value}</Typography>
        <Typography variant="caption" color="text.secondary">
          {note}
        </Typography>
      </Box>
    </Paper>
  )
}

export default function ProductSummary({ productCount, totalQuantity, inventoryValue }) {
  return (
    <Box className="summary-grid">
      <SummaryCard
        icon={<CategoryOutlinedIcon fontSize="small" />}
        label="Total products"
        value={productCount}
        note="Unique items in your catalog"
        tone="lavender"
      />
      <SummaryCard
        icon={<WarehouseOutlinedIcon fontSize="small" />}
        label="Units in stock"
        value={formatNumber(totalQuantity)}
        note="Across all products"
        tone="mint"
      />
      <SummaryCard
        icon={<LocalOfferOutlinedIcon fontSize="small" />}
        label="Inventory value"
        value={formatCurrency(inventoryValue)}
        note="Based on current stock"
        tone="peach"
      />
    </Box>
  )
}
