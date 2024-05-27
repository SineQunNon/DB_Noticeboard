import React, { createContext, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignUpPage from './SignUpPage'
import MainPage from './MainPage'
import Login from './login'
import WritePost from './WritePost'
import DetailPost from './DetailPost'

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  // 로그인 상태 변수
  const [isSigned, setIsSigned] = useState({
    pk_id: '',
    is_signed: false
  });

  return (
    <GlobalContext.Provider value={{ isSigned, setIsSigned }}>
      {children}
    </GlobalContext.Provider>
  );
}

function App() {
  return (
    <Router>
      <GlobalProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/mainpage" element={<MainPage />} />
          <Route path="/signuppage" element={<SignUpPage />} />
          <Route path="/writepost" element={<WritePost />} />
          <Route path="/detailpost/:postId" element={<DetailPost />} />
        </Routes>
      </GlobalProvider>
    </Router>
  );
}

export default App;
