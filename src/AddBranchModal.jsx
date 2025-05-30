import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box
} from "@mui/material";

const AddBranchModal = ({ open, handleClose, adicionarFilial }) => {
    const [novaFilial, setNovaFilial] = useState({
        nome: "",
        endereco: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNovaFilial((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        adicionarFilial(novaFilial);
        setNovaFilial({ nome: "", endereco: "" });
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Adicionar Filial</DialogTitle>
            <DialogContent>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1}}>
                    <TextField
                        label="Nome"
                        name="nome"
                        value={novaFilial.nome}
                        onChange={handleChange}
                        sx={{width: "100%"}}
                    />
                    <TextField
                        label="Endereço"
                        name="endereco"
                        value={novaFilial.endereco}
                        onChange={handleChange}
                        sx={{width: "100%"}}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
                <Button onClick={handleSubmit} variant="contained">Adicionar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddBranchModal;
