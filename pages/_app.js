function GlobalStyle(){
    return(
    <style global jsx>{`
        *{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            list-style:none;
        }
        body{
            font-family: 'Open Sansans' sans-serif;
        }
        /* App fit height */
        html,body, #_next {
            min-height: 100vh;
            display: flex;
            flex: 1;
        }
        #_next{
            flex: 1;
        }
        #_next > * {
            flex: 1;
        }
        /* ./App fit Height */
        `}</style>        
    );
}



export default function MyApp({ Component, pageProps }) {
    console.log('Roda em todas as páginas');
    return (
      <>
      <GlobalStyle/>
    <Component {...pageProps} />
      </>
    );
  }