import React from "react";
import { Box, Card, CardContent, Typography, Stack, Avatar } from "@mui/material";

const cardData = [
  { image: "../public/icons/express_icon.svg", text: "Receba em até 2 horas com frete grátis!" },
  { image: "../public/icons/desconto_icon.png", text: "Descontos e benefícios em medicamentos." },
  { image: "../public/icons/cashback_icon.png", text: "Cashback de até 10% do total da compra." },
  { image: "../public/icons/pix_icon.svg", text: "Pague no PIX! Consulte as regras" },
  { image: "../public/icons/heart_icon.png", text: "Exames, testes, vacinas e muitos mais." },
];

const CardSection = () => {
  return (
    <Box
      sx={{
        display: "flex",
        margin: "0 auto",
        gap: "20px",
        padding: "20px 0",
      }}
    >
      {cardData.map((item, index) => (
        <Card
          key={index}
          sx={{
            width: "100%",
            padding: "2.5rem",
            display: "flex",
            alignItems: "center",
            boxShadow: 3,
            borderRadius: 2,
            background: "#D4D4D4",
          }}
        >
          <Stack direction="row" spacing={4} alignItems="center">
            <Avatar
              src={item.image}
              alt={item.text}
              sx={{ width: 40, height: 40 }}
              variant="square"
            />
            <Typography variant="body1" fontWeight="300" fontSize={14}>
              {item.text}
            </Typography>
          </Stack>
        </Card>
      ))}
    </Box>
  );
};

export default CardSection;
