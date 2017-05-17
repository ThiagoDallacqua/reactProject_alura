import React, { Component } from 'react';
import InputCustomizado from './componentes/InputCustomizado.js';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros.js';

class FormularioLivro extends Component {
  constructor(){
    super();
    this.state = {
      titulo: '',
      preco: '',
      autorId: ''
    };
    this.enviaForm = this.enviaForm.bind(this);
    this.setTitulo = this.setTitulo.bind(this);
    this.setPreco = this.setPreco.bind(this);
    this.setAutorId = this.setAutorId.bind(this);
  }

  enviaForm(evento){
    evento.preventDefault();

    fetch('http://localhost:8080/api/livros', {
      headers:{'Content-type': 'application/json'},
      method: 'post',
      body: JSON.stringify({titulo:this.state.titulo, preco:this.state.preco, autorId:this.state.autorId})
    }).then(res => {
      PubSub.publish("limpa-erros", {});

      if (res.status === 400) {
        console.log(res.status);
        console.log(res.statusText);

        res.json()
        .then(err => {
          // err.errors.forEach((erro) => console.log(`o campo ${erro.field} não pode estar vazio.`));
          console.log(err);

          new TratadorErros().publicaErros(err);
        }).catch(err => console.log(err));
      }else{
        res.json()
        .then(novaListagem => {
          console.log(novaListagem);
          PubSub.publish('atualiza-lista-livros', novaListagem);
          this.setState({
            titulo: '',
            preco: '',
            autorId: ''
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

  setTitulo(evento){
    this.setState({titulo: evento.target.value});
  }

  setPreco(evento){
    this.setState({preco: evento.target.value});
  }

  setAutorId(evento){
    this.setState({autorId: evento.target.value});
  }

  render() {
    return (
      <div>
        <div className="header">
          <h1>Cadastro de Livros</h1>
        </div>
        <div className="content" id="content">
          <div className="pure-form pure-form-aligned">
            <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
              <InputCustomizado id="titulo" type="text" name="titulo" value={this.state.titulo} onChange={this.setTitulo} label="Título do Livro"/>
              <InputCustomizado id="preco" type="text" name="preco" value={this.state.preco} onChange={this.setPreco} label="Preço"/>
              <div className="pure-control-group">
              <label htmlFor="autorId">AutorId</label>
                <select value={this.state.autorId} id="autorId" name="autorId" onChange={this.setAutorId}>
                  <option value="">Selecione o Autor</option>
                  {
                    this.props.autores.map(autor => {
                      return <option key={autor.id} value={autor.id}>{autor.nome}</option>
                    })
                  }
                </select>
              </div>
              <div className="pure-control-group">
                <label></label>
                <button type="submit" className="pure-button pure-button-primary">Gravar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

class TabelaLivros extends Component {
  render() {
    return (
      <div>
        <table className="pure-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Preço</th>
              <th>Autor</th>
            </tr>
          </thead>
          <tbody>
            {
              this.props.lista.map(function(livro) {
                return (
                  <tr key={livro.id}>
                    <td>{livro.titulo}</td>
                    <td>{livro.preco}</td>
                    <td>{livro.autor.nome}</td>
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

export default class LivroBox extends Component {
  constructor(){
    super();
    this.state = {
      lista: [],
      autores: []
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

    fetch('http://localhost:8080/api/livros')
    .then(res => res.json())
    .then(result => {
      this.setState({lista:result});
    }).catch(err => console.log(err));

    PubSub.subscribe('atualiza-lista-livros', (topico, novaLista) => {
      this.setState({lista: novaLista});
  });

    fetch('http://localhost:8080/api/autores')
    .then(res => res.json())
    .then(result => {
      this.setState({autores:result});
    }).catch(err => console.log(err));
  }

  render(){
    return (
      <div>
        <FormularioLivro autores={this.state.autores}/>
        <TabelaLivros lista={this.state.lista}/>
      </div>
    );
  }
}
