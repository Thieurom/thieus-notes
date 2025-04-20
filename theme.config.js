const YEAR = new Date().getFullYear()

export default {
  footer: (
    <p style={{ display: 'block', marginTop: '8rem' }}>
      <time>{YEAR}</time> © Doan Thieu.
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
