import React, { useState } from "react";
import ChatBot from 'react-simple-chatbot';
import { Segment } from 'semantic-ui-react';
import Button from "@mui/material/Button";
import ChatIcon from '@mui/icons-material/Chat';
import IconButton from '@mui/material/IconButton';

function App() {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatOpenedOnce, setChatOpenedOnce] = useState(false);
  const [userName, setUserName] = useState('');

  const steps = [
      {
          id: "AskName",
          message: "Hi, How can I help you today? Please enter your name.",
          trigger: "Name",
      },
      {
          id: "Name",
          user: true,
          trigger: "validateName",
      },
      {
          id: "validateName",
          message: "Hi {previousValue}, how can I assist you today?",
          trigger: "issues",
      },
      {
          id: "issues",
          options: [
              { value: "React", label: "React", trigger: "React" },
              { value: "Angular", label: "Angular", trigger: "Angular" },
          ],
      },
      {
          id: "React",
          message: "Thanks for letting us know about your React issue. Our team will resolve it ASAP.",
          end: true,
      },
      {
          id: "Angular",
          message: "Thanks for letting us know about your Angular issue. Our team will resolve it ASAP.",
          end: true,
      },
  ];

  const toggleChat = () => {
      if (!chatOpenedOnce) {
          setChatOpenedOnce(true);
          setChatOpen(true);
      } else {
          setChatOpen((prevState) => !prevState);
      }
  };

  const handleEnd = () => {
      setChatOpen(false);
      setUserName(''); // Reset the user's name when the chat ends
  };

  const handleUserInput = (value) => {
      setUserName(value);
  };

  return (
      <>
          <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 1 }}
              onClick={toggleChat}
          >
              <ChatIcon />
          </IconButton>

          {chatOpen && (
              <Segment floated="right">
                  <ChatBot
                      steps={userName ? steps.slice(2) : steps} // Only show the steps after name validation
                      handleEnd={handleEnd}
                      userDelay={400}
                      handleUserInput={handleUserInput}
                  />
              </Segment>
          )}
      </>
  );
}

export default App;
