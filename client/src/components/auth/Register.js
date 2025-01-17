import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import ImageCarousel from '../common/ImageCarousel'

const Register = () => {
  const navigate = useNavigate()

  const [formFields, setFormFields] = useState({
    username: '',
    email: '',
    profileimage: '',
    password: '',
    passwordconfirmation: '',
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormFields({ ...formFields, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    setError('')
    console.log(formFields)
    e.preventDefault()
    try {
      const { data } = await axios.post('/api/auth/register/', formFields)
      localStorage.setItem('THEATRE-PROJECT-TOKEN', data.token)
      const currentUser = data.username
      localStorage.setItem('current user', currentUser)
      const musicalpage = localStorage.getItem('musical-page')
      navigate(musicalpage)
      localStorage.removeItem('musical-page')
    } catch (error) {
      console.log(error.response.data.detail)
      setError(error.response.data.detail)
    }
  }

  const handleUpload = async (e) => {
    const image = e.target.files[0]
    const pictureToUpload = new FormData()
    pictureToUpload.append('file', image)
    pictureToUpload.append('upload_preset', process.env.REACT_APP_UPLOAD_PRESET)
    try {
      const { data } = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDNAME}/image/upload`, pictureToUpload)
      setFormFields({ ...formFields, profileimage: data.secure_url })
    } catch (error) {
      setError(error.response.data)
    }
  }

  const navigateLogin = () => {
    navigate('/login')
  }

  return (
    <main className='form-page'>
      <form onSubmit={handleSubmit}>
        <h1>Register here!</h1>
        <div className='form-container'>
          <a href='https://uk.hadestown.com/?_ga=2.141747122.1843058498.1681983080-1442831874.1681983080'>
            <img className='register-image' src='https://images.ctfassets.net/6pezt69ih962/2PxxtNSc6MjdNIWz4OQbrd/e5ef0df143a6a389243bb1b16cb8cfd5/hadestown_new-1200.jpg' alt='Hadestown image' />
          </a>
          <label htmlFor='username'></label>
          <input type='text' name='username' placeholder='Username' onChange={handleChange} value={formFields.username} />
          {error.username && <p className='error'>Error: {error.username}</p>}
          <label htmlFor='email'></label>
          <input type='email' name='email' placeholder='Email' onChange={handleChange} value={formFields.email} />
          {error.email && <p className='error'>Error: {error.email}</p>}
          <label htmlFor='profileimage'></label>
          {formFields.profileimage ? <img src={formFields.profileimage} /> : <input type='file' onChange={handleUpload} value={formFields.profileimage} />}
          {error.profileimage && <p className='error'>Error: {error.profileimage}</p>}
          <label htmlFor='password'></label>
          <input type='password' name='password' placeholder='Password' onChange={handleChange} value={formFields.password} />
          {error.password && <p className='error'>Error: {error.password}</p>}
          <label htmlFor='passwordconfirmation'></label>
          <input type='password' name='passwordconfirmation' placeholder='Confirm password' onChange={handleChange} value={formFields.passwordconfirmation} />
          {error.passwordconfirmation && <p className='error'>Error: {error.passwordconfirmation}</p>}
        </div>
        <button className='register-button button-common'>Register</button>
        <button onClick={navigateLogin} className='register-button button-common'>Already have an account? Log in now.</button>
      </form>
      <ImageCarousel />
    </main>
  )
}

export default Register