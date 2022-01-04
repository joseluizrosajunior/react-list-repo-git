import React, { useState, useCallback, useEffect } from "react";
import { FaBars, FaGithub, FaPlus, FaSpinner, FaTrash } from 'react-icons/fa'
import { Link } from "react-router-dom";
import api from "../../services/api";
import { Container, Form, SubmitButton, List, DeleteButton } from "./styles";
export default function Main() {

    const [newRepo, setNewRepo] = useState('');
    const [repositorios, setRepositorios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(false);


    useEffect(()=>{
        const repositoriesFromLocalstorage = localStorage.getItem('repositories');
        if (repositoriesFromLocalstorage) {
            setRepositorios(JSON.parse(repositoriesFromLocalstorage));
        }
    }, [])

    useEffect(()=>{
        localStorage.setItem('repositories', JSON.stringify(repositorios))
    }, [repositorios]);

    function handleInputChange(event) {
        setNewRepo(event.target.value);
        setAlert(false);
    }

    const handleSubmit = useCallback((event) => {
        setLoading(true);
        setAlert(false);
        event.preventDefault();
        async function submit() {
            try {
                if (!newRepo) {
                    throw new Error('Você precisa indicar um repositório');
                }
                const hasRepo = repositorios.find(repo => repo.name === newRepo);
                if (hasRepo) {
                    throw new Error('Repositório dulicado');
                }
                const response = await api.get(`repos/${newRepo}`);
                const data = {
                    name: response.data.full_name
                };
                setRepositorios([...repositorios, data]);
                setNewRepo('');
            } catch (error) {
                setAlert(true);
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
            <Form onSubmit={handleSubmit} error={alert}>
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
                        <Link to={`/repositorio/${encodeURIComponent(repo.name)}`}>
                            <FaBars size={20} />
                        </Link>
                    </li>
                ))}
            </List>
        </Container>
    )
}