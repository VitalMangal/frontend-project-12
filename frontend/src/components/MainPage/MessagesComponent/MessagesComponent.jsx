import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

import { useGetChannelsQuery, useGetMessagesQuery } from '../../../store/index.js';
import MessageForm from './MessagesForm.jsx';

const MessagesComponent = () => {
  const { t } = useTranslation();
  const activeChannelId = useSelector((state) => state.activeChannelId.value);
  const { data: messages = [], error } = useGetMessagesQuery();
  const { data: channels = [] } = useGetChannelsQuery();

  useEffect(() => {
    if (error) {
      toast.error(t('messages.errors.loading'));
    }
  }, [error, t]);

  const activeChannel = channels.filter((channel) => channel.id === activeChannelId);
  const messagesFromActiveChannel = messages.filter((mess) => mess.channelId === activeChannelId);

  return (
    <div className="col p-0 h-100">
      <div className="d-flex flex-column h-100">
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0">
            <b>{activeChannel?.name}</b>
          </p>
          <span className="text-muted">{t('messages.mess', { count: messagesFromActiveChannel.length })}</span>
        </div>
        <div id="messages-box" className="chat-messages overflow-auto px-5 ">
          {messagesFromActiveChannel.map((message) => (
            <div className="text-break mb-2" key={message.id}>
              <b>{message.username}</b>
              :
              {` ${message.body}`}
            </div>
          ))}
        </div>
        <div className="mt-auto px-5 py-3">
          <MessageForm />
        </div>
      </div>
    </div>
  );
};

export default MessagesComponent;
