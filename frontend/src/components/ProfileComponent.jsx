import React from 'react'
import { useEffect } from 'react'

function ProfileComponent() {

    const [user, setUser] = React.useState(null);

    useEffect(() => {
        const auth = localStorage.getItem('user');
        if (!auth) {
            navigate('/signup');
        }
        setUser(JSON.parse(auth));
        console.log("User:", JSON.parse(auth));
    }, []);

    return (
        <div>
            <h1>User Profile</h1>
            {user && (
                <div>
                    <p>User ID: {user._id}</p>
                    <p>Name: {user.name}</p>
                    <p>Email: {user.email}</p>
                </div>
            )}
        </div>
    )
}
export default ProfileComponent