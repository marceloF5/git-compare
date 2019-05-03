import React from 'react'
import moment from 'moment'

import CompareList from '../../components/CompareList'

import { Container, Form } from './styles'
import logo from '../../assets/logo.png'

import api from '../../services/api'

class Main extends React.Component {
    state = {
        repositoryInput: '',
        repositories: [],
    }

    handleInput = (e) => {
        this.setState({ repositoryInput: e.target.value })
    }

    handleAddRepository = async (e) => {
        e.preventDefault()
        const { repositoryInput, repositories } = this.state

        try {
            const { data: repository } = await api.get(`/repos/${repositoryInput}`)

            repository.lastCommit = moment(repository.pushed_at).fromNow()

            this.setState({
                repositoryInput: '',
                repositories: [...repositories, repository],
            })
        } catch (err) {
            console.log(err)
        }
    }

    render() {
        const { repositoryInput, repositories } = this.state
        return (
            <Container>
                <img src={logo} alt="Github Compare" />
                <Form onSubmit={this.handleAddRepository}>
                    <input
                        type="text"
                        placeholder="Type some user or repo"
                        value={repositoryInput}
                        onChange={e => this.handleInput(e)}
                    />
                    <button type="submit">OK</button>
                </Form>

                <CompareList repositories={repositories} />
            </Container>
        )
    }
}

export default Main
