import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

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

  const movie2 = await prisma.movie.create({
    data: {
      title: 'Z-Zone222222222',
      description:
        'A group of young delinquents, transferred to a remote military base for rehabilitation, find themselves caught in a web of secrets and battling sinister forces lurking in the shadows.',
      release_date: new Date('2024-12-20'),
      duration: 83,
      genre: 'Horror',
      rating: 'NC15',
      iscomingsoon: true,
      posterurl: 'https://tickets.legend.com.kh/CDN/media/entity/get/Movies/HO00001784',
      trailerurl: 'https://www.youtube.com/watch?v=iTGYRpHpl7k',
    }
  });

  const cinema1 = await prisma.cinema.create({
    data: {
      name: "Legend Cinema 271 Mega Mall",
      description: "",
      openHour: "09:30",
      closeHour: "22:30",
      address1: "3rd Floor, Chip Mong Mega Mall",
      address2: "St271, Phum Prek Ta Nu, Sangkat Chak Angrae Leu, Khan Mean Chey",
      city: "Phnom Penh, Cambodia",
      numberOfHalls: 7,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const cinema2 = await prisma.cinema.create({
    data: {
      name: "Legend Cinema Sihanoukville",
      description: "",
      openHour: "09:30",
      closeHour: "22:30",
      address1: "PGB-5-021, 4th Floor of Prince",
      address2: "PGB-5-021, 4th Floor of Prince ,Sihanoukville",
      city: "Sihanoukville, Cambodia",
      numberOfHalls: 4,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Create showtimes
  await prisma.showtime.createMany({
    data: [
      {
        movie_id: movie1.movie_id,
        cinema_id: cinema1.cinema_id,
        show_date: new Date(), // Use the current date and time (if that's what you want)
        start_time: new Date('2025-01-10T14:30:00'), // Start time is valid ISO string
        runtime: 86,
      },
      {
        movie_id: movie1.movie_id,
        cinema_id: cinema2.cinema_id, // Another cinema ID for the second showtime
        show_date: new Date(), // Current date and time
        start_time: new Date('2025-01-08T17:45:00'), // Another valid start time
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
      phone_number: '1234567890', // Make sure this field is unique
      // dob: null, // You can leave this out or explicitly set it to null if necessary
      created_at: new Date(),
      updated_at: new Date(),
    }
  });

  // Create admin
  await prisma.admin.create({
    data: {
      email: 'admin@example.com',
      password: await bcrypt.hash('adminpassword', 10), 
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
