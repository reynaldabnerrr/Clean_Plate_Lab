import React, { useState } from 'react';
import { useCpl } from '../context/CplContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Edit3, 
  Lock, 
  LogOut, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Utensils, 
  Package, 
  FileText,
  Search,
  X
} from 'lucide-react';

export function AdminDashboard({ isOpen, onClose }) {
  const { 
    menuItems, 
    addMenuItem, 
    updateMenuItem, 
    deleteMenuItem, 
    orders, 
    updateOrderStatus,
    isAdminLoggedIn, 
    setIsAdminLoggedIn,
    announcementText,
    setAnnouncementText
  } = useCpl();

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Add/Edit Meal Form Modal state
  const [showMealModal, setShowMealModal] = useState(false);
  const [editingMealId, setEditingMealId] = useState(null);
  const [mealForm, setMealForm] = useState({
    code: "CPL-019",
    name: "",
    category: "High Protein",
    protein: 45,
    carbs: 40,
    fat: 16,
    kcal: 580,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    tags: "Sous-Vide, High Protein, Gluten Free",
    desc: ""
  });

  // Search filter
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null;

  // Handle Login
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if ((email === "admin@cleanplatelab.id" || email === "admin") && password === "cpl2026") {
      setIsAdminLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("Invalid credentials. Use admin / cpl2026 or click Demo Login.");
    }
  };

  const handleDemoLogin = () => {
    setIsAdminLoggedIn(true);
    setLoginError("");
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
  };

  // Meal Form Submit
  const handleMealFormSubmit = (e) => {
    e.preventDefault();
    const formattedTags = typeof mealForm.tags === 'string' 
      ? mealForm.tags.split(',').map(t => t.trim()) 
      : mealForm.tags;

    if (editingMealId) {
      updateMenuItem(editingMealId, {
        ...mealForm,
        tags: formattedTags
      });
    } else {
      addMenuItem({
        ...mealForm,
        tags: formattedTags
      });
    }
    setShowMealModal(false);
    resetMealForm();
  };

  const resetMealForm = () => {
    setEditingMealId(null);
    setMealForm({
      code: `CPL-0${menuItems.length + 14}`,
      name: "",
      category: "High Protein",
      protein: 45,
      carbs: 40,
      fat: 16,
      kcal: 580,
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
      tags: "Sous-Vide, High Protein",
      desc: ""
    });
  };

  const handleEditClick = (meal) => {
    setEditingMealId(meal.id);
    setMealForm({
      code: meal.code,
      name: meal.name,
      category: meal.category,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
      kcal: meal.kcal,
      image: meal.image,
      tags: Array.isArray(meal.tags) ? meal.tags.join(', ') : meal.tags,
      desc: meal.desc
    });
    setShowMealModal(true);
  };

  const filteredMenuItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[92vh] overflow-y-auto bg-[#F5F2EA] text-[#1E1E1E] p-6 sm:p-8 space-y-6">
        
        {/* LOGIN SCREEN */}
        {!isAdminLoggedIn ? (
          <div className="py-6 max-w-md mx-auto space-y-6 text-center">
            <div className="w-16 h-16 bg-[#EBF0E6] text-[#647554] rounded-full flex items-center justify-center mx-auto border-2 border-[#8A9C7A]">
              <Lock size={28} />
            </div>

            <DialogHeader className="text-center">
              <Badge variant="default" className="mx-auto mb-1">
                <span>Secure CMS Portal</span>
              </Badge>
              <DialogTitle className="text-3xl font-extrabold uppercase text-[#1E1E1E]">
                CPL ADMIN LOGIN
              </DialogTitle>
              <DialogDescription className="text-xs text-[#555555]">
                Enter administrator credentials to manage menu items, customer orders, and lab batch data.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-left bg-white p-6 border-2 border-[#1E1E1E]">
              <div>
                <label className="block text-xs font-display font-bold uppercase tracking-wider mb-1 text-[#1E1E1E]">
                  Admin Email / ID:
                </label>
                <Input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@cleanplatelab.id"
                />
              </div>

              <div>
                <label className="block text-xs font-display font-bold uppercase tracking-wider mb-1 text-[#1E1E1E]">
                  Password:
                </label>
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              {loginError && (
                <div className="p-3 bg-rose-50 border border-rose-300 text-rose-700 text-xs font-bold font-mono">
                  {loginError}
                </div>
              )}

              <Button type="submit" variant="default" className="w-full bg-[#8A9C7A] hover:bg-[#647554] text-white font-extrabold py-3">
                Sign In to CMS Dashboard
              </Button>

              <div className="pt-2 text-center">
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={handleDemoLogin}
                  className="w-full text-xs font-bold bg-[#EBF0E6] text-[#647554] hover:bg-[#8A9C7A] hover:text-white"
                >
                  ⚡ One-Click Demo Admin Login
                </Button>
              </div>
            </form>

            <div className="text-[10px] font-mono text-gray-500">
              Demo Credentials: <code>admin</code> / <code>cpl2026</code>
            </div>
          </div>
        ) : (
          
          /* ADMIN CMS DASHBOARD */
          <div className="space-y-6">
            
            {/* Dashboard Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#1E1E1E] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="solid" className="bg-[#8A9C7A] text-white">
                    <span>ADMINISTRATOR MODE</span>
                  </Badge>
                  <span className="text-xs font-mono text-gray-600">Logged in as Executive Chef / CMS Admin</span>
                </div>
                <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight text-[#1E1E1E] mt-1">
                  CPL CONTENT & MENU CMS
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 border-[#1E1E1E] text-[#1E1E1E]"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </Button>
              </div>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card className="p-4 bg-white border border-[#1E1E1E] rounded-none">
                <div className="text-[10px] font-display font-bold uppercase text-gray-500">Total Menu Items</div>
                <div className="font-display text-3xl font-extrabold text-[#8A9C7A]">{menuItems.length}</div>
              </Card>

              <Card className="p-4 bg-white border border-[#1E1E1E] rounded-none">
                <div className="text-[10px] font-display font-bold uppercase text-gray-500">Active Customer Orders</div>
                <div className="font-display text-3xl font-extrabold text-[#1E1E1E]">{orders.length}</div>
              </Card>

              <Card className="p-4 bg-white border border-[#1E1E1E] rounded-none">
                <div className="text-[10px] font-display font-bold uppercase text-gray-500">Pending Approvals</div>
                <div className="font-display text-3xl font-extrabold text-amber-600">
                  {orders.filter(o => o.status === "Pending").length}
                </div>
              </Card>

              <Card className="p-4 bg-white border border-[#1E1E1E] rounded-none">
                <div className="text-[10px] font-display font-bold uppercase text-gray-500">Active Batch</div>
                <div className="font-display text-3xl font-extrabold text-[#647554]">#014</div>
              </Card>
            </div>

            {/* Main Tabs */}
            <Tabs defaultValue="menu" className="w-full">
              <TabsList className="grid grid-cols-3 w-full bg-white border-2 border-[#1E1E1E]">
                <TabsTrigger value="menu" className="flex items-center gap-1.5 font-bold">
                  <Utensils size={14} />
                  <span>Menu Catalog CMS</span>
                </TabsTrigger>
                <TabsTrigger value="orders" className="flex items-center gap-1.5 font-bold">
                  <Package size={14} />
                  <span>Order Inquiries ({orders.length})</span>
                </TabsTrigger>
                <TabsTrigger value="announcement" className="flex items-center gap-1.5 font-bold">
                  <FileText size={14} />
                  <span>Site Announcement</span>
                </TabsTrigger>
              </TabsList>

              {/* MENU CATALOG TAB */}
              <TabsContent value="menu" className="space-y-4 mt-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  
                  {/* Search Input */}
                  <div className="relative flex-1 max-w-md">
                    <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search meal code or title..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 bg-white"
                    />
                  </div>

                  <Button
                    onClick={() => { resetMealForm(); setShowMealModal(true); }}
                    className="bg-[#8A9C7A] hover:bg-[#647554] text-white font-extrabold flex items-center gap-2"
                  >
                    <Plus size={16} />
                    <span>Add New Meal Item</span>
                  </Button>
                </div>

                {/* Menu Table (Rounded) */}
                <div className="border-2 border-[#1E1E1E] bg-white overflow-x-auto rounded-2xl shadow-sm">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-[#EBF0E6] text-[#1E1E1E] font-display font-extrabold uppercase border-b-2 border-[#1E1E1E]">
                      <tr>
                        <th className="p-3">Code</th>
                        <th className="p-3">Meal Item</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Protein</th>
                        <th className="p-3">Carbs</th>
                        <th className="p-3">Fat</th>
                        <th className="p-3">Calories</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 font-mono">
                      {filteredMenuItems.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="p-3 font-bold text-[#8A9C7A]">{item.code}</td>
                          <td className="p-3 font-sans font-bold text-[#1E1E1E] flex items-center gap-2">
                            <img src={item.image} alt="" className="w-8 h-8 object-cover rounded" />
                            <span>{item.name}</span>
                          </td>
                          <td className="p-3 font-sans">
                            <span className="bg-gray-100 px-2 py-0.5 rounded text-[10px] font-bold">
                              {item.category}
                            </span>
                          </td>
                          <td className="p-3 font-bold text-[#647554]">{item.protein}g</td>
                          <td className="p-3">{item.carbs}g</td>
                          <td className="p-3">{item.fat}g</td>
                          <td className="p-3 font-bold">{item.kcal} kcal</td>
                          <td className="p-3 text-right space-x-2">
                            <button
                              onClick={() => handleEditClick(item)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                              title="Edit item"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => deleteMenuItem(item.id)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                              title="Delete item"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              {/* ORDERS TAB */}
              <TabsContent value="orders" className="space-y-4 mt-4">
                <div className="border-2 border-[#1E1E1E] bg-white overflow-x-auto rounded-2xl shadow-sm">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-[#EBF0E6] text-[#1E1E1E] font-display font-extrabold uppercase border-b-2 border-[#1E1E1E]">
                      <tr>
                        <th className="p-3">Ref Code</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Plan</th>
                        <th className="p-3">Address</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 font-mono">
                      {orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-gray-50">
                          <td className="p-3 font-bold text-[#1E1E1E]">{ord.refCode}</td>
                          <td className="p-3 font-sans font-bold">
                            <div>{ord.customerName}</div>
                            <div className="text-[10px] text-gray-500 font-mono">{ord.phone}</div>
                          </td>
                          <td className="p-3 font-sans text-[11px]">{ord.plan}</td>
                          <td className="p-3 font-sans text-[10px] text-gray-600 max-w-xs truncate">{ord.address}</td>
                          <td className="p-3">{ord.date}</td>
                          <td className="p-3 font-sans">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              ord.status === "Approved" ? "bg-emerald-100 text-emerald-800" :
                              ord.status === "Delivered" ? "bg-blue-100 text-blue-800" :
                              "bg-amber-100 text-amber-800"
                            }`}>
                              {ord.status}
                            </span>
                          </td>
                          <td className="p-3 text-right space-x-1 font-sans">
                            {ord.status === "Pending" && (
                              <button
                                onClick={() => updateOrderStatus(ord.id, "Approved")}
                                className="px-2 py-1 bg-emerald-600 text-white rounded text-[10px] font-bold"
                              >
                                Approve
                              </button>
                            )}
                            {ord.status === "Approved" && (
                              <button
                                onClick={() => updateOrderStatus(ord.id, "Delivered")}
                                className="px-2 py-1 bg-blue-600 text-white rounded text-[10px] font-bold"
                              >
                                Mark Delivered
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              {/* ANNOUNCEMENT CMS TAB */}
              <TabsContent value="announcement" className="space-y-4 mt-4 bg-white p-6 border-2 border-[#1E1E1E]">
                <h3 className="font-display font-extrabold text-lg uppercase text-[#1E1E1E]">
                  Header Announcement Banner CMS
                </h3>
                <p className="text-xs text-gray-600">
                  Update the live announcement text displayed on top of the website.
                </p>

                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-display font-bold uppercase text-[#1E1E1E]">
                    Announcement Ticker Message:
                  </label>
                  <Input
                    type="text"
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    placeholder="Enter announcement..."
                    className="font-bold text-sm"
                  />
                </div>

                <div className="p-4 bg-[#F5F2EA] border border-[#1E1E1E] text-xs font-mono">
                  <strong>Live Preview:</strong>
                  <div className="mt-1 text-[#647554] font-bold uppercase">
                    🟢 {announcementText}
                  </div>
                </div>
              </TabsContent>

            </Tabs>

          </div>
        )}

      </DialogContent>

      {/* ADD / EDIT MEAL FORM MODAL */}
      {showMealModal && (
        <Dialog open={showMealModal} onOpenChange={setShowMealModal}>
          <DialogContent className="max-w-lg bg-white p-6 border-2 border-[#1E1E1E] space-y-4 z-50">
            <DialogHeader>
              <DialogTitle className="text-xl font-extrabold uppercase">
                {editingMealId ? "Edit Meal Item" : "Add New Meal Box"}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Fill in the macronutrient specs and ingredients.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleMealFormSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Meal Code:</label>
                  <Input
                    type="text"
                    required
                    value={mealForm.code}
                    onChange={(e) => setMealForm({ ...mealForm, code: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Category:</label>
                  <select
                    value={mealForm.category}
                    onChange={(e) => setMealForm({ ...mealForm, category: e.target.value })}
                    className="w-full h-10 p-2 border border-gray-300 font-bold"
                  >
                    <option value="High Protein">High Protein</option>
                    <option value="Lean Muscle">Lean Muscle</option>
                    <option value="Plant Power">Plant Power</option>
                    <option value="Keto / Low Carb">Keto / Low Carb</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Meal Title:</label>
                <Input
                  type="text"
                  required
                  value={mealForm.name}
                  onChange={(e) => setMealForm({ ...mealForm, name: e.target.value })}
                  placeholder="e.g. GRILLED SALMON BOWL"
                />
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block font-bold mb-1">Protein (g):</label>
                  <Input
                    type="number"
                    required
                    value={mealForm.protein}
                    onChange={(e) => setMealForm({ ...mealForm, protein: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Carbs (g):</label>
                  <Input
                    type="number"
                    required
                    value={mealForm.carbs}
                    onChange={(e) => setMealForm({ ...mealForm, carbs: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Fat (g):</label>
                  <Input
                    type="number"
                    required
                    value={mealForm.fat}
                    onChange={(e) => setMealForm({ ...mealForm, fat: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Kcal:</label>
                  <Input
                    type="number"
                    required
                    value={mealForm.kcal}
                    onChange={(e) => setMealForm({ ...mealForm, kcal: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Image URL:</label>
                <Input
                  type="url"
                  required
                  value={mealForm.image}
                  onChange={(e) => setMealForm({ ...mealForm, image: e.target.value })}
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Tags (comma separated):</label>
                <Input
                  type="text"
                  value={mealForm.tags}
                  onChange={(e) => setMealForm({ ...mealForm, tags: e.target.value })}
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Description:</label>
                <textarea
                  rows={2}
                  required
                  value={mealForm.desc}
                  onChange={(e) => setMealForm({ ...mealForm, desc: e.target.value })}
                  className="w-full p-2 border border-gray-300"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowMealModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="default" className="bg-[#8A9C7A] text-white font-extrabold">
                  Save Meal Item
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

    </Dialog>
  );
}
