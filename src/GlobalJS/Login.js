import React, { useState, useRef,useContext, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../GlobalCSS/Login.css";
import {handleNextFocus} from "../GlobalJS/GlobalFunctions";
const LoginUrl = "/AccountsAPI/Accounts/UserLogin";
const SignupUrl = "/AccountsAPI/Accounts/UserSignUp";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [userName,setUserNamel] = useState("");
  const [password,setPassword] = useState("");
  const [suserName,setsUserName] = useState("");
  const [spassword,setsPassword] = useState("");
  const [confirmPass,setConfirmPass] = useState("");
  const passwordRef = useRef(null);
  const loginRef = useRef(null);
  const spasswordRef = useRef(null);
  const confirmPassRef = useRef(null);
  const signupRef = useRef(null);
  const navigate = useNavigate();

  const slideStyle = {
    marginLeft: isLogin ? '0%' : '-50%'
  };

  const handleSignupClick = () => setIsLogin(false);
  const handleLoginClick = () => setIsLogin(true);

  const fn_Login = async (e) => {
    e.preventDefault(); 
    let obj = {
      UserName: userName,
      Password: password
    }
    const response = await axios.post(LoginUrl,obj);
    if(response.data.success)
    {
        sessionStorage.setItem("UserName", userName.toUpperCase());
        sessionStorage.setItem("ShortName", userName.substring(0, 2).toUpperCase());
        navigate("/Layout");
    }
    else
    {
      passwordRef.current.focus();
      Swal.fire({
        icon: "error",
        text: response.data.message,
      });
      
    }
  }

  const fn_Signup = async (e) => {
    e.preventDefault(); 
    if(spassword != confirmPass)
    {
        Swal.fire({
        icon: "warning",
        text: "Password and confirm password is not match ...",
      });
      return;
    }
    let obj = {
      UserName: suserName,
      Password: spassword
    }
    const response = await axios.post(SignupUrl,obj);
    if(response.data.success)
    {
        Swal.fire({
        icon: "success",
        text: response.data.message,
      });
      setsUserName("");
      setsPassword("");
      setConfirmPass("");
    }
    else
    {
      Swal.fire({
        icon: "error",
        text: response.data.message,
      });
      
    }
  }

  return (
    <div className="login-body">
      <div className="wrapper">
        <div className="title-text">
          <div className="title login" style={slideStyle}>Login</div>
          <div className="title signup">Signup</div>
        </div>

        <div className="form-container">
          <div className="slide-controls">
            <input type="radio" name="slide" id="login" checked={isLogin} readOnly />
            <input type="radio" name="slide" id="signup" checked={!isLogin} readOnly />
            <label htmlFor="login" className="slide login" onClick={handleLoginClick}>Login</label>
            <label htmlFor="signup" className="slide signup" onClick={handleSignupClick}>Signup</label>
            <div className="slider-tab" style={{ left: isLogin ? '0%' : '50%' }}></div>
          </div>

          <div className="form-inner">
            <form action="#" className="login" style={slideStyle}>
              <div className="field">
                <input type="text" placeholder="User Name" autoFocus onKeyDown={(e) => handleNextFocus(e, passwordRef)} value={userName} onChange={(e) => setUserNamel(e.target.value) } />
              </div>
              <div className="field">
                <input type="password" placeholder="Password" ref={passwordRef} onKeyDown={(e) => handleNextFocus(e, loginRef)} value={password} onChange={(e) => setPassword(e.target.value) } />
              </div>
              <div className="pass-link"><a href="#">Forgot password?</a></div>
              <div className="field btn">
                <div className="btn-layer"></div>
                <input type="submit" value="Login" ref={loginRef} onClick={fn_Login} />
              </div>
              <div className="signup-link">
                Not a member? <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(false); }}>Signup now</a>
              </div>
            </form>

            <form action="#" className="signup">
              <div className="field">
                <input type="text" onKeyDown={(e) => handleNextFocus(e, spasswordRef)} value={suserName} onChange={(e) => setsUserName(e.target.value) }  placeholder="User Name" />
              </div>
              <div className="field">
                <input type="password" placeholder="Password" ref={spasswordRef} onKeyDown={(e) => handleNextFocus(e, confirmPassRef)} value={spassword} onChange={(e) => setsPassword(e.target.value) }  />
              </div>
              <div className="field">
                <input type="password" placeholder="Confirm password" ref={confirmPassRef} onKeyDown={(e) => handleNextFocus(e, signupRef)} value={confirmPass} onChange={(e) => setConfirmPass(e.target.value) } />
              </div>
              <div className="field btn">
                <div className="btn-layer"></div>
                <input type="submit" value="Signup" ref={signupRef} onClick={fn_Signup} />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;