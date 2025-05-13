import { useState, useEffect, useCallback } from 'react'
// libreria installata npm i lodash
import { debounce } from 'lodash'
import './App.css'

// oppure al posto della libreria si può utilizzare questa funzione
// function debounce(callback, delay) {
//   let timer;
//   return (query) => {
//     clearTimeout(timer)
//     timer = setTimeout(() => {
//       callback(query)
//     }, delay)
//   }
// }

function App() {
  // creo lo stato per l'input 
  const [query, setQuery] = useState('')
  // creo lo stato dei prodotti 
  const [products, setProducts] = useState([])
  // creo lo stato del prodotto
  const [product, setProduct] = useState(null)


  const handleSearch = async (query) => {
    // se l'input è vuoto e non contiene spazi allora viene chiuso il menu a tendina
    if (query.trim() === '') {
      setProducts([])
      return
    }
    try {
      // eseguo la chiamata di ricerca del prodotto
      const res = await fetch(`http://localhost:5000/products?search=${query.toLowerCase()}`)
      const resData = await res.json()
      setProducts(resData)
    } catch (error) {
      console.error(error);
    }
  }

  // aggiungo il deobunce che aiuta a fermare il fetch per 500 ms per dare il tempo all'utente di inserire l'input, utilizzo useCallback per evitare di ricreare la funzione ad ogni render
  // e quindi di evitare di fare più chiamate al server
  const debouncedSearch = useCallback(debounce(handleSearch, 500), [])

  // utilizzo useEffect per eseguire la funzione debouncedSearch quando l'input cambia
  // e quindi quando l'utente scrive qualcosa
  // in questo modo evito di fare più chiamate al server
  useEffect(() => {
    debouncedSearch(query)
  }, [query])

  // utilizzo useEffect per eseguire la funzione fetchProduct per recuperare il prodotto
  // quando l'utente clicca su un prodotto
  const fetchProduct = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/products/${id}`)
      const data = await res.json()
      // resetto lo stato dell'input per chiudere il menu a tendina
      setQuery('')
      // resetto lo stato dei prodotti per chiudere il menu a tendina
      setProducts([])
      // setto lo stato del prodotto
      setProduct(data)
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <div>
        <input
          type="text"
          placeholder='Cerca...'
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>
      {products.length === 0 ? null : <div className='container-cards'>
        {products.map(product => <h4 onClick={() => fetchProduct(product.id)}>{product.name}</h4>)}
      </div>}
      {product && <div className='card'>
        <img src={product.image} alt={product.name} />
        <h3>{product.name}</h3>
        <p>description: {product.description}</p>
        <ul>
          <li>brand: {product.brand}</li>
          <li>color: {product.color}</li>
          <li>connectivity: {product.connectivity}</li>
          <li>wireless {product.wireless === true ? 'yes' : 'no'}</li>
        </ul>
        <span>Rating: {product.rating}</span>
        <span>Price: {product.price}€</span>
      </div>}
    </>
  )
}

export default App
