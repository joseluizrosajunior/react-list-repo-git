import React, { useEffect } from "react";
import { useState } from "react/cjs/react.development";
import api from "../../services/api";
import { BackButton, Container, IssuesList, Loading, Owner, PageActions } from "./styles";
import {FaArrowLeft} from 'react-icons/fa';

export default function Repositorio({match}) {

    const [repositorio, setRepositorio] = useState({});
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    function handlePage(action) {
        setPage(action==='back' ? page - 1 : page + 1);
    }

    useEffect(() => {
        setLoading(true);
        async function load(){
            const nomeRepositorio = decodeURIComponent(match.params.repositorio);
            const response = await api.get(`/repos/${nomeRepositorio}/issues`, {
                params: {
                    state: 'open',
                    page,
                    per_page: 5
                }
            });
            setIssues(response.data);
            setLoading(false);
        }
        load();
    }, [match.params.repositorio, page])

    useEffect(()=>{
        async function load() {
            const nomeRepositorio = decodeURIComponent(match.params.repositorio);
            const [repositoriosData, issuesData] = await Promise.all([
                api.get(`/repos/${nomeRepositorio}`),
                api.get(`/repos/${nomeRepositorio}/issues`, {
                    params: {
                        state: 'open',
                        per_page: 5
                    }
                })
            ]);
            setRepositorio(repositoriosData.data);
            setIssues(issuesData.data);
            setLoading(false);
        }

        load();
    }, [match.params.repositorio])


    if (loading) {
        return(
            <Loading>
                Carregando...
            </Loading>
        );
    }

    return(
        <Container>
            <BackButton to={'/'}>
                <FaArrowLeft color="#000" size={30}></FaArrowLeft>
            </BackButton>
            <Owner>
                <img src={repositorio.owner.avatar_url} alt={repositorio.owner.login} />
                <h1>{repositorio.name}</h1>
                <p>{repositorio.description}</p>
            </Owner>
            <IssuesList>
                {issues.map(issue => (
                    <li key={issue.id}>
                        <img src={issue.user.avatar_url} alt={issue.user.login}></img>
                        <div>
                            <strong>
                                <a href={issue.html_url}>{issue.title}</a>
                                {issue.labels.map(label => (
                                    <span key={label.id}>{label.name}</span>
                                ))}
                            </strong>
                            <p>{issue.user.login}</p>
                        </div>
                    </li>
                ))}
            </IssuesList>
            <PageActions>
                <button
                    type="button"
                    onClick={() => handlePage('back')}
                    disabled={page < 2}
                    >Voltar</button>
                <button type="button" onClick={() => handlePage('next')}>Próxima</button>
            </PageActions>
        </Container>
    )
}