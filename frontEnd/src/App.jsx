import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from "./components/Header.jsx";
import Main from "./components/Main.jsx";
import SideChatButton from "./components/sideButton.jsx";
import RenderPage from './components/RenderPage.jsx';
import LiveAlgo  from './components/LiveAlgo.jsx';

// const pages = import.meta.glob("./algorithms/*.jsx");

// function AlgoLoader() {
//   const { algoName } = useParams();
//   const fileKey = `./algorithms/${algoName}.jsx`;
//   if (!pages[fileKey]) {
//   return <div>Algorithm page not found</div>;
//   }
//   const Page = React.lazy(pages[fileKey]);
//   return (
//     <React.Suspense fallback={<div>Loading...</div>}>
//       <Page />
//     </React.Suspense>
//   );
// }

export default function App() {
    return (
        <>
            <BrowserRouter>
                <Header />
                <main>  
                    <Routes>
                        {/* <Route path="/algorithms/:algoName" element={<AlgoLoader />} /> */}
                        {/* <Route path="/render/:id" element={<RenderPage />} /> */}
                        <Route path="/" element={<Main />} />
                        <Route path="/algo/:id" element={<LiveAlgo />} />
                    </Routes>
                </main>
                <SideChatButton />
            </BrowserRouter>
        </>
    )
}
