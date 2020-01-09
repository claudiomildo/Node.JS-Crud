import React, { Component } from 'react'
import axios from 'axios'
import Main from '../template/Main'

const headerProps = {
    icon: 'address-card-o',
    title: 'Cadastro de Novos Usuários',
}

const baseUrl = 'http://127.0.0.1:3001/api/users'

const initialState = {
    user: { nome: '', email: '' },
    list: []
}

export default class UserCrud extends Component {
    constructor(props) {
        super(props)
        this.state = { ...initialState }

        this.clear = this.clear.bind(this)
        this.save = this.save.bind(this)
        this.getUpdatedList = this.getUpdatedList.bind(this)
        this.updateField = this.updateField.bind(this)
        this.load = this.load.bind(this)
        this.remove = this.remove.bind(this)

    }


    componentWillMount() {
        axios(baseUrl).then(resp => {
            this.setState({ list: resp.data })
        })
    }

    clear() {
        this.setState({ user: initialState.user })
    }

    save() {
        const user = this.state.user
        const method = user._id ? 'put' : 'post'
        const url = user._id ? `${baseUrl}/${user._id}` : baseUrl
        axios[method](url, user)
            .then(resp => {
                const list = this.getUpdatedList(resp.data)
                this.setState({ user: initialState.user, list })
            })
    }

    getUpdatedList(user, add = true) {
        const list = this.state.list.filter(u => u._id !== user._id)
        if (add) list.unshift(user)
        return list
    }

    updateField(event) {
        const user = { ...this.state.user }
        user[event.target.nome] = event.target.value
        this.setState({ user })
    }

    renderForm() {
        return (
            <div className="form">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label className="font-weight-bold text-uppercase">Nome</label>
                            <input type="text" className="form-control" name="nome" placeholder="Digite o nome..."
                                value={this.state.user.nome} onChange={e => this.updateField(e)} />
                            {console.log(this.state.user.nome)}
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label className="font-weight-bold text-uppercase">E-mail</label>
                            <input type="text" className="form-control" name="email" placeholder="Digite o e-mail..."
                                value={this.state.user.email} onChange={e => this.updateField(e)} />
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <button className="btn btn-primary btn-sm" onClick={e => this.save(e)}>Salvar</button>
                        <button className="btn btn-dark ml-1 btn-sm" onClick={e => this.clear(e)}>Cancelar</button>
                    </div>
                </div>
            </div>
        )
    }

    load(user) {
        this.setState({ user })
    }

    remove(user) {
        axios.delete(`${baseUrl}/${user._id}`)
            .then(resp => {
                const list = this.getUpdatedList(user, false)
                this.setState({ list })
            })
    }

    renderTable() {
        return (
            <table className="table table-striped mt-2">
                <thead className="thead-dark">
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
        )
    }

    renderRows() {
        return this.state.list.map(user => {
            return (
                <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.nome}</td>
                    <td>{user.email}</td>
                    <td>
                        <button className="btn btn-warning btn-sm" onClick={() => this.load(user)}><i className="fa fa-pencil"></i></button>
                        <button className="btn btn-danger btn-sm ml-1" onClick={() => this.remove(user)}><i className="fa fa-trash"></i></button>
                    </td>
                </tr>
            )
        })
    }

    render() {
        return (
            <Main {...headerProps}>
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        )
    }
}