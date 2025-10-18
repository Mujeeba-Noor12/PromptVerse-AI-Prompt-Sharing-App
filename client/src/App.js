import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Navbar from './components/layout/Navbar';
import NotificationTest from './components/common/NotificationTest';
import Home from './pages/Home';
import Auth from './pages/Auth';
import CreatePrompt from './pages/CreatePrompt';
import PromptDetail from './pages/PromptDetail';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import MyPrompts from './pages/MyPrompts';
import LikedPrompts from './pages/LikedPrompts';
import ForgotPassword from './pages/ForgotPassword';
import EditPrompt from './pages/EditPrompt'; 

import ResetPassword from './pages/ResetPassword';
import PrivateRoute from './components/auth/PrivateRoute';
import BookMarked from './pages/BookMarked';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <div className="min-h-screen">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                        <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/prompts/new" element={<CreatePrompt />} />

              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/register" element={<Auth />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/prompts/:id/edit" element={<EditPrompt />} /> 

              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/prompts/:id" element={<PromptDetail />} />
              <Route path="/user/:username" element={<UserProfile />} />
                
                {/* Protected Routes */}
                <Route path="/create" element={
                  <PrivateRoute>
                    <CreatePrompt />
                  </PrivateRoute>
                } />
                <Route path="/profile" element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } />
                <Route path="/my-prompts" element={
                  <PrivateRoute>
                    <MyPrompts />
                  </PrivateRoute>
                } />
                <Route path="/liked" element={
                  <PrivateRoute>
                    <LikedPrompts />
                  </PrivateRoute>
                } />
              
               <Route path="/bookmark" element={
                  <PrivateRoute>
                    <BookMarked />
                  </PrivateRoute>
                } />
  </Routes>
              
            </main>
            <NotificationTest />
          </div>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 