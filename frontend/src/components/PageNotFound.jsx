import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import pages from '../utils/pages';

const PageNotFound = () => {
  const { t } = useTranslation();
  return (
    <div className="text-center">
      <img alt={t('notFound.notFound')} className="img-fluid h-25" src="https://cdn2.hexlet.io/assets/error-pages/404-4b6ef16aba4c494d8101c104236304e640683fa9abdb3dd7a46cab7ad05d46e9.svg" />
      <h1 className="h4 text-muted">{t('notFound.notFound')}</h1>
      <p className="text-muted">
        {t('notFound.butMove')}
        <Link to={pages.main}>{t('notFound.toHomePage')}</Link>
      </p>
    </div>

  );
};

export default PageNotFound;
