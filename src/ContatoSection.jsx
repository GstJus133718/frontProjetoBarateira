import React from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Avatar,
} from "@mui/material";
import RoomIcon from "@mui/icons-material/Room";
import PhoneIcon from "@mui/icons-material/Phone";

const ContatoSection = () => {
  return (
    <Box sx={{ px: 4, py: 6 }}>
      <Typography variant="h5" align="center" fontWeight="bold" mb={4}>
        Entre em contato conosco
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        <Grid item>
          <Paper
            elevation={3}
            sx={{
              width: 600,
              height: 550,
              p: 4,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Typography variant="h5" color="#F15A2B" fontWeight="bold" display="flex" alignItems="center" justifyContent="center" marginBottom={5}>
              Onde ficamos?
            </Typography>

            <Stack direction="row" alignItems="center" spacing={2} width="300px" color="#1E4262">
              <Avatar sx={{ bgcolor: "#0C58A3", width: 80, height: 80 }}>
                <RoomIcon sx={{ color: "#fff" }} />
              </Avatar>
              <Box>
                <Typography fontWeight="bold" color="#1E4262">Endereço</Typography>
                <Typography variant="body2">Rua Exemplo, 123 - Cidade</Typography>
              </Box>
            </Stack>

            <Stack direction="row" alignItems="center" width="300px" spacing={2} color="#1E4262">
              <Avatar sx={{ bgcolor: "#0C58A3", width: 80, height: 80 }}>
                <PhoneIcon sx={{ color: "#fff" }} />
              </Avatar>
              <Box>
                <Typography fontWeight="bold">Fone</Typography>
                <Typography variant="body2">(99) 99999-9999</Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Formulário de Contato */}
        <Grid item>
          <Paper
            elevation={3}
            sx={{
              width: 600,
              height: 550,
              p: 4,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <Typography variant="h6" color="#F15A2B" fontWeight="bold" mb={1}>
              Contato
            </Typography>

            <TextField fullWidth label="Nome" variant="outlined" />
            <TextField fullWidth label="Telefone" variant="outlined" />
            <TextField fullWidth label="Email" variant="outlined" />
            <TextField
              fullWidth
              label="Mensagem"
              multiline
              rows={4}
              variant="outlined"
            />
            <Button
              variant="contained"
              sx={{ backgroundColor: "#0C58A3", mt: 2 }}
            >
              Enviar
            </Button>
          </Paper>
        </Grid>
        </Grid>

      {/* Mapa */}
      <Box mt={4} sx={{ display: "flex", justifyContent: "center" }}>
        <iframe
          title="Mapa"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.529076351507!2d-46.63955708542113!3d-23.58808446859344!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59d84df2e1f9%3A0x1c9c6bb3a5deae70!2sChurrascaria%20Chuleta%C3%A3o!5e0!3m2!1spt-BR!2sbr!4v1716331809326!5m2!1spt-BR!2sbr"
          width="100%"
          height="350"
          style={{ border: 0, borderRadius: "8px", maxWidth: "1235px" }}
          allowFullScreen=""
          loading="lazy"
          ></iframe>
      </Box>
    </Box>
  );
};

export default ContatoSection;
