import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useAddMessageMutation, } from '../../../redux/index.js';
import filter from '../../../leo-profanity.js'

const MessageForm = ({ activeChannelId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

	const inputRef = useRef();
	useEffect(() => {
    inputRef.current.focus();
  }, [activeChannelId]);

  const [ addMessage ] = useAddMessageMutation();

	const formik = useFormik({
    initialValues: {
      body: '',
      channelId: '',
      username: '',
    },
    onSubmit: async (values) => {
      setIsLoading(true);
      try{
        //поменять на получение username из api
        const { username } = JSON.parse(localStorage.getItem('userData'));
        formik.values.username = username;
        formik.values.channelId = activeChannelId;
        formik.values.body = filter.clean(formik.values.body);
        await addMessage(values);
        formik.resetForm();
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
        toast.error(t('messages.errors.send'));
      } finally {
        // не работает автофокус
        inputRef.current.focus();
      }

    },
  });

  return (
    <Form onSubmit={formik.handleSubmit} noValidate="" className="py-1 border rounded-2">
      <Form.Group className="input-group has-validation">
        <Form.Control
          onChange={formik.handleChange}
          value={formik.values.body}
          name="body"
          id="body"
          aria-label={t('messages.label')}
          placeholder={t('messages.placeholder')}
          className="border-0 p-0 ps-2 form-control"
          ref={inputRef}
          type="text"
          required
          disabled={isLoading}                    
        />
        <Button 
          disabled={isLoading} 
          type="submit" 
          variant="light" 
          className="btn-group-vertical"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
            <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"></path>
          </svg>
          <span className="visually-hidden">{t('messages.send')}</span>
        </Button>
      </Form.Group>
    </Form>
  )
};

export default MessageForm;