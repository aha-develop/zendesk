import React from "react";

const Styles = () => {
  return (
    <style>
      {`
        .page {
          min-height: 60vh;
          display: flex;
          flex-direction: column;
        }
        .page-content {
          padding: 16px;
        }
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1;
        }
        .empty-state__content {
          text-align: center;
          min-width: 30vw;
        }
        .empty-state__content p {
          color: #333333;
        }
        .empty-state__content p {
          color: #999999;
        }
        .sections {
          background-color: var(--aha-gray-100);
          display: flex;
          padding: 16px;
          gap: 18px;
          flex-wrap: wrap;
          flex-direction: column;
        }
        .sections > * {
          width: 70vh;
          min-width: 600px;
        }
        .sections section {
          background: white;
          border: 1px solid #e1e1e1;
          box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.08);
          border-radius: 4px;
          min-height: 100px;
          display: flex;
          flex-direction: column;
        }
        .sections h2 {
          border-bottom: 1px solid var(--aha-gray-400);
          padding: 15px 21px;
          margin: 0;
          font-style: normal;
          font-weight: 600;
          font-size: 18px;
          line-height: 18px;
          color: #000000;
        }
        .sections .sidebar {
          flex-grow: 1;
          max-width: 300px;
        }
        .sections h3 {
          font-style: normal;
          font-weight: bold;
          font-size: 18px;
          line-height: 21px;
        }
        .sections .subsection {
          padding: 15px 21px;
        }
        select {
          margin: 0;
        }
      `}
    </style>
  );
};

export default Styles;
