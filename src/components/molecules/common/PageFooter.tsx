'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { LandingFooter } from '@/components/organisms/landing';

export const PageFooter: React.FC = () => {
  const t = useTranslations('landing');

  const footerColumns = [
    {
      title: t("footer.company.title"),
      content: (
        <>
          {t("footer.company.description")}
          <br />
          <br />
          {t("footer.company.mission")}
        </>
      ),
    },
    {
      title: t("footer.services.title"),
      content: (
        <>
          {t("footer.services.rental")}
          <br />
          {t("footer.services.consulting")}
          <br />
          {t("footer.services.courses")}
          <br />
          {t("footer.services.maintenance")}
        </>
      ),
    },
    {
      title: t("footer.contact.title"),
      content: (
        <>
          {t("footer.contact.address")}
          <br />
          {t("footer.contact.phone")}
          <br />
          {t("footer.contact.email")}
        </>
      ),
    },
    {
      title: t("footer.support.title"),
      content: (
        <>
          {t("footer.support.hotline")}
          <br />
          {t("footer.support.technical")}
          <br />
          <br />
          {t("footer.support.businessEmail")}
        </>
      ),
    },
  ];

  return (
    <LandingFooter
      companyInfo={t("footer.company.description")}
      columns={footerColumns}
    />
  );
};

export default PageFooter;
