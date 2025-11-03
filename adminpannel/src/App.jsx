import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/Products/ProductList';
import ProductForm from './pages/Products/ProductForm';
import ProductDetails from './pages/Products/ProductDetails';
import BrandList from './pages/Brands/BrandList';
import CategoryList from './pages/Categories/CategoryList';
import AttributeList from './pages/Attributes/AttributeList.jsx';
import HomepageManager from './pages/Homepage/HomepageManager';
import ToastContainer from './components/ui/ToastContainer';
import UserList from './pages/Users/UserList';
import UserDetails from './pages/Users/UserDetails';

function App() {
  return (
    <Provider store={store}>
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
              <Route path="homepage" element={<HomepageManager />} />
              <Route path="products" element={<ProductList />} />
              <Route path="products/new" element={<ProductForm />} />
              <Route path="products/:id/edit" element={<ProductForm />} />
              <Route path="products/:id" element={<ProductDetails />} />
              <Route path="attributes" element={<AttributeList />} />
              <Route path="brands" element={<BrandList />} />
              <Route path="categories" element={<CategoryList />} />
              {/* Add these new routes */}
              <Route path="users" element={<UserList />} />
              <Route path="users/:id" element={<UserDetails />} />
              
              <Route path="analytics" element={<div className="p-6">Analytics coming soon...</div>} />
              <Route path="settings" element={<div className="p-6">Settings coming soon...</div>} />

              <Route path="analytics" element={<div className="p-6">Analytics coming soon...</div>} />
              <Route path="settings" element={<div className="p-6">Settings coming soon...</div>} />
            </Route>
          </Routes>
          <ToastContainer />
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;