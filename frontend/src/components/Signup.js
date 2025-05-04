
import React, {useState} from 'react'
import axios from "axios"
import { toast } from "react-toastify";
import {Link, useNavigate} from "react-router-dom";

const Signup = () => {
    const navigate=useNavigate()
    const [formdata, setFormdata]=useState({
        email:"",
        name:"",
        password:"",
        password2:"",
    })
    const [error, setError]=useState('')

    const handleOnchange = (e)=>{
        const {name, type, checked, value} = e.target
        setFormdata({...formdata,
            [name]: type === 'checkbox' ? checked : value
        })
        //setFormdata({...formdata, [e.target.name]:e.target.value})
    }
    const {email, name, password, password2}=formdata

    const handleSubmit =async (e)=>{
        e.preventDefault();

        if (password !== password2) {
            toast.error("Passwords do not match!");
            return;
        }

        if (!email || !name || !password || !password2) {
            toast.error("Please fill out all fields.");
            return;
        }

        try {
            console.log(formdata)
            const response = await axios.post('http://localhost:8000/api/signup/', formdata);
            console.log(response.data);
            const result = response.data;
            if (response.status === 201) {
                navigate("/otp/verify");
                alert(result.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong during registration!");
            setError('Failed to register');
        }

    }

  return (
      <div>
          <section>
              <div className="leaves">
                  <div className="set">
                      <div><img src="/imagelogin/b1.png" alt="leaf1"/></div>
                      <div><img src="/imagelogin/b2.png" alt="leaf2"/></div>
                      <div><img src="/imagelogin/b3.png" alt="leaf3"/></div>
                      <div><img src="/imagelogin/b4.png" alt="leaf4"/></div>
                      <div><img src="/imagelogin/b5.png" alt="leaf5"/></div>
                      <div><img src="/imagelogin/b2.png" alt="leaf6"/></div>
                      <div><img src="/imagelogin/b3.png" alt="leaf7"/></div>
                      <div><img src="/imagelogin/b4.png" alt="leaf8"/></div>
                  </div>
              </div>
              <img src="/imagelogin/4.png" className="bg" alt="background"/>
              <div className="login">
                  <h2>Signup</h2>
                  <form onSubmit={handleSubmit}>
                      <div className="inputBox">
                          <input
                              type="email"
                              placeholder="email"
                              className="email-form"
                              value={email}
                              name="email"
                              onChange={handleOnchange}
                          />
                      </div>
                      <div className="inputBox">
                          <input
                              type="text"
                              placeholder="name"
                              className="email-form"
                              value={name}
                              name="name"
                              onChange={handleOnchange}
                          />
                      </div>
                      <div className="inputBox">
                          <input
                              type="password"
                              placeholder="password"
                              className="email-form"
                              value={password}
                              name="password"
                              onChange={handleOnchange}
                          />
                      </div>
                      <div className="inputBox">
                          <input
                              type="password"
                              placeholder="confirm password"
                              className="email-form"
                              value={password2}
                              name="password2"
                              onChange={handleOnchange}
                          />
                      </div>
                      <div className="inputBox">
                          <input type="submit" value="Signup" className="submitButton" id="btn"/>
                      </div>
                      <p><Link className="signlink" to="/login">Have a account</Link></p>
                  </form>
              </div>
          </section>
      </div>
  )
}

export default Signup
