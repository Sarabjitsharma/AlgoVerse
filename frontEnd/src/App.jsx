import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import {inputValue} from './components/sideButton.jsx'
import Header from "./components/Header.jsx";
import Main from "./components/Main.jsx";
import Footer from "./components/Footer.jsx";
import SideChatButton from "./components/sideButton.jsx";
import React from "react";
import { useParams } from "react-router-dom";

const pages = import.meta.glob("./algorithms/*.jsx");

function AlgoLoader() {
  const { algoName } = useParams();
  const fileKey = `./algorithms/${algoName}.jsx`;
  if (!pages[fileKey]) {
  return <div>Algorithm page not found</div>;
  }
  const Page = React.lazy(pages[fileKey]);
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Page />
    </React.Suspense>
  );
}

export default function App() {
    return (
        <>
            <BrowserRouter>
                <Header />
                <main>
                    <Routes>
                        <Route path="/" element={<Main />} />
                        <Route path="/algorithms/:algoName" element={<AlgoLoader />} />
                    </Routes>
                </main>
                <SideChatButton />
            </BrowserRouter>
        </>
    )
}
