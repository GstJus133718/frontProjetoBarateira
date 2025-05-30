import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box
} from "@mui/material";

const EditBranchModal = ({ open, handleClose, filial, atualizarFilial }) => {
    const [filialEditada, setFilialEditada] = useState({});

    useEffect(() => {
        if (filial) {
            setFilialEditada(filial);
        }
    }, [filial]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilialEditada((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        atualizarFilial(filialEditada);
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Editar Filial</DialogTitle>
            <DialogContent>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                    <TextField
                        label="Nome"
                        name="nome"
                        value={filialEditada?.nome || ""}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Endereço"
                        name="endereco"
                        value={filialEditada?.endereco || ""}
                        onChange={handleChange}
                        fullWidth
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
                <Button onClick={handleSubmit} variant="contained">Salvar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditBranchModal;
