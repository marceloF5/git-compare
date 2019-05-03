import React from 'react'
import moment from 'moment'

import CompareList from '../../components/CompareList'

import { Container, Form } from './styles'
import logo from '../../assets/logo.png'

import api from '../../services/api'

class Main extends React.Component {
    state = {
        loading: false,
        repositoryInput: '',
        repositories: [],
        repositoryError: false,
    }

    async componentDidMount() {
        this.setState({
            loading: true,
        })

        this.setState({
            loading: false,
            repositories: await this.getLocalRepositories(),
        })
    }

    handleInput = (e) => {
        this.setState({ repositoryInput: e.target.value })
    }

    getLocalRepositories = async () => JSON.parse(await localStorage.getItem('@GitCompare:repositories')) || []

    handleAddRepository = async (e) => {
        e.preventDefault()
        const { repositoryInput, repositories } = this.state
        this.setState({ loading: true })
        try {
            const { data: repository } = await api.get(`/repos/${repositoryInput}`)

            repository.lastCommit = moment(repository.pushed_at).fromNow()

            const localRepositories = await this.getLocalRepositories()

            this.setState({
                repositoryInput: '',
                repositories: [...repositories, repository],
                repositoryError: false,
            })

            await localStorage.setItem(
                '@GitCompare:repositories',
                JSON.stringify([...localRepositories, repository]),
            )
        } catch (err) {
            this.setState({ repositoryError: true })
        } finally {
            this.setState({ loading: false })
        }
    }

    handleRemoveRepository = async (id) => {
        const { repositories } = this.state

        const updatedRepositories = repositories.filter(repository => repository.id !== id)

        this.setState({
            repositories: updatedRepositories,
        })
        await localStorage.setItem('@GitCompare:repositories', JSON.stringify(updatedRepositories))
    }

    handleUpdateRepository = () => {}

    render() {
        const {
            loading, repositoryInput, repositories, repositoryError,
        } = this.state
        return (
            <Container>
                <img src={logo} alt="Github Compare" />

                <Form withError={repositoryError} onSubmit={this.handleAddRepository}>
                    <input
                        type="text"
                        placeholder="Type some user or repo"
                        value={repositoryInput}
                        onChange={e => this.handleInput(e)}
                    />
                    <button type="submit">
                        {loading ? <i className="fa fa-spinner fa-pulse" /> : '+'}
                    </button>
                </Form>

                <CompareList
                    repositories={repositories}
                    removeRepository={this.handleRemoveRepository}
                    updateRepository={this.handleUpdateRepository}
                />
            </Container>
        )
    }
}

export default Main
