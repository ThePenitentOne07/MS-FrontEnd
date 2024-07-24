import React from "react";
import { Card, CardContent, Typography, Chip, colors } from "@mui/material";
import { useNavigate } from "react-router-dom";

const OrderCard = ({ order }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/orderstatus/${order.id}`);
  };

  const statusMapping = {
    PAID: { label: "Đang xác nhận", color: "#4caf50" }, // Green
    PRE_ORDERED: { label: "Đã đặt trước", color: "#1DE5E2" },
    IN_DELIVERY: { label: "Đang giao", color: "#2196f3" }, // Blue
    PREORDERED_ORDER_IN_DELIVERY: {
      label: "Đơn đặt trước đang giao",
      color: "#4894B2",
    },
    CANNOT_DELIVER: { label: "Tạm hoãn", color: "#f44336" }, // Red
    COMPLETE_EXCHANGE: { label: "đã giao", color: "#4caf50" },
    CANNOT_CONFRIRM: { label: "Chưa chấp nhận", color: "#f44336" },
  };

  const status = statusMapping[order.orderStatus];

  return (
    <Card
      onClick={handleCardClick}
      sx={{ mb: 2, cursor: "pointer", border: "2px solid #cb8bcd" }}
    >
      <CardContent>
        <Typography>Mã đơn hàng: {order.id}</Typography>
        <Typography>Tổng cộng: {order.totalPrice}</Typography>
        <Typography
          component="div"
          style={{ display: "flex", alignItems: "center", gap: "10px" }}
        >
          Tình trạng:
          <Chip
            label={status.label}
            style={{
              backgroundColor: status.color,
              color: "white",
            }}
          />
        </Typography>
        <Typography>Ngày đặt: {order.orderDate}</Typography>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
