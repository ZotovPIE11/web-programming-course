/*
 * ЗАДАЧА 5: Практика с Generics
 * 
 * Инструкции:
 * 1. Переименуйте файл в .ts
 * 2. Добавьте generic типы ко всем функциям где это необходимо
 * 3. Создайте типизированные интерфейсы и классы
 * 4. Используйте ограничения generics (constraints)
 */

// Универсальные utility функции и классы

// TODO: Типизировать с использованием generics

// Утилита для кеширования
class Cache<K, V> {
    private cache: Map<K, V>;

    constructor() {
        this.cache = new Map<K, V>();
    }
    
    set(key: K, value: V): void {
        this.cache.set(key, value);
    }
    
    get(key: K): V | undefined {
        return this.cache.get(key);
    }
    
    has(key: K): boolean {
        return this.cache.has(key);
    }
    
    clear(): void {
        this.cache.clear();
    }
    
    delete(key: K): boolean {
        return this.cache.delete(key);
    }
    
    getSize(): number {
        return this.cache.size;
    }
}

// Универсальная функция фильтрации
function filterArray<T>(array: T[], predicate: (item: T) => boolean): T[] {
    return array.filter(predicate);
}

// Универсальная функция маппинга
function mapArray<T, U>(array: T[], mapper: (item: T) => U): U[] {
    return array.map(mapper);
}

// Функция для получения первого элемента
function getFirst<T>(array: T[]): T | undefined {
    return array.length > 0 ? array[0] : undefined;
}

// Функция для получения последнего элемента
function getLast<T>(array: T[]): T | undefined {
    return array.length > 0 ? array[array.length - 1] : undefined;
}

// Функция группировки по ключу
function groupBy<T, K extends string | number | symbol>(array: T[], keyGetter: (item: T) => K): Record<K, T[]> {
    const groups: Record<K, T[]> = {} as Record<K, T[]>;
    
    array.forEach(item => {
        const key = keyGetter(item);
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(item);
    });
    
    return groups;
}

// Функция для создания уникального массива
function unique<T, K extends string | number | symbol>(array: T[], keyGetter?: (item: T) => K): T[] {
    if (!keyGetter) {
        return [...new Set(array)];
    }
    
    const seen = new Set();
    return array.filter(item => {
        const key = keyGetter(item);
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}

// Функция сортировки с кастомным компаратором
function sortBy<T>(array: T[], compareFn: (a: T, b: T) => number): T[] {
    return [...array].sort(compareFn);
}

// Класс для работы с коллекцией
class Collection<T> {
    private items: T[];

    constructor(items: T[] = []) {
        this.items = items;
    }
    
    add(item: T) {
        this.items.push(item);
        return this;
    }
    
    remove(predicate: (item: T) => boolean) {
        this.items = this.items.filter(item => !predicate(item));
        return this;
    }
    
    find(predicate: (item: T) => boolean) {
        return this.items.find(predicate);
    }
    
    filter(predicate: (item: T) => boolean): Collection<T> {
        return new Collection(this.items.filter(predicate));
    }
    
    map<U>(mapper: (item: T) => U): Collection<U> {
        return new Collection(this.items.map(mapper));
    }
    
    reduce<U>(reducer: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U {
        return this.items.reduce(reducer, initialValue);
    }
    
    toArray() {
        return [...this.items];
    }
    
    get length() {
        return this.items.length;
    }
}

// Класс Repository для работы с данными
interface Identifiable {
    id: number;
}

class Repository<T extends Identifiable> {
    private items: (T & { createdAt: Date; updatedAt: Date })[] = [];
    private nextId: number = 1;

    constructor() {}
    
    create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): T & { createdAt: Date; updatedAt: Date } {
        const item = {
            id: this.nextId++,
            ...data,
            createdAt: new Date(),
            updatedAt: new Date()
        } as T & { createdAt: Date; updatedAt: Date };
        this.items.push(item);
        return item;
    }
    
    findById(id: number): (T & { createdAt: Date; updatedAt: Date }) | undefined {
        return this.items.find(item => item.id === id);
    }
    
    findAll(): (T & { createdAt: Date; updatedAt: Date })[] {
        return [...this.items];
    }
    
    update(id: number, updates: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>): (T & { createdAt: Date; updatedAt: Date }) | null {
        const index = this.items.findIndex(item => item.id === id);
        if (index === -1) return null;
        
        const existingItem = this.items[index];
        const updatedItem = {
            ...existingItem,
            ...updates,
            updatedAt: new Date()
        } as T & { createdAt: Date; updatedAt: Date };
        this.items[index] = updatedItem;
        
        return this.items[index]!;
    }
    
    delete(id: number): boolean {
        const index = this.items.findIndex(item => item.id === id);
        if (index === -1) return false;
        
        this.items.splice(index, 1);
        return true;
    }
    
    count() {
        return this.items.length;
    }
}

// Функция для объединения объектов
type UnionToIntersection<U> = 
  (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never

function merge<T extends object, S extends object[]>(target: T, ...sources: S): T & UnionToIntersection<S[number]> {
    return Object.assign({}, target, ...sources);
}

// Функция для deep clone
function deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    
    if (obj instanceof Date) {
        return new Date(obj.getTime()) as T;
    }
    
    if (obj instanceof Array) {
        return obj.map(item => deepClone(item)) as T;
    }
    
    const cloned = {} as { [key: string]: any };
    Object.keys(obj as object).forEach(key => {
        cloned[key] = deepClone((obj as any)[key]);
    });
    
    return cloned as T;
}

// Примеры использования
console.log('=== Тестирование Cache ===');
const cache = new Cache<string, { name: string; age: number }>();
cache.set('user:1', { name: 'Анна', age: 25 });
console.log('Получили из кеша:', cache.get('user:1'));

console.log('\n=== Тестирование фильтрации и маппинга ===');
const numbers = [1, 2, 3, 4, 5];
const evenNumbers = filterArray(numbers, n => n % 2 === 0);
const doubled = mapArray(numbers, n => n * 2);
console.log('Четные числа:', evenNumbers);
console.log('Удвоенные:', doubled);

console.log('\n=== Тестирование Collection ===');
interface UserData { name: string; age: number; }
const users = new Collection<UserData>([
    { name: 'Анна', age: 25 },
    { name: 'Петр', age: 30 },
    { name: 'Мария', age: 22 }
]);

const adults = users.filter(user => user.age >= 25);
const names = users.map(user => user.name);
console.log('Взрослые:', adults.toArray());
console.log('Имена:', names.toArray());

console.log('\n=== Тестирование Repository ===');
interface UserRecord extends Identifiable { name: string; email: string; }
const userRepo = new Repository<UserRecord>();
const newUser = userRepo.create({ name: 'Анна', email: 'anna@example.com' });
console.log('Создан пользователь:', newUser);
console.log('Всего пользователей:', userRepo.count());

console.log('\n=== Тестирование merge ===');
const obj1 = { a: 1, b: 2 };
const obj2 = { b: 3, c: 4 };
const mergedObj = merge(obj1, obj2);
console.log('Объединенный объект:', mergedObj);

console.log('\n=== Тестирование deepClone ===');
const original = { a: 1, b: { c: 2 }, d: new Date() };
const cloned = deepClone(original);
console.log('Клонированный объект:', cloned);
console.log('Клонированный объект (original === cloned):', original === cloned); // false
console.log('Клонированный объект (original.b === cloned.b):', original.b === cloned.b); // false
console.log('Клонированный объект (original.d === cloned.d):', original.d === cloned.d); // false