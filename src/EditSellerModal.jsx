import React, { useState, useEffect } from "react";
import {
  Box,
  Modal,
  Typography,
  TextField,
  Button,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 900,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
};

const EditSellerModal = ({ open, handleClose, vendedor, atualizarVendedor }) => {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [filial, setFilial] = useState("");
  const [status, setStatus] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [senha, setSenha] = useState("");
  const [comissao, setComissao] = useState("");
  const [perfil, setPerfil] = useState("");

  // Carregar dados do vendedor quando o modal abrir ou o vendedor mudar
  useEffect(() => {
    if (vendedor) {
      setNome(vendedor.nome || "");
      setCpf(vendedor.cpf || "");
      setFilial(vendedor.filial || "Norte");
      setStatus(vendedor.status || "Ativo");
      setSobrenome(vendedor.sobrenome || "");
      setSenha("");
      // Remover o " %" do final da string de comissão
      setComissao(vendedor.comissao ? vendedor.comissao.replace(" %", "") : "0");
      setPerfil(vendedor.perfil || "Vendedor");
    }
  }, [vendedor]);

  const handleSubmit = () => {
    if (!vendedor) return;

    // Criar objeto com os dados atualizados do vendedor
    const vendedorAtualizado = {
      ...vendedor,
      nome: nome,
      cpf: cpf,
      filial: filial,
      status: status,
      sobrenome: sobrenome,
      comissao: comissao + " %",
      perfil: perfil
    };

    // Se uma nova senha foi fornecida, atualize-a
    if (senha) {
      vendedorAtualizado.senha = senha;
    }

    // Chamar a função de atualizar vendedor passada como prop
    atualizarVendedor(vendedorAtualizado);
  };

  if (!vendedor) return null;

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Typography onClick={handleClose} sx={{ cursor: "pointer" }}>
            X
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          <Box sx={{ flex: 1, minWidth: 300 }}>
            <Typography>Nome:</Typography>
            <TextField
              fullWidth
              margin="dense"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              disabled
            />
            <Typography>CPF:</Typography>
            <TextField
              fullWidth
              margin="dense"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              disabled
            />
            <Typography>Filial:</Typography>
            <TextField
              select
              fullWidth
              margin="dense"
              value={filial}
              onChange={(e) => setFilial(e.target.value)}
            >
              <MenuItem value="Norte">Norte</MenuItem>
              <MenuItem value="Sul">Sul</MenuItem>
            </TextField>
            <Typography>Status</Typography>
            <Box>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={status === "Ativo"} 
                    onChange={() => setStatus("Ativo")}
                  />
                }
                label="Ativo"
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={status === "Inativo"} 
                    onChange={() => setStatus("Inativo")}
                  />
                }
                label="Inativo"
              />
            </Box>
          </Box>

          <Box sx={{ flex: 1, minWidth: 300 }}>
            <Typography>Sobrenome:</Typography>
            <TextField
              fullWidth
              margin="dense"
              value={sobrenome}
              onChange={(e) => setSobrenome(e.target.value)}
              disabled
            />
            <Typography>Senha:</Typography>
            <TextField 
              fullWidth 
              margin="dense"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite para alterar a senha"
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box>
                <Typography>Comissão:</Typography>
                <TextField
                  fullWidth
                  margin="dense"
                  sx={{ width: "11rem" }}
                  value={comissao}
                  onChange={(e) => setComissao(e.target.value)}
                  InputProps={{
                    endAdornment: "%"
                  }}
                />
              </Box>
              <Box>
                <Typography>Perfil:</Typography>
                <TextField
                  select
                  margin="dense"
                  fullWidth
                  sx={{ width: "12rem" }}
                  value={perfil}
                  onChange={(e) => setPerfil(e.target.value)}
                >
                  <MenuItem value="Vendedor">Vendedor</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                </TextField>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Button 
            variant="contained" 
            sx={{ px: 8, py: 1, background: "#0C58A3" }}
            onClick={handleSubmit}
          >
            Salvar Alterações
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditSellerModal;
