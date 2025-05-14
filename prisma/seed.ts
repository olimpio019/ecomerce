const { PrismaClient } = require('@prisma/client');
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const senhaHash = await bcrypt.hash('123456', 10);

  // Criar ou atualizar usuário admin
  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@example.com' },
    update: {
      role: 'ADMIN',
      admin: true
    },
    create: {
      nome: 'Admin',
      email: 'admin@example.com',
      senhaHash,
      role: 'ADMIN',
      admin: true
    },
  });

  console.log('Usuário admin criado/atualizado:', admin);

  // Criar categorias
  const categorias = [
    { nome: 'Masculino' },
    { nome: 'Feminino' },
    { nome: 'Infantil' },
    { nome: 'Esportes' }
  ];

  for (let i = 0; i < categorias.length; i++) {
    await prisma.categoria.upsert({
      where: { id: i + 1 },
      update: categorias[i],
      create: categorias[i]
    });
  }

  // Produtos para cada categoria
  const produtos = [
    // Masculino
    {
      nome: 'Tênis Nike Air Max',
      descricao: 'Tênis Nike Air Max para corrida e caminhada',
      preco: 499.90,
      precoPix: 449.90,
      imagemUrl: '/produtos/tenis-nike-air-max.jpg',
      marca: 'Nike',
      categoriaId: 1,
      estoque: 10,
      tamanhos: ['40', '41', '42', '43', '44']
    },
    {
      nome: 'Tênis Adidas Ultraboost',
      descricao: 'Tênis Adidas Ultraboost para corrida',
      preco: 599.90,
      precoPix: 539.90,
      imagemUrl: '/produtos/tenis-adidas-ultraboost.jpg',
      marca: 'Adidas',
      categoriaId: 1,
      estoque: 8,
      tamanhos: ['39', '40', '41', '42', '43']
    },
    // Feminino
    {
      nome: 'Tênis Nike Air Force',
      descricao: 'Tênis Nike Air Force feminino',
      preco: 399.90,
      precoPix: 359.90,
      imagemUrl: '/produtos/tenis-nike-air-force.jpg',
      marca: 'Nike',
      categoriaId: 2,
      estoque: 12,
      tamanhos: ['35', '36', '37', '38', '39']
    },
    {
      nome: 'Tênis Adidas Forum',
      descricao: 'Tênis Adidas Forum feminino',
      preco: 349.90,
      precoPix: 314.90,
      imagemUrl: '/produtos/tenis-adidas-forum.jpg',
      marca: 'Adidas',
      categoriaId: 2,
      estoque: 15,
      tamanhos: ['34', '35', '36', '37', '38']
    },
    // Infantil
    {
      nome: 'Tênis Nike Kids',
      descricao: 'Tênis Nike para crianças',
      preco: 199.90,
      precoPix: 179.90,
      imagemUrl: '/produtos/tenis-nike-kids.jpg',
      marca: 'Nike',
      categoriaId: 3,
      estoque: 20,
      tamanhos: ['28', '29', '30', '31', '32']
    },
    {
      nome: 'Tênis Adidas Kids',
      descricao: 'Tênis Adidas para crianças',
      preco: 189.90,
      precoPix: 170.90,
      imagemUrl: '/produtos/tenis-adidas-kids.jpg',
      marca: 'Adidas',
      categoriaId: 3,
      estoque: 18,
      tamanhos: ['27', '28', '29', '30', '31']
    },
    // Esportes
    {
      nome: 'Tênis Nike Zoom',
      descricao: 'Tênis Nike Zoom para corrida',
      preco: 459.90,
      precoPix: 413.90,
      imagemUrl: '/produtos/tenis-nike-zoom.jpg',
      marca: 'Nike',
      categoriaId: 4,
      estoque: 10,
      tamanhos: ['39', '40', '41', '42', '43']
    },
    {
      nome: 'Tênis Adidas Solarboost',
      descricao: 'Tênis Adidas Solarboost para corrida',
      preco: 499.90,
      precoPix: 449.90,
      imagemUrl: '/produtos/tenis-adidas-solarboost.jpg',
      marca: 'Adidas',
      categoriaId: 4,
      estoque: 8,
      tamanhos: ['40', '41', '42', '43', '44']
    }
  ];

  for (const produto of produtos) {
    await prisma.produto.create({
      data: produto
    });
  }

  console.log('Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 