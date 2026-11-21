require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const { DatabaseSync: Database } = require("node:sqlite");
const { syllabus } = require("./syllabus");

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || true }));
app.use(express.json({ limit: "1mb" }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "files (3)")));

const db = new Database(process.env.DB_FILE || "./parakh.sqlite");
db.pragma = (str) => db.exec(`PRAGMA ${str}`);
db.transaction = (fn) => (...args) => {
  db.exec("BEGIN");
  try {
    const result = fn(...args);
    db.exec("COMMIT");
    return result;
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
};
db.pragma("journal_mode = WAL");
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('student','teacher')),
  class_level INTEGER,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS concepts (
  id TEXT PRIMARY KEY, name TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS class_concepts (
  class_level INTEGER NOT NULL,
  concept_id TEXT NOT NULL REFERENCES concepts(id),
  position INTEGER NOT NULL,
  PRIMARY KEY(class_level, concept_id)
);
CREATE TABLE IF NOT EXISTS prerequisites (
  concept_id TEXT NOT NULL REFERENCES concepts(id),
  prerequisite_id TEXT NOT NULL REFERENCES concepts(id),
  PRIMARY KEY(concept_id, prerequisite_id)
);
CREATE TABLE IF NOT EXISTS mastery (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  concept_id TEXT NOT NULL REFERENCES concepts(id),
  score REAL NOT NULL DEFAULT 0.5,
  interval_days INTEGER NOT NULL DEFAULT 1,
  last_review TEXT,
  next_review TEXT,
  tested INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY(user_id, concept_id)
);
CREATE TABLE IF NOT EXISTS attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  concept_id TEXT NOT NULL REFERENCES concepts(id),
  question TEXT NOT NULL,
  selected_answer TEXT,
  correct INTEGER NOT NULL,
  reasoning_correct INTEGER NOT NULL,
  answer_misconception TEXT,
  reasoning_misconception TEXT,
  difficulty INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS misconception_counts (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY(user_id, code)
);
CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  concept_id TEXT NOT NULL,
  class_level INTEGER NOT NULL,
  difficulty INTEGER NOT NULL,
  stem TEXT NOT NULL,
  options_json TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS custom_questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  teacher_id INTEGER NOT NULL REFERENCES users(id),
  class_level INTEGER NOT NULL,
  concept_id TEXT NOT NULL,
  difficulty INTEGER NOT NULL DEFAULT 1,
  stem TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  distractors_json TEXT NOT NULL,
  sound_reasoning TEXT NOT NULL,
  flawed_reasoning TEXT NOT NULL,
  flawed_reasoning2 TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS calendar_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  teacher_id INTEGER NOT NULL REFERENCES users(id),
  class_level INTEGER NOT NULL DEFAULT 0,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  subject TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS assignments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  teacher_id INTEGER NOT NULL REFERENCES users(id),
  class_level INTEGER NOT NULL,
  concept_id TEXT NOT NULL,
  difficulty INTEGER NOT NULL DEFAULT 2,
  due_date TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`);

const concepts = {
  add:"Addition", sub:"Subtraction", mul:"Multiplication", div:"Division",
  shapes:"Shapes & Space", patterns:"Patterns",
  measure:"Measurement", time:"Time",
  money:"Money", dataBasic:"Data Handling",
  frac:"Fractions", dec:"Decimals",
  factor:"Factors & Multiples", geo2d:"2D Geometry",
  symm:"Symmetry", perim:"Perimeter", area:"Area",
  wholenums:"Whole Numbers", playnums:"Playing with Numbers",
  int:"Integers", ratio:"Ratio & Proportion",
  pct:"Percentages", profit:"Profit & Loss",
  si:"Simple Interest", ci:"Compound Interest",
  algIntro:"Intro to Algebra", algExpr:"Algebraic Expressions",
  linEq1:"Linear Equations",
  exponents:"Exponents & Powers",
  lines:"Lines & Angles", triangles:"Triangles",
  quadShape:"Quadrilaterals", circles:"Circles",
  mensur:"Mensuration", surfVol:"Surface Area & Volume",
  dataAdv:"Data Handling",
  sqRoot:"Squares & Roots", cubeRoot:"Cubes & Roots",
  directInv:"Direct & Inverse Prop.",
  factorAlg:"Factorisation",
  visuals:"Solid Shapes",
  realNums:"Real Numbers",
  poly:"Polynomials", linEq2:"Pair of Linear Eq.",
  quadEq:"Quadratic Equations", ap:"Arithmetic Progressions",
  coordGeo:"Coordinate Geometry",
  euclid:"Euclid's Geometry",
  triAdv:"Triangles",
  circleAdv:"Circles",
  constructions:"Constructions",
  heron:"Heron's Formula", areaCircle:"Areas Related to Circles",
  surfVolAdv:"Surface Areas & Volumes",
  trig:"Introduction to Trig.", trigApp:"Some Apps of Trig.",
  stats:"Statistics", prob:"Probability",
  pyth:"Pythagoras Theorem"
};
const classConcepts = {
  1:["add","sub","shapes","patterns","time","money"],
  2:["add","sub","mul","shapes","measure","time","money","patterns","dataBasic"],
  3:["add","sub","mul","div","frac","measure","time","money","patterns","dataBasic"],
  4:["add","sub","mul","div","frac","geo2d","perim","area","time","money","patterns","dataBasic"],
  5:["mul","div","frac","dec","factor","geo2d","symm","perim","area","dataBasic"],
  6:["wholenums","playnums","int","frac","dec","ratio","algIntro","geo2d","lines","symm","mensur","dataAdv"],
  7:["int","frac","dec","pct","ratio","algExpr","linEq1","lines","triangles","mensur","dataAdv","symm","visuals"],
  8:["int","frac","pct","profit","si","ci","algExpr","factorAlg","linEq1","exponents","sqRoot","cubeRoot","quadShape","mensur","surfVol","directInv","dataAdv","visuals"],
  9:["realNums","poly","linEq2","coordGeo","euclid","lines","triangles","quadShape","circles","constructions","heron","surfVolAdv","stats","prob","pyth"],
 10:["realNums","poly","linEq2","quadEq","ap","coordGeo","triAdv","circleAdv","constructions","trig","trigApp","areaCircle","surfVolAdv","stats","prob"]
};
const prereqs = {
  sub:["add"],mul:["add"],div:["mul"],
  patterns:["add"],measure:["add","sub"],time:["add"],money:["add","sub"],
  dataBasic:["add"],
  frac:["div"],dec:["frac"],factor:["mul","div"],
  geo2d:["shapes"],symm:["shapes"],perim:["add","mul"],area:["mul"],
  wholenums:["add","sub","mul","div"],playnums:["factor"],
  int:["sub"],ratio:["div","frac"],
  pct:["frac","dec"],profit:["pct"],si:["pct","mul"],ci:["si"],
  algIntro:["add","sub","mul"],algExpr:["algIntro"],
  linEq1:["algIntro","int"],
  exponents:["mul"],
  lines:["geo2d"],triangles:["lines"],quadShape:["lines","triangles"],
  circles:["geo2d"],
  mensur:["area","perim"],surfVol:["mensur"],
  dataAdv:["dataBasic","pct"],
  sqRoot:["mul","exponents"],cubeRoot:["mul","exponents"],
  directInv:["ratio"],factorAlg:["algExpr"],
  visuals:["geo2d"],
  realNums:["sqRoot","int"],
  poly:["algExpr","factorAlg"],linEq2:["linEq1"],
  quadEq:["poly","linEq1"],ap:["linEq1"],
  coordGeo:["linEq2"],
  euclid:["lines","triangles"],
  triAdv:["triangles","pyth"],
  circleAdv:["circles"],
  constructions:["lines","triangles"],
  heron:["triangles","area"],areaCircle:["circles","area"],
  surfVolAdv:["surfVol"],
  trig:["triangles","pyth"],trigApp:["trig"],
  stats:["dataAdv","pct"],prob:["frac","pct"],
  pyth:["triangles","sqRoot"]
};
const insertConcept = db.prepare("INSERT OR IGNORE INTO concepts(id,name) VALUES (?,?)");
for (const [id,name] of Object.entries(concepts)) insertConcept.run(id,name);
const insertClassConcept = db.prepare("INSERT OR IGNORE INTO class_concepts(class_level,concept_id,position) VALUES (?,?,?)");
for (const [k,ids] of Object.entries(classConcepts)) ids.forEach((id,i)=>insertClassConcept.run(+k,id,i));
const insertPrereq = db.prepare("INSERT OR IGNORE INTO prerequisites(concept_id,prerequisite_id) VALUES (?,?)");
for (const [id,ps] of Object.entries(prereqs)) ps.forEach(p=>insertPrereq.run(id,p));

const M = {
  slip:"Slips on carrying, borrowing or counting",
  op:"Uses the wrong operation",
  fadd:"Adds tops and bottoms of fractions separately",
  sign:"Gets signs wrong with negatives",
  pct:"Treats percent as a plain number",
  move:"Moves a term across the = sign without flipping its sign",
  dist:"Applies a rule to only one term",
  sqs:"Forgets the square or the square root"
};
const explain = {
  slip:"Slow down on each column or group and re-check.",
  op:"Say in words what the question asks, then pick the operation.",
  fadd:"Make the denominators equal first; only the numerators add.",
  sign:"Use a number line. Minus times minus gives plus.",
  pct:"Percent means per hundred: divide by 100 first.",
  move:"Do the same operation on both sides.",
  dist:"Multiply or divide every term inside the brackets.",
  sqs:"Check the square relationship, then take the square root."
};

function tokenFor(user) {
  return jwt.sign({ id:user.id, role:user.role }, process.env.JWT_SECRET || "change-this-secret", { expiresIn:"7d" });
}
function auth(req,res,next) {
  const raw = req.headers.authorization || "";
  const token = raw.startsWith("Bearer ") ? raw.slice(7) : "";
  try { req.auth = jwt.verify(token, process.env.JWT_SECRET || "change-this-secret"); next(); }
  catch { return res.status(401).json({ error:"Please log in again." }); }
}
function role(name) {
  return (req,res,next)=> req.auth.role===name ? next() : res.status(403).json({error:"This action is not allowed for your account."});
}
function validClass(k) { return Number.isInteger(+k) && +k>=1 && +k<=10; }
function initMastery(userId, classLevel) {
  const add = db.prepare("INSERT OR IGNORE INTO mastery(user_id,concept_id) VALUES (?,?)");
  for (const id of classConcepts[classLevel] || []) add.run(userId,id);
}
function userPublic(u) {
  return { id:u.id, name:u.name, email:u.email, role:u.role, classLevel:u.class_level };
}
function masteryRows(userId) {
  return db.prepare(`SELECT c.id,c.name,m.score,m.interval_days,m.last_review,m.next_review,m.tested
    FROM mastery m JOIN concepts c ON c.id=m.concept_id WHERE m.user_id=? ORDER BY c.name`).all(userId);
}
function average(rows) { return rows.length ? rows.reduce((s,x)=>s+x.score,0)/rows.length : 0; }
function datePlus(days) { const d=new Date(); d.setDate(d.getDate()+days); return d.toISOString(); }

app.get("/api/health", (_req,res)=>res.json({ok:true,service:"EduSpark API"}));

app.post("/api/auth/register", (req,res)=>{
  const {name,email,password,role:accountRole,classLevel}=req.body || {};
  if (!name || !email || !password || password.length<8 || !["student","teacher"].includes(accountRole))
    return res.status(400).json({error:"Enter name, email, password (at least 8 characters), and student/teacher role."});
  if (accountRole==="student" && !validClass(+classLevel))
    return res.status(400).json({error:"Students must select a class from 1 to 10."});
  try {
    const hash=bcrypt.hashSync(password,12);
    const result=db.prepare("INSERT INTO users(name,email,password_hash,role,class_level) VALUES (?,?,?,?,?)")
      .run(name.trim(),email.trim().toLowerCase(),hash,accountRole,accountRole==="student"?+classLevel:null);
    const user=db.prepare("SELECT * FROM users WHERE id=?").get(result.lastInsertRowid);
    if(user.role==="student") initMastery(user.id,user.class_level);
    res.status(201).json({token:tokenFor(user),user:userPublic(user)});
  } catch(e) { res.status(409).json({error:"That email may already be registered."}); }
});

app.post("/api/auth/login",(req,res)=>{
  const {email,password}=req.body||{};
  const user=db.prepare("SELECT * FROM users WHERE email=?").get(String(email||"").trim().toLowerCase());
  if(!user || !bcrypt.compareSync(password||"",user.password_hash)) return res.status(401).json({error:"Invalid email or password."});
  if(user.role==="student") initMastery(user.id,user.class_level);
  res.json({token:tokenFor(user),user:userPublic(user)});
});
app.get("/api/me",auth,(req,res)=>{
  const u=db.prepare("SELECT * FROM users WHERE id=?").get(req.auth.id);
  if(!u) return res.status(404).json({error:"Account not found."});
  res.json({user:userPublic(u)});
});

// Full class/subject/chapter/topic tree for flowchart UIs.
app.get("/api/syllabus/:classLevel/flowchart",auth,(req,res)=>{
  const k=+req.params.classLevel;
  if(!validClass(k)) return res.status(400).json({error:"Class must be 1 to 10."});
  const data=syllabus[k];
  if(!data) return res.status(404).json({error:"Syllabus not found for this class."});
  const subject=String(req.query.subject||"").trim().toLowerCase();
  if(subject) {
    const found=data.subjects.find(s=>s.id===subject || s.name.toLowerCase()===subject);
    if(!found) return res.status(404).json({error:"Subject not found for this class.",availableSubjects:data.subjects.map(s=>s.name)});
    return res.json({classLevel:k,board:data.board,subjects:[found]});
  }
  res.json(data);
});

app.get("/api/syllabus/:classLevel",auth,(req,res)=>{
  const k=+req.params.classLevel;
  if(!validClass(k)) return res.status(400).json({error:"Class must be 1 to 10."});
  const rows=db.prepare(`SELECT c.id,c.name,cc.position FROM class_concepts cc JOIN concepts c ON c.id=cc.concept_id
    WHERE cc.class_level=? ORDER BY cc.position`).all(k);
  const ps=db.prepare("SELECT concept_id,prerequisite_id FROM prerequisites").all();
  res.json({classLevel:k,concepts:rows.map(c=>({...c,prerequisites:ps.filter(p=>p.concept_id===c.id && rows.some(x=>x.id===p.prerequisite_id)).map(p=>p.prerequisite_id)}))});
});

function makeQuestion(concept,difficulty) {
  const rand=(a,b)=>Math.floor(Math.random()*(b-a+1));
  let stem,answer,wrong=[],reasoning;
  switch(concept) {
    case "add": {const a=rand(10,90)*difficulty,b=rand(10,90)*difficulty;stem=`${a} + ${b} = ?`;answer=String(a+b);wrong=[String(a+b+10),String(a-b)];reasoning=["slip","op"];break;}
    case "sub": {const b=rand(10,80)*difficulty,a=b+rand(10,90)*difficulty;stem=`${a} − ${b} = ?`;answer=String(a-b);wrong=[String(a-b-10),String(a+b)];reasoning=["slip","op"];break;}
    case "mul": {const a=rand(2,5+difficulty*3),b=rand(2,9);stem=`${a} × ${b} = ?`;answer=String(a*b);wrong=[String(a+b),String(a*(b+1))];reasoning=["op","slip"];break;}
    case "div": {const b=rand(2,9),q=rand(2,5+difficulty*3),a=b*q;stem=`${a} ÷ ${b} = ?`;answer=String(q);wrong=[String(a*b),String(q+1)];reasoning=["op","slip"];break;}
    case "frac": {const set=[["1/2 + 1/3 = ?","5/6","2/5","1/6","fadd"],["1/5 + 2/5 = ?","3/5","3/10","2/25","fadd"],["3/4 + 2/3 = ?","17/12","5/7","1/2","fadd"]][difficulty-1];[stem,answer,...wrong]=set;reasoning=["fadd","op"];break;}
    case "pct": {const n=[40,80,200][rand(0,2)],p=[10,25,50][rand(0,2)];stem=`What is ${p}% of ${n}?`;answer=String(n*p/100);wrong=[String(n*p),String(n/p)];reasoning=["pct","op"];break;}
    case "int": {const a=rand(2,9),b=rand(2,9);stem=`(−${a}) × (−${b}) = ?`;answer=String(a*b);wrong=[String(-a*b),String(a+b)];reasoning=["sign","op"];break;}
    case "lin": {const x=rand(1,9),a=rand(2,5),b=rand(1,8),c=a*x+b;stem=`Solve: ${a}x + ${b} = ${c}`;answer=`x = ${x}`;wrong=[`x = ${c+b}`,`x = ${c-b}`];reasoning=["move","op"];break;}
    case "quad": {const p=rand(1,4),q=rand(p+1,6);stem=`The roots of x² − ${p+q}x + ${p*q} = 0 are…`;answer=`${p} and ${q}`;wrong=[`${-p} and ${-q}`,`${p+q} and ${p*q}`];reasoning=["sign","op"];break;}
    case "pyth": {const triples=[[3,4,5],[5,12,13],[8,15,17]],t=triples[rand(0,2)];stem=`The legs of a right triangle are ${t[0]} and ${t[1]}. Hypotenuse?`;answer=String(t[2]);wrong=[String(t[0]+t[1]),String(t[2]*t[2])];reasoning=["op","sqs"];break;}
    default: throw new Error("Unknown concept");
  }
  const options=[answer,...wrong].sort(()=>Math.random()-.5);
  return {stem,answer,options,reasoning};
}
app.get("/api/questions/next",auth,role("student"),(req,res)=>{
  const u=db.prepare("SELECT * FROM users WHERE id=?").get(req.auth.id);
  const rows=masteryRows(u.id);
  if(!rows.length) return res.status(400).json({error:"No concepts found for this class."});
  const weakest=rows.filter(x=>x.tested).sort((a,b)=>a.score-b.score)[0] || rows[0];
  const concept=req.query.concept || weakest.id;
  if(!classConcepts[u.class_level].includes(concept)) return res.status(400).json({error:"Concept is not in this class syllabus."});
  const m=rows.find(x=>x.id===concept);
  const difficulty=Math.max(1,Math.min(3, m.score<.4?1:m.score<.7?2:3));
  const q=makeQuestion(concept,difficulty),id=require("crypto").randomUUID();
  db.prepare("INSERT INTO questions(id,user_id,concept_id,class_level,difficulty,stem,options_json,answer) VALUES (?,?,?,?,?,?,?,?)")
    .run(id,u.id,concept,u.class_level,difficulty,q.stem,JSON.stringify(q.options),q.answer);
  res.json({questionId:id,conceptId:concept,conceptName:concepts[concept],difficulty,stem:q.stem,options:q.options});
});

app.post("/api/attempts",auth,role("student"),(req,res)=>{
  const {questionId,conceptId,question,selectedAnswer,correct:isCorrect,reasoningCorrect,answerMisconception,reasoningMisconception,difficulty=1}=req.body||{};
  let concept=conceptId;
  let qStem=question||"";
  let qDiff=Math.max(1,Math.min(3,+difficulty||1));
  let correct=isCorrect===undefined?false:!!isCorrect;
  let good=!!reasoningCorrect;

  if (questionId) {
    const q=db.prepare("SELECT * FROM questions WHERE id=? AND user_id=?").get(questionId,req.auth.id);
    if(q){
      concept=q.concept_id;
      qStem=q.stem;
      qDiff=q.difficulty;
      correct=String(selectedAnswer)===q.answer;
      db.prepare("DELETE FROM questions WHERE id=?").run(questionId);
    }
  }

  if(!concept || !concepts[concept]) {
    return res.status(400).json({error:"Valid conceptId is required."});
  }

  db.prepare("INSERT OR IGNORE INTO mastery(user_id,concept_id,score,interval_days,tested) VALUES (?,?,0.5,1,0)").run(req.auth.id,concept);
  const m=db.prepare("SELECT * FROM mastery WHERE user_id=? AND concept_id=?").get(req.auth.id,concept);
  let score=m?m.score:0.5;
  let interval=m?m.interval_days:1;

  if(correct && good){score += .3*(1-score);interval=Math.max(1,Math.round(interval*2.2));}
  else if(correct){score += .05*(1-score);interval=Math.max(1,Math.round(interval*1.2));}
  else {score*=.7;interval=1;}
  score=Math.min(.98,Math.max(.02,score));

  const today=new Date().toISOString(),next=datePlus(interval);
  const tx=db.transaction(()=>{
    db.prepare(`INSERT INTO attempts(user_id,concept_id,question,selected_answer,correct,reasoning_correct,answer_misconception,reasoning_misconception,difficulty)
      VALUES (?,?,?,?,?,?,?,?,?)`).run(req.auth.id,concept,qStem,String(selectedAnswer||""),+correct,+good,answerMisconception||null,reasoningMisconception||null,qDiff);
    db.prepare(`UPDATE mastery SET score=?,interval_days=?,last_review=?,next_review=?,tested=1 WHERE user_id=? AND concept_id=?`)
      .run(score,interval,today,next,req.auth.id,concept);
    for(const code of [answerMisconception,reasoningMisconception].filter(Boolean))
      db.prepare(`INSERT INTO misconception_counts(user_id,code,count) VALUES (?,?,1)
        ON CONFLICT(user_id,code) DO UPDATE SET count=count+1`).run(req.auth.id,code);
  });
  tx();
  res.json({ok:true,correct,reasoningCorrect:good,mastery:{conceptId:concept,previous:m?m.score:0.5,current:score,intervalDays:interval,nextReview:next},misconceptions:[answerMisconception,reasoningMisconception].filter(Boolean).map(code=>({code,label:M[code]||code,advice:explain[code]||""}))});
});

app.get("/api/student/dashboard",auth,role("student"),(req,res)=>{
  const u=db.prepare("SELECT * FROM users WHERE id=?").get(req.auth.id);
  const mastery=masteryRows(u.id);
  const misconceptions=db.prepare("SELECT code,count,label FROM (SELECT mc.code,mc.count,mc.code AS label FROM misconception_counts mc WHERE user_id=? ORDER BY count DESC LIMIT 5)").all(u.id);
  const attempts=db.prepare("SELECT COUNT(*) AS total FROM attempts WHERE user_id=?").get(u.id).total;
  const recentAttempts=db.prepare("SELECT id,concept_id,question,selected_answer,correct,reasoning_correct,answer_misconception,reasoning_misconception,difficulty,created_at FROM attempts WHERE user_id=? ORDER BY id DESC LIMIT 20").all(u.id);
  const events=db.prepare("SELECT * FROM calendar_events WHERE class_level IN (?,0) ORDER BY date,time LIMIT 50").all(u.class_level);
  res.json({user:userPublic(u),mastery,overallMastery:average(mastery),attemptCount:attempts,recentAttempts,misconceptions:misconceptions.map(x=>({...x,label:M[x.code]||x.code,advice:explain[x.code]||""})),calendar:events});
});

app.get("/api/teacher/classes/:classLevel/overview",auth,role("teacher"),(req,res)=>{
  const k=+req.params.classLevel;
  if(!validClass(k)) return res.status(400).json({error:"Class must be 1 to 10."});
  const students=db.prepare("SELECT id,name,email FROM users WHERE role='student' AND class_level=? ORDER BY name").all(k);
  const data=students.map(s=>{
    const m=masteryRows(s.id),weak=m.filter(x=>x.score<.4).map(x=>x.name);
    const attCount=db.prepare("SELECT COUNT(*) AS total FROM attempts WHERE user_id=?").get(s.id)?.total||0;
    const recentAtt=db.prepare("SELECT id,concept_id,question,selected_answer,correct,reasoning_correct,answer_misconception,reasoning_misconception,difficulty,created_at FROM attempts WHERE user_id=? ORDER BY id DESC LIMIT 10").all(s.id);
    const studentMis=db.prepare("SELECT code,count FROM misconception_counts WHERE user_id=? ORDER BY count DESC LIMIT 5").all(s.id);
    return {id:s.id,name:s.name,overallMastery:average(m),atRisk:average(m)<.4,weakConcepts:weak,mastery:m,attemptCount:attCount,recentAttempts:recentAtt,misconceptions:studentMis};
  });
  const conceptStats=(classConcepts[k]||[]).map(id=>{
    const values=data.map(s=>s.mastery.find(m=>m.id===id)?.score ?? .5);
    return {conceptId:id,name:concepts[id],average:values.length?values.reduce((a,b)=>a+b,0)/values.length:0,below40:values.filter(v=>v<.4).length,at70Plus:values.filter(v=>v>=.7).length};
  });
  const avg=data.length?data.reduce((a,s)=>a+s.overallMastery,0)/data.length:0;
  res.json({classLevel:k,studentCount:data.length,classAverage:avg,atRisk:data.filter(s=>s.atRisk).length,students:data,conceptStats});
});

app.get("/api/teacher/students/:id/details",auth,role("teacher"),(req,res)=>{
  const sid=+req.params.id;
  const s=db.prepare("SELECT id,name,email,role,class_level FROM users WHERE id=?").get(sid);
  if(!s) return res.status(404).json({error:"Student not found."});
  const m=masteryRows(sid);
  const att=db.prepare("SELECT * FROM attempts WHERE user_id=? ORDER BY id DESC LIMIT 30").all(sid);
  const mis=db.prepare("SELECT code,count FROM misconception_counts WHERE user_id=? ORDER BY count DESC").all(sid);
  res.json({student:s,overallMastery:average(m),mastery:m,attempts:att,misconceptions:mis.map(x=>({...x,label:M[x.code]||x.code,advice:explain[x.code]||""}))});
});

app.get("/api/calendar",auth,(req,res)=>{
  const u=db.prepare("SELECT * FROM users WHERE id=?").get(req.auth.id);
  const k=u.role==="student"?u.class_level:+(req.query.classLevel||u.class_level||0);
  res.json(db.prepare("SELECT * FROM calendar_events WHERE class_level IN (?,0) ORDER BY date,time").all(k));
});
app.post("/api/calendar",auth,role("teacher"),(req,res)=>{
  const {classLevel=0,date,time="09:00",subject,type="Class",title}=req.body||{};
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date||"") || !title || !subject || !validClass(+classLevel) && +classLevel!==0)
    return res.status(400).json({error:"Provide a valid date, class (0 for all), subject and title."});
  const r=db.prepare("INSERT INTO calendar_events(teacher_id,class_level,date,time,subject,type,title) VALUES (?,?,?,?,?,?,?)")
    .run(req.auth.id,+classLevel,date,time,subject,type,title);
  res.status(201).json(db.prepare("SELECT * FROM calendar_events WHERE id=?").get(r.lastInsertRowid));
});
app.delete("/api/calendar/:id",auth,role("teacher"),(req,res)=>{
  const r=db.prepare("DELETE FROM calendar_events WHERE id=? AND teacher_id=?").run(+req.params.id,req.auth.id);
  if(!r.changes) return res.status(404).json({error:"Event not found or not yours."});
  res.json({deleted:true});
});
app.post("/api/assignments",auth,role("teacher"),(req,res)=>{
  const {classLevel,conceptId,difficulty=2,dueDate}=req.body||{};
  if(!validClass(+classLevel) || !concepts[conceptId]) return res.status(400).json({error:"Invalid class or concept."});
  const r=db.prepare("INSERT INTO assignments(teacher_id,class_level,concept_id,difficulty,due_date) VALUES (?,?,?,?,?)")
    .run(req.auth.id,+classLevel,conceptId,Math.max(1,Math.min(3,+difficulty)),dueDate||null);
  res.status(201).json({id:r.lastInsertRowid,classLevel:+classLevel,conceptId,difficulty:+difficulty,dueDate:dueDate||null});
});
app.get("/api/assignments",auth,(req,res)=>{
  const u=db.prepare("SELECT * FROM users WHERE id=?").get(req.auth.id);
  const k=u.role==="student"?u.class_level:+(req.query.classLevel||0);
  res.json(db.prepare("SELECT a.*,c.name AS conceptName FROM assignments a JOIN concepts c ON c.id=a.concept_id WHERE class_level=? ORDER BY created_at DESC").all(k));
});

// Teacher Question Management (Only for Teacher)
app.get("/api/teacher/questions", auth, role("teacher"), (req, res) => {
  const k = req.query.classLevel ? +req.query.classLevel : 0;
  const c = req.query.conceptId || "";
  let sql = "SELECT * FROM custom_questions WHERE 1=1";
  const params = [];
  if (k) { sql += " AND class_level=?"; params.push(k); }
  if (c) { sql += " AND concept_id=?"; params.push(c); }
  sql += " ORDER BY id DESC";
  const rows = db.prepare(sql).all(...params);
  res.json(rows.map(r => ({
    id: r.id,
    teacherId: r.teacher_id,
    classLevel: r.class_level,
    conceptId: r.concept_id,
    difficulty: r.difficulty,
    stem: r.stem,
    correctAnswer: r.correct_answer,
    distractors: JSON.parse(r.distractors_json || "[]"),
    soundReasoning: r.sound_reasoning,
    flawedReasoning: r.flawed_reasoning,
    flawedReasoning2: r.flawed_reasoning2 || "",
    createdAt: r.created_at
  })));
});

app.post("/api/teacher/questions", auth, role("teacher"), (req, res) => {
  const { classLevel, conceptId, difficulty=1, stem, correctAnswer, distractors, soundReasoning, flawedReasoning, flawedReasoning2 } = req.body || {};
  if (!validClass(+classLevel) || !conceptId || !concepts[conceptId]) {
    return res.status(400).json({ error: "Invalid class level or concept ID." });
  }
  if (!stem || !stem.trim()) return res.status(400).json({ error: "Question stem is required." });
  if (!correctAnswer || !correctAnswer.trim()) return res.status(400).json({ error: "Correct answer is required." });
  const distList = Array.isArray(distractors) ? distractors.map(d=>String(d).trim()).filter(Boolean) : [];
  if (distList.length < 1) return res.status(400).json({ error: "At least one wrong answer option (distractor) is required." });
  if (!soundReasoning || !soundReasoning.trim()) return res.status(400).json({ error: "Sound reasoning explanation is required." });
  if (!flawedReasoning || !flawedReasoning.trim()) return res.status(400).json({ error: "Flawed reasoning explanation is required." });

  const r = db.prepare(`
    INSERT INTO custom_questions(teacher_id, class_level, concept_id, difficulty, stem, correct_answer, distractors_json, sound_reasoning, flawed_reasoning, flawed_reasoning2)
    VALUES (?,?,?,?,?,?,?,?,?,?)
  `).run(
    req.auth.id,
    +classLevel,
    conceptId,
    Math.max(1, Math.min(3, +difficulty)),
    stem.trim(),
    correctAnswer.trim(),
    JSON.stringify(distList),
    soundReasoning.trim(),
    flawedReasoning.trim(),
    (flawedReasoning2 || "").trim() || null
  );

  res.status(201).json({
    id: r.lastInsertRowid,
    classLevel: +classLevel,
    conceptId,
    difficulty: +difficulty,
    stem: stem.trim(),
    correctAnswer: correctAnswer.trim(),
    distractors: distList,
    soundReasoning: soundReasoning.trim(),
    flawedReasoning: flawedReasoning.trim(),
    flawedReasoning2: (flawedReasoning2 || "").trim() || null
  });
});

app.delete("/api/teacher/questions/:id", auth, role("teacher"), (req, res) => {
  const id = +req.params.id;
  const r = db.prepare("DELETE FROM custom_questions WHERE id=?").run(id);
  if (!r.changes) return res.status(404).json({ error: "Question not found." });
  res.json({ deleted: true, id });
});

app.get("/api/questions/custom", (req, res) => {
  const k = req.query.classLevel ? +req.query.classLevel : 0;
  const c = req.query.conceptId || "";
  let sql = "SELECT * FROM custom_questions WHERE 1=1";
  const params = [];
  if (k) { sql += " AND class_level=?"; params.push(k); }
  if (c) { sql += " AND concept_id=?"; params.push(c); }
  sql += " ORDER BY id DESC";
  const rows = db.prepare(sql).all(...params);
  res.json(rows.map(r => ({
    id: r.id,
    classLevel: r.class_level,
    conceptId: r.concept_id,
    difficulty: r.difficulty,
    stem: r.stem,
    correct: r.correct_answer,
    distractors: JSON.parse(r.distractors_json || "[]"),
    soundReasoning: r.sound_reasoning,
    flawedReasoning: r.flawed_reasoning,
    flawedReasoning2: r.flawed_reasoning2 || ""
  })));
});

app.use((err,_req,res,_next)=>{console.error(err);res.status(500).json({error:"Unexpected server error."});});
const port = process.env.PORT || 5500;
app.listen(port, () => {
  console.log(`EduSpark unified app running at http://localhost:${port}`);
});
if (Number(port) !== 4000) {
  try {
    app.listen(4000, () => {
      console.log(`EduSpark also accessible at http://localhost:4000`);
    });
  } catch (e) {
    // Port 4000 might already be in use
  }
}
