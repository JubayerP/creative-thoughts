import '@/styles/globals.css'
import { Toaster } from 'react-hot-toast'
import { ToastContainer } from 'react-toastify'
import Layout from '../components/layout'
import 'react-toastify/dist/ReactToastify.css'

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <ToastContainer limit={1}/>
      <Component {...pageProps} />
    </Layout>
  )
}
