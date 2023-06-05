import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function Dashboard({ token, setTokenUrl }) {

    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [userConnected, setUserConnected] = useState(false);
    const [isPrivate, setIsPrivate] = useState(false);

    const handleImageUpload = (event) => {
        setSelectedImage(event.target.files[0]);
    };

    useEffect(() => {
        getAllImg();
        verifyIfUserExist();
    }, []);

    const getAllImg = () => {
        axios.get('http://localhost:5000/pictures/all')
            .then((response) => {
                console.log(response)
                setImages(response.data)
            })
            .catch((error) => console.error(error));
    }

    const verifyIfUserExist = () => {
        console.log(localStorage.getItem("userExerciceMai"))
        if (localStorage.getItem("userExerciceMai") !== null) {
            setUserConnected(true);
        } else {
            setUserConnected(false);
        }
    }

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('image', selectedImage);
        formData.append('token', JSON.parse(localStorage.getItem("userExerciceMai")).token);
        formData.append('private', false);

        axios.post("http://localhost:5000/pictures/upload", formData,
            {
                headers: {
                    'auth-token': localStorage.getItem("tokenExoMai"),
                }
            }
        ).then((response) => {
            console.log(response);
            getAllImg();
        });
    };

    const deleteUser = async () => {
        axios
            .delete(`http://localhost:5000/users/delete/${JSON.parse(localStorage.getItem("userExerciceMai"))._id}`)
            .then(response => {
                if (response.status === 200) {
                    console.log(response)
                    localStorage.removeItem('userExerciceMai');
                    setUserConnected(false);
                }
            });
    }

    return (
        <div>
            <Container maxWidth="md" style={{ marginTop: 150, margin: 20 }}>
                {userConnected &&
                    <Button variant="contained" color="error" onClick={() => deleteUser()}>Supprimer mon compte</Button>
                }
                <Link href="/login">
                    <Button variant="contained" color="primary">Page de connexion</Button>
                </Link>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                        variant="outlined"
                        style={{ width: 120, margin: 10, border: isPrivate ? '4px solid black' : "4px solid green" }}
                    >
                        Image privée
                    </Button>
                    <Button
                        variant="outlined"
                        style={{ width: 120, margin: 10, border: !isPrivate ? '4px solid black' : "4px solid green" }}
                    >
                        Image publique
                    </Button>
                </div>
                <div>
                    <input type="file" id="img" name="image" accept="image/*" onChange={handleImageUpload} />
                    <button onClick={handleUpload}>Upload Image</button>
                </div>
                <div>
                    <h2>Toutes les images</h2>
                    {images.map((image) => (
                        <img
                            key={image._id}
                            src={`http://localhost:3000/uploads/${image.filename}`}
                            alt={image.originalName}
                        />
                    ))}
                    <h2>Mes images</h2>
                </div>
            </Container>
        </div>
    )
}
