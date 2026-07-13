import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Package, LogOut, DollarSign, Plus, Edit2, Trash2, Box } from 'lucide-react';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'revenue'>('orders');
  const [selectedMonth, setSelectedMonth] = useState<string>('5');
  const [selectedYear, setSelectedYear] = useState<string>('2026');

  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [adminPage, setAdminPage] = useState(1);
  const ADMIN_ITEMS_PER_PAGE = 12;

  const totalAdminPages = Math.max(1, Math.ceil(products.length / ADMIN_ITEMS_PER_PAGE));
  const paginatedAdminProducts = products.slice(
    (adminPage - 1) * ADMIN_ITEMS_PER_PAGE,
    adminPage * ADMIN_ITEMS_PER_PAGE
  );

  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productToDelete, setProductToDelete] = useState<any>(null);
  const [productForm, setProductForm] = useState({
    name: '', price: '', category_id: '1', stock_quantity: '', image_url: ''
  });

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/admin/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setOrders(await res.json());
    } catch (error) { console.error(error); }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) setProducts(await res.json());
    } catch (error) { console.error(error); }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/admin/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) fetchOrders();
    } catch (error) { console.error(error); }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products';
    const method = editingProduct ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          name: productForm.name,
          price: Number(productForm.price),
          category_id: Number(productForm.category_id),
          stock_quantity: Number(productForm.stock_quantity),
          image_url: productForm.image_url
        })
      });
      if (res.ok) {
        setProductForm({ name: '', price: '', category_id: '1', stock_quantity: '', image_url: '' });
        setEditingProduct(null);
        fetchProducts();
      }
    } catch (error) { console.error(error); }
  };

  const handleDeleteProduct = async (id: number) => {
    setProductToDelete(null);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchProducts();
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(`Không thể xóa sản phẩm: ${errorData.error || errorData.message || 'Lỗi hệ thống'}`);
      }
    } catch (error) {
      console.error(error);
      alert('Đã xảy ra lỗi kết nối khi xóa sản phẩm');
    }
  };

  const startEditProduct = (product: any) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price.toString(),
      category_id: product.category?.id?.toString() || '1',
      stock_quantity: product.stock_quantity.toString(),
      image_url: product.image_url
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Group revenue by Month/Year
  const revenueByMonth = orders.reduce((acc: any, order) => {
    if (order.status !== 'cancelled' && order.status !== 'pending') {
      const date = new Date(order.created_at);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      if (!acc[monthYear]) acc[monthYear] = 0;
      acc[monthYear] += Number(order.total_amount);
    }
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Admin Header */}
      <header className="bg-white border-b border-outline-variant/10 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-black text-[#1A237E] tracking-tighter">THE ATELIER <span className="text-primary">ADMIN</span></h1>
        </div>
        <div className="flex items-center gap-6">
          <span className="font-bold text-sm">Xin chào, {user?.full_name}</span>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-800 transition-colors">
            <LogOut className="w-4 h-4" /> Đăng xuất
          </button>
        </div>
      </header>

      <div className="flex-grow flex">
        {/* Admin Sidebar */}
        <aside className="w-64 bg-white border-r border-outline-variant/10 flex flex-col p-6 gap-2">
          <button onClick={() => setActiveTab('orders')} className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition-all text-left ${activeTab === 'orders' ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:bg-surface'}`}>
            <Package className="w-5 h-5" /> Quản lý Đơn hàng
          </button>
          <button onClick={() => setActiveTab('products')} className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition-all text-left ${activeTab === 'products' ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:bg-surface'}`}>
            <Box className="w-5 h-5" /> Sản phẩm & Tồn kho
          </button>
          <button onClick={() => setActiveTab('revenue')} className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition-all text-left ${activeTab === 'revenue' ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:bg-surface'}`}>
            <DollarSign className="w-5 h-5" /> Báo cáo Doanh thu
          </button>
        </aside>

        {/* Admin Content */}
        <main className="flex-grow p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'orders' && (
            <div className="bg-white rounded-3xl border border-outline-variant/10 shadow-lg shadow-primary/5 overflow-hidden">
              <div className="p-6 border-b border-outline-variant/10">
                <h2 className="text-xl font-bold text-[#1A237E]">Tất cả Đơn hàng ({orders.length})</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-surface-container-low text-on-surface-variant text-sm uppercase tracking-widest">
                    <tr>
                      <th className="p-6 font-bold">Mã ĐH</th>
                      <th className="p-6 font-bold">Khách hàng</th>
                      <th className="p-6 font-bold">Tổng tiền</th>
                      <th className="p-6 font-bold">Ngày đặt</th>
                      <th className="p-6 font-bold">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10 text-sm">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-surface/50 transition-colors">
                        <td className="p-6 font-bold text-[#1A237E]">#{order.id}</td>
                        <td className="p-6">
                          <p className="font-bold text-on-surface">{order.customer_name}</p>
                          <p className="text-xs text-on-surface-variant">{order.customer_email}</p>
                        </td>
                        <td className="p-6 font-bold text-primary">${Number(order.total_amount).toFixed(2)}</td>
                        <td className="p-6 text-on-surface-variant">{new Date(order.created_at).toLocaleDateString('vi-VN')}</td>
                        <td className="p-6">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="bg-surface-container-low border border-outline-variant/20 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-widest focus:ring-2 focus:ring-primary/20"
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-8">
              {/* Product Form */}
              <div className="bg-white rounded-3xl border border-outline-variant/10 shadow-lg shadow-primary/5 p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[#1A237E] flex items-center gap-2">
                    {editingProduct ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    {editingProduct ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
                  </h2>
                  {editingProduct && (
                    <button onClick={() => { setEditingProduct(null); setProductForm({ name: '', price: '', category_id: '1', stock_quantity: '', image_url: '' }); }} className="text-sm font-bold text-on-surface-variant hover:text-primary">
                      Hủy Sửa
                    </button>
                  )}
                </div>
                <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  <div className="space-y-2 lg:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-primary">Tên sản phẩm</label>
                    <input required value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} type="text" className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/10" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-primary">Giá ($)</label>
                    <input required value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} type="number" step="0.01" className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/10" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-primary">Danh mục</label>
                    <select value={productForm.category_id} onChange={e => setProductForm({ ...productForm, category_id: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/10">
                      <option value="1">Archival Paper</option>
                      <option value="2">Fine Writing</option>
                      <option value="3">Studio Tools</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-primary">Kho</label>
                    <input required value={productForm.stock_quantity} onChange={e => setProductForm({ ...productForm, stock_quantity: e.target.value })} type="number" className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/10" />
                  </div>
                  <div className="space-y-2 lg:col-span-4">
                    <label className="text-xs font-bold uppercase tracking-widest text-primary">Link hình ảnh</label>
                    <input required value={productForm.image_url} onChange={e => setProductForm({ ...productForm, image_url: e.target.value })} type="url" placeholder="https://..." className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/10" />
                  </div>
                  <div className="space-y-2 lg:col-span-1 flex items-end">
                    <button type="submit" className="w-full h-[50px] bg-primary text-on-primary rounded-xl font-bold hover:bg-primary-dim transition-all shadow-lg shadow-primary/20">
                      {editingProduct ? 'Lưu Thay Đổi' : 'Thêm'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Product Table */}
              <div className="bg-white rounded-3xl border border-outline-variant/10 shadow-lg shadow-primary/5 overflow-hidden">
                <div className="p-6 border-b border-outline-variant/10 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-[#1A237E]">Kho Hàng</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-surface-container-low text-on-surface-variant text-sm uppercase tracking-widest">
                      <tr>
                        <th className="p-6 font-bold">Sản phẩm</th>
                        <th className="p-6 font-bold">Danh mục</th>
                        <th className="p-6 font-bold">Giá</th>
                        <th className="p-6 font-bold">Tồn kho</th>
                        <th className="p-6 font-bold text-right">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10 text-sm">
                      {paginatedAdminProducts.map(product => (
                        <tr key={product.id} className="hover:bg-surface/50 transition-colors">
                          <td className="p-6 flex items-center gap-4">
                            <img src={product.image_url} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                            <span className="font-bold text-on-surface">{product.name}</span>
                          </td>
                          <td className="p-6 text-on-surface-variant">{product.category?.name}</td>
                          <td className="p-6 font-bold text-primary">${Number(product.price).toFixed(2)}</td>
                          <td className="p-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.stock_quantity > 10 ? 'bg-secondary/10 text-secondary' : product.stock_quantity > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                              {product.stock_quantity}
                            </span>
                          </td>
                          <td className="p-6 text-right">
                            <button onClick={() => startEditProduct(product)} className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => setProductToDelete(product)} className="p-2 text-on-surface-variant hover:text-red-500 transition-colors ml-2">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Admin Pagination */}
                {totalAdminPages > 1 && (
                  <div className="p-6 border-t border-outline-variant/10 flex items-center justify-between bg-surface/30">
                    <span className="text-sm text-on-surface-variant font-medium">
                      Hiển thị {(adminPage - 1) * ADMIN_ITEMS_PER_PAGE + 1} - {Math.min(adminPage * ADMIN_ITEMS_PER_PAGE, products.length)} / {products.length} sản phẩm
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setAdminPage(prev => Math.max(1, prev - 1))}
                        disabled={adminPage === 1}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${adminPage === 1 ? 'opacity-40 cursor-not-allowed bg-surface text-on-surface-variant' : 'bg-white border border-outline-variant/20 hover:bg-surface text-on-surface'}`}
                      >
                        ← Trang trước
                      </button>
                      {Array.from({ length: totalAdminPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setAdminPage(page)}
                          className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${adminPage === page ? 'bg-primary text-on-primary shadow-md shadow-primary/20' : 'bg-white border border-outline-variant/20 hover:bg-surface text-on-surface'}`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setAdminPage(prev => Math.min(totalAdminPages, prev + 1))}
                        disabled={adminPage === totalAdminPages}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${adminPage === totalAdminPages ? 'opacity-40 cursor-not-allowed bg-surface text-on-surface-variant' : 'bg-white border border-outline-variant/20 hover:bg-surface text-on-surface'}`}
                      >
                        Trang tiếp →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Custom Delete Confirmation Modal */}
              {productToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
                  <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 border border-outline-variant/10 shadow-2xl shadow-primary/20 space-y-6">
                    <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                      <Trash2 className="w-8 h-8" />
                    </div>
                    <div className="text-center space-y-2">
                      <h3 className="text-xl font-bold text-[#1A237E]">Xác Nhận Xóa Sản Phẩm</h3>
                      <p className="text-sm text-on-surface-variant">
                        Bạn có chắc chắn muốn xóa sản phẩm <span className="font-bold text-on-surface">"{productToDelete.name}"</span> không? Hành động này không thể hoàn tác.
                      </p>
                    </div>
                    <div className="flex items-center gap-4 pt-2">
                      <button
                        type="button"
                        onClick={() => setProductToDelete(null)}
                        className="flex-1 py-3 rounded-xl border border-outline-variant/20 font-bold text-on-surface-variant hover:bg-surface transition-colors"
                      >
                        Hủy bỏ
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(productToDelete.id)}
                        className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
                      >
                        Xóa sản phẩm
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'revenue' && (() => {
            const filteredOrders = orders.filter(order => {
              if (order.status === 'cancelled' || order.status === 'pending') return false;
              const date = new Date(order.created_at);
              const matchYear = date.getFullYear().toString() === selectedYear;
              const matchMonth = selectedMonth === 'all' || (date.getMonth() + 1).toString() === selectedMonth;
              return matchYear && matchMonth;
            });

            const totalRevenue = filteredOrders.reduce((sum, order) => sum + Number(order.total_amount), 0);
            const avgOrderValue = filteredOrders.length > 0 ? totalRevenue / filteredOrders.length : 0;

            return (
              <div className="space-y-8">
                <div className="bg-white rounded-3xl border border-outline-variant/10 shadow-lg shadow-primary/5 p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline-variant/10 pb-6 mb-6">
                    <div>
                      <h2 className="text-2xl font-black text-[#1A237E] flex items-center gap-2">
                        <DollarSign className="w-7 h-7 text-primary" /> Báo cáo Doanh thu theo Tháng/Năm
                      </h2>
                      <p className="text-sm text-on-surface-variant mt-1">
                        Chỉ tính những đơn hàng đã thanh toán (Paid), đang giao (Shipped) hoặc đã giao thành công (Delivered).
                      </p>
                    </div>

                    {/* Bộ chọn Tháng & Năm */}
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-2xl border border-outline-variant/20">
                        <span className="text-xs font-bold uppercase tracking-widest text-primary">Năm:</span>
                        <select
                          value={selectedYear}
                          onChange={(e) => setSelectedYear(e.target.value)}
                          className="bg-transparent font-bold text-on-surface focus:outline-none cursor-pointer"
                        >
                          <option value="2026">2026</option>
                          <option value="2025">2025</option>
                          <option value="2024">2024</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-2xl border border-outline-variant/20">
                        <span className="text-xs font-bold uppercase tracking-widest text-primary">Tháng:</span>
                        <select
                          value={selectedMonth}
                          onChange={(e) => setSelectedMonth(e.target.value)}
                          className="bg-transparent font-bold text-on-surface focus:outline-none cursor-pointer"
                        >
                          <option value="all">Tất cả các tháng (Cả năm)</option>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                            <option key={m} value={m.toString()}>Tháng {m}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Thẻ Hero Doanh thu */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1A237E] to-primary text-white shadow-xl flex flex-col justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">
                          {selectedMonth === 'all' ? `Tổng Doanh Thu Năm ${selectedYear}` : `Doanh Thu Tháng ${selectedMonth}/${selectedYear}`}
                        </p>
                        <h3 className="text-4xl font-black mt-2">${totalRevenue.toFixed(2)}</h3>
                        <p className="text-sm font-medium opacity-90 mt-1">
                          ≈ {(totalRevenue * 25000).toLocaleString('vi-VN')} VNĐ
                        </p>
                      </div>
                      <div className="mt-6 pt-4 border-t border-white/20 flex justify-between items-center text-xs opacity-90 font-medium">
                        <span>Trạng thái: Hoàn tất</span>
                        <span className="bg-white/20 px-3 py-1 rounded-full font-bold">Thực tế</span>
                      </div>
                    </div>

                    <div className="p-6 rounded-3xl border border-outline-variant/20 bg-surface-container-low flex flex-col justify-center items-center text-center">
                      <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Số Đơn Hàng Thành Công</p>
                      <p className="text-4xl font-black text-[#1A237E]">{filteredOrders.length}</p>
                      <p className="text-xs text-on-surface-variant mt-2 font-medium">Đơn đã thanh toán hoặc giao hàng</p>
                    </div>

                    <div className="p-6 rounded-3xl border border-outline-variant/20 bg-surface-container-low flex flex-col justify-center items-center text-center">
                      <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Giá Trị Đơn Trung Bình</p>
                      <p className="text-4xl font-black text-primary">${avgOrderValue.toFixed(2)}</p>
                      <p className="text-xs text-on-surface-variant mt-2 font-medium">Trên mỗi đơn thành công</p>
                    </div>
                  </div>
                </div>

                {/* Danh sách các tháng hoặc chi tiết đơn hàng */}
                {selectedMonth === 'all' ? (
                  <div className="bg-white rounded-3xl border border-outline-variant/10 shadow-lg shadow-primary/5 p-6 md:p-8">
                    <h3 className="text-xl font-bold text-[#1A237E] mb-6">Chi tiết doanh thu từng tháng trong năm {selectedYear}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
                        const mOrders = orders.filter(o => {
                          if (o.status === 'cancelled' || o.status === 'pending') return false;
                          const d = new Date(o.created_at);
                          return d.getFullYear().toString() === selectedYear && (d.getMonth() + 1) === m;
                        });
                        const mRev = mOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);
                        return (
                          <div
                            key={m}
                            onClick={() => setSelectedMonth(m.toString())}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center ${
                              mRev > 0
                                ? 'border-primary/40 bg-primary/5 hover:bg-primary/10 hover:scale-105 shadow-md'
                                : 'border-outline-variant/20 bg-surface-container-low opacity-60 hover:opacity-100'
                            }`}
                          >
                            <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Tháng {m}</span>
                            <span className="text-xl font-black text-[#1A237E] mt-1">${mRev.toFixed(2)}</span>
                            <span className="text-[11px] text-primary font-bold mt-1">{mOrders.length} đơn</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl border border-outline-variant/10 shadow-lg shadow-primary/5 overflow-hidden">
                    <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
                      <h3 className="text-xl font-bold text-[#1A237E]">
                        Danh sách Đơn hàng đóng góp doanh thu Tháng {selectedMonth}/{selectedYear} ({filteredOrders.length} đơn)
                      </h3>
                      <button
                        onClick={() => setSelectedMonth('all')}
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        ← Xem tất cả các tháng
                      </button>
                    </div>
                    {filteredOrders.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead className="bg-surface-container-low text-on-surface-variant text-sm uppercase tracking-widest">
                            <tr>
                              <th className="p-6 font-bold">Mã ĐH</th>
                              <th className="p-6 font-bold">Khách hàng</th>
                              <th className="p-6 font-bold">Ngày đặt</th>
                              <th className="p-6 font-bold">Tổng tiền</th>
                              <th className="p-6 font-bold">Trạng thái</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-outline-variant/10 text-sm">
                            {filteredOrders.map(order => (
                              <tr key={order.id} className="hover:bg-surface/50 transition-colors">
                                <td className="p-6 font-bold text-[#1A237E]">#{order.id}</td>
                                <td className="p-6">
                                  <p className="font-bold text-on-surface">{order.customer_name}</p>
                                  <p className="text-xs text-on-surface-variant">{order.customer_email}</p>
                                </td>
                                <td className="p-6 text-on-surface-variant">{new Date(order.created_at).toLocaleDateString('vi-VN')}</td>
                                <td className="p-6 font-bold text-primary">${Number(order.total_amount).toFixed(2)}</td>
                                <td className="p-6">
                                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-secondary/10 text-secondary">
                                    {order.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="p-12 text-center text-on-surface-variant">
                        <p className="text-lg font-bold">Chưa có đơn hàng nào đã hoàn thành trong Tháng {selectedMonth}/{selectedYear}.</p>
                        <p className="text-sm mt-1">Hãy thử chọn tháng khác hoặc thay đổi năm.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })()}
        </main>
      </div>
    </div>
  );
}