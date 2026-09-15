import './App.css'
import HeroLogo from './components/HeroLogo'

function App() {
  return (
    <>
      <header className="navbar">
        <a className="logo" href="#">
          MIRACLE
        </a>

        <nav className="navigation" aria-label="Main navigation">
          <a href="#studio">A stúdió</a>
          <a href="#services">Szolgáltatások</a>
          <a href="#work">Munkáink</a>
          <a href="#contact">Kapcsolat</a>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero__overlay" />

          <div className="hero__content">
            <p className="eyebrow">Recording studio</p>

            <HeroLogo />

            <p className="hero__subtitle">
              Recording · Mixing · Mastering
            </p>

            <a className="hero__button" href="#studio">
              Fedezd fel a stúdiót
              <span aria-hidden="true">→</span>
            </a>
          </div>

          <a className="scroll-indicator" href="#studio">
            <span>Scroll</span>
            <span className="scroll-indicator__line" />
          </a>
        </section>

        <section className="intro" id="studio">
          <div className="intro__heading">
            <p className="eyebrow eyebrow--dark">A creative home</p>
            <h2>Több mint egy stúdió.</h2>
          </div>

          <div className="intro__body">
            <p>
              A Miracle egy alkotói tér zenészeknek, előadóknak és
              producereknek. Egy hely, ahol a hangzás és az elképzelés
              valódi formát kap.
            </p>

            <a href="#services">
              Ismerd meg a stúdiót
              <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className="intro__visual">
            <span>Studio image</span>
          </div>
        </section>
      </main>
    </>
  )
}

export default App