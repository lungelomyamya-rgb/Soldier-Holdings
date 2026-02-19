/**
 * User Messages Component
 *
 * Displays user notifications (errors, warnings, success, info)
 * Provides consistent UI for all user feedback
 * Uses UI primitives and CSS modules for consistent styling
 */

import React from 'react';
import { useUserMessages } from '../hooks/useErrorHandler';
import { UserMessageAction } from '../interfaces/IErrorHandlerService';
import { UserMessage } from '../types/errors';
import Box from './ui/Box';
import Flex from './ui/Flex';
import Typography from './ui/Typography';
import { UserMessagesProps } from '../types/index';
import styles from '../styles/UserMessages.module.css';

const UserMessages: React.FC<UserMessagesProps> = ({ className = '', position = 'top-right' }) => {
  const { messages, clearMessages } = useUserMessages();

  if (messages.length === 0) {
    return null;
  }

  const handleMessageClick = (messageId: string, action?: () => void) => {
    if (action) {
      action();
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'error':
        return 'fas fa-exclamation-circle';
      case 'success':
        return 'fas fa-check-circle';
      case 'warning':
        return 'fas fa-exclamation-triangle';
      case 'info':
        return 'fas fa-info-circle';
      default:
        return 'fas fa-info-circle';
    }
  };

  return (
    <Box className={`${styles.userMessages} ${styles[`position${position.charAt(0).toUpperCase() + position.slice(1)}`]} ${className}`}>
      {messages.map((message: UserMessage) => (
        <Box
          key={message.id}
          className={`${styles.userMessage} ${styles[`type${message.type.charAt(0).toUpperCase() + message.type.slice(1)}`]}`}
          role="alert"
          aria-live="polite"
        >
          <Flex className={styles.messageContent}>
            <Flex className={styles.iconContainer}>
              <i className={`${getIcon(message.type)} ${styles.icon}`} />
            </Flex>

            <Box className={styles.textContent}>
              <Typography variant="h4" className={styles.title}>
                {message.title}
              </Typography>
              <Typography variant="body2" className={styles.message}>
                {message.message}
              </Typography>
            </Box>

            {!message.persistent && (
              <button
                className={styles.closeButton}
                onClick={() => clearMessages()}
                aria-label="Close message"
              >
                <i className="fas fa-times" />
              </button>
            )}
          </Flex>

          {message.actions && message.actions.length > 0 && (
            <Flex className={styles.actionsContainer}>
              {message.actions.map((action: UserMessageAction, index: number) => (
                <button
                  key={index}
                  className={`${styles.actionButton} ${action.primary ? styles.primary : ''}`}
                  onClick={() => handleMessageClick(message.id, action.action)}
                >
                  <Typography variant="body2">
                    {action.label}
                  </Typography>
                </button>
              ))}
            </Flex>
          )}
        </Box>
      ))}

      {messages.length > 1 && (
        <button className={styles.clearAllButton} onClick={clearMessages}>
          <Typography variant="body2">
            Clear All
          </Typography>
        </button>
      )}
    </Box>
  );
};

export default UserMessages;
