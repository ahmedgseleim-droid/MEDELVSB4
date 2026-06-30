const { Pool } = require("C:/Users/HanyG/Desktop/MEDELVSB4/node_modules/.pnpm/node_modules/pg");
const p = new Pool({
  connectionString: "postgresql://postgres.yhyoitszucxkrwnewchs:MEDELVSBKSA@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres",
  ssl: { rejectUnauthorized: false }
});
(async () => {
  try {
    const c = await p.query("SELECT COUNT(*) AS cnt FROM records");
    console.log("Total records:", c.rows[0].cnt);
    const r = await p.query("SELECT id, patient_name, saved_by, submitted_by, created_at FROM records ORDER BY id");
    console.log("All records:", JSON.stringify(r.rows, null, 2));
  } catch (e) {
    console.error("Error:", e.message);
  } finally {
    await p.end();
  }
})();
