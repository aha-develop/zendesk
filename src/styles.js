import React from "react";

const Styles = () => {
  return (
    <style>
      {`
        * {
          font-family: Inter, Helvetica, Segoe UI, Arial, sans-serif !important;
        }
        .type-icon {
          color: #3fad33;
          padding-right: 5px;
          vertical-align: middle;
        }
        .icon-button {
          border: 0;
        }
        .branches {
          font-size: 85%;
        }
        .sections {
          background-color: var(--aha-gray-100);
          display: flex;
          padding: 16px;
          gap: 18px;
          flex-wrap: wrap;
        }
        .sections section {
          padding: 21px 26px;
          background: white;
          border: 1px solid #e1e1e1;
          box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.08);
          border-radius: 4px;
          min-height: 100px;
          display: flex;
          flex-direction: column;
          flex-grow: 5;
          flex-shrink: 1;
          max-width: 800px;
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
        .subsection + .subsection {
          margin-top: 2rem;
        }
      `}
    </style>
  );
};

export default Styles;
