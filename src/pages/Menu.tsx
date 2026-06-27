import { ArrowLeft, CirclePlus, Minus, Plus, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import Header from "../components/Header";
import { useCategories, useCreateOrder, useFoods } from "@/api/hooks";
import { message } from "antd";

interface CartItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

const Menu = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
  const [cart, setCart] = useState<CartItem[]>([]);

  const { data: categories = [] } = useCategories();
  const { data: products = [] } = useFoods(selectedCategoryId);
  const { mutate: createOrder, isPending } = useCreateOrder();

  const addToCart = (product: any) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const increaseQuantity = (id: number) => {
    setCart(cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const decreaseQuantity = (id: number) => {
    setCart(
      cart
        .map((item) => item.id === id ? { ...item, quantity: item.quantity - 1 } : item)
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id: number) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const removeAll = () => setCart([]);

  const handleCreateOrder = () => {
    createOrder(
      {
        table_id: Number(id),
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      },
      {
        onSuccess: () => {
          message.success("Order placed!");
          navigate("/table");
        },
        onError: () => {
          message.error("Order failed. Try again!");
        },
      }
    )
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div>
      <Header />
      <div className="flex min-h-screen bg-slate-100">

        {/* LEFT */}
        <div className="flex-1 p-4">
          <div className="flex gap-5 text-blue-800 font-bold py-5 items-center text-4xl">
            <ArrowLeft className="cursor-pointer" onClick={() => navigate(-1)} size={32} />
            <h1>Table {id}</h1>
          </div>

          <div className="flex gap-2 mb-5">
            <button
              onClick={() => setSelectedCategoryId(undefined)}
              className={`px-4 py-2 rounded-lg text-sm ${selectedCategoryId === undefined
                  ? "bg-blue-800 text-white"
                  : "bg-slate-200 hover:bg-slate-300"
                }`}
            >
              All Items
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategoryId(category.id)}
                className={`px-4 py-2 rounded-lg text-sm ${selectedCategoryId === category.id
                    ? "bg-blue-800 text-white"
                    : "bg-slate-200 hover:bg-slate-300"
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-4">
            {products.map((product) => (
              <button key={product.id} onClick={() => addToCart(product)} className="cursor-pointer">
                <div className="bg-white rounded-lg border overflow-hidden hover:shadow-lg transition">
                  <div className="relative">
                    <img src={product.imageUrl} alt={product.name} className="h-40 w-full object-cover" />
                    <div className="absolute right-2 top-2 bg-blue-800 text-white px-2 py-1 rounded text-sm font-semibold">
                      ${product.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold">{product.name}</h3>
                  </div>
                  <div className="flex justify-end p-3 pt-0">
                    <CirclePlus size={28} className="text-blue-700 hover:text-blue-900" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-5 border-b border-gray-200">
            <h2 className="text-2xl font-bold">Order Summary</h2>
            <div className="flex justify-between">
              <p className="text-sm text-gray-500">TABLE #{id}</p>
              {cart.length > 0 && (
                <button onClick={removeAll} className="font-bold text-blue-800 cursor-pointer">
                  Clear All
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {cart.length === 0 ? (
              <p className="text-gray-400">Chưa có món nào</p>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="rounded-lg">
                    <div className="flex gap-3">
                      <img src={item.imageUrl} alt="" className="h-18 w-20 object-cover rounded" />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{item.name}</h4>
                          <span className="font-semibold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3 mt-3 bg-slate-100">
                            <button
                              onClick={() => decreaseQuantity(item.id)}
                              className="p-1 border border-gray-300 rounded-sm cursor-pointer"
                            >
                              <Minus size={14} />
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              onClick={() => increaseQuantity(item.id)}
                              className="p-1 border border-gray-300 rounded-sm cursor-pointer"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <Trash2
                            className="text-gray-500 hover:text-red-700 cursor-pointer mt-3"
                            onClick={() => removeItem(item.id)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 p-5">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span>Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-2xl font-bold mb-5">
              <span>Total</span>
              <span className="text-blue-800 text-4xl">${total.toFixed(2)}</span>
            </div>
            <button
              disabled={cart.length === 0 || isPending}
              onClick={handleCreateOrder}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 cursor-pointer"
            >
              {isPending ? "Processing..." : "Confirm Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
