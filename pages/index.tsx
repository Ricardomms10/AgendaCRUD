import styles from '../styles/Home.module.scss'
import { FormEvent, useEffect, useState } from 'react'
import { database } from '../services/firebase'
import Head from '../components/head/index';

type Contato = {
  chave: string;
  nome: string;
  email: string;
  telefone: string;
  observacao: string;
}

export default function Home() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [observacao, setObservacao] = useState('')
  const [contatos, setContatos] = useState<Contato[]>([])
  const [buscar, setBuscar] = useState<Contato[]>()
  const [estaBuscando, setEstabuscando] = useState(false)
  const [chave, setChave] = useState('')
  const [atualizando, setAtualizando] = useState(false)

  useEffect(() => {
    const refContatos = database.ref('contatos')
    refContatos.on('value', resultado => {
      const resultadoContato = Object.entries<Contato>(resultado.val() ?? {}).map(([chave, valor]) => ({
        chave,
        nome: valor.nome,
        email: valor.email,
        telefone: valor.telefone,
        observacao: valor.observacao,
      }))
      setContatos(resultadoContato)
    })
  }, [])

  function delet(ref: string) {
    const refContatos = database.ref(`contatos/${ref}`).remove()
  }

  function toRecord(event: FormEvent) {
    event.preventDefault()
    const ref = database.ref('contatos')
    const date = {
      nome,
      email,
      telefone,
      observacao,
    }
    ref.push(date)
    setNome('')
    setEmail('')
    setTelefone('')
    setObservacao('')
  }

  function search(event: FormEvent<HTMLInputElement>) {
    const palavra = event.currentTarget.value;
    if (palavra.length > 0) {
      setEstabuscando(true);
      const date = contatos.filter(contato => {
        const regra = new RegExp(palavra, 'gi');
        return regra.test(contato.nome);
      });
      setBuscar(date);
    } else {
      setEstabuscando(false);

    }
  }

  function ToEdit(contatos: Contato) {
    setAtualizando(true)
    setChave(contatos.chave)
    setNome(contatos.nome)
    setEmail(contatos.email)
    setTelefone(contatos.telefone)
    setObservacao(contatos.observacao)


  }

  function toUpdate() {
    const ref = database.ref('contatos/')

    const dados = {
      nome: nome,
      email: email,
      telefone: telefone,
      observacao: observacao,
    }
    ref.child(chave).update(dados)

    setNome('')
    setEmail('')
    setTelefone('')
    setObservacao('')

    setAtualizando(false)
  }

  return (
    <>
    <Head />
    <div className={styles.container}>
      <form >
        <input
          type='text'
          placeholder='Nome'
          value={nome}
          onChange={event => setNome(event.target.value)} />
        <input
          type='text'
          placeholder='Email'
          value={email}
          onChange={event => setEmail(event.target.value)} />
        <input
          type='number'
          placeholder='Telefone'
          value={telefone}
          onChange={event => setTelefone(event.target.value)} />
        <textarea
          placeholder='Observação'
          value={observacao}
          onChange={event => setObservacao(event.target.value)} />
        {atualizando ?
          <button type='button' onClick={toUpdate}>Atualizar</button> :
          <button type='button' onClick={toRecord}>Salvar</button>
        }

      </form>

      <div className={styles.contactBox}>
        <h2>LISTA DE CONTATOS</h2>
        <input
          type='Text'
          placeholder='Buscar'
          onChange={search} />

        {estaBuscando
          ? buscar?.map((contato) => (
            <div key={contato.chave} className={styles.boxInfo}>
              <div className={styles.boxBtn}>
                <p className={styles.nameUser}>{contato.nome}</p>
                <div>
                  <a onClick={() => ToEdit(contato)}>Editar</a>
                  <a onClick={() => { delet(contato.chave) }}>Excluir</a>
                </div>
              </div>
              <div className={styles.data}>
                <p>{contato.email}</p>
                <p>{contato.telefone}</p>
                <p>{contato.observacao}</p>
              </div>
            </div>
          ))
          : contatos?.map((contato) => (
            <div key={contato.chave} className={styles.boxInfo}>
              <div className={styles.boxBtn}>
                <p className={styles.nameUser}>{contato.nome}</p>
                <div>
                  <a onClick={() => ToEdit(contato)}>Editar</a>
                  <a onClick={() => { delet(contato.chave) }}>Excluir</a>
                </div>
              </div>
              <div className={styles.data}>
                <p>{contato.email}</p>
                <p>{contato.telefone}</p>
                <p>{contato.observacao}</p>
              </div>
            </div>
          ))
        }
      </div>
    </div>
    </>
  )
}
