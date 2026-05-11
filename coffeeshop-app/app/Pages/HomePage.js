'use client';

import Link from 'next/link';

export default function LoginPage() {
  return (
    <>
      <div className="container">
zzz
        {/* LEFT SIDE */}
        <div className="left"></div>

        {/* RIGHT SIDE */}
        <div className="right">

          <div className="overlay"></div>

          <div className="login-box">

            <h1>Welcome Back to SipSync!</h1>

            <div className="input-box">
              <input type="email" placeholder="Email Address" />
            </div>

            <div className="input-box">
              <input type="password" placeholder="Password" />
            </div>

            <div className="forgot">
              <a href="#">Forgot password ?</a>
            </div>

            <button className="login-btn">
              Login
            </button>

            <div className="or">or</div>

            <div className="google-login">
              <input type="checkbox" />
              <span>Sign in with google</span>
            </div>

            <div className="signup">
              Don’t have an account?{' '}
              <Link href="/signup">Sign up</Link>
            </div>

          </div>
        </div>
      </div>

      <style jsx>{`
        .container{
          width:100%;
          height:100vh;
          display:flex;
          overflow:hidden;
          font-family:Arial, Helvetica, sans-serif;
        }

        .left{
          width:50%;
          background-image:url('/login_side.png');
          background-size:cover;
          background-position:center;
        }

        .right{
          width:50%;
          position:relative;
          background-image:url('/login_bg.png');
          background-size:cover;
          background-position:center;
          display:flex;
          justify-content:center;
          align-items:center;
        }

        .overlay{
          position:absolute;
          inset:0;
          background:rgba(0,0,0,0.45);
          backdrop-filter:blur(2px);
        }

        .login-box{
          position:relative;
          z-index:2;
          width:380px;
          color:white;
          text-align:center;
        }

        .login-box h1{
          font-size:38px;
          font-weight:500;
          margin-bottom:35px;
        }

        .input-box{
          margin-bottom:18px;
        }

        .input-box input{
          width:100%;
          padding:14px 16px;
          border:none;
          outline:none;
          background:rgba(0,0,0,0.35);
          color:white;
          font-size:15px;
        }

        .input-box input::placeholder{
          color:#ddd;
        }

        .forgot{
          text-align:right;
          margin-bottom:20px;
        }

        .forgot a{
          color:#ddd;
          text-decoration:none;
          font-size:12px;
        }

        .login-btn{
          width:180px;
          padding:12px;
          border:none;
          border-radius:30px;
          background:white;
          color:#444;
          font-size:18px;
          font-weight:bold;
          cursor:pointer;
          margin-bottom:12px;
        }

        .or{
          margin-bottom:12px;
          color:#ddd;
        }

        .google-login{
          display:flex;
          justify-content:center;
          align-items:center;
          gap:10px;
          margin-bottom:35px;
        }

        .google-login input{
          width:18px;
          height:18px;
        }

        .signup{
          color:#ddd;
        }

        .signup a{
          color:white;
          font-weight:bold;
          text-decoration:none;
        }

        @media screen and (max-width:900px){

          .left{
            display:none;
          }

          .right{
            width:100%;
          }
        }
      `}</style>
    </>
  );
}