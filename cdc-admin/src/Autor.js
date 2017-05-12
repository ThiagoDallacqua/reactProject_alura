import React, { Component } from 'react';
import InputCustomizado from './componentes/InputCustomizado.js';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros.js';

class FormularioAutor extends Component {
  constructor(){
    super();
    this.state = {
      nome: '',
      email: '',
      senha: ''
    };
    this.enviaForm = this.enviaForm.bind(this);
    this.setNome = this.setNome.bind(this);
    this.setEmail = this.setEmail.bind(this);
    this.setSenha = this.setSenha.bind(this);
  }

  enviaForm(evento){
    evento.preventDefault();

    fetch('http://localhost:8080/api/autores', {
      headers:{'Content-type': 'application/json'},
      method: 'post',
      body: JSON.stringify({nome:this.state.nome, email:this.state.email, senha:this.state.senha})
    }).then(res => {
      PubSub.publish("limpa-erros", {});

      if (res.status === 400) {
        console.log(res.status);
        console.log(res.statusText);

        res.json()
        .then(err => {
          err.errors.forEach((erro) => console.log(`o campo ${erro.field} não pode estar vazio.`));

          new TratadorErros().publicaErros(err);
        }).catch(err => console.log(err));
      }else{
        res.json()
        .then(novaListagem => {
          console.log(novaListagem);
          PubSub.publish('atualiza-lista-autores', novaListagem);
          this.setState({
            nome: '',
            email: '',
            senha: ''
          });
        }).catch(err => console.log(err));
      }
    });

    // fetch('http://cdc-react.herokuapp.com/api/autores', {
    //   headers:{'Content-type': 'application/json'},
    //   method: 'post',
    //   body: JSON.stringify({nome:this.state.nome, email:this.state.email, senha:this.state.senha})
    // }).then(res => {
    //   console.log(res.status);
    //   console.log(res.statusText);
    //   res.json()
    //   .then(result => {
    //     console.log(result);
    //     this.setState({lista:result});
    //   }).catch(err => console.log(err));
    // });
  }

  setNome(evento){
    this.setState({nome: evento.target.value});
  }

  setEmail(evento){
    this.setState({email: evento.target.value});
  }

  setSenha(evento){
    this.setState({senha: evento.target.value});
  }

  render() {
    return (
      <div className="pure-form pure-form-aligned">
        <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
            <InputCustomizado id="nome" type="text" name="nome" value={this.state.nome} onChange={this.setNome} label="Nome"/>
            <InputCustomizado id="email" type="email" name="email" value={this.state.email} onChange={this.setEmail} label="Email"/>
            <InputCustomizado id="senha" type="password" name="senha" value={this.state.senha} onChange={this.setSenha} label="Senha"/>
          <div className="pure-control-group">
            <label></label>
            <button type="submit" className="pure-button pure-button-primary">Gravar</button>
          </div>
        </form>

      </div>
    );
  }
}

class TabelaAutores extends Component {
  render() {
    return (
      <div>
        <table className="pure-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>email</th>
            </tr>
          </thead>
          <tbody>
            {
              this.props.lista.map(function(autor) {
                return (
                  <tr key={autor.id}>
                    <td>{autor.nome}</td>
                    <td>{autor.email}</td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>
    );
  }
}

export default class AutorBox extends Component {
  constructor(){
    super();
    this.state = {
      lista: []
    };
  }

  componentDidMount(){
    // fetch('http://cdc-react.herokuapp.com/api/autores')
    // .then(res => res.json())
    // .then(result => {
    //   let arrResult = [];
    //   let index = parseInt(result.length) - 1;
    //   arrResult.push(result[0]);
    //   arrResult.push(result[1]);
    //   arrResult.push(result[3]);
    //   arrResult.push(result[index]);
    //   this.setState({lista:arrResult})
    // }).catch(err => console.log(err));

    fetch('http://localhost:8080/api/autores')
    .then(res => res.json())
    .then(result => {
      console.log(result);
      this.setState({lista:result});
    }).catch(err => console.log(err));

    PubSub.subscribe('atualiza-lista-autores', (topico, novaLista) => this.setState({lista: novaLista}));
  }

  render(){
    return (
      <div>
        <FormularioAutor/>
        <TabelaAutores lista={this.state.lista}/>
      </div>
    );
  }
}
