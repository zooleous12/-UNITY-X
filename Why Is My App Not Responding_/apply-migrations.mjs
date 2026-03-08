import mysql from 'mysql2/promise';

const url = process.env.DATABASE_URL;
if (!url) { console.error('DATABASE_URL not set'); process.exit(1); }

const conn = await mysql.createConnection(url);

const statements = [
  // flashcards
  `CREATE TABLE IF NOT EXISTS \`flashcards\` (
    \`id\` int AUTO_INCREMENT NOT NULL,
    \`userId\` int NOT NULL,
    \`studyMaterialId\` int,
    \`courseId\` int,
    \`front\` text NOT NULL,
    \`back\` text NOT NULL,
    \`easeFactor\` float NOT NULL DEFAULT 2.5,
    \`interval\` int NOT NULL DEFAULT 0,
    \`repetitions\` int NOT NULL DEFAULT 0,
    \`nextReviewAt\` timestamp NOT NULL DEFAULT (now()),
    \`lastReviewedAt\` timestamp,
    \`correctCount\` int NOT NULL DEFAULT 0,
    \`incorrectCount\` int NOT NULL DEFAULT 0,
    \`difficulty\` enum('easy','medium','hard') NOT NULL DEFAULT 'medium',
    \`tags\` json,
    \`createdAt\` timestamp NOT NULL DEFAULT (now()),
    \`updatedAt\` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT \`flashcards_id\` PRIMARY KEY(\`id\`)
  )`,
  // study_materials
  `CREATE TABLE IF NOT EXISTS \`study_materials\` (
    \`id\` int AUTO_INCREMENT NOT NULL,
    \`userId\` int NOT NULL,
    \`courseId\` int,
    \`title\` varchar(500) NOT NULL,
    \`type\` enum('audio','pdf','document_scan','video') NOT NULL,
    \`originalFileUrl\` text,
    \`originalFileKey\` text,
    \`processedFileUrl\` text,
    \`processedFileKey\` text,
    \`status\` enum('pending','processing','completed','failed') NOT NULL DEFAULT 'pending',
    \`processingError\` text,
    \`duration\` int,
    \`pageCount\` int,
    \`wordCount\` int,
    \`language\` varchar(10),
    \`transcription\` text,
    \`summary\` text,
    \`keyPoints\` json,
    \`definitions\` json,
    \`timestamps\` json,
    \`subject\` varchar(100),
    \`course\` varchar(200),
    \`tags\` json,
    \`createdAt\` timestamp NOT NULL DEFAULT (now()),
    \`updatedAt\` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT \`study_materials_id\` PRIMARY KEY(\`id\`)
  )`,
  // study_sessions
  `CREATE TABLE IF NOT EXISTS \`study_sessions\` (
    \`id\` int AUTO_INCREMENT NOT NULL,
    \`userId\` int NOT NULL,
    \`sessionType\` enum('review','flashcards','reading','practice') NOT NULL,
    \`studyMaterialId\` int,
    \`startedAt\` timestamp NOT NULL DEFAULT (now()),
    \`endedAt\` timestamp,
    \`durationMinutes\` int,
    \`itemsReviewed\` int NOT NULL DEFAULT 0,
    \`itemsCorrect\` int NOT NULL DEFAULT 0,
    \`itemsIncorrect\` int NOT NULL DEFAULT 0,
    \`subject\` varchar(100),
    \`notes\` text,
    \`createdAt\` timestamp NOT NULL DEFAULT (now()),
    CONSTRAINT \`study_sessions_id\` PRIMARY KEY(\`id\`)
  )`,
  // subscription_history
  `CREATE TABLE IF NOT EXISTS \`subscription_history\` (
    \`id\` int AUTO_INCREMENT NOT NULL,
    \`userId\` int NOT NULL,
    \`action\` enum('subscribed','upgraded','downgraded','canceled','renewed') NOT NULL,
    \`fromTier\` enum('free','student','scholar','academic'),
    \`toTier\` enum('free','student','scholar','academic') NOT NULL,
    \`amount\` float,
    \`currency\` varchar(3) DEFAULT 'usd',
    \`stripeEventId\` varchar(255),
    \`createdAt\` timestamp NOT NULL DEFAULT (now()),
    CONSTRAINT \`subscription_history_id\` PRIMARY KEY(\`id\`)
  )`,
  // weakness_analyses
  `CREATE TABLE IF NOT EXISTS \`weakness_analyses\` (
    \`id\` int AUTO_INCREMENT NOT NULL,
    \`userId\` int NOT NULL,
    \`testImageUrl\` text NOT NULL,
    \`testImageKey\` text NOT NULL,
    \`testType\` varchar(100),
    \`subject\` varchar(100),
    \`mistakes\` json,
    \`weakConcepts\` json,
    \`predictions\` json,
    \`score\` float,
    \`totalQuestions\` int,
    \`correctAnswers\` int,
    \`createdAt\` timestamp NOT NULL DEFAULT (now()),
    \`updatedAt\` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT \`weakness_analyses_id\` PRIMARY KEY(\`id\`)
  )`,
  // courses
  `CREATE TABLE IF NOT EXISTS \`courses\` (
    \`id\` int AUTO_INCREMENT NOT NULL,
    \`userId\` int NOT NULL,
    \`name\` varchar(200) NOT NULL,
    \`code\` varchar(50),
    \`color\` varchar(7) NOT NULL DEFAULT '#6366f1',
    \`semester\` varchar(50),
    \`instructor\` varchar(200),
    \`description\` text,
    \`materialsCount\` int NOT NULL DEFAULT 0,
    \`flashcardsCount\` int NOT NULL DEFAULT 0,
    \`createdAt\` timestamp NOT NULL DEFAULT (now()),
    \`updatedAt\` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT \`courses_id\` PRIMARY KEY(\`id\`)
  )`,
  // user_preferences
  `CREATE TABLE IF NOT EXISTS \`user_preferences\` (
    \`id\` int AUTO_INCREMENT NOT NULL,
    \`userId\` int NOT NULL,
    \`themeMode\` enum('light','dark','auto') DEFAULT 'dark',
    \`purpleShade\` varchar(20) DEFAULT 'default',
    \`accentColor\` varchar(7) DEFAULT '#a855f7',
    \`fontSize\` enum('small','medium','large') DEFAULT 'medium',
    \`sidebarPosition\` enum('left','right','hidden') DEFAULT 'left',
    \`cardLayout\` enum('compact','comfortable','spacious') DEFAULT 'comfortable',
    \`dashboardLayout\` varchar(50) DEFAULT 'default',
    \`experimentalFeatures\` text,
    \`submittedSuggestions\` text,
    \`createdAt\` timestamp NOT NULL DEFAULT (now()),
    \`updatedAt\` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT \`user_preferences_id\` PRIMARY KEY(\`id\`),
    CONSTRAINT \`user_preferences_userId_unique\` UNIQUE(\`userId\`)
  )`,
  // material_questions
  `CREATE TABLE IF NOT EXISTS \`material_questions\` (
    \`id\` int AUTO_INCREMENT NOT NULL,
    \`materialId\` int NOT NULL,
    \`userId\` int NOT NULL,
    \`question\` text NOT NULL,
    \`answer\` text NOT NULL,
    \`tokensUsed\` int,
    \`responseTime\` int,
    \`createdAt\` timestamp NOT NULL DEFAULT (now()),
    CONSTRAINT \`material_questions_id\` PRIMARY KEY(\`id\`)
  )`,
];

// ALTER users table - add columns if not exist
const userAlters = [
  { col: 'subscriptionTier', sql: "ALTER TABLE `users` ADD COLUMN `subscriptionTier` enum('free','student','scholar','academic','founder','beta') NOT NULL DEFAULT 'free'" },
  { col: 'subscriptionStatus', sql: "ALTER TABLE `users` ADD COLUMN `subscriptionStatus` enum('active','canceled','past_due','trialing') DEFAULT 'active'" },
  { col: 'stripeCustomerId', sql: "ALTER TABLE `users` ADD COLUMN `stripeCustomerId` varchar(255)" },
  { col: 'stripeSubscriptionId', sql: "ALTER TABLE `users` ADD COLUMN `stripeSubscriptionId` varchar(255)" },
  { col: 'subscriptionEndsAt', sql: "ALTER TABLE `users` ADD COLUMN `subscriptionEndsAt` timestamp" },
  { col: 'monthlyAudioMinutes', sql: "ALTER TABLE `users` ADD COLUMN `monthlyAudioMinutes` int DEFAULT 0 NOT NULL" },
  { col: 'monthlyPdfPages', sql: "ALTER TABLE `users` ADD COLUMN `monthlyPdfPages` int DEFAULT 0 NOT NULL" },
  { col: 'usageResetAt', sql: "ALTER TABLE `users` ADD COLUMN `usageResetAt` timestamp DEFAULT (now()) NOT NULL" },
  { col: 'userTier', sql: "ALTER TABLE `users` ADD COLUMN `userTier` enum('regular','founder_core','beta_tester') DEFAULT 'regular' NOT NULL" },
  { col: 'seatNumber', sql: "ALTER TABLE `users` ADD COLUMN `seatNumber` int" },
  { col: 'seatType', sql: "ALTER TABLE `users` ADD COLUMN `seatType` enum('reserved_family','public_founder','beta_tester')" },
  { col: 'lifetimeFree', sql: "ALTER TABLE `users` ADD COLUMN `lifetimeFree` boolean DEFAULT false NOT NULL" },
  { col: 'betaFreeYearUnlocked', sql: "ALTER TABLE `users` ADD COLUMN `betaFreeYearUnlocked` boolean DEFAULT false NOT NULL" },
  { col: 'betaFreeYearStart', sql: "ALTER TABLE `users` ADD COLUMN `betaFreeYearStart` timestamp" },
  { col: 'betaFreeYearEnd', sql: "ALTER TABLE `users` ADD COLUMN `betaFreeYearEnd` timestamp" },
  { col: 'founderBadge', sql: "ALTER TABLE `users` ADD COLUMN `founderBadge` varchar(100)" },
];

console.log('Creating tables...');
for (const sql of statements) {
  try {
    await conn.execute(sql);
    console.log('  OK:', sql.substring(0, 60) + '...');
  } catch (e) {
    console.log('  SKIP (already exists?):', e.message.substring(0, 80));
  }
}

console.log('\nAltering users table...');
// First check existing columns
const [cols] = await conn.execute("SHOW COLUMNS FROM `users`");
const existingCols = new Set(cols.map(c => c.Field));

for (const { col, sql } of userAlters) {
  if (existingCols.has(col)) {
    console.log(`  SKIP: ${col} already exists`);
    continue;
  }
  try {
    await conn.execute(sql);
    console.log(`  OK: Added ${col}`);
  } catch (e) {
    console.log(`  ERR: ${col}: ${e.message.substring(0, 80)}`);
  }
}

// Verify
const [tables] = await conn.execute("SHOW TABLES");
console.log('\nFinal tables:', tables.map(t => Object.values(t)[0]).join(', '));

await conn.end();
console.log('Done!');
