import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create movies
  const movie1 = await prisma.movie.create({
    data: {
      title: 'Z-Zone',
      description:
        'A group of young delinquents, transferred to a remote military base for rehabilitation, find themselves caught in a web of secrets and battling sinister forces lurking in the shadows.',
      release_date: new Date('2024-12-20'),
      duration: 83,
      genre: 'Horror',
      rating: 'NC15',
      iscomingsoon: false,
      posterurl: 'https://tickets.legend.com.kh/CDN/media/entity/get/Movies/HO00001784',
      trailerurl: 'https://www.youtube.com/watch?v=iTGYRpHpl7k',
    }
  });

  // Create showtimes
  await prisma.showtime.createMany({
    data: [
      {
        movie_id: movie1.movie_id,
        show_date: new Date('2025-01-10'),
        start_time: new Date('2025-01-10T14:30:00'),
        runtime: 86,
      },
    ],
  });

  // Create users
  const user1 = await prisma.users.create({
    data: {
      name: 'John Doe',
      username: 'johndoe',
      email: 'johndoe@example.com',
      phone_number: '1234567890',
    }
  });

  const user2 = await prisma.users.create({
    data: {
      name: 'Jane Smith',
      username: 'janesmith',
      email: 'janesmith@example.com',
      phone_number: '0987654321',
    }
  });

  // Create auth providers
  await prisma.auth_providers.createMany({
    data: [
      {
        user_id: user1.id,
        provider: 'google',
        provider_id: 'google_id_1',
        password: 'hashedpassword1',
      },
      {
        user_id: user2.id,
        provider: 'facebook',
        provider_id: 'facebook_id_1',
        password: 'hashedpassword2',
      },
    ],
  });

  // Create admin
  await prisma.admin.create({
    data: {
      email: 'admin@example.com',
      password: 'adminpassword',
      role: 'admin',
    }
  });

  console.log('Database has been seeded!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
