import './styles/global.css';

import { Header } from './sections/Header';
import { Hero } from './sections/Hero';
import { Services } from './sections/Services';
import { Features } from './sections/Features';
import { Technology } from './sections/Technology';
import { About } from './sections/About';
import { Footer } from './sections/Footer';

export default function App() {
  return (
    <>
      <a className="ais-skip-link" href="#main">
        본문 바로가기
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Services />
        <Features />
        <Technology />
        <About />
      </main>
      <Footer />
    </>
  );
}
