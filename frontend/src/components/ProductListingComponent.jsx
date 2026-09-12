import React from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom';

function ProductListingComponent() {

    const [products, setProducts] = React.useState([]);
    const [searchTerm, setSearchTerm] = React.useState('');

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = async () => {
        let result = await fetch("http://localhost:3000/products");
        result = await result.json();
        console.log(result);
        setProducts(result);
    }

    const handleDelete = async (id) => {
        let result = await fetch(`http://localhost:3000/product/${id}`, {
            method: "DELETE"
        });
        result = await result.json();
        console.log(result);
        getProducts(); // Refresh the product list  
    }

    const handleSearch = async (searchTerm) => {
        setSearchTerm(searchTerm);
        let result = await fetch(`http://localhost:3000/search/${searchTerm}`);
        result = await result.json();
        console.log(result);
        setProducts(result);
    }

    return (
        <div>
            <h3>Search Product:</h3>
            <input type="text" placeholder="Search Product" onChange={(e) => handleSearch(e.target.value)} />
            <br />
            <br />
            <h1>Products</h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Company</th>
                        <th>Operations</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        products.length > 0 ? products.map((item, index) => (
                            <tr key={index}>
                                <td>{item.name}</td>
                                <td>{item.price}</td>
                                <td>{item.category}</td>
                                <td>{item.company}</td>
                                <td>
                                    <Link to={`/update/${item._id}`}>Update</Link>
                                    <button onClick={() => { handleDelete(item._id) }}>Delete</button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5">No products found</td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}

export default ProductListingComponent