import React from 'react'
import { useParams } from 'react-router-dom';
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function AddProduct() {
    const navigate = useNavigate();

    const [name, setName] = React.useState('');
    const [price, setPrice] = React.useState('');
    const [category, setCategory] = React.useState('');
    const [company, setCompany] = React.useState('');
    const [productId, setProductId] = React.useState('');

    const productIdParam = useParams().id;

    useEffect(() => {
        if (productIdParam) {
            getProductDetails();
        }
    }, [productIdParam]);

    const getProductDetails = async () => {
        let result = await fetch(`http://localhost:3000/product/${productIdParam}`);
        result = await result.json();
        console.log(result);
        setName(result.name);
        setPrice(result.price);
        setCategory(result.category);
        setCompany(result.company);
        setProductId(result._id);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(name, price, category, company);
        if (!name || !price || !category || !company) {
            alert("Please fill all the fields");
            return;
        }

        if (productIdParam) {
            // Update product
            let result = await fetch(`http://localhost:3000/product/${productIdParam}`, {
                method: "PUT",
                body: JSON.stringify({ name, price, category, company }),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            result = await result.json();
            console.log(result);
            if (result) {
                navigate('/');
            }
        } else {
            const userId = JSON.parse(localStorage.getItem('user'))._id;

            let result = await fetch("http://localhost:3000/add-product", {
                method: "POST",
                body: JSON.stringify({ name, price, category, company, userId }),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            result = await result.json();
            console.log(result);
            if (result) {
                alert("Product added successfully");
                setName('');
                setPrice('');
                setCategory('');
                setCompany('');
            }
        }
    }

    return (
        <div>
            <h1>{productIdParam ? "Update Product" : "Add Product"}</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="price">Price:</label>
                    <input type="text" id="price" value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="category">Category:</label>
                    <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="company">Company:</label>
                    <input type="text" id="company" value={company} onChange={(e) => setCompany(e.target.value)} />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default AddProduct