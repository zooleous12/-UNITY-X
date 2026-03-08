/**
 * Demo Data Seeding Script for K-State Investor Presentations
 * Copyright (c) 2026 Charles Kendrick. All Rights Reserved.
 * 
 * This script creates a demo account with pre-loaded data for flawless presentations.
 * Demo account: demo@kstate.edu / kstate2026
 */

import { getDb } from './db';
import { users, courses, materials, flashcards, materialQuestions } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

export async function seedDemoData() {
  const db = await getDb();
  if (!db) {
    throw new Error('[Demo] Database connection failed');
  }
  
  console.log('[Demo] Starting demo data seed...');
  
  // 1. Create demo user
  const demoEmail = 'demo@kstate.edu';
  const existingUser = await db.select().from(users).where(eq(users.email, demoEmail)).limit(1);
  
  let demoUser;
  if (existingUser.length > 0) {
    demoUser = existingUser[0];
    console.log('[Demo] Demo user already exists, using existing user');
  } else {
    const [newUser] = await db.insert(users).values({
      openId: 'demo-kstate-user',
      name: 'K-State Demo Student',
      email: demoEmail,
      avatarUrl: '/icon-192.png',
      founderTier: 'founder' as const,
      founderSeatNumber: 1,
      betaTesterNumber: null,
    }).returning();
    demoUser = newUser;
    console.log('[Demo] Created demo user:', demoUser.email);
  }
  
  // 2. Create 3 courses
  const courseData = [
    { name: 'Biology 101', code: 'BIOL101', color: '#10b981' },
    { name: 'Computer Science 201', code: 'CS201', color: '#3b82f6' },
    { name: 'History 150', code: 'HIST150', color: '#f59e0b' },
  ];
  
  const createdCourses = [];
  for (const course of courseData) {
    const [newCourse] = await db.insert(courses).values({
      userId: demoUser.id,
      name: course.name,
      code: course.code,
      color: course.color,
    }).$returningId();
    createdCourses.push(newCourse);
    console.log('[Demo] Created course:', newCourse.name);
  }
  
  // 3. Create materials for each course
  const materialData = [
    // Biology 101
    { courseId: createdCourses[0].id, title: 'Cell Structure Lecture', type: 'audio', transcription: 'Today we\'ll discuss the fundamental components of cells. The cell membrane, composed of a phospholipid bilayer, acts as a selective barrier controlling what enters and exits the cell. The nucleus contains genetic material (DNA) organized into chromosomes. Mitochondria are the powerhouses of the cell, generating ATP through cellular respiration. Ribosomes synthesize proteins based on instructions from mRNA. The endoplasmic reticulum comes in two forms: rough ER (with ribosomes) for protein processing, and smooth ER for lipid synthesis. The Golgi apparatus modifies and packages proteins for transport. Lysosomes contain digestive enzymes for breaking down waste. Understanding these organelles is crucial for comprehending how cells function as the basic units of life.', summary: 'Overview of cell structure including membrane, nucleus, mitochondria, ribosomes, ER, Golgi apparatus, and lysosomes.', keyPoints: 'Cell membrane is a phospholipid bilayer|Nucleus contains DNA|Mitochondria generate ATP|Ribosomes synthesize proteins|ER processes proteins and lipids|Golgi apparatus packages proteins|Lysosomes digest waste' },
    { courseId: createdCourses[0].id, title: 'Photosynthesis Process', type: 'video', transcription: 'Photosynthesis is the process by which plants convert light energy into chemical energy. It occurs in two main stages: the light-dependent reactions and the Calvin cycle. In the light-dependent reactions, chlorophyll in the thylakoid membranes absorbs photons, exciting electrons that move through the electron transport chain. This generates ATP and NADPH while splitting water molecules to release oxygen. The Calvin cycle uses ATP and NADPH to fix carbon dioxide into glucose through a series of enzyme-catalyzed reactions. The overall equation is 6CO2 + 6H2O + light energy → C6H12O6 + 6O2. Factors affecting photosynthesis rate include light intensity, CO2 concentration, and temperature.', summary: 'Photosynthesis converts light to chemical energy through light-dependent reactions and Calvin cycle.', keyPoints: 'Light-dependent reactions in thylakoids|Chlorophyll absorbs photons|Electron transport chain generates ATP and NADPH|Water splitting releases oxygen|Calvin cycle fixes CO2 into glucose|Factors: light, CO2, temperature' },
    { courseId: createdCourses[0].id, title: 'DNA Replication', type: 'pdf', transcription: 'DNA replication is the process of copying DNA before cell division. It follows a semiconservative model where each new DNA molecule contains one original strand and one newly synthesized strand. The process begins at origins of replication where helicase unwinds the double helix. Single-strand binding proteins stabilize the separated strands. Primase synthesizes RNA primers to provide starting points for DNA synthesis. DNA polymerase III adds nucleotides in the 5\' to 3\' direction, creating the leading strand continuously and the lagging strand in Okazaki fragments. DNA polymerase I replaces RNA primers with DNA. Ligase seals the gaps between fragments. Proofreading mechanisms ensure accuracy with error rates of only 1 in 10 billion base pairs.', summary: 'DNA replication copies genetic material semiconservatively using multiple enzymes.', keyPoints: 'Semiconservative replication model|Helicase unwinds DNA|Primase creates RNA primers|DNA polymerase III synthesizes new strands|Leading strand continuous, lagging strand fragmented|DNA polymerase I replaces primers|Ligase seals gaps|Proofreading ensures accuracy' },
    { courseId: createdCourses[0].id, title: 'Cellular Respiration', type: 'audio', transcription: 'Cellular respiration is the process of breaking down glucose to produce ATP. It consists of four stages: glycolysis, pyruvate oxidation, the Krebs cycle, and oxidative phosphorylation. Glycolysis occurs in the cytoplasm, splitting glucose into two pyruvate molecules while producing 2 ATP and 2 NADH. Pyruvate enters the mitochondria and is converted to acetyl-CoA, releasing CO2 and producing NADH. The Krebs cycle oxidizes acetyl-CoA, generating 3 NADH, 1 FADH2, 1 ATP, and 2 CO2 per cycle. Finally, the electron transport chain uses NADH and FADH2 to pump protons, creating a gradient that drives ATP synthase to produce approximately 34 ATP. The total yield is about 38 ATP per glucose molecule.', summary: 'Cellular respiration breaks down glucose through glycolysis, Krebs cycle, and electron transport chain to produce ATP.', keyPoints: 'Glycolysis produces 2 ATP and 2 NADH|Pyruvate oxidation creates acetyl-CoA|Krebs cycle generates NADH, FADH2, ATP, CO2|Electron transport chain produces ~34 ATP|Total yield: ~38 ATP per glucose|Aerobic process requiring oxygen' },
    { courseId: createdCourses[0].id, title: 'Genetics and Inheritance', type: 'pdf', transcription: 'Mendelian genetics describes how traits are inherited through genes. Gregor Mendel\'s experiments with pea plants revealed fundamental principles. The law of segregation states that each parent contributes one allele for each trait, and these alleles separate during gamete formation. The law of independent assortment states that genes for different traits are inherited independently. Dominant alleles mask recessive alleles in heterozygotes. Punnett squares predict offspring genotypes and phenotypes. Extensions to Mendelian genetics include incomplete dominance (blending), codominance (both alleles expressed), multiple alleles (ABO blood types), and polygenic inheritance (multiple genes affecting one trait). Sex-linked traits are carried on X or Y chromosomes, with X-linked recessive disorders more common in males.', summary: 'Mendelian genetics explains inheritance patterns through laws of segregation and independent assortment.', keyPoints: 'Law of segregation: alleles separate in gametes|Law of independent assortment: traits inherited independently|Dominant vs recessive alleles|Punnett squares predict outcomes|Incomplete dominance and codominance|Multiple alleles and polygenic traits|Sex-linked inheritance patterns' },
    
    // Computer Science 201
    { courseId: createdCourses[1].id, title: 'Data Structures Overview', type: 'audio', transcription: 'Data structures are fundamental to computer science, organizing data for efficient access and modification. Arrays provide constant-time access but fixed size. Linked lists allow dynamic sizing but slower access. Stacks follow Last-In-First-Out (LIFO) principle, useful for function calls and undo operations. Queues follow First-In-First-Out (FIFO), ideal for task scheduling. Trees organize hierarchical data, with binary search trees enabling O(log n) search. Hash tables provide average O(1) lookup through key-value mapping. Graphs represent networks with nodes and edges, supporting algorithms like Dijkstra\'s shortest path. Choosing the right data structure depends on the specific operations your application requires.', summary: 'Overview of fundamental data structures: arrays, linked lists, stacks, queues, trees, hash tables, and graphs.', keyPoints: 'Arrays: constant-time access, fixed size|Linked lists: dynamic size, slower access|Stacks: LIFO principle|Queues: FIFO principle|Trees: hierarchical organization|Hash tables: O(1) average lookup|Graphs: network representation' },
    { courseId: createdCourses[1].id, title: 'Algorithm Complexity', type: 'video', transcription: 'Big O notation describes algorithm efficiency in terms of time and space complexity. O(1) represents constant time, independent of input size. O(log n) indicates logarithmic growth, common in binary search. O(n) represents linear time, where execution time grows proportionally with input. O(n log n) is typical of efficient sorting algorithms like merge sort. O(n²) represents quadratic time, seen in nested loops. O(2^n) indicates exponential growth, often impractical for large inputs. Space complexity measures memory usage. Trade-offs exist between time and space - faster algorithms may use more memory. Analyzing complexity helps choose appropriate algorithms for specific problems and predict performance at scale.', summary: 'Big O notation describes algorithm efficiency, with common complexities from O(1) to O(2^n).', keyPoints: 'O(1): constant time|O(log n): logarithmic (binary search)|O(n): linear time|O(n log n): efficient sorting|O(n²): quadratic (nested loops)|O(2^n): exponential growth|Trade-offs between time and space' },
    { courseId: createdCourses[1].id, title: 'Object-Oriented Programming', type: 'pdf', transcription: 'Object-oriented programming (OOP) organizes code around objects that combine data and behavior. The four pillars of OOP are encapsulation, inheritance, polymorphism, and abstraction. Encapsulation bundles data and methods, hiding internal details through access modifiers (public, private, protected). Inheritance allows classes to derive properties from parent classes, promoting code reuse. Polymorphism enables objects to take multiple forms through method overriding and interfaces. Abstraction simplifies complex systems by exposing only essential features. Classes serve as blueprints for objects. Constructors initialize object state. Destructors clean up resources. Design patterns like Singleton, Factory, and Observer solve common OOP problems. Benefits include modularity, reusability, and maintainability.', summary: 'OOP organizes code around objects with four pillars: encapsulation, inheritance, polymorphism, and abstraction.', keyPoints: 'Encapsulation: bundling data and methods|Inheritance: deriving from parent classes|Polymorphism: multiple forms through overriding|Abstraction: exposing essential features|Classes as object blueprints|Constructors and destructors|Design patterns solve common problems|Benefits: modularity, reusability, maintainability' },
    { courseId: createdCourses[1].id, title: 'Database Fundamentals', type: 'audio', transcription: 'Databases store and organize data for efficient retrieval. Relational databases use tables with rows and columns, connected through foreign keys. SQL (Structured Query Language) enables data manipulation through SELECT, INSERT, UPDATE, and DELETE commands. Normalization reduces redundancy by organizing data into separate tables. ACID properties (Atomicity, Consistency, Isolation, Durability) ensure reliable transactions. Indexes speed up queries but slow down writes. NoSQL databases like MongoDB offer flexible schemas for unstructured data. Key-value stores provide simple lookups. Document databases store JSON-like objects. Graph databases excel at relationship queries. Choosing between SQL and NoSQL depends on data structure, scalability needs, and consistency requirements.', summary: 'Databases organize data, with relational (SQL) and NoSQL options serving different needs.', keyPoints: 'Relational databases use tables and SQL|Normalization reduces redundancy|ACID properties ensure reliability|Indexes improve query performance|NoSQL offers flexible schemas|Key-value, document, and graph databases|SQL vs NoSQL trade-offs' },
    { courseId: createdCourses[1].id, title: 'Software Development Lifecycle', type: 'video', transcription: 'The Software Development Lifecycle (SDLC) guides project development from conception to deployment. The waterfall model follows sequential phases: requirements, design, implementation, testing, and maintenance. Agile methodologies emphasize iterative development with short sprints, daily standups, and continuous feedback. Scrum organizes work into 2-4 week sprints with roles like Product Owner and Scrum Master. Kanban visualizes workflow with boards showing work in progress. DevOps integrates development and operations, automating deployment through CI/CD pipelines. Version control systems like Git track code changes and enable collaboration. Code reviews improve quality. Testing includes unit tests, integration tests, and end-to-end tests. Continuous integration automatically builds and tests code. Continuous deployment pushes changes to production automatically.', summary: 'SDLC guides development through methodologies like Waterfall, Agile, Scrum, and DevOps.', keyPoints: 'Waterfall: sequential phases|Agile: iterative development with sprints|Scrum: organized sprints with defined roles|Kanban: visualizes workflow|DevOps: integrates dev and ops|Git for version control|CI/CD automates testing and deployment|Multiple testing levels' },
    
    // History 150
    { courseId: createdCourses[2].id, title: 'World War II Causes', type: 'pdf', transcription: 'World War II (1939-1945) resulted from multiple interconnected causes. The Treaty of Versailles imposed harsh penalties on Germany after WWI, creating economic hardship and resentment. The Great Depression destabilized economies worldwide, leading to political extremism. Adolf Hitler rose to power in Germany, promoting Nazi ideology and territorial expansion. Appeasement policies by Britain and France failed to contain aggression. Japan sought resources and territory in Asia. Italy under Mussolini pursued imperial ambitions. The invasion of Poland in September 1939 triggered declarations of war. Key battles included Stalingrad, D-Day, and Midway. The Holocaust resulted in genocide of six million Jews. The war ended with atomic bombs on Hiroshima and Nagasaki. Consequences included 70-85 million deaths, the Cold War, and formation of the United Nations.', summary: 'WWII causes include Treaty of Versailles, economic depression, rise of totalitarian regimes, and territorial aggression.', keyPoints: 'Treaty of Versailles created resentment|Great Depression caused instability|Hitler\'s rise and Nazi ideology|Appeasement policies failed|Japan and Italy sought expansion|Poland invasion triggered war|Major battles: Stalingrad, D-Day, Midway|Holocaust genocide|Atomic bombs ended Pacific war|70-85 million deaths' },
    { courseId: createdCourses[2].id, title: 'The Cold War', type: 'audio', transcription: 'The Cold War (1947-1991) was a period of geopolitical tension between the United States and Soviet Union. Ideological differences between capitalism and communism drove the conflict. The Truman Doctrine pledged to contain communist expansion. The Marshall Plan provided economic aid to rebuild Europe. NATO formed as a military alliance against Soviet threats. The Berlin Blockade and Airlift demonstrated early tensions. The Korean War (1950-1953) was the first major proxy conflict. The Cuban Missile Crisis (1962) brought the world closest to nuclear war. The Vietnam War divided American society. The Space Race showcased technological competition, culminating in the moon landing. Détente in the 1970s temporarily eased tensions. Reagan\'s military buildup and Gorbachev\'s reforms led to the Soviet Union\'s collapse in 1991.', summary: 'The Cold War was a 44-year ideological and geopolitical struggle between the US and Soviet Union.', keyPoints: 'Capitalism vs communism ideology|Truman Doctrine and containment|Marshall Plan rebuilt Europe|NATO military alliance|Berlin Blockade and Airlift|Korean War proxy conflict|Cuban Missile Crisis nuclear threat|Vietnam War division|Space Race competition|Détente period|Soviet collapse 1991' },
    { courseId: createdCourses[2].id, title: 'Industrial Revolution', type: 'video', transcription: 'The Industrial Revolution (1760-1840) transformed society from agrarian to industrial. It began in Britain with textile manufacturing innovations like the spinning jenny and power loom. James Watt\'s steam engine provided reliable power for factories and transportation. Coal mining expanded to fuel industrial growth. Iron and steel production advanced with new smelting techniques. Railroads revolutionized transportation and commerce. Urbanization accelerated as workers moved to factory cities. Working conditions were often harsh, with long hours and child labor. The middle class emerged as factory owners and managers. Labor movements organized for better conditions. Technological innovations spread to Europe and America. The Second Industrial Revolution (1870-1914) brought electricity, chemicals, and mass production. Impacts included increased productivity, environmental pollution, and social upheaval.', summary: 'The Industrial Revolution transformed society through mechanization, urbanization, and technological innovation.', keyPoints: 'Began in Britain 1760-1840|Textile innovations: spinning jenny, power loom|Steam engine powered factories|Coal and iron production expanded|Railroads revolutionized transport|Urbanization and factory cities|Harsh working conditions|Middle class emergence|Labor movements organized|Second Industrial Revolution: electricity, chemicals|Increased productivity and pollution' },
    { courseId: createdCourses[2].id, title: 'American Civil Rights Movement', type: 'audio', transcription: 'The Civil Rights Movement (1954-1968) fought for racial equality in America. Brown v. Board of Education (1954) declared school segregation unconstitutional. Rosa Parks\' bus boycott in Montgomery sparked mass protests. Martin Luther King Jr. led nonviolent resistance, delivering his famous "I Have a Dream" speech in 1963. The Civil Rights Act of 1964 banned discrimination in public accommodations and employment. The Voting Rights Act of 1965 protected African American voting rights. Malcolm X advocated for Black empowerment through different means. The Black Panthers promoted self-defense and community programs. Freedom Riders challenged segregation in interstate travel. Sit-ins at lunch counters demonstrated peaceful protest. The movement faced violent opposition, including bombings and assassinations. Achievements included legal equality, though economic and social disparities persisted.', summary: 'The Civil Rights Movement achieved legal equality through protests, legislation, and leadership from figures like MLK Jr.', keyPoints: 'Brown v. Board ended school segregation|Rosa Parks sparked Montgomery boycott|MLK Jr. led nonviolent resistance|"I Have a Dream" speech 1963|Civil Rights Act 1964 banned discrimination|Voting Rights Act 1965 protected voting|Malcolm X and Black Panthers|Freedom Riders and sit-ins|Violent opposition and assassinations|Legal equality achieved, disparities remained' },
    { courseId: createdCourses[2].id, title: 'Ancient Rome', type: 'pdf', transcription: 'Ancient Rome evolved from a small city-state to a vast empire spanning three continents. The Roman Republic (509-27 BCE) featured a complex government with consuls, the Senate, and assemblies. Julius Caesar\'s military conquests and political maneuvering led to civil war. Augustus became the first emperor, establishing the Pax Romana (27 BCE - 180 CE), a period of relative peace and prosperity. Roman engineering achievements included aqueducts, roads, and the Colosseum. Roman law formed the basis for many modern legal systems. Latin influenced European languages. Christianity spread throughout the empire despite initial persecution. The empire split into Eastern and Western halves in 285 CE. The Western Empire fell in 476 CE due to economic troubles, military defeats, and barbarian invasions. The Eastern (Byzantine) Empire continued until 1453 CE.', summary: 'Ancient Rome grew from city-state to empire, leaving lasting legacies in law, engineering, and language.', keyPoints: 'Roman Republic 509-27 BCE|Julius Caesar and civil war|Augustus first emperor|Pax Romana peace period|Engineering: aqueducts, roads, Colosseum|Roman law influenced modern systems|Latin shaped European languages|Christianity spread despite persecution|Empire split East/West 285 CE|Western fall 476 CE|Byzantine Empire until 1453 CE' },
  ];
  
  const createdMaterials = [];
  for (const material of materialData) {
    const [newMaterial] = await db.insert(materials).values({
      userId: demoUser.id,
      courseId: material.courseId,
      title: material.title,
      type: material.type as 'audio' | 'video' | 'pdf',
      fileUrl: `https://demo-storage.lectureme.app/${material.title.toLowerCase().replace(/\s+/g, '-')}.${material.type}`,
      fileKey: `demo/${material.title.toLowerCase().replace(/\s+/g, '-')}.${material.type}`,
      transcription: material.transcription,
      summary: material.summary,
      keyPoints: material.keyPoints,
      status: 'completed',
      processingError: null,
    }).returning();
    createdMaterials.push(newMaterial);
    console.log('[Demo] Created material:', newMaterial.title);
  }
  
  // 4. Generate flashcards from materials
  let totalFlashcards = 0;
  for (const material of createdMaterials) {
    const keyPointsArray = material.keyPoints?.split('|') || [];
    const numCards = Math.min(keyPointsArray.length, 5); // 3-5 cards per material
    
    for (let i = 0; i < numCards; i++) {
      const keyPoint = keyPointsArray[i];
      const [question, answer] = keyPoint.includes(':') 
        ? keyPoint.split(':').map((s: string) => s.trim())
        : [`What is ${keyPoint}?`, keyPoint];
      
      await db.insert(flashcards).values({
        userId: demoUser.id,
        studyMaterialId: material.id,
        courseId: material.courseId,
        front: question,
        back: answer,
        easeFactor: 2.5,
        interval: Math.floor(Math.random() * 7) + 1, // 1-7 days
        repetitions: Math.floor(Math.random() * 3), // 0-2 repetitions
        nextReviewAt: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000), // Random within next week
        lastReviewedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random within past week
        correctCount: Math.floor(Math.random() * 5),
        incorrectCount: Math.floor(Math.random() * 2),
      });
      totalFlashcards++;
    }
  }
  console.log(`[Demo] Created ${totalFlashcards} flashcards`);
  
  // 5. Add Q&A history
  const qaData = [
    { materialId: createdMaterials[0].id, question: 'What is the function of mitochondria?', answer: 'Mitochondria are the powerhouses of the cell, generating ATP (adenosine triphosphate) through cellular respiration. They convert nutrients into energy that cells can use for various functions.' },
    { materialId: createdMaterials[1].id, question: 'Can you explain the Calvin cycle in simple terms?', answer: 'The Calvin cycle is the second stage of photosynthesis where the plant uses the energy (ATP and NADPH) from the light-dependent reactions to convert carbon dioxide from the air into glucose (sugar). Think of it as the "building" phase where the plant makes food.' },
    { materialId: createdMaterials[5].id, question: 'What\'s the difference between a stack and a queue?', answer: 'A stack follows Last-In-First-Out (LIFO) - like a stack of plates where you take from the top. A queue follows First-In-First-Out (FIFO) - like a line at a store where the first person in line is served first. Stacks are used for undo operations, while queues are used for task scheduling.' },
    { materialId: createdMaterials[6].id, question: 'Why is O(log n) better than O(n)?', answer: 'O(log n) is more efficient because it grows much slower than O(n) as input size increases. For example, with 1 million items, O(n) requires 1 million operations, but O(log n) only needs about 20 operations. This is why binary search (O(log n)) is so much faster than linear search (O(n)).' },
    { materialId: createdMaterials[10].id, question: 'What were the main causes of World War II?', answer: 'The main causes were: 1) The harsh Treaty of Versailles that punished Germany after WWI, 2) The Great Depression causing economic instability, 3) Rise of totalitarian regimes (Hitler, Mussolini, Tojo), 4) Failure of appeasement policies, and 5) Territorial aggression by Germany, Italy, and Japan. These factors combined to create conditions for global conflict.' },
    { materialId: createdMaterials[11].id, question: 'How did the Cuban Missile Crisis almost start a nuclear war?', answer: 'In 1962, the Soviet Union secretly placed nuclear missiles in Cuba, just 90 miles from the US. When discovered, President Kennedy demanded their removal and blockaded Cuba. For 13 days, the world was on the brink of nuclear war. The crisis ended when the Soviets agreed to remove the missiles in exchange for the US removing missiles from Turkey and promising not to invade Cuba.' },
  ];
  
  for (const qa of qaData) {
    await db.insert(materialQuestions).values({
      userId: demoUser.id,
      materialId: qa.materialId,
      question: qa.question,
      answer: qa.answer,
    });
  }
  console.log(`[Demo] Created ${qaData.length} Q&A entries`);
  
  console.log('[Demo] Demo data seeding complete!');
  console.log('[Demo] Demo account: demo@kstate.edu / kstate2026');
  console.log(`[Demo] Created ${createdCourses.length} courses, ${createdMaterials.length} materials, ${totalFlashcards} flashcards`);
  
  return {
    user: demoUser,
    courses: createdCourses,
    materials: createdMaterials,
    flashcardCount: totalFlashcards,
    qaCount: qaData.length,
  };
}

// Run if executed directly
if (require.main === module) {
  seedDemoData()
    .then(() => {
      console.log('[Demo] Success!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('[Demo] Error:', error);
      process.exit(1);
    });
}
