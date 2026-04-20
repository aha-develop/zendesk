import React from "react";

const Styles = () => {
  return (
    <style>
      {`
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
        }
        .sidebar-layout {
          min-height: calc(100vh - 100px);
          display: flex;
          flex-direction: column;
        }
        .sidebar-layout__content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
      `}
    </style>
  );
};

export default Styles;
