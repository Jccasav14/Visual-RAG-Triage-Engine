const { Client } = require('pg');
const bcrypt = require('bcryptjs');

async function seed() {
  const host = process.env.DB_HOST || 'localhost';
  const port = parseInt(process.env.DB_PORT || '5432', 10);
  const user = process.env.DB_USERNAME || 'postgres';
  const password = process.env.DB_PASSWORD || '1234';

  console.log('🌱 Conectando a PostgreSQL para poblar datos completos...');

  const client = new Client({
    host,
    port,
    user,
    password,
    database: 'visual_rag_db',
  });

  try {
    await client.connect();

    const hashedPassword = await bcrypt.hash('password', 10);

    const docJeanId = '11111111-2222-3333-4444-555555555555';
    const docSilvaId = '94dcdd83-9195-4ac3-ad28-79b8be9671f2';
    const patNelsonId = '66666666-7777-8888-9999-000000000000';
    const patDemoId = '77777777-8888-9999-0000-111111111111';

    const usersToInsert = [
      {
        id: docJeanId,
        email: 'jeancasaxd60@gmail.com',
        fullName: 'Dr. Jean Carlos Casa',
        role: 'DOCTOR',
        cedula: '1751361000',
        doctorId: null,
        phone: '+593 99 876 5432',
        specialty: 'Cirugía General y Laparoscópica',
        licenseNumber: 'MSP-849201',
        hospital: 'Hospital Metropolitano de Quito',
        bloodType: 'O+',
        emergencyContact: 'Dra. Elena Casa - 0991122334',
        birthDate: '1990-04-12'
      },
      {
        id: docSilvaId,
        email: 'dr.silva@hospital.com',
        fullName: 'Dr. Alejandro Silva',
        role: 'DOCTOR',
        cedula: '0928374651',
        doctorId: null,
        phone: '+593 98 765 4321',
        specialty: 'Cirugía Oncológica y Reconstructiva',
        licenseNumber: 'MSP-592018',
        hospital: 'Hospital de Especialidades',
        bloodType: 'A+',
        emergencyContact: 'Dr. Roberto Mendoza - 0984455667',
        birthDate: '1985-08-25'
      },
      {
        id: patNelsonId,
        email: 'nelsoncasa@gmail.com',
        fullName: 'Nelson Steven Casa',
        role: 'PATIENT',
        cedula: '1751361054',
        doctorId: docJeanId,
        phone: '+593 98 123 4567',
        specialty: null,
        licenseNumber: null,
        hospital: null,
        bloodType: 'O+',
        emergencyContact: 'Carmen Velásquez (Madre) - 0998765432',
        birthDate: '1998-05-14'
      },
      {
        id: patDemoId,
        email: 'paciente.demo@gmail.com',
        fullName: 'Juan Carlos Casallas',
        role: 'PATIENT',
        cedula: '1728394051',
        doctorId: docJeanId,
        phone: '+593 97 111 2233',
        specialty: null,
        licenseNumber: null,
        hospital: null,
        bloodType: 'A+',
        emergencyContact: 'Lucía Casallas (Hermana) - 0981122334',
        birthDate: '1995-11-20'
      }
    ];

    for (const u of usersToInsert) {
      await client.query(
        `INSERT INTO users (
          id, email, password, "fullName", role, cedula, "doctorId", 
          phone, specialty, "licenseNumber", hospital, "bloodType", "emergencyContact", "birthDate"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        ON CONFLICT (email) DO UPDATE SET 
          password = EXCLUDED.password, 
          "fullName" = EXCLUDED."fullName", 
          "doctorId" = EXCLUDED."doctorId",
          phone = EXCLUDED.phone,
          specialty = EXCLUDED.specialty,
          "licenseNumber" = EXCLUDED."licenseNumber",
          hospital = EXCLUDED.hospital,
          "bloodType" = EXCLUDED."bloodType",
          "emergencyContact" = EXCLUDED."emergencyContact",
          "birthDate" = EXCLUDED."birthDate"`,
        [
          u.id, u.email, hashedPassword, u.fullName, u.role, u.cedula, u.doctorId,
          u.phone, u.specialty, u.licenseNumber, u.hospital, u.bloodType, u.emergencyContact, u.birthDate
        ]
      );
    }

    // Insert Medical Restrictions cleanly
    await client.query('DELETE FROM medical_restrictions WHERE "patientId" IN ($1, $2)', [patNelsonId, patDemoId]);

    await client.query(`
      INSERT INTO medical_restrictions (
        "patientId", "doctorId", "surgeryType", "surgeryDate", prohibitions, "allowedActions", 
        allergies, "emergencyThresholds", notes, "startDate", "endDate", "restDays", "followupAppointmentDate", status
      )
      VALUES 
        (
          '${patNelsonId}', 
          '${docJeanId}', 
          'Apendicectomía Laparoscópica', 
          '2026-08-10', 
          'Prohibido levantar objetos pesados (+3kg), masajear el área o realizar esfuerzos intensos.', 
          'Caminatas suaves de 10-15 minutos, ingesta abundante de agua y curación seca con gasa estéril.', 
          'Ninguna', 
          'Fiebre superior a 38°C, sangrado activo o enrojecimiento extendido en suturas.', 
          'Evolución postoperatoria favorable. Control presencial en 7 días.', 
          '2026-08-10', 
          '2026-08-24', 
          14, 
          '2026-08-25', 
          'ACTIVE'
        ),
        (
          '${patDemoId}', 
          '${docJeanId}', 
          'Colecistectomía Laparoscópica', 
          '2026-08-12', 
          'No consumir comida grasosa ni irritante durante los primeros 15 días.', 
          'Dieta blanda y caminatas ligeras.', 
          'Penicilina', 
          'Fiebre alta o sangrado continuo.', 
          'Control en consulta externa.', 
          '2026-08-12', 
          '2026-08-27', 
          15, 
          '2026-08-28', 
          'ACTIVE'
        );
    `);

    console.log('✅ Base de datos PostgreSQL poblada exitosamente:');
    console.log('   👨‍⚕️ DOCTOR: jeancasaxd60@gmail.com | Nombre: Dr. Jean Carlos Casa');
    console.log('   👨‍🦱 PACIENTE: nelsoncasa@gmail.com | Nombre: Nelson Steven Casa');
    console.log('   📋 Fichas médicas postoperatorias asociadas');

  } catch (err) {
    console.error('❌ Error al poblar PostgreSQL:', err.message);
  } finally {
    await client.end();
  }
}

seed();
