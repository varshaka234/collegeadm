const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const multer = require("multer");
const app = express();
app.use(express.json());
const puppeteer = require("puppeteer");

// ✅ Correct CORS Setup
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true, // Allow cookies & authentication headers
  })
);

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "W7301@jqir#", // ⚠️ Consider using environment variables for security
  database: "college_admission",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL database");
});

// ✅ Register User (Includes Additional Fields & Improved Validation)
app.post("/register", async (req, res) => {
  try {
    console.log("📥 Incoming Registration Request:", req.body); // ✅ Log received data


    // ✅ Extract all fields from req.body
    const {
      fullname,
      fatherName,
      motherName,
      dobYear,
      dobMonth,
      dobDay,
      gender,
      qualification,
      category,
      aadhar,
      mobile,
      alternateMobile,
      email,
      address,
      state,
      district,
      pincode,
      nationality,
      keralite,
      religion,
      caste,
      
    } = req.body;

    const dobYearParsed = parseInt(dobYear);
    const dobMonthParsed = parseInt(dobMonth);
    const dobDayParsed = parseInt(dobDay);


    // ✅ Validate required fields
    if (
      !fullname || !fatherName || !motherName || !dobYear || !dobMonth || !dobDay ||
      !gender || !qualification || !category || !aadhar || !mobile || !email || 
      !address || !state || !district || !pincode || !keralite || !religion || !caste
    ) {
      return res.status(400).json({ error: "❌ Missing required fields. Please check your input." });
    }
    

    // ✅ Validate Aadhar (Should be 12 digits)
    if (!/^\d{12}$/.test(aadhar)) {
      return res.status(400).json({ error: "❌ Enter a valid 12-digit Aadhar number." });
    }

    // ✅ Validate Mobile Number (Should be 10 digits)
    if (!/^\d{10}$/.test(mobile)) {
      return res.status(400).json({ error: "❌ Enter a valid 10-digit mobile number." });
    }

    // ✅ Validate Email Format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "❌ Enter a valid email address." });
    }

    // ✅ Combine DOB fields into a single date string
    const dob = `${dobYear}-${dobMonth}-${dobDay}`;

    

    // ✅ SQL Insert Query
    const sql = `INSERT INTO users 
  (fullname, fatherName, motherName, dobYear, dobMonth, dobDay, gender, qualification, category, nationality, 
   aadhar, mobile, alternateMobile, email, address, state, district, pincode, keralite, religion, caste) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`; 

const values = [
  fullname, fatherName, motherName, dobYear, dobMonth, dobDay, gender, qualification, category, nationality, 
  aadhar, mobile, alternateMobile, email, address, state, district, pincode, keralite, religion, caste,
];

    // ✅ Execute Query
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("❌ Database Error:", err); // ✅ Log SQL error
        return res.status(500).json({ error: "❌ Database error: " + err.message });
      }
      res.status(201).json({ message: "✅ Registration successful", userId: result.insertId });
    });

  } catch (error) {
    console.error("❌ Server Error:", error); // ✅ Log unexpected errors
    res.status(500).json({ error: "❌ Server error: " + error.message });
  }
});

// ✅ Login User (Verify Hashed Password & Generate JWT)
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "❌ Email and password are required." });
    }

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
      if (err) {
        console.error("❌ Database Error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: "❌ Invalid email or password" });
      }

      const user = results[0];


      // ✅ Generate JWT token
      const token = jwt.sign({ id: user.id }, "your_secret_key", { expiresIn: "1h" });

      res.cookie("token", token, {
        httpOnly: true, // Prevents access via JavaScript
        secure: false, // Set to true in production (HTTPS required)
        sameSite: "lax",
      });

      res.json({ success: true, token, studentId: user.id });
    });
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
  },
});

// ✅ Accept both "photo" and "signature"
const upload = multer({ storage: storage }).fields([
  { name: "photo", maxCount: 1 },
  { name: "signature", maxCount: 1 },
]);

app.post("/upload", (req, res) => {
  upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
          return res.status(400).json({ error: "MulterError: " + err.message });
      } else if (err) {
          return res.status(400).json({ error: "File upload failed" });
      }

      if (!req.files || !req.files["photo"] || !req.files["signature"]) {
          return res.status(400).json({ error: "Both photo and signature are required" });
      }

      res.json({
          message: "✅ Upload successful",
          photo: req.files["photo"][0].filename,
          signature: req.files["signature"][0].filename,
      });
  });
});



app.get("/api/payments", (req, res) => {
  const sql = `
    SELECT 
      transaction_id, 
      CONCAT('₹', FORMAT(amount, 2)) AS amount, 
      status, 
      payment_date 
    FROM payments 
    ORDER BY payment_date DESC`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Database Error:", err);
      return res.status(500).json({ error: "Database Error" });
    }
    
    console.log("📊 Payment Data Retrieved:", results); // ✅ Debugging
    res.json(results);
  });
});


// ✅ Logout User (Clear JWT Token)
app.post("/api/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "✅ Logout successful" });
});
// ✅ Fetch Application Data by ID
app.get("/api/getApplication/:id", (req, res) => {
  const applicationId = req.params.id;

  const sql = "SELECT * FROM applications WHERE id = ?";
  db.query(sql, [applicationId], (err, result) => {
    if (err) {
      console.error("❌ Database Error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "❌ Application not found" });
    }

    res.json(result[0]); // Send application details
  });
});
app.get('/getPrograms/:qualification', async (req, res) => {
  const qualification = req.params.qualification;
  const query = `
      SELECT programs.program_name FROM programs
      JOIN qualifications ON programs.qualification_id = qualifications.id
      WHERE qualifications.qualification_name = ?`;
  
  db.query(query, [qualification], (err, results) => {
      if (err) {
          res.status(500).json({ error: err.message });
      } else {
          res.json(results);
      }
  });
});
app.get("/preview", async (req, res) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto("https://admissions.cusat.ac.in/Application");

  // Simulate login
  await page.type("input[name='username']", "your_username");
  await page.type("input[name='password']", "your_password");
  await page.keyboard.press("Enter");

  await page.waitForTimeout(3000); // Wait for login

  // Click on "Short Preview" button
  try {
      await page.click("button:text('Short Preview')");
      await page.waitForTimeout(3000);

      // Take a screenshot
      await page.screenshot({ path: "short_preview.png" });

      res.json({ message: "Success", screenshot: "short_preview.png" });
  } catch (error) {
      res.status(500).json({ message: "Failed to navigate", error });
  }

  await browser.close();
});
app.get("/api/applicants", (req, res) => {
  const sql = "SELECT * FROM users WHERE status = 'pending'"; // Fetch only pending applications
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Database Error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});
app.post("/api/applicants/:id/approve", (req, res) => {
  const applicantId = req.params.id;
  const { status } = req.body; // "approved" or "rejected"

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const sql = "UPDATE users SET status = ? WHERE id = ?";
  db.query(sql, [status, applicantId], (err, result) => {
    if (err) {
      console.error("❌ Database Error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: `✅ Application ${status} successfully` });
  });
});
// Get student details by ID

  app.get("/student/:id", (req, res) => {

  const studentId = req.params.id;
  const query = "SELECT * FROM students WHERE id = ?";

  db.query(query, [studentId], (err, result) => {
      if (err) {
          return res.status(500).json({ error: "Database error" });
      }
      if (result.length === 0) {
          return res.status(404).json({ error: "Student not found" });
      }
      res.json(result[0]); // Return student details
  });
});


app.get("/api/admin/applicants", async (req, res) => {
  try {
    const [applicants] = await db.query("SELECT * FROM applicants");
    res.json(applicants);
  } catch (error) {
    res.status(500).json({ error: "Error fetching applicants" });
  }
});

app.get("/api/admin/applicant/:studentId", async (req, res) => {
  const { studentId } = req.params;
  try {
    const [studentData] = await db.query(
      "SELECT * FROM applicants WHERE student_id = ?",
      [studentId]
    );
    res.json(studentData);
  } catch (error) {
    res.status(500).json({ error: "Error fetching student data" });
  }
});
app.get("/api/admin/applicants", (req, res) => {
  const sql = "SELECT * FROM users WHERE status = 'pending'";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Database Error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  const query = "INSERT INTO applicants (name, email, status) VALUES (?, ?, 'Pending')";
  db.query(query, [name, email], (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });

      res.json({ message: "Student registered successfully, pending admin approval." });
  });
});
app.get('/admin/applicants', (req, res) => {
  const query = "SELECT * FROM applicants";
  db.query(query, (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });

      res.json(results);
  });
});
app.post("/api/student/register", async (req, res) => {
  const { fullname, email, mobile, program } = req.body;

  try {
      const insertQuery = `INSERT INTO applicants (name, mobile, program, payment_status, app_status) 
                           VALUES (?, ?, ?, 'Pending', 'Under Review')`;

      await db.query(insertQuery, [fullname, email, mobile, program]);
      res.status(201).json({ message: "Registration successful" });
  } catch (error) {
      console.error("Error inserting applicant:", error);
      res.status(500).json({ message: "Database error" });
  }
});



// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
