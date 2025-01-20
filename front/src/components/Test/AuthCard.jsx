import React, { useState } from 'react';
import './AuthCard.css'; // Импортируйте CSS файл для стилей

const AuthCard = () => {
  const [isLogin, setIsLogin] = useState(true);

  const handleToggle = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="auth-container">
      <div className={`card ${isLogin ? 'login' : 'register'}`}>
        {isLogin ? (
          <div className="login-card">
            <h2>Вход</h2>
            {/* Поля для логина */}
            <button onClick={handleToggle}>Создать аккаунт</button>
          </div>
        ) : (
          <div className="register-card">
            <h2>Регистрация</h2>
            {/* Поля для регистрации */}
            <button onClick={handleToggle}>Назад к входу</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCard;
