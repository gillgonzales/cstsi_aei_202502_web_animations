import { Link } from 'react-router-dom'
import { pages } from './config/routes'
import { useEffect, useRef, useState } from 'react'
import animateJsLogoSrc from '/assets/img/animejs_logo.png?url'
import { AnimateCSSLogo, LogosContainer } from './styles/App.styled'
import { animate } from 'animejs'
import MenuItem from './components/MenuItem/MenuItem'
import { Container } from './styles/globals.styled'

function App() {
  const [showAnimateCSSLogo, setShowAnimateCSSLogo] = useState(false)
  const animateJsLogoRef = useRef(null);
  const reactSpin = useRef(null)

  const applyAnimations = () => {
    console.log(animateJsLogoRef.current)


    const animateViteLogo = animate('.vite-logo', {
      keyframes: [
        { translateX: 450, rotateZ: '0deg', opacity: 0 },
        { translateX: 0, rotateZ: '360deg', opacity: 1 },
      ],
      duration: 2000,
      easing: 'easeInOutQuad',
      autoplay: false
    });


    animateJsLogoRef.current && animate(animateJsLogoRef.current, {
      opacity: [0, 1],
      translateY: ['100%', '0%'],
      duration: 2000,
      easing: 'easeIn',
      delay: 2000,
      autoplay: true,
      onComplete: () => animateViteLogo.play()
    });

    animate(reactSpin.current, {
      opacity: [0, 1],
      alternate: true,
      rotate: '-1turn',
      loop: true,
      duration: 5000,
      onBegin: self => {
        console.log('onBegin', self)
        animate(reactSpin.current, {
          scale: [0, 1],
          loop: false,
          duration: self.iterationDuration,
        });
      }
    });

  }

  useEffect(() => {
    !showAnimateCSSLogo && setShowAnimateCSSLogo(true)
    applyAnimations()
  }, [showAnimateCSSLogo]);

  return (
    <>
      <Container>
        <h1>CSTSI - AEI
          <a target="_blank" href="#">&nbsp;Aula 04</a>
        </h1>
        <ul>
          {pages.map(({ path, title }, index) => (
            <MenuItem
              key={index}
              path={path}
              title={title}
              index={index}
            />
          ))}
        </ul>
        <LogosContainer>
          <img ref={reactSpin} src="assets/svgs/react.svg" alt="react" className="logo" />
          <img src="assets/svgs/vite.svg" alt="vite" className="logo vite-logo" />
          {showAnimateCSSLogo ?
            <Link to={'https://animejs.com/documentation/getting-started/using-with-react'} target="_blank">
              <AnimateCSSLogo ref={animateJsLogoRef} src={animateJsLogoSrc} />
            </Link>
            : ''}
        </LogosContainer>
      </Container>
    </>
  )
}

export default App
