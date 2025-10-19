import React from 'react';
import { Logo } from '@/components/atoms/landing';
import { landingColors } from '@/styles/landing-theme';

export interface FooterColumn {
  title?: string;
  content: React.ReactNode;
}

export interface LandingFooterProps {
  companyInfo: string;
  columns: FooterColumn[];
  className?: string;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({
  companyInfo,
  columns = [],
  className = '',
}) => {
  return (
    <footer
      className={className}
      style={{
        width: '100%',
        paddingLeft: 100,
        paddingRight: 100,
        paddingTop: 80,
        paddingBottom: 80,
        background: landingColors.ui.white,
        borderTop: `4px ${landingColors.ui.black} solid`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: 100,
      }}
    >
      {/* Company info */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 10,
        }}
      >
        <Logo textColor={landingColors.ui.black} />
        <div
          style={{
            color: landingColors.ui.black,
            fontSize: 16,
            fontFamily: 'Poppins',
            fontWeight: 400,
            lineHeight: '16px',
            whiteSpace: 'pre-line',
          }}
        >
          {companyInfo}
        </div>
      </div>
      
      {/* Footer columns */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          gap: 30,
        }}
      >
        {columns.map((column, index) => (
          <div
            key={index}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              gap: 20,
            }}
          >
            {column.title && (
              <h3
                style={{
                  color: landingColors.ui.black,
                  fontSize: 20,
                  fontFamily: 'Afacad',
                  fontWeight: 700,
                  lineHeight: '20px',
                  margin: 0,
                }}
              >
                {column.title}
              </h3>
            )}
            <div
              style={{
                color: landingColors.ui.black,
                fontSize: 15.62,
                fontFamily: 'Poppins',
                fontWeight: 400,
                lineHeight: '15.62px',
                whiteSpace: 'pre-line',
              }}
            >
              {column.content}
            </div>
          </div>
        ))}
      </div>
    </footer>
  );
};
