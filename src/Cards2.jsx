import React from "react";
import { Box, Card } from "@mui/material";

const cardData = [
  { image: "/logo/logo_2.png" },
  { image: "/logo/logo_2.png" },
];

const CardSection2 = () => {
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
            height: "450px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: 3,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Box
            component="img"
            src={item.image}
            alt={`Card image ${index}`}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Card>
      ))}
    </Box>
  );
};

export default CardSection2;
