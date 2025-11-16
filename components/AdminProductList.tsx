'use client'

interface Product {
  id: number
  name: string
  description: string | null
  price: number
  imageUrl: string | null
  category: string | null
  stock: number
}

interface AdminProductListProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (id: number) => void
}

export default function AdminProductList({ products, onEdit, onDelete }: AdminProductListProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No products found. Add your first product above!</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="text-left p-4 font-semibold text-gray-700">Image</th>
            <th className="text-left p-4 font-semibold text-gray-700">Name</th>
            <th className="text-left p-4 font-semibold text-gray-700">Category</th>
            <th className="text-left p-4 font-semibold text-gray-700">Price</th>
            <th className="text-left p-4 font-semibold text-gray-700">Stock</th>
            <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b hover:bg-gray-50">
              <td className="p-4">
                <img
                  src={product.imageUrl || 'https://via.placeholder.com/100?text=No+Image'}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded"
                />
              </td>
              <td className="p-4">
                <div className="font-semibold text-gray-800">{product.name}</div>
                <div className="text-sm text-gray-500 line-clamp-2 max-w-xs">
                  {product.description || 'No description'}
                </div>
              </td>
              <td className="p-4">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                  {product.category || 'Uncategorized'}
                </span>
              </td>
              <td className="p-4 font-semibold text-gray-800">${product.price}</td>
              <td className="p-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  product.stock > 0 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {product.stock}
                </span>
              </td>
              <td className="p-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(product.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
