import React, { Component } from 'react';
import './css/pure-min.css';
import './css/side-menu.css'

class App extends Component {
  constructor(){
    super();
    this.state = {
      lista: [],
      nome: '',
      email: '',
      senha: ''
    };
    this.enviaForm = this.enviaForm.bind(this);
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
  }

  enviaForm(evento){
    evento.preventDefault();

    fetch('http://localhost:8080/api/autores', {
      headers:{'Content-type': 'application/json'},
      method: 'post',
      body: JSON.stringify({nome:this.state.nome, email:this.state.email, senha:this.state.senha})
    }).then(res => {
      console.log(res.status);
      console.log(res.statusText);
    });

    // fetch('http://cdc-react.herokuapp.com/api/autores', {
    //   headers:{'Content-type': 'application/json'},
    //   method: 'post',
    //   body: JSON.stringify({nome:'beurismar', email:'beurismar@olenhador.com', senha:'123456'})
    // }).then(res => console.log(res))
    // .catch(err => console.log(err));
  }

  render() {
    return (
      <div id="layout">
          <a href="#menu" id="menuLink" className="menu-link">
              <span></span>
          </a>

          <div id="menu">
              <div className="pure-menu">
                  <a className="pure-menu-heading" href="#">Company</a>

                  <ul className="pure-menu-list">
                      <li className="pure-menu-item"><a href="#" className="pure-menu-link">Home</a></li>
                      <li className="pure-menu-item"><a href="#" className="pure-menu-link">Autor</a></li>
                      <li className="pure-menu-item"><a href="#" className="pure-menu-link">Livro</a></li>
                  </ul>
              </div>
          </div>

          <div id="main">
            <div className="header">
              <h1>Cadastro de Autores</h1>
            </div>
            <div className="content" id="content">
              <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
                  <div className="pure-control-group">
                    <label htmlFor="nome">Nome</label>
                    <input id="nome" type="text" name="nome" value=""  />
                  </div>
                  <div className="pure-control-group">
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" name="email" value=""  />
                  </div>
                  <div className="pure-control-group">
                    <label htmlFor="senha">Senha</label>
                    <input id="senha" type="password" name="senha"  />
                  </div>
                  <div className="pure-control-group">
                    <label></label>
                    <button type="submit" className="pure-button pure-button-primary">Gravar</button>
                  </div>
                </form>

              </div>
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
                      this.state.lista.map(function(autor) {
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
            </div>
          </div>
      </div>
    );
  }
}

export default App;
