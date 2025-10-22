import '@testing-library/jest-dom'

// Mock Next.js Image component globally
jest.mock('next/image', () => {
  return function MockImage({ src, alt, width, height, ...props }) {
    return (
      <div 
        data-testid="next-image-mock"
        data-src={src}
        data-alt={alt}
        data-width={width}
        data-height={height}
        {...props}
      >
        {alt}
      </div>
    );
  };
});

// Mock next/router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    }
  },
}))

// Mock styled-components
jest.mock('styled-components', () => {
  const React = require('react')
  const styled = (tag) => (strings, ...values) => {
    return React.forwardRef((props, ref) => {
      return React.createElement(tag, { ...props, ref })
    })
  }
  styled.div = styled('div')
  styled.span = styled('span')
  styled.button = styled('button')
  styled.h1 = styled('h1')
  styled.h2 = styled('h2')
  styled.h3 = styled('h3')
  styled.h4 = styled('h4')
  styled.p = styled('p')
  styled.section = styled('section')
  styled.article = styled('article')
  styled.header = styled('header')
  styled.footer = styled('footer')
  styled.nav = styled('nav')
  styled.main = styled('main')
  styled.aside = styled('aside')
  styled.form = styled('form')
  styled.input = styled('input')
  styled.textarea = styled('textarea')
  styled.select = styled('select')
  styled.ul = styled('ul')
  styled.li = styled('li')
  styled.table = styled('table')
  styled.tr = styled('tr')
  styled.td = styled('td')
  styled.th = styled('th')
  styled.thead = styled('thead')
  styled.tbody = styled('tbody')
  styled.tfoot = styled('tfoot')
  return styled
})
