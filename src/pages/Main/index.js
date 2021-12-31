import React, { useState, useCallback } from "react";
import { FaGithub, FaPlus } from 'react-icons/fa'
import api from "../../services/api";
import { Container, Form, SubmitButton } from "./styles";
export default function Main() {

    const [newRepo, setNewRepo] = useState('');
    const [repositorios, setRepositorios] = useState('');

    function handleInputChange(event) {
        setNewRepo(event.target.value);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const response = await api.get(`repos/${newRepo}`);
        const data = {
            name: response.data.full_name
        };
        setRepositorios([...repositorios, data]);
        setNewRepo('');
    }

    return(
        <Container>
            <h1>
                <FaGithub size={25}/>
                Meus repositórios
            </h1>
            <Form onSubmit={handleSubmit}>
                <input type="text"
                    placeholder="Adicionar repositórios"
                    value={newRepo}
                    onChange={handleInputChange}/>
                <SubmitButton>
                    <FaPlus color="#fff" size={14} />
                </SubmitButton>
            </Form>
        </Container>
    )
}