import { CirclePlus, Minus, Plus, Trash2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { useState } from "react";

const categories = [
  "All Items",
  "Burgers",
  "Pizza",
  "Drinks",
  "Sides",
  "Desserts",
];

const products = [
  {
    id: 1,
    name: "Signature Truffle Burger",
    price: 18.5,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
  },
  {
    id: 2,
    name: "Classic Margherita",
    price: 14,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591",
  },
  {
    id: 3,
    name: "Bourbon Old Fashioned",
    price: 12,
    image:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187",
  },
  {
    id: 4,
    name: "Truffle Fries",
    price: 8.5,
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877",
  },
  {
    id: 5,
    name: "Grilled Salmon",
    price: 22,
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288",
  },
  {
    id: 6,
    name: "Caesar Salad",
    price: 10.5,
    image:
      "https://images.unsplash.com/photo-1546793665-c74683f339c1",
  },
  {
    id: 7,
    name: "Chocolate Lava Cake",
    price: 9,
    image:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c",
  },
  {
    id: 8,
    name: "Iced Matcha Latte",
    price: 7.5,
    image:
      "https://images.unsplash.com/photo-1515823064-d6e0c04616a7",
  },
];

const Menu = () => {
  const { id } = useParams();

  const [cart, setCart] = useState<any[]>([]);

  const addToCart = (product: any) => {
    const existing = cart.find(
      (item) => item.id === product.id
    );

    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? {
              ...item,
              quantity: item.quantity + 1,
            }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          ...product,
          quantity: 1,
        },
      ]);
    }
  };

  const increaseQuantity = (id: number) => {
    setCart(
      cart.map((item) =>
        item.id === id
          ? {
            ...item,
            quantity: item.quantity + 1,
          }
          : item
      )
    );
  };

  const decreaseQuantity = (id: number) => {
    setCart(
      cart
        .map((item) =>
          item.id === id
            ? {
              ...item,
              quantity: item.quantity - 1,
            }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  }

  const subtotal = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* LEFT */}
      <div className="flex-1 p-4">
        <div className="flex gap-2 mb-5">
          {categories.map((item) => (
            <button
              key={item}
              className="px-4 py-2 rounded-lg bg-slate-200 text-sm hover:bg-slate-300"
            >
              {item}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-4">
          {products.map((product) => (
            <button onClick={() =>
              addToCart(product)
            } className="cursor-pointer">
              <div
                key={product.id}
                className="bg-white rounded-lg border overflow-hidden hover:shadow-lg transition"
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-40 w-full object-cover"
                  />

                  <div className="absolute right-2 top-2 bg-blue-800 text-white px-2 py-1 rounded text-sm font-semibold">
                    ${product.price.toFixed(2)}
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="font-semibold">
                    {product.name}
                  </h3>
                </div>

                <div className="flex justify-end p-3 pt-0">
                  <CirclePlus
                    size={28}
                    className="text-blue-700  hover:text-blue-900"

                  />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-96 bg-white border-l flex flex-col">
        <div className="p-5 border-b">
          <h2 className="text-2xl font-bold">
            Order Summary
          </h2>

          <p className="text-sm text-gray-500">
            TABLE #{id}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {cart.length === 0 ? (
            <p className="text-gray-400">
              Chưa có món nào
            </p>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className=" rounded-lg"
                >
                  <div className="flex gap-3">
                    <img src={item.image} alt="" className="h-18 w-20 object-cover rounded" />
                    <div className="flex-1">
                      <div className="flex justify-between ">
                        <h4 className="font-medium">
                          {item.name}
                        </h4>
                        <span className="font-semibold">
                          $
                          {(
                            item.price *
                            item.quantity
                          ).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3 mt-3 bg-slate-100">
                          <button
                            onClick={() =>
                              decreaseQuantity(
                                item.id
                              )
                            }
                            className="p-1 border border-gray-300 rounded-sm cursor-pointer"
                          >
                            <Minus size={14} />
                          </button>

                          <span>
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              increaseQuantity(
                                item.id
                              )
                            }
                            className="p-1 border border-gray-300 rounded-sm cursor-pointer"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <Trash2 className="text-gray-500 hover:text-red-700 cursor-pointer mt-3" onClick={() =>
                          removeItem(
                            item.id
                          )
                        } />

                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t p-5">
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>
              ${subtotal.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between mb-4">
            <span>Tax (10%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-2xl font-bold mb-5">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button
            disabled={cart.length === 0}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 cursor-pointer"
          >
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Menu;