import React from "react";

function css(strings) {
  return strings.join("");
}

const Styles = () => {
  return (
    <style>
      {css`
        .page {
          min-height: 60vh;
          display: flex;
          flex-direction: column;
          padding: 0;
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
        section.empty-state__content {
          padding: 4rem;
          margin-top: 10rem;
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
          flex: 1;
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
        .sections .section__title {
          border-bottom: 1px solid var(--aha-gray-400);
          padding: 15px 21px;
        }
        .sections h2 {
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

        .zendesk__ticket__details {
          margin-bottom: 20px !important;
        }

        .zendesk__ticket .comments ul.list {
          margin-left: 0px !important;
        }

        .zendesk__comments .comments__body {
          padding: 13px 13px 5px 13px !important;
        }

        .comments__body blockquote {
          border-left: 5px solid var(--aha-gray-600);
          padding-left: 10px;
          margin-left: 5px;
        }

        .zendesk__comments .comment__private .comments__body {
          background-color: #fff3cc !important;
          border: 1px solid #efdaa3;
        }
      `}
    </style>
  );
};

export default Styles;
