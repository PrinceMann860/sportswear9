import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/Products/ProductList';
import ProductForm from './pages/Products/ProductForm';
import BrandList from './pages/Brands/BrandList';
import CategoryList from './pages/Categories/CategoryList';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/:id/edit" element={<ProductForm />} />
            <Route path="brands" element={<BrandList />} />
            <Route path="categories" element={<CategoryList />} />
            <Route path="analytics" element={<div className="p-6">Analytics coming soon...</div>} />
            <Route path="settings" element={<div className="p-6">Settings coming soon...</div>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;