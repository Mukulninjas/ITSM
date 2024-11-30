import React from 'react';

const AuthLayout = ({ title, children }) => {
    return (
        <div className="auth-container">
            <div className="auth-form">
                {title && <h1 className="auth-title">{title}</h1>}
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;
