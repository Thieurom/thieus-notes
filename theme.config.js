const YEAR = new Date().getFullYear()

export default {
  footer: (
    <p style={{ display: 'block', marginTop: '8rem' }}>
      <time>{YEAR}</time> © Doan Thieu.
      <a href="https://www.goodreads.com/user/show/25954119-thi-u" target="_blank">goodreads</a>
      <a href="https://github.com/Thieurom" target="_blank">github</a>
      <a href="https://twitter.com/lethieu" target="_blank">twitter</a>
      <style jsx>{`
        a {
          float: right;
          margin: 0 0.25rem;
        }
        @media screen and (max-width: 480px) {
          article {
            padding-top: 2rem;
            padding-bottom: 4rem;
          }
        }
      `}</style>
    </p>
  )
}
