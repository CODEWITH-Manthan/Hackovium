
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: "postgresql://postgres:admin123@localhost:5432/solsense"
});

async function checkProfiles() {
  try {
    const res = await pool.query(`
      SELECT id, user_id AS "userId", profile_name AS "profileName", 
              panel_capacity AS "panelCapacity", panel_efficiency AS "panelEfficiency", 
              tilt_angle AS "tiltAngle", location_city AS "locationCity"
       FROM solar_profiles 
       LIMIT 5
    `);
    console.log(JSON.stringify(res.rows, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkProfiles();
