// pages/_app.tsx
import { AppProps } from 'next/app';
import Layout from './components/layout/Layout';
import '../styles/globals.css';
import Footer from './components/homepage/slider/footer/Footer';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <Layout>
      <Component {...pageProps} />
      <Footer/>
    </Layout>
  );
};

export default MyApp;