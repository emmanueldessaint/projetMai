import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Login({ token, setTokenUrl }) {

    const router = useRouter();

    const [loginName, setLoginName] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [signupName, setSignupName] = useState('');
    const [signupPassword, setSignupPassword] = useState('');

    const connect = async () => {
        axios
            .post('http://localhost:5000/users/login', {
                name: loginName,
                password: loginPassword
            })
            .then(response => {
                if (response.status === 200) {
                    router.push('/');
                    localStorage.setItem("userExerciceMai", JSON.stringify(response.data.registeredUser));
                }
            });
    }

    const signup = async () => {
        axios
            .post('http://localhost:5000/users/create', {
                name: signupName,
                password: signupPassword
            })
            .then(response => {
                if (response.status === 200) {
                    console.log(response)
                    router.push('/');
                    localStorage.setItem("userExerciceMai", JSON.stringify(response.data.newUser));
                }
            });
    }

    return (
        <div>
            <Container maxWidth="md" style={{ marginTop: 150 }}>
                <div style={{textAlign: "center"}}>
                    <Link href="/">
                        <Button variant="contained" color="primary">Dashboard</Button>
                    </Link>
                </div>
                <Grid container spacing={12}>
                    <Grid item xs={6}>
                        <h2 style={{ marginBottom: 20 }}>Se connecter</h2>
                        <TextField
                            style={{ marginBottom: 20 }}
                            type="email"
                            value={loginName}
                            size="small"
                            onChange={(e) => setLoginName(e.target.value)}
                            label="Nom de compte"
                            variant="outlined"
                            fullWidth
                        />
                        <TextField
                            style={{ marginBottom: 10 }}
                            value={loginPassword}
                            type="password"
                            size="small"
                            onChange={(e) => setLoginPassword(e.target.value)}
                            label="Mot de passe"
                            variant="outlined"
                            fullWidth
                        />
                        <Button variant="contained" onClick={() => connect()}>Envoyer</Button>
                    </Grid>
                    <Grid item xs={6}>
                        <h2 style={{ marginBottom: 20 }}>Créer un compte</h2>
                        <TextField
                            style={{ marginBottom: 20 }}
                            type="email"
                            value={signupName}
                            size="small"
                            onChange={(e) => setSignupName(e.target.value)}
                            label="Nom de compte"
                            variant="outlined"
                            fullWidth
                        />
                        <TextField
                            style={{ marginBottom: 10 }}
                            value={signupPassword}
                            type="password"
                            size="small"
                            onChange={(e) => setSignupPassword(e.target.value)}
                            label="Mot de passe"
                            variant="outlined"
                            fullWidth
                        />
                        <Button variant="contained" onClick={() => signup()}>Envoyer</Button>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}
