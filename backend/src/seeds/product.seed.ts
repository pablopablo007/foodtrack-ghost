import { DataSource } from 'typeorm';
import { Product } from '../entities/product.entity';

export async function seedProducts(dataSource: DataSource) {
    const productRepository = dataSource.getRepository(Product);

    // Check if products already exist
    const count = await productRepository.count();
    if (count > 0) {
        console.log('Products already seeded');
        return;
    }

    const defaultProducts = [
        {
            name: 'Hamburguesa Clásica',
            description: 'Carne angus 150g, queso cheddar, lechuga, tomate y salsa secreta.',
            price: 12.50,
            category: 'Hamburguesas',
            image: '/images/products/hamburguesa-clasica.png',
            available: true
        },
        {
            name: 'Pizza Personal',
            description: 'Masa artesanal, salsa de tomate italiana, mozzarella y pepperoni.',
            price: 10.00,
            category: 'Pizzas',
            image: '/images/products/pizza-personal.png',
            available: true
        },
        {
            name: 'Pollo Crispy',
            description: '3 piezas de pollo frito crujiente con nuestra mezcla de especias.',
            price: 9.50,
            category: 'Pollo',
            image: '/images/products/pollo-crispy.png',
            available: true
        },
        {
            name: 'Papas Fritas',
            description: 'Papas corte bastón, fritas a la perfección con sal de mar.',
            price: 4.50,
            category: 'Acompañamientos',
            image: '/images/products/papas-fritas.png',
            available: true
        },
        {
            name: 'Bebida Grande',
            description: 'Refresco carbonatado de 500ml a elección (Cola, Naranja, Limón).',
            price: 2.50,
            category: 'Bebidas',
            image: '/images/products/bebida-grande.png',
            available: true
        },
        {
            name: 'Cheeseburger Doble',
            description: 'Doble carne, doble queso, tocino y cebolla caramelizada.',
            price: 15.50,
            category: 'Hamburguesas',
            image: '/images/products/cheeseburger-doble.png',
            available: true
        },
        {
            name: 'Aros de Cebolla',
            description: 'Aros de cebolla rebosados y fritos, servidos con salsa BBQ.',
            price: 5.00,
            category: 'Acompañamientos',
            image: '/images/products/aros-cebolla.png',
            available: true
        }
    ];

    await productRepository.save(defaultProducts);
    console.log('✅ Default products seeded successfully');
}
