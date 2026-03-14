import React from 'react';

export const Header = () => {
  return (
    <header className="header">
      <div className="header-title">
        {/* Dynamic title based on route could go here */}
      </div>
      <div className="user-profile">
        <div className="avatar">RS</div>
        <span>Dr. R. Sharma</span>
      </div>
    </header>
  );
};

export default Header;
