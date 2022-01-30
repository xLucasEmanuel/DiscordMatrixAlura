import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from './config.json';
import {useRouter} from 'next/router'
import { createClient } from '@supabase/supabase-js'
import { ButtonSendSticker} from './src/Components/ButtonSendStickers';

const SUPABASE_ANON_KEY ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzU0OTM4NSwiZXhwIjoxOTU5MTI1Mzg1fQ.PYaBHvN5cNs89eLmJQw6xxVYciJYJ-xfm2h5IQ7pplo'
const SUPABASE_URL ='https://uxciffxookzlleveuyfy.supabase.co'
const supabaseCliente = createClient(SUPABASE_URL,SUPABASE_ANON_KEY);

function escutaMensagensEmTempoReal(adicionaMensagem){
    return supabaseCliente
    .from(' mensagens ')
    .on('INSERT', (respostaLive) => {
        adicionaMensagem(respostaLive.new);

    })
    .subscribe();
}

 

export default function ChatPage() {
    const roteamento = useRouter();
    const usuarioLogado = roteamento.query.username;
    console.log('roteamento.query', roteamento.query);
    console.log('usuarioLogado', usuarioLogado);
    const [mensagem, setMensagem] = React.useState('');
    const [listaDeMensagens, setListaDeMensagens] = React.useState([
     
    ]);

    React.useEffect(() => {
        supabaseCliente
    .from('mensagens')
    .select('*')
    .order('id',{ ascending: false})
    .then(({ data }) => {
        console.log('Dados da Consulta:', data);
       setListaDeMensagens(data);
    });
        escutaMensagensEmTempoReal((novaMensagem) => {
            console.log('Nova Mensagem:', novaMensagem);
             setListaDeMensagens((valorAtualDaLista) => {
                 return [
                    novaMensagem,
                    ...valorAtualDaLista,
                   
                 ]
             })              
           ;

        });

    }, []);
    

    // ./Sua lógica vai aqui
    function handleNovaMensagem(novaMensagem) {
        const mensagem = {
         //   id: listaDeMensagens.length + 1,
            de: usuarioLogado,
            texto: novaMensagem,
        }

        supabaseCliente
        .from('mensagens')
        .insert([
            mensagem
        ])
        .then(({data}) => {
           console.log('Criando Mensagem', data);
         
        });

        
        setMensagem('');
    }
    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >

                    <MessageList mensagens={listaDeMensagens} />
                    {/*
                    {listaDeMensagens.map((mensagemAtual) => {
                       
                        return(
                            <li key={mensagemAtual.id}>
                                {mensagemAtual.de}: {mensagemAtual.texto}
                            </li>
                        )
                    })} */}
                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            value={mensagem}
                            onChange={(event) => { // função {function dá no mesmo, apenas abreviado}                                                
                                const valor = event.target.value;
                                setMensagem(valor);
                            }
                            }
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    handleNovaMensagem(mensagem);
                                }


                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        <ButtonSendSticker 
                        onStickerClick={(sticker) => {
                            console.log('Salva esse sticker no banco', sticker);
                            handleNovaMensagem(':sticker:' + sticker);
                        }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    console.log('MessageList', props);
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {props.mensagens.map((mensagem) => {
                return (
                    <Text
                        key={mensagem.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${mensagem.de}.png`}
                            />
                            <Text tag="strong">
                                {mensagem.de}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {(new Date().toLocaleDateString())}
                            </Text>
                        </Box>
                        {mensagem.texto.startsWith(':sticker:').toString()}
                        {mensagem.texto.startsWith(':sticker:') 
                       ?  (
                            <img src={mensagem.texto.replace(':sticker:', '')} />
                       )

                       :( 
                           mensagem.texto

                       )}
                    </Text>


                );
            })}


        </Box>
    )
}