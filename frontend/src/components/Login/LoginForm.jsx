import React, {
  useEffect, useRef, useState,
} from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { useAuth } from '../../hooks';
import { useLoginUserMutation } from '../../store/index.js';
import pages from '../../utils/pages.js';

const LoginForm = () => {
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const { t } = useTranslation();
  const auth = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef();
  const [authFailed, setAuthFailed] = useState(false);

  const formSchema = yup.object().shape({
    username: yup.string().required(t('login.errors.required')).trim(),
    password: yup.string().required(t('login.errors.required')),
  });

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      setAuthFailed(false);
      loginUser(values)
        .unwrap()
        .then((response) => {
          const newData = { ...response, userLoggedIn: true };
          auth.logIn(newData);
          navigate(pages.main);
        })
        .catch((error) => {
          if (error?.status === 401) {
            setAuthFailed(true);
            inputRef.current.select();
          }
        });
    },
  });

  return (
    <Form onSubmit={formik.handleSubmit} className="col-12 col-md-6 mt-3 mt-mb-0">
      <h1 className="text-center mb-4">{t('login.come')}</h1>
      <Form.Group className="form-floating mb-3">
        <Form.Control
          onChange={formik.handleChange}
          value={formik.values.username}
          placeholder={t('login.nickname')}
          name="username"
          id="username"
          autoComplete="username"
          isInvalid={authFailed}
          required
          ref={inputRef}
          type="text"
          disabled={isLoading}
        />
        <Form.Label htmlFor="username">{t('login.nickname')}</Form.Label>
      </Form.Group>
      <Form.Group className="form-floating mb-4">
        <Form.Control
          onChange={formik.handleChange}
          value={formik.values.password}
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder={t('login.password')}
          isInvalid={authFailed}
          disabled={isLoading}
        />
        <Form.Label htmlFor="password" className="form-label">{t('login.password')}</Form.Label>
        <Form.Control.Feedback type="invalid">{t('login.errors.incorrect')}</Form.Control.Feedback>
      </Form.Group>
      <Button
        type="submit"
        variant="outline-primary"
        className="w-100 mb-3"
        disabled={isLoading}
      >
        {t('login.come')}
      </Button>
    </Form>
  );
};

export default LoginForm;
