import React, { useState, useEffect } from "react";
import {
    Box,
    Modal,
    Typography,
    TextField,
    Button,
    Radio,
    RadioGroup,
    FormControl,
    FormLabel,
    FormControlLabel
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

const EditCustomerModal = ({ open, handleClose, clienteSelecionado, atualizarCliente }) => {
    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [email, setEmail] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [status, setStatus] = useState("Ativo");

    useEffect(() => {
        if (clienteSelecionado) {
            setNome(clienteSelecionado.nome || "");
            setCpf(clienteSelecionado.cpf || "");
            setEmail(clienteSelecionado.email || "");
            setDataNascimento(clienteSelecionado.dataNascimento || "");
            setStatus(clienteSelecionado.status || "Ativo");
        }
    }, [clienteSelecionado]);

    const handleSubmit = () => {
        atualizarCliente({
            ...clienteSelecionado,
            dataNascimento,
            status
        });
        handleClose();
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Typography onClick={handleClose} sx={{ cursor: "pointer" }}>X</Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    <Box sx={{ flex: 1, minWidth: 300 }}>
                        <Typography sx={{ fontWeight: 300 }}>Nome:</Typography>
                        <TextField fullWidth margin="dense" value={nome} disabled />

                        <Typography sx={{ fontWeight: 300 }}>CPF / CNPJ:</Typography>
                        <TextField fullWidth margin="dense" value={cpf} disabled />

                        <Typography sx={{ fontWeight: 300 }}>Email:</Typography>
                        <TextField fullWidth margin="dense" value={email} disabled />

                        <Typography sx={{ fontWeight: 300 }}>Data de Nascimento:</Typography>
                        <TextField fullWidth margin="dense" type="date" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} InputLabelProps={{ shrink: true }} />

                        <FormControl component="fieldset" sx={{ mt: 1 }}>
                            <FormLabel component="legend" sx={{ fontWeight: 300 }}>Status</FormLabel>
                            <RadioGroup row value={status} onChange={(e) => setStatus(e.target.value)}>
                                <FormControlLabel value="Ativo" control={<Radio />} label="Ativo" />
                                <FormControlLabel value="Inativo" control={<Radio />} label="Inativo" />
                            </RadioGroup>
                        </FormControl>
                    </Box>
                </Box>
                <Box sx={{ mt: 4, textAlign: "center" }}>
                    <Button variant="contained" sx={{ px: 8, py: 1, background: "#0C58A3" }} onClick={handleSubmit}>
                        Salvar
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default EditCustomerModal;
