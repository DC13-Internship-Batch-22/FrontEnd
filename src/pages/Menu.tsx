import { useParams } from "react-router-dom";

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
];

const Menu = () => {
  const { id } = useParams();

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* LEFT */}
      <div className="flex-1 p-4">
        {/* Categories */}
        <div className="flex gap-2 mb-5">
          {categories.map((item) => (
            <button
              key={item}
              className="px-4 py-2 rounded-lg bg-slate-200 text-sm"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Products */}
        <div className="grid grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg border overflow-hidden cursor-pointer hover:shadow-lg"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-40 w-full object-cover"
              />

              <div className="p-3">
                <h3 className="font-semibold">
                  {product.name}
                </h3>

                <p className="text-blue-600 font-bold mt-2">
                  ${product.price}
                </p>
              </div>
            </div>
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

        <div className="flex-1 p-5">
          <p className="text-gray-400">
            Chưa có món nào
          </p>
        </div>

        <div className="border-t p-5">
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>$0.00</span>
          </div>

          <div className="flex justify-between mb-4">
            <span>Tax</span>
            <span>$0.00</span>
          </div>

          <div className="flex justify-between text-2xl font-bold mb-5">
            <span>Total</span>
            <span>$0.00</span>
          </div>

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg">
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Menu;