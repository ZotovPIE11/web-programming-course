/**
 * Задание 3: Responsive сетка
 *
 * Задачи:
 * 1. grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4
 * 2. Скрыть рейтинг на мобильных: hidden md:flex
 */

const products = [
  { id: 1, name: 'Ноутбук', price: 89990, rating: 4.8, image: 'https://avatars.mds.yandex.net/i?id=8070938e99d5f0f52865d593b7d09a64_l-4571838-images-thumbs&n=13' },
  { id: 2, name: 'Смартфон', price: 69990, rating: 4.7, image: 'https://avatars.mds.yandex.net/i?id=4fbb3c9bf3db47d2907bbc303e529c09_l-5454561-images-thumbs&ref=rim&n=13&w=543&h=452' },
  { id: 3, name: 'Планшет', price: 45990, rating: 4.6, image: 'https://avatars.mds.yandex.net/i?id=c58d3e953c53b18794294cfa20712af3_l-5232914-images-thumbs&n=13' },
  { id: 4, name: 'Наушники', price: 25990, rating: 4.9, image: 'https://avatars.mds.yandex.net/i?id=1bf69a4e00145d2ef0f7ac7b43725503_l-5233330-images-thumbs&n=13' },
  { id: 5, name: 'Часы', price: 18990, rating: 4.5, image: 'https://avatars.mds.yandex.net/get-mpic/5253116/2a0000019575172ae5ddcde79d2b83b75d56/orig' },
  { id: 6, name: 'Камера', price: 125990, rating: 4.9, image: 'https://avatars.mds.yandex.net/i?id=ce04e402d71a2065bcf2a3787c2f7231e511699e-16891649-images-thumbs&n=13' },
];

function Task3() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Задание 3: Responsive сетка</h2>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-4 text-sm">
        Откройте <code className="bg-blue-100 px-1 rounded">src/tasks/Task3.tsx</code> и добавьте responsive классы
      </div>

      {/* TODO: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(p => (
          <div key={p.id} className="bg-white rounded-lg shadow-md p-4">
            <img src={p.image} alt={p.name} className="w-full h-auto object-cover rounded" />
            <h3 className="text-lg font-bold mt-3">{p.name}</h3>
            {/* TODO: hidden md:flex */}
            <div className="hidden md:flex ">
              <span>⭐ {p.rating}</span>
            </div>
            <p className="text-xl font-bold text-blue-600 mt-2">{p.price.toLocaleString()} ₽</p>
          </div>
        ))}
      </div>

      <div className="mt-6 p-3 bg-gray-800 text-white rounded">
        <span className="md:hidden">📱 Mobile</span>
        <span className="hidden md:inline lg:hidden">💻 Tablet</span>
        <span className="hidden lg:inline">🖥 Desktop</span>
      </div>
    </div>
  );
}

export default Task3;
