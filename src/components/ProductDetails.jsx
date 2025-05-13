import { memo } from "react";

const Card = memo(({ product }) => {

    return (
        <div className='card'>
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
        </div>
    )
})

export default Card