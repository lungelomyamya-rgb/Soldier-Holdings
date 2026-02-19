/**
 * User Messages Component
 *
 * Displays user notifications (errors, warnings, success, info)
 * Provides consistent UI for all user feedback
 */

import React from 'react';
import { useUserMessages } from '../hooks/useErrorHandler';
import { UserMessageAction } from '../interfaces/IErrorHandlerService';
import { UserMessage } from '../types/errors';
import '../styles/UserMessages.css';

interface UserMessagesProps {
  className?: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

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
    <div className={`user-messages user-messages--${position} ${className}`}>
      {messages.map((message: UserMessage) => (
        <div
          key={message.id}
          className={`user-message user-message--${message.type}`}
          role='alert'
          aria-live='polite'
        >
          <div className='user-message__content'>
            <div className='user-message__icon'>
              <i className={getIcon(message.type)} />
            </div>
            <div className='user-message__text'>
              <div className='user-message__title'>{message.title}</div>
              <div className='user-message__message'>{message.message}</div>
            </div>
            {!message.persistent && (
              <button
                className='user-message__close'
                onClick={() => clearMessages()}
                aria-label='Close message'
              >
                <i className='fas fa-times' />
              </button>
            )}
          </div>
          {message.actions && message.actions.length > 0 && (
            <div className='user-message__actions'>
              {message.actions.map((action: UserMessageAction, index: number) => (
                <button
                  key={index}
                  className={`user-message__action ${action.primary ? 'primary' : ''}`}
                  onClick={() => handleMessageClick(message.id, action.action)}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
      {messages.length > 1 && (
        <button className='user-messages__clear-all' onClick={clearMessages}>
          Clear All
        </button>
      )}
    </div>
  );
};

export default UserMessages;
