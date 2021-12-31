import React, { useState, useCallback } from "react";
import { FaGithub, FaPlus, FaSpinner } from 'react-icons/fa'
import api from "../../services/api";
import { Container, Form, SubmitButton } from "./styles";
export default function Main() {

    const [newRepo, setNewRepo] = useState('');
    const [repositorios, setRepositorios] = useState('');
    const [loading, setLoading] = useState(false);

    function handleInputChange(event) {
        setNewRepo(event.target.value);
    }

    const handleSubmit = useCallback((event) => {
        setLoading(true);
        event.preventDefault();
        async function submit() {
            try {
                const response = await api.get(`repos/${newRepo}`);
                const data = {
                    name: response.data.full_name
                };
                setRepositorios([...repositorios, data]);
                setNewRepo('');
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        submit();
        
    }, [newRepo, repositorios]);

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
                <SubmitButton loading={loading ? 1 : 0}>
                    {loading ? (
                        <FaSpinner color="#fff" size={14} />
                    ) : (
                        <FaPlus color="#fff" size={14} />
                    )}
                </SubmitButton>
            </Form>
        </Container>
    )
}