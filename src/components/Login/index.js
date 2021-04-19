import React, { useState, useEffect } from 'react'
import {Redirect,Link,useHistory} from "react-router-dom";
import Box from '@material-ui/core/Box'
import { useRouter } from 'next/router'
import styles from "./styles.module.scss"
import { Typography, Button, TextField, Checkbox, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import theme from '../../theme';
import { connect, useSelector } from "react-redux";
import { signup, verifyToken, closeAlert } from '../../redux/actions/user';

//Classes for Material UI elements
const useStyles = makeStyles({
    darkTheme: {
        color: theme.palette.primary.dark,
    },
    input: {
        '&::placeholder': {
            fontSize: 6
        }
    },
    InputBox: {
        borderRadius: '6px',
        height: '32px',
        fontSize: '14px'
    },
    space: {
        marginTop: "20px"
    },
    spaceBottom: {
        marginBottom: "20px"
    }
});

//Functional component starts
function SignUp({ dispatch,props }) {

    //Hooks call
    const router = useRouter();
    const classes = useStyles();
    let history = useHistory();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmpassword, setConfirmPassword] = useState('')
    const [errMsg, setErrMsg] = useState({
        email: '',
        password1: "",
        password2: "",
        wrongCredentials: '',
        wrongCredentials1: ''
    })
    const {verifyTokenObj, resetPasswordObj} = useSelector(state => state.user)


    console.log('verifyTokenObj: ',verifyTokenObj)
    console.log('resetPasswordObj: ',resetPasswordObj)
    verifyTokenObj.email && !email &&  setEmail(verifyTokenObj.email);
    

    //validating Email
    function isInvalidEmail() {
        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (email) {
            if (reg.test(email)) {
                // setErrMsg({ email: '' });
                return false;
            } else {
                console.log("You have entered an invalid email address!")
                // setErrMsg({ email: 'Invalid Email Id' });
                return true;
            }
        } else return false;

    }

    //validating Password length and characters
    function isMatchPassword() {
        var reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
        if (password) {
            if (reg.test(password)) {
                return false;
            } else {

                // setErrMsg({ wrongCredentials: 'Check and enter correct Password' })
                console.log('Check and enter correct Password');
                return true;
            }
        }
        else
            return false;


    }

    //validating Password length and characters
    function isMatchPassword1() {
        var reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
        if (confirmpassword) {
            if (reg.test(confirmpassword)) {
                return false;
            } else {

                // setErrMsg({ wrongCredentials: 'Check and enter correct confirm Password' })
                console.log('Check and enter correct confirm Password');
                return true;
            }
        }
        else
            return false;


    }

    //comparing password and confirmpassword
    let handleUpdate = () => {
        if (password && confirmpassword && ( password == confirmpassword)) {
            setErrMsg({ wrongCredentials: '' });
            let { id } = verifyTokenObj;
            dispatch(signup({ id, password }));
            setTimeout(() => {
                history.push('/');
            }, 8000);
            setPassword("");
            setConfirmPassword("");
        } else {
            setErrMsg({ wrongCredentials: 'Please enter valid Password' })
        }
    }

    //ComponentDidMount
    useEffect(() => {
        var tokenArr = window.location.href.split("/");
        var token = tokenArr[tokenArr.length - 1];
        console.log('token ', token)
        setPassword("");
        dispatch(verifyToken(token));
    }, [])


    return (
        <div className={styles.container}>
            { resetPasswordObj.isSuccess  ?    
            <Snackbar open={resetPasswordObj.isSuccess} autoHideDuration={8000} onClose={()=>{dispatch(closeAlert())}} >
                <Alert onClose={()=>{dispatch(closeAlert())}} variant="filled" severity="success">
                    <div style={{ fontSize: 18, textAlign: 'center' }}>user's Password is Updated Successfully</div>
                    <div style={{ fontSize: 18, textAlign: 'center' }}>You are being redirected to Login screen. Please wait.</div>
                </Alert>
            </Snackbar> : 
                resetPasswordObj.isError ? 
                <Snackbar open={resetPasswordObj.isError} autoHideDuration={5000} onClose={()=>{dispatch(closeAlert())}} >
                    <Alert onClose={()=>{dispatch(closeAlert())}} variant="filled" severity="warning">
                        {resetPasswordObj.message}
                    </Alert>
                </Snackbar> : null
            }
            <div className={styles.loginContainer}>
                <Typography
                    variant="h6"
                >
                    Find your insight based action
                </Typography>
                
                <div className={styles.inputFields}>
                    <TextField
                        error={isInvalidEmail()}
                        id="email"
                        type="email"
                        placeholder="Email"
                        variant="outlined"
                        size="small"
                        helperText={isInvalidEmail() ? 'Invalid Email' : ''}
                        inputProps={{
                            style: {
                                padding: 7,
                                width: 260,
                                height: 30
                            }
                        }}
                        className={styles.inputBoxStyle}
                        value = {email}
                        disabled
                    />
                    <TextField

                        error={isMatchPassword()}
                        id="password"
                        type="password"
                        helperText={isMatchPassword() ? 'Invalid password' : ''}
                        placeholder="Create Password"
                        variant="outlined"
                        size="small"
                        inputProps={{
                            style: {
                                padding: 7,
                                width: 260,
                                height: 30
                            }
                        }}
                        className={styles.inputBoxStyle}
                        margin="normal"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value) }}
                        onBlur={() => { isMatchPassword() }}
                    />
                    {
                        (errMsg.wrongCredentials !== '') ? <p style={{ color: "red" }}>{errMsg.wrongCredentials} </p> : null
                    }
                    <TextField
                        id="confirmpassword"
                        type="password"
                        placeholder="Confirm Password"
                        variant="outlined"
                        error={isMatchPassword1()}
                        helperText={isMatchPassword1() ? 'Invalid confirm password' : ''}
                        size="small"
                        className={styles.inputBoxStyle}
                        inputProps={{
                            style: {
                                padding: 7,
                                width: 260,
                                height: 30
                            }
                        }}
                        margin="normal"
                        value={confirmpassword}
                        onChange={(e) => { setConfirmPassword(e.target.value) }}
                        onBlur={() => { isMatchPassword1() }}

                    />
                    {
                        (errMsg.wrongCredentials1 !== '') ? <p style={{ color: "red" }}>{errMsg.wrongCredentials1} </p> : null
                    }


                    <Box display="flex" align="center" className={`${styles.text}`}>
                        <Typography variant="caption" className={`${styles.text}`} >
                            Your password should contain minimum 8 characters with atleast one capital and one small letter,one numeral and one special character
                        </Typography>
                    </Box>
                </div>
                <div>
                    <Button 
                    color="primary" 
                    variant="outlined" 
                    className={`${classes.InputBox} ${classes.spaceBottom} ${styles.customButton}`} 
                    size="small" 
                    onClick={handleUpdate}>
                        <Box m={0} px={11}>Update</Box> 
                    </Button>
                </div>
                <Typography align="center" variant="caption" className={`${styles.text}`}>
                    Click here to 
                    <Link to="/">
                        Login
                    </Link>.
               </Typography>
            </div>
        </div>
    )
}


export default connect()(SignUp)