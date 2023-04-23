import { useEffect, useState } from 'react'
import axios from 'axios'
import { userTokenFunction } from '../../helpers/auth'
import BackButton from '../common/BackArrow'
import SendIcon from '@mui/icons-material/Send'
import Messaging from '../common/Messaging'

const Messages = () => {
  const [messages, setMessages] = useState([])
  const [error, setError] = useState('')
  const userToken = userTokenFunction()
  const currentUser = localStorage.getItem('current user')
  const [isActive, setActive] = useState(false)
  const [newrecipient, setNewRecipient] = useState()

  const handleClick = (e) => {
    setActive(!isActive)
    setNewRecipient(e.target.value)
  }

  useEffect(() => {
    const getMessages = async () => {
      try {
        const { data } = await axios.get('/api/messages/1/', userToken)
        console.log(data)
        setMessages(data)
      } catch (error) {
        console.log(error)
        setError(error.response.data.message)
      }
    }
    getMessages()
  }, [])
  
  return (
    <div className='main-container'>
      {messages.length > 0 ?
        <div>
          <h3 className='profile-title'>Your messages:</h3>
          <BackButton />
          <div className='messages-container'>
            {messages.map(item => {
              const { id, message, owner, recipient } = item
              return (
                <div key={id}>
                  <div className='comment-owner'>
                    <p className='username-box'>Message from: {owner.username}</p>
                    <img className='user-profile-image' src={owner.profileimage} alt='user profile image' />
                    {currentUser === owner.username ? <></> : <button className='button-common' onClick={handleClick} value={owner.id}><span><SendIcon sx={{ color: 'white', fontSize: 20 }} className='icon' /></span> Reply to {owner.username}</button>}
                    {isActive ? <Messaging value={newrecipient}/> : <></>}
                  </div>
                  <div className='comment-owner'>
                    <p className='username-box'>Message to: {recipient.username}</p>
                    <img className='user-profile-image' src={recipient.profileimage} alt='user profile image' />                    
                  </div>
                  <p className='user-comment'>{message}</p>
                </div>
              )
            })
            }
          </div>
        </div>
        :
        <p>no messages here</p>
      }
    </div>
  )
}

export default Messages