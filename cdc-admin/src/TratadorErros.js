import PubSub from 'pubsub-js';

export default class TratadorErros{
  publicaErros(erros){
    console.log(erros);

    erros.errors.forEach(erro => {
      PubSub.publish("erro-validacao", erro);
    });
  }
}
