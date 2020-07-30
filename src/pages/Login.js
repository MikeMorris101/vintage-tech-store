import React, { useState, useContext } from 'react';

//straip functions
import loginUser from '../strapi/loginUser';
import registerUser from '../strapi/registerUser';

//handle user
import { useHistory } from 'react-router-dom';
import { UserContext } from '../context/user';

export default function Login() {
  const history = useHistory();
  //setup user context
  const { userLogin, alert, showAlert } = useContext(UserContext);

  //state values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setusername] = useState('');
  const [isMember, setIsMember] = useState(true);

  let isEmpty = !email || !password || (!isMember && !username) || alert.show;

  const toggleMember = () => {
    setIsMember(!isMember);
  };

  const handleSubmit = async (event) => {
    showAlert({ msg: 'accessing user data. please wait...' });

    //alert
    event.preventDefault();
    let response;
    if (isMember) {
      response = await loginUser({ email, password });
    } else {
      response = await registerUser({ email, password, username });
    }
    if (response) {
      const {
        jwt: token,
        user: { username },
      } = response.data;
      const newUser = { token, username };
      userLogin(newUser);
      showAlert({
        msg: `you are logged in : ${username}. shop away my friend`,
      });
      history.push('/products');
    } else {
      showAlert({
        msg: 'there was an error. please try again...',
        type: 'danger',
      });
    }
  };

  return (
    <section className='form section'>
      <h2 className='section-title'>{isMember ? 'sign in' : 'register'}</h2>
      <form className='login-form'>
        <div className='form-control'>
          <label htmlFor='email'>email</label>
          <input
            type='email'
            name='email'
            id='email'
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div className='form-control'>
          <label htmlFor='password'>password</label>
          <input
            type='password'
            name='password'
            id='password'
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        {!isMember && (
          <div className='form-control'>
            <label htmlFor='username'>username</label>
            <input
              type='username'
              name='username'
              id='username'
              value={username}
              onChange={(e) => {
                setusername(e.target.value);
              }}
            />
          </div>
        )}

        {/* empty form text */}
        {isEmpty && (
          <p className='form-empty'>please fill out all form fields</p>
        )}

        {/* submit */}
        {!isEmpty && (
          <button
            type='submit'
            className='btn btn-block btn-primary'
            onClick={handleSubmit}
          >
            submit
          </button>
        )}

        {/* register link */}
        <p className='register-link'>
          {isMember ? 'need to register?' : 'already a member?'}
          <button type='button' onClick={toggleMember}>
            click here
          </button>
        </p>
      </form>
    </section>
  );
}
