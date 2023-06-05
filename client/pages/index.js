import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

export default function Test() {

  const [images, setImages] = useState([]);
  const [imagesOwner, setImagesOwner] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [userConnected, setUserConnected] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);

  const handleImageUpload = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  useEffect(() => {
    getAllImg();
    getAllUserImg();
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

  const getAllUserImg = () => {
    if (localStorage.getItem("userExerciceMai") !== null) {
      axios.get(`http://localhost:5000/pictures/all/${JSON.parse(localStorage.getItem("userExerciceMai")).token}`)
        .then((response) => {
          console.log(response)
          setImagesOwner(response.data)
        })
        .catch((error) => console.error(error));
    }
  }

  const verifyIfUserExist = () => {
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
      }).then((response) => {
        console.log(response);
        getAllImg();
        getAllUserImg();
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

  const deletePicture = async (itemReceived) => {
    axios
      .delete(`http://localhost:5000/pictures/delete/${itemReceived}`)
      .then(response => {
        if (response.status === 200) {
          console.log(response)
          getAllImg();
          getAllUserImg();
        }
      });
  }

  const switchState = (itemReceived) => {
    axios
      .put(`http://localhost:5000/pictures/modify/${itemReceived}`)
      .then(response => {
        if (response.status === 200) {
          console.log(response)
          getAllImg();
          getAllUserImg();
        }
      });
  }

  return (
    <div>
      <Container maxWidth="md" style={{ marginTop: 150, margin: 20 }}>
        <Link href="/login">
          <Button variant="contained" color="primary">Page de connexion</Button>
        </Link>
        {userConnected &&
          <>
            <Button variant="contained" color="error" onClick={() => deleteUser()}>Supprimer mon compte</Button>
            <div style={{margin: 10}}>
              <input type="file" id="img" name="image" accept="image/*" onChange={handleImageUpload} />
              <button disabled={selectedImage === null} onClick={handleUpload}>Upload Image</button>
            </div>
            <div>
              <h2>Toutes les images publiques</h2>
              <div style={{ display: 'flex' }}>
                {images.map((image) => (
                  <div stlye={{ width: 200, height: 200 }}>
                    <img
                      style={{ maxWidth: 200, maxHeight: 200 }}
                      key={image._id}
                      src={`http://localhost:3000/uploads/${image.filename}`}
                      alt={image.originalName}
                    />
                  </div>
                ))}
              </div>
              <h2>Mes images</h2>
              <div style={{ display: 'flex' }}>
                {imagesOwner.map((image) => (
                  <div style={{ display: 'flex', flexDirection: "column", width: 200, height: 280, border: '1px solid grey', padding: 20, margin: 10 }}>
                    <Button onClick={() => deletePicture(image.filename)} fullWidth variant="contained" color="error">Supprimer</Button>
                    <img
                      style={{ maxWidth: 200, maxHeight: 200 }}
                      key={image._id}
                      src={`http://localhost:3000/uploads/${image.filename}`}
                      alt={image.originalName}
                    />
                    <FormControlLabel control={<Switch checkd={image.isPrivate === true} onClick={() => switchState(image.filename)} />} label="Image privée" />
                  </div>
                ))}
              </div>
            </div>
          </>
        }
        {!userConnected && <h2>Vous n'etes pas connecté</h2>}
      </Container>
    </div>
  )
}
