import React, { useState, useCallback } from "react";
import { FaBars, FaGithub, FaPlus, FaSpinner, FaTrash } from 'react-icons/fa'
import api from "../../services/api";
import { Container, Form, SubmitButton, List, DeleteButton } from "./styles";
export default function Main() {

    const [newRepo, setNewRepo] = useState('');
    const [repositorios, setRepositorios] = useState([]);
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

    const handleDelete = useCallback((repo) => {
        const find = repositorios.filter(r => r.name !== repo);
        setRepositorios(find);
    }, [repositorios]);

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

            <List>
                {repositorios.map(repo => (
                    <li key={repo.name}>
                        <DeleteButton onClick={() => handleDelete(repo.name)}>
                            <FaTrash size={14} />
                        </DeleteButton>
                        <span>{repo.name}</span>
                        <a href="#1">
                            <FaBars size={20} />
                        </a>
                    </li>
                ))}
            </List>
        </Container>
    )
}