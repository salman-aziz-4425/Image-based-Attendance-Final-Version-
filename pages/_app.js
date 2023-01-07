import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import withRedux from 'next-redux-wrapper';
import ThemeProvider from '../containers/ThemeProvider';
import initStore from '../redux/store';
import 'antd/dist/antd.css';
import '@glidejs/glide/dist/css/glide.core.min.css';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.core.css';
import '../style/global.css';
import { Amplify} from 'aws-amplify';
import awsconfig from '../src/aws-exports';
import { useSelector, useDispatch } from 'react-redux'
Amplify.configure({...awsconfig});

function CustomApp({ Component, pageProps, store }){
  useEffect(()=>{

  },[])
    return (
      <Provider store={store}>
        <ThemeProvider>
          <Component {...pageProps} />
        </ThemeProvider>
      </Provider>
    );
}

export default withRedux(initStore)(CustomApp);
