import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Badge,
  Divider
} from '@mui/material'
import { Send } from '@mui/icons-material'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import io from 'socket.io-client'

const Chat = () => {
  const [conversations, setConversations] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [socket, setSocket] = useState(null)
  const messagesEndRef = useRef(null)
  const { user } = useAuth()

  useEffect(() => {
    const newSocket = io('http://localhost:5000')
    setSocket(newSocket)

    newSocket.emit('join_user', user.id)

    newSocket.on('receive_message', (messageData) => {
      setMessages(prev => [...prev, messageData])
    })

    return () => newSocket.close()
  }, [user.id])

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchConversations = async () => {
    try {
      const response = await axios.get('/api/chat')
      setConversations(response.data)
    } catch (error) {
      console.error('Failed to fetch conversations')
    }
  }

  const fetchMessages = async (userId) => {
    try {
      const response = await axios.get(`/api/chat/${userId}`)
      setMessages(response.data)
      setSelectedUser(conversations.find(c => c._id === userId)?.user)
      
      // Mark messages as read
      await axios.put(`/api/chat/read/${userId}`)
    } catch (error) {
      console.error('Failed to fetch messages')
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return

    const messageData = {
      receiver: selectedUser._id,
      message: newMessage.trim()
    }

    try {
      socket.emit('send_message', messageData)
      setNewMessage('')
    } catch (error) {
      console.error('Failed to send message')
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <Box sx={{ height: '80vh' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Chat
      </Typography>

      <Box sx={{ display: 'flex', height: '100%', gap: 2 }}>
        {/* Conversations List */}
        <Paper sx={{ width: 300, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Conversations
          </Typography>
          <List>
            {conversations.map((conversation) => (
              <ListItem
                key={conversation._id}
                button
                selected={selectedUser?._id === conversation._id}
                onClick={() => fetchMessages(conversation._id)}
              >
                <ListItemAvatar>
                  <Badge
                    color="success"
                    variant="dot"
                    invisible={!conversation.user.isActive}
                  >
                    <Avatar>
                      {conversation.user.name.charAt(0)}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={conversation.user.name}
                  secondary={
                    <Box>
                      <Typography variant="body2" noWrap>
                        {conversation.lastMessage?.message}
                      </Typography>
                      {conversation.unreadCount > 0 && (
                        <Badge
                          badgeContent={conversation.unreadCount}
                          color="error"
                        />
                      )}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Chat Area */}
        <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6">
                  {selectedUser.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedUser.role} • {selectedUser.department}
                </Typography>
              </Box>

              {/* Messages */}
              <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
                {messages.map((message, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      justifyContent: message.sender._id === user.id ? 'flex-end' : 'flex-start',
                      mb: 2
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: '70%',
                        p: 2,
                        borderRadius: 2,
                        bgcolor: message.sender._id === user.id ? 'primary.main' : 'grey.100',
                        color: message.sender._id === user.id ? 'white' : 'text.primary'
                      }}
                    >
                      <Typography variant="body1">
                        {message.message}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          opacity: 0.7,
                          color: message.sender._id === user.id ? 'white' : 'text.secondary'
                        }}
                      >
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </Typography>
                    </Box>
                  </Box>
                ))}
                <div ref={messagesEndRef} />
              </Box>

              {/* Message Input */}
              <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    multiline
                    maxRows={3}
                  />
                  <Button
                    variant="contained"
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    sx={{ minWidth: 'auto', px: 3 }}
                  >
                    <Send />
                  </Button>
                </Box>
              </Box>
            </>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100%',
              color: 'text.secondary'
            }}>
              <Typography variant="h6">
                Select a conversation to start chatting
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  )
}

export default Chat