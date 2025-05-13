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
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState([])
  const [product, setProduct] = useState(null)


  const handleSearch = async (query) => {
    if (query.trim() === '') {
      setProducts([])
      return
    }
    try {
      const res = await fetch(`http://localhost:5000/products?search=${query.toLowerCase()}`)
      const resData = await res.json()
      setProducts(resData)
      console.log('api');

    } catch (error) {
      console.error(error);
    }
  }

  const debouncedSearch = useCallback(debounce(handleSearch, 500), [])

  useEffect(() => {
    debouncedSearch(query)
  }, [query])

  const fetchProduct = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/products/${id}`)
      const data = await res.json()
      setQuery('')
      setProducts([])
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
