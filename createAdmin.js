const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@tieba.ci';
  const adminPassword = 'adminpassword123'; // Default password

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log(`L'administrateur avec l'email ${adminEmail} existe déjà.`);
    return;
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // Create the admin user
  const adminUser = await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('✅ Compte Administrateur créé avec succès !');
  console.log(`📧 Email : ${adminEmail}`);
  console.log(`🔑 Mot de passe : ${adminPassword}`);
  console.log(`⚠️ Pensez à changer ce mot de passe plus tard.`);
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors de la création de l\'admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
