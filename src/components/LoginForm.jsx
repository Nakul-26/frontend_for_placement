//not in use *********************** NOT IN USE *********************************************

// src/components/LoginForm.jsx (or wherever your component files are)
// import { useState } from 'react';
// import { useAuth } from '../context/AuthContext.jsx';
// import { useNavigate, Link } from 'react-router-dom';
// import { Box, TextField, Button, Typography, Alert } from '@mui/material';

// export default function LoginForm() {
//   const { login } = useAuth();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     if (!email || !password) {
//       setError('Email and password are required.');
//       return;
//     }

//     try {
//       setLoading(true);
//       await login(email, password);
//       navigate('/dashboard');
//     } catch (err) {
//       setError(err?.message || 'Login failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleLogin = () => {
//     window.location.href = 'http://localhost:3000/auth/google';
//   };

//   return (
//     <>
//       <Typography component="h1" variant="h5" align="center">
//         Sign in
//       </Typography>
//       {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
//       <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
//         <TextField
//           margin="normal"
//           required
//           fullWidth
//           id="email"
//           label="Email Address"
//           name="email"
//           autoComplete="email"
//           autoFocus
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <TextField
//           margin="normal"
//           required
//           fullWidth
//           name="password"
//           label="Password"
//           type="password"
//           id="password"
//           autoComplete="current-password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <Button
//           type="submit"
//           fullWidth
//           variant="contained"
//           sx={{ mt: 3, mb: 2 }}
//           disabled={loading}
//         >
//           {loading ? 'Signing In...' : 'Sign In'}
//         </Button>
//         <Button
//           fullWidth
//           variant="outlined"
//           onClick={handleGoogleLogin}
//           disabled={loading}
//         >
//           {loading ? 'Redirecting...' : 'Sign in with Google'}
//         </Button>
//         <Box sx={{ mt: 2, textAlign: 'center' }}>
//           <Link to="/register" style={{ textDecoration: 'none' }}>
//             <Typography variant="body2" color="primary">
//               {"Don't have an account? Sign Up"}
//             </Typography>
//           </Link>
//         </Box>
//       </Box>
//     </>
//   );
// }