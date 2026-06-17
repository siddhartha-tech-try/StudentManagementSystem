import { prisma } from "../src/config/prisma";
import { createStudent } from "../src/services/student.service";

const seedStudents = [
  {
    name: "Aarav Sharma",
    course: "Computer Science",
    year: 2,
    dateOfBirth: "2005-03-12",
    email: "aarav.sharma@example.com",
    mobileNo: "9876543210",
    gender: "MALE" as const,
    address: "18 Park Street, Delhi"
  },
  {
    name: "Meera Nair",
    course: "Business Administration",
    year: 1,
    dateOfBirth: "2006-07-24",
    email: "meera.nair@example.com",
    mobileNo: "9988776655",
    gender: "FEMALE" as const,
    address: "42 Lake View Road, Kochi"
  },
  {
    name: "Rohan Patel",
    course: "Mechanical Engineering",
    year: 3,
    dateOfBirth: "2004-11-05",
    email: "rohan.patel@example.com",
    mobileNo: "9123456789",
    gender: "MALE" as const,
    address: "7 University Avenue, Ahmedabad"
  }
];

const main = async () => {
  const existingCount = await prisma.student.count();

  if (existingCount > 0) {
    console.log("Seed skipped because students already exist.");
    return;
  }

  for (const student of seedStudents) {
    await createStudent(student);
  }

  console.log("Seeded sample students.");
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
