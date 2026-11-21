const $=s=>document.querySelector(s),r=(a,b)=>a+Math.floor(Math.random()*(b-a+1)),pk=a=>a[r(0,a.length-1)],sh=a=>a.map(v=>[Math.random(),v]).sort((x,y)=>x[0]-y[0]).map(v=>v[1]),f=x=>+(+x).toFixed(2),esc=x=>String(x).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const API_BASE = "";
let API_TOKEN = localStorage.getItem("eduspark_token") || localStorage.getItem("parakh_token") || "";

// ═══════════════════════════════════════════════════════════════════
//  NCERT Mathematics Concept Pool — Classes 1 to 10
// ═══════════════════════════════════════════════════════════════════
const N={
  // Primary (Class 1-5) fundamentals
  add:'Addition',sub:'Subtraction',mul:'Multiplication',div:'Division',
  shapes:'Shapes & Space',patterns:'Patterns',
  measure:'Measurement',time:'Time',
  money:'Money',dataBasic:'Data Handling',
  frac:'Fractions',dec:'Decimals',
  factor:'Factors & Multiples',geo2d:'2D Geometry',
  symm:'Symmetry',perim:'Perimeter',area:'Area',

  // Upper Primary (Class 6-8)
  wholenums:'Whole Numbers',playnums:'Playing with Numbers',
  int:'Integers',ratio:'Ratio & Proportion',
  pct:'Percentages',profit:'Profit & Loss',
  si:'Simple Interest',ci:'Compound Interest',
  algIntro:'Intro to Algebra',algExpr:'Algebraic Expressions',
  linEq1:'Linear Equations',
  exponents:'Exponents & Powers',
  lines:'Lines & Angles',triangles:'Triangles',
  quadShape:'Quadrilaterals',circles:'Circles',
  mensur:'Mensuration',surfVol:'Surface Area & Volume',
  dataAdv:'Data Handling',
  sqRoot:'Squares & Roots',cubeRoot:'Cubes & Roots',
  directInv:'Direct & Inverse Prop.',
  factorAlg:'Factorisation',
  visuals:'Solid Shapes',

  // Secondary (Class 9-10)
  realNums:'Real Numbers',
  poly:'Polynomials',linEq2:'Pair of Linear Eq.',
  quadEq:'Quadratic Equations',ap:'Arithmetic Progressions',
  coordGeo:'Coordinate Geometry',
  euclid:'Euclid\'s Geometry',
  triAdv:'Triangles',
  circleAdv:'Circles',
  constructions:'Constructions',
  heron:'Heron\'s Formula',areaCircle:'Areas Related to Circles',
  surfVolAdv:'Surface Areas & Volumes',
  trig:'Introduction to Trig.',trigApp:'Some Apps of Trig.',
  stats:'Statistics',prob:'Probability',
  pyth:'Pythagoras Theorem'
};

// ═══════════════════════════════════════════════════════════════════
//  Prerequisites (what you need before you can learn this)
// ═══════════════════════════════════════════════════════════════════
const PR={
  sub:['add'],mul:['add'],div:['mul'],
  patterns:['add'],measure:['add','sub'],time:['add'],money:['add','sub'],
  dataBasic:['add'],
  frac:['div'],dec:['frac'],factor:['mul','div'],
  geo2d:['shapes'],symm:['shapes'],perim:['add','mul'],area:['mul'],

  wholenums:['add','sub','mul','div'],playnums:['wholenums','factor'],
  int:['wholenums','sub'],ratio:['frac','div'],
  pct:['frac','dec'],profit:['pct'],si:['pct','mul'],ci:['si'],
  algIntro:['wholenums','add','sub'],algExpr:['algIntro'],
  linEq1:['algIntro','int'],
  exponents:['mul'],
  lines:['geo2d'],triangles:['lines'],quadShape:['lines','triangles'],
  circles:['geo2d'],
  mensur:['geo2d','area','perim'],surfVol:['mensur'],
  dataAdv:['wholenums','dataBasic','pct'],
  sqRoot:['mul','exponents'],cubeRoot:['mul','exponents'],
  directInv:['ratio'],factorAlg:['algExpr'],
  visuals:['geo2d'],

  realNums:['sqRoot','int'],
  poly:['realNums','algExpr','factorAlg'],linEq2:['poly','linEq1'],
  quadEq:['poly','linEq2'],ap:['linEq2'],
  coordGeo:['linEq2'],
  euclid:['lines','triangles'],
  triAdv:['coordGeo','triangles','pyth'],
  circleAdv:['triAdv','circles'],
  constructions:['triAdv','circleAdv'],
  heron:['triangles','area'],areaCircle:['circleAdv','circles','area'],
  surfVolAdv:['areaCircle','surfVol'],
  trig:['triAdv','triangles','pyth'],trigApp:['trig'],
  stats:['realNums','dataAdv','pct'],prob:['realNums','frac','pct'],
  pyth:['triangles','sqRoot']
};

// ═══════════════════════════════════════════════════════════════════
//  NCERT Class-wise syllabus mapping
// ═══════════════════════════════════════════════════════════════════
const LIST={
  1: ['add','sub','shapes','patterns','time','money'],
  2: ['add','sub','mul','shapes','measure','time','money','patterns','dataBasic'],
  3: ['add','sub','mul','div','frac','measure','time','money','patterns','dataBasic'],
  4: ['add','sub','mul','div','frac','geo2d','perim','area','time','money','patterns','dataBasic'],
  5: ['mul','div','frac','dec','factor','geo2d','symm','perim','area','dataBasic'],
  6: ['wholenums','playnums','int','frac','dec','ratio','algIntro','geo2d','lines','symm','mensur','dataAdv'],
  7: ['int','frac','dec','pct','ratio','algExpr','linEq1','lines','triangles','mensur','dataAdv','symm','visuals'],
  8: ['int','frac','pct','profit','si','ci','algExpr','factorAlg','linEq1','exponents','sqRoot','cubeRoot','quadShape','mensur','surfVol','directInv','dataAdv','visuals'],
  9: ['realNums','poly','linEq2','coordGeo','euclid','lines','triangles','quadShape','circles','constructions','heron','surfVolAdv','stats','prob','pyth'],
 10: ['realNums','poly','linEq2','quadEq','ap','coordGeo','triAdv','circleAdv','constructions','trig','trigApp','areaCircle','surfVolAdv','stats','prob']
};

const SC=[0,5,9,12,20,30,50,80,99,99,99];
let C=[];const B=id=>C.find(c=>c.id==id);

// ═══════════════════════════════════════════════════════════════════
//  Misconception library
// ═══════════════════════════════════════════════════════════════════
const M={
  slip:['Slips on carrying, borrowing or counting','Slow down on each column or group and re-check.'],
  op:['Uses the wrong operation','Say in words what the question asks, then pick the operation.'],
  fadd:['Adds tops and bottoms of fractions separately','Make the denominators equal first; only the numerators add.'],
  sign:['Gets signs wrong with negatives','Use a number line. Minus times minus gives plus.'],
  pct:['Treats percent as a plain number','Percent means per hundred: divide by 100 first.'],
  move:['Moves a term across the = sign without flipping its sign','Do the same operation on both sides.'],
  dist:['Applies a rule to only one term','Multiply or divide every term inside the brackets.'],
  sqs:['Forgets the square or the square root','Check: a² + b² = c², then take the root.'],
  place:['Mixes up place values','Write the number in expanded form to see each digit\'s value.'],
  unit:['Confuses units of measurement','Always check: are both values in the same unit before computing?'],
  decPt:['Misplaces the decimal point','Line up the decimal points before adding or subtracting.'],
  ratio:['Swaps numerator and denominator in a ratio','Ratio a : b means a/b, not b/a. Read the question carefully.'],
  expRule:['Applies exponent rules incorrectly','aⁿ × aᵐ = aⁿ⁺ᵐ, not aⁿˣᵐ. Review the exponent laws.'],
  formula:['Uses the wrong formula','Write out which formula applies and check each variable.'],
  angle:['Confuses angle relationships','Supplementary angles add to 180°; complementary add to 90°.'],
  trig:['Mixes up sin, cos, tan ratios','SOH-CAH-TOA: Sin = Opp/Hyp, Cos = Adj/Hyp, Tan = Opp/Adj.'],
  probAdd:['Adds probabilities when should multiply','Independent events: multiply. Mutually exclusive: add.'],
  root:['Confuses square and square root','√25 = 5 because 5² = 25. The root undoes the square.'],
  lcmhcf:['Swaps LCM and HCF','LCM is the smallest common multiple; HCF is the largest common factor.'],
  profLoss:['Confuses cost price and selling price','Profit = SP − CP. Loss = CP − SP. Keep them straight.'],
  coord:['Swaps x and y coordinates','Points are (x, y): x is horizontal, y is vertical.']
};

// ═══════════════════════════════════════════════════════════════════
//  Reasoning items per concept: [correct reasoning, [wrong1, miscCode], [wrong2, miscCode]]
// ═══════════════════════════════════════════════════════════════════
const R={
  add:['Add place by place, carrying when a column passes 9',['Do the opposite: subtract the numbers','op'],['Add the ones, then forget the carry','slip']],
  sub:['Subtract column by column, borrowing when the top digit is smaller',['Combine the two numbers','op'],['Skip the borrow and take the smaller digit from the bigger','slip']],
  mul:['Multiplication is repeated addition of equal groups',['Just add the two numbers','op'],['Count one extra group to be safe','slip']],
  div:['Division undoes multiplication: what times the divisor gives the number?',['Multiply to share things out','op'],['Round the answer up by one','slip']],
  shapes:['Identify shapes by counting their sides and corners',['All shapes with straight sides are the same','op'],['A shape with 4 sides is always a square','slip']],
  patterns:['Find the rule that connects one item to the next',['Just repeat the last item','op'],['Skip a step in the pattern','slip']],
  measure:['Use the correct unit and tool for what you are measuring',['Mix up centimetres and metres','unit'],['Measure from 1 instead of 0 on the ruler','slip']],
  time:['Read the hour hand and minute hand separately',['Read the small hand as minutes','op'],['Count the marks wrong on the clock','slip']],
  money:['Add up the rupees and paise separately, then combine',['Treat paise the same as rupees','unit'],['Forget to carry from paise to rupees','slip']],
  dataBasic:['Count each category carefully and compare the totals',['Mix up the categories','op'],['Miscount by one','slip']],
  frac:['Make the denominators equal, then add the numerators only',['Add the tops and add the bottoms','fadd'],['Multiply the fractions together','op']],
  dec:['Line up the decimal points, then add or subtract as whole numbers',['Ignore the decimal point','decPt'],['Put the decimal in the wrong place','slip']],
  factor:['A factor divides the number exactly with no remainder',['A factor is any number less than it','op'],['Confuse multiples with factors','lcmhcf']],
  geo2d:['Count sides and angles to classify the shape',['All 4-sided shapes are squares','op'],['Confuse radius with diameter','formula']],
  symm:['A shape is symmetric if one half mirrors the other',['Any shape with equal sides is symmetric','op'],['Count the wrong number of lines of symmetry','slip']],
  perim:['Add up all the side lengths to get the perimeter',['Multiply length × width for perimeter','formula'],['Forget to count one side','slip']],
  area:['Area = length × width for a rectangle',['Add the sides for area','formula'],['Forget to square the units','unit']],

  wholenums:['Whole numbers start from 0 and go on forever',['Whole numbers include negative numbers','sign'],['Skip zero when listing whole numbers','slip']],
  playnums:['LCM is the smallest number divisible by both; HCF is the largest common factor',['Swap LCM and HCF','lcmhcf'],['Multiply the numbers for HCF','op']],
  int:['Use the number line and the sign rules',['Ignore the signs and use the digits','sign'],['Always add when two numbers appear','op']],
  ratio:['Ratio compares two quantities in order: first to second',['Swap the two quantities','ratio'],['Add instead of divide','op']],
  pct:['Percent means per hundred, so divide by 100 first',['Percent is just a number, so multiply directly','pct'],['Divide the number by the percent','op']],
  profit:['Profit = Selling Price − Cost Price',['Profit = CP − SP','profLoss'],['Add CP and SP for profit','op']],
  si:['Simple Interest = (P × R × T) / 100',['Multiply P × R × T without dividing','pct'],['Use the wrong formula','formula']],
  ci:['CI = P(1 + R/100)ᵀ − P; interest on interest',['Use simple interest formula for CI','formula'],['Forget to subtract the principal','slip']],
  algIntro:['A variable like x stands for an unknown number',['x is always 1','op'],['Treat the variable as a label, not a number','move']],
  algExpr:['Combine only like terms (same variable and power)',['Add unlike terms together','dist'],['Ignore the variable when simplifying','op']],
  linEq1:['Do the same operation on both sides to isolate x',['Move the term across and keep its sign','move'],['Apply the step to one term only','dist']],
  exponents:['aⁿ × aᵐ = aⁿ⁺ᵐ; (aⁿ)ᵐ = aⁿˣᵐ',['Multiply the bases together','expRule'],['Add the bases instead of exponents','op']],
  lines:['When two lines cross, vertically opposite angles are equal',['Adjacent angles are equal','angle'],['All angles at a point add to 90°','formula']],
  triangles:['Angles in a triangle always add to 180°',['Angles add to 360°','angle'],['Angles add to 90°','formula']],
  quadShape:['Angles in a quadrilateral add to 360°',['Angles add to 180°','angle'],['All sides of a quadrilateral are equal','op']],
  circles:['Diameter = 2 × radius; circumference = 2πr',['Confuse radius with diameter','formula'],['Use π = 3','slip']],
  mensur:['Use the correct formula for each shape (l×b for rectangle, ½×b×h for triangle)',['Swap area and perimeter formulas','formula'],['Forget the ½ for triangle area','slip']],
  surfVol:['Surface area is the total outside area; volume is the space inside',['Swap surface area and volume formulas','formula'],['Forget one face of the solid','slip']],
  dataAdv:['Read the scale of the graph carefully before comparing bars',['Ignore the scale','op'],['Misread the axis labels','slip']],
  sqRoot:['√n is the number which, when squared, gives n',['√n = n/2','root'],['Forget that √ undoes squaring','op']],
  cubeRoot:['∛n is the number which, when cubed, gives n',['∛n = n/3','root'],['Confuse cube root with square root','op']],
  directInv:['Direct: both increase together; Inverse: one up, the other down',['Treat inverse as direct','ratio'],['Multiply instead of divide','op']],
  factorAlg:['Take out common factors, then factorise the remaining expression',['Divide only one term by the common factor','dist'],['Forget a term when factoring','slip']],
  visuals:['Count faces, edges and vertices: F + V = E + 2 (Euler\'s formula)',['Mix up faces and edges','op'],['Miscount the vertices','slip']],

  realNums:['Every real number is either rational or irrational',['All decimals are rational','root'],['√2 is rational because it looks like a fraction','op']],
  poly:['Degree = highest power of the variable in the polynomial',['Degree = number of terms','op'],['Add degrees of each term','slip']],
  linEq2:['Solve using substitution or elimination to find x and y',['Add both equations without aligning','move'],['Solve for only one variable','dist']],
  quadEq:['Use the quadratic formula or factorisation to find roots',['The roots have the signs shown in the equation','sign'],['Add or multiply the coefficients directly','op']],
  ap:['In an AP, each term = a + (n−1)d; sum = n/2 × (first + last)',['Use n × d instead of a + (n−1)d','formula'],['Confuse n (terms) with d (difference)','slip']],
  coordGeo:['Distance = √[(x₂−x₁)² + (y₂−y₁)²]; midpoint = average of coordinates',['Swap x and y coordinates','coord'],['Forget the square root','sqs']],
  euclid:['A postulate is accepted without proof; a theorem must be proved',['Postulates need proof','op'],['Theorems are assumed true','slip']],
  triAdv:['Similar triangles have equal angles and proportional sides (AA, SAS, SSS)',['Equal sides means similar','op'],['Confuse similarity and congruence','formula']],
  circleAdv:['A tangent is perpendicular to the radius at the point of contact',['A tangent passes through the centre','formula'],['Chord and tangent are the same','op']],
  constructions:['Use compass and straightedge; transfer lengths with the compass arc',['Guess angles by eye','op'],['Forget to keep the compass width fixed','slip']],
  heron:['Area = √[s(s−a)(s−b)(s−c)] where s = (a+b+c)/2',['Use ½ × base × height without knowing the height','formula'],['Calculate s incorrectly','slip']],
  areaCircle:['Area of circle = πr²; area of sector = (θ/360)πr²',['Use 2πr for area','formula'],['Use diameter instead of radius','slip']],
  surfVolAdv:['Combine shapes by adding/subtracting volumes and surface areas',['Forget to subtract the overlapping face','formula'],['Swap radius and height','slip']],
  trig:['sin θ = opp/hyp, cos θ = adj/hyp, tan θ = opp/adj (SOH-CAH-TOA)',['Mix up sin and cos','trig'],['Use hypotenuse as opposite','op']],
  trigApp:['Draw the figure, label the angle of elevation/depression, then apply trig ratios',['Confuse elevation with depression','trig'],['Forget to convert units','unit']],
  stats:['Mean = sum/n; median = middle value; mode = most frequent',['Mean = middle value','formula'],['Mode = average','op']],
  prob:['P(event) = favourable outcomes / total outcomes, between 0 and 1',['Add probabilities for all events','probAdd'],['P can be greater than 1','formula']],
  pyth:['Use a² + b² = c², then take a square root',['Add the sides directly','op'],['Leave the answer squared','sqs']]
};

// ═══════════════════════════════════════════════════════════════════
//  Question generators per concept: d = difficulty 1..3
//  Returns [stem, correct, [[wrong, misconception]...]]
// ═══════════════════════════════════════════════════════════════════
const G={
add:d=>{const s=SC[S.k]*d,a=r(s,2*s),b=r(s,2*s);return[`${a} + ${b} = ?`,a+b,[[a+b+10,'slip'],[a-b,'op']]]},
sub:d=>{const s=SC[S.k]*d,b=r(s,2*s),a=b+r(s,2*s)+3;return[`${a} − ${b} = ?`,a-b,[[a-b-10,'slip'],[a+b,'op']]]},
mul:d=>{const a=r(2,4+4*d+(S.k>3?4:0)),b=r(3,9);return[`${a} × ${b} = ?`,a*b,[[a+b,'op'],[a*(b+1),'slip']]]},
div:d=>{const b=r(2,9),q=r(2,5+4*d),a=b*q;return[`${a} ÷ ${b} = ?`,q,[[a*b,'op'],[q+1,'slip']]]},
shapes:d=>pk([
  ['How many sides does a triangle have?',3,[[4,'op'],[2,'slip']]],
  ['How many corners does a rectangle have?',4,[[2,'op'],[3,'slip']]],
  ['Which shape has no corners?','Circle',[['Square','op'],['Triangle','slip']]]
]),
patterns:d=>{const s=r(2,5),step=r(2,4);const seq=[s,s+step,s+2*step];return[`What comes next: ${seq.join(', ')}, ?`,s+3*step,[[s+4*step,'slip'],[s+2*step,'op']]]},
measure:d=>pk([
  ['How many centimetres in 1 metre?',100,[[10,'unit'],[1000,'slip']]],
  ['Which is longer: 50 cm or 1 m?','1 m',[['50 cm','unit'],['They are equal','slip']]],
  ['How many grams in 1 kilogram?',1000,[[100,'unit'],[10,'slip']]]
]),
time:d=>pk([
  ['How many minutes in 1 hour?',60,[[100,'op'],[30,'slip']]],
  ['If the time is 3:30, the minute hand points to…',6,[[3,'op'],[12,'slip']]],
  ['How many hours in a day?',24,[[12,'op'],[48,'slip']]]
]),
money:d=>{const a=r(10,50),b=r(5,30);return[`You have ₹${a} and spend ₹${b}. How much is left?`,a-b,[[a+b,'op'],[a-b+1,'slip']]]},
dataBasic:d=>pk([
  ['In a pictograph, 🍎🍎🍎 means 3 apples and 🍊🍊🍊🍊 means 4 oranges. How many more oranges?',1,[[7,'op'],[2,'slip']]],
  ['A bar shows: Maths=5, Science=3, English=4. Which subject has the most students?','Maths',[['Science','op'],['English','slip']]]
]),
frac:d=>pk([[['1/5 + 2/5 = ?','3/5',[['3/10','fadd'],['2/25','op']]],['1/2 + 1/3 = ?','5/6',[['2/5','fadd'],['1/6','op']]],['3/4 + 2/3 = ?','17/12',[['5/7','fadd'],['1/2','op']]]][d-1]]),
dec:d=>pk([
  ['0.3 + 0.5 = ?',0.8,[[0.35,'decPt'],[8,'slip']]],
  ['1.5 − 0.7 = ?',0.8,[[2.2,'op'],[0.2,'decPt']]],
  ['0.2 × 3 = ?',0.6,[[0.23,'decPt'],[6,'slip']]]
]),
factor:d=>{const n=pk([12,18,24,36]);const facs=[1,2,3,4,6].filter(x=>n%x===0);const f=pk(facs);return[`Is ${f} a factor of ${n}?`,'Yes',[['No','op'],[`${n} is a factor of ${f}`,'lcmhcf']]]},
geo2d:d=>pk([
  ['How many sides does a hexagon have?',6,[[5,'op'],[8,'slip']]],
  ['A circle has how many lines of symmetry?','Infinite',[['1','op'],['4','slip']]],
  ['What is the sum of angles in a quadrilateral?','360°',[['180°','angle'],['270°','slip']]]
]),
symm:d=>pk([
  ['How many lines of symmetry does a square have?',4,[[2,'op'],[1,'slip']]],
  ['Does a rectangle have rotational symmetry?','Yes (order 2)',[['No','op'],['Yes (order 4)','slip']]],
  ['How many lines of symmetry does an equilateral triangle have?',3,[[1,'op'],[6,'slip']]]
]),
perim:d=>{const l=r(3,12),w=r(2,8);return[`Perimeter of a rectangle with length ${l} cm and width ${w} cm?`,`${2*(l+w)} cm`,[[`${l*w} cm`,'formula'],[`${l+w} cm`,'slip']]]},
area:d=>{const l=r(3,10),w=r(2,8);return[`Area of a rectangle ${l} cm × ${w} cm?`,`${l*w} cm²`,[[`${2*(l+w)} cm²`,'formula'],[`${l+w} cm²`,'slip']]]},

wholenums:d=>pk([
  ['Which is the smallest whole number?',0,[[1,'slip'],[-1,'sign']]],
  ['Is every natural number a whole number?','Yes',[['No','op'],['Only even ones','slip']]]
]),
playnums:d=>{const a=r(4,12),b=r(3,10);const h=()=>{let x=Math.min(a,b),y=Math.max(a,b);while(y%x!==0){[x,y]=[y%x,x]}return x};const hcf=h();return[`HCF of ${a} and ${b} = ?`,hcf,[[a*b/hcf,'lcmhcf'],[a*b,'op']]]},
int:d=>{const a=r(2,9),b=r(2,9);return[[`(−${a}) + ${b} = ?`,b-a,[[-(a+b),'sign'],[a+b,'op']]],[`${a} − (−${b}) = ?`,a+b,[[a-b,'sign'],[-(a+b),'sign']]],[`(−${a}) × (−${b}) = ?`,a*b,[[-a*b,'sign'],[a+b,'op']]]][d-1]},
ratio:d=>{const a=r(2,6),b=r(2,6);return[`Express ${a}:${b} in simplest form.`,
  (()=>{let x=a,y=b,t;while(y){t=y;y=x%y;x=t}return`${a/x}:${b/x}`})(),
  [[`${b}:${a}`,'ratio'],[`${a+b}`,'op']]]},
pct:d=>[()=>{const n=pk([40,80,200]),p=pk([10,25,50]);return[`What is ${p}% of ${n}?`,n*p/100,[[n*p,'pct'],[f(n/p),'op']]]},()=>['A price of 200 rises by 15%. New price?',230,[[215,'pct'],[30,'op']]],()=>['A ₹100 item gets a 20% discount, then 10% more off. Final price?',72,[[70,'pct'],[90,'op']]]][d-1](),
profit:d=>{const cp=pk([100,200,500]),sp=cp+pk([20,50,80])*pk([1,-1]);const p=sp-cp;return[`CP = ₹${cp}, SP = ₹${sp}. Profit or loss?`,p>=0?`Profit ₹${p}`:`Loss ₹${-p}`,[[p>=0?`Loss ₹${p}`:`Profit ₹${-p}`,'profLoss'],[`₹${cp+sp}`,'op']]]},
si:d=>{const P=pk([1000,2000,5000]),R=pk([5,10]),T=pk([2,3]);const si=P*R*T/100;return[`SI on ₹${P} at ${R}% for ${T} years?`,`₹${si}`,[[`₹${P*R*T}`,'pct'],[`₹${P+si}`,'formula']]]},
ci:d=>{const P=1000,R=10,T=2;return[`CI on ₹${P} at ${R}% for ${T} years?`,'₹210',[[`₹${P*R*T/100}`,'formula'],[`₹${P+P*R*T/100}`,'slip']]]},
algIntro:d=>{const a=r(2,6),c=r(10,30);return[`If ${a}x = ${c}, then x = ?`,c/a,[[c-a,'move'],[c*a,'op']]]},
algExpr:d=>{const a=r(2,5),b=r(1,4);return[`Simplify: ${a}x + ${b}x`,`${a+b}x`,[[`${a*b}x`,'op'],[`${a+b}x²`,'dist']]]},
linEq1:d=>{const x=r(1,9),b=r(1,9);if(d==1){const a=r(2,6),c=a*x+b;return[`Solve: ${a}x + ${b} = ${c}`,`x = ${x}`,[[`x = ${f((c+b)/a)}`,'move'],[`x = ${c-b}`,'op']]]}const a=d==2?2:r(3,5),b2=r(1,5),c=a*(x+b2);return[`Solve: ${a}(x + ${b2}) = ${c}`,`x = ${x}`,[[`x = ${f(c/a+b2)}`,'move'],[`x = ${f((c-b2)/a)}`,'dist']]]},
exponents:d=>pk([
  [`2³ × 2⁴ = ?`,'2⁷ = 128',[['2¹² = 4096','expRule'],['2 + 7 = 9','op']]],
  [`(3²)³ = ?`,'3⁶ = 729',[['3⁵ = 243','expRule'],['9','op']]],
  [`5⁰ = ?`,1,[[0,'expRule'],[5,'op']]]
]),
lines:d=>pk([
  ['Two supplementary angles add to…','180°',[['90°','angle'],['360°','formula']]],
  ['Vertically opposite angles are…','Equal',[['Supplementary','angle'],['Complementary','formula']]],
  ['If one angle is 70°, its supplement is…','110°',[['20°','angle'],['290°','formula']]]
]),
triangles:d=>{const a=r(40,80),b=r(30,70);const c=180-a-b;return[`In △ABC, ∠A = ${a}°, ∠B = ${b}°. Find ∠C.`,`${c}°`,[[`${360-a-b}°`,'angle'],[`${a+b}°`,'formula']]]},
quadShape:d=>pk([
  ['Sum of angles in a quadrilateral?','360°',[['180°','angle'],['720°','formula']]],
  ['A rhombus has all sides equal. Is it always a square?','No',[['Yes','op'],['Only if angles are 90°','slip']]],
  ['Opposite angles of a parallelogram are…','Equal',[['Supplementary','angle'],['90°','formula']]]
]),
circles:d=>{const radius=r(3,10);return[`Circumference of a circle with radius ${radius} cm? (π ≈ 22/7)`,`${f(2*22/7*radius)} cm`,[[`${f(22/7*radius*radius)} cm`,'formula'],[`${2*radius} cm`,'slip']]]},
mensur:d=>{const b=r(4,10),h=r(3,8);return[`Area of a triangle with base ${b} cm and height ${h} cm?`,`${f(b*h/2)} cm²`,[[`${b*h} cm²`,'slip'],[`${2*(b+h)} cm²`,'formula']]]},
surfVol:d=>{const l=r(3,8),w=r(2,6),h=r(2,5);return[`Volume of a cuboid ${l}×${w}×${h} cm?`,`${l*w*h} cm³`,[[`${2*(l*w+w*h+h*l)} cm³`,'formula'],[`${l+w+h} cm³`,'op']]]},
dataAdv:d=>pk([
  ['In a pie chart, a sector of 90° represents what fraction?','1/4',[['1/2','op'],['90/100','pct']]],
  ['Mean of 4, 6, 8, 10, 12 is…',8,[[40,'op'],[10,'slip']]]
]),
sqRoot:d=>{const n=pk([16,25,36,49,64,81]);const rt=Math.round(Math.sqrt(n));return[`√${n} = ?`,rt,[[n/2,'root'],[rt+1,'slip']]]},
cubeRoot:d=>{const n=pk([8,27,64,125]);const rt=Math.round(Math.cbrt(n));return[`∛${n} = ?`,rt,[[n/3,'root'],[rt+1,'slip']]]},
directInv:d=>pk([
  ['If 5 pens cost ₹50, how much do 8 pens cost?','₹80',[['₹40','ratio'],['₹58','op']]],
  ['If 6 workers finish a job in 12 days, how many days for 4 workers?','18 days',[['8 days','ratio'],['24 days','op']]]
]),
factorAlg:d=>pk([
  ['Factorise: 6x + 12','6(x + 2)',[['6x + 2','dist'],['3(2x + 12)','slip']]],
  ['Factorise: x² + 5x + 6','(x + 2)(x + 3)',[['(x + 1)(x + 6)','slip'],['x(x + 5) + 6','dist']]],
  ['Factorise: x² − 9','(x + 3)(x − 3)',[['(x − 3)²','sign'],['(x + 9)(x − 1)','op']]]
]),
visuals:d=>pk([
  ['How many faces does a cube have?',6,[[4,'op'],[8,'slip']]],
  ['How many edges does a cuboid have?',12,[[6,'op'],[8,'slip']]],
  ['Euler\'s formula: F + V − E = ?',2,[[0,'formula'],[1,'slip']]]
]),

realNums:d=>pk([
  ['Is √2 rational or irrational?','Irrational',[['Rational','root'],['Neither','op']]],
  ['The decimal expansion of 1/3 is…','0.333… (non-terminating repeating)',[['0.3 (terminating)','decPt'],['0.33','slip']]],
  ['Is 0 a rational number?','Yes',[['No','op'],['Only a whole number','slip']]]
]),
poly:d=>{const a=r(1,3),b=r(1,5);return[`Degree of ${a}x³ + ${b}x − 7?`,3,[[2,'op'],[4,'slip']]]},
linEq2:d=>{const x=r(1,5),y=r(1,5);const a1=1,b1=1,c1=x+y;const a2=r(1,3),b2=r(1,3),c2=a2*x+b2*y;return[`Solve: x + y = ${c1} and ${a2}x + ${b2}y = ${c2}`,`x = ${x}, y = ${y}`,[[`x = ${y}, y = ${x}`,'coord'],[`x = ${c1}`,'dist']]]},
quadEq:d=>{const p=r(1,4),q=r(p+1,6),b=r(2,6),c=r(1,5);return[[`Roots of x² − ${p+q}x + ${p*q} = 0?`,`${p} and ${q}`,[[`${-p} and ${-q}`,'sign'],[`${p+q} and ${p*q}`,'op']]],[`Sum of roots of x² − ${p+q}x + ${p*q} = 0?`,p+q,[[-(p+q),'sign'],[p*q,'op']]],[`Discriminant of x² + ${b}x + ${c} = 0?`,b*b-4*c,[[b*b+4*c,'sign'],[2*b-4*c,'sqs']]]][d-1]},
ap:d=>{const a=r(2,10),dd=r(2,5),n=r(5,10);return[`Find the ${n}th term of AP: ${a}, ${a+dd}, ${a+2*dd}, …`,a+(n-1)*dd,[[a+n*dd,'formula'],[n*dd,'slip']]]},
coordGeo:d=>{const x1=r(0,5),y1=r(0,5),x2=r(0,5),y2=r(0,5);const mx=f((x1+x2)/2),my=f((y1+y2)/2);return[`Midpoint of (${x1},${y1}) and (${x2},${y2})?`,`(${mx}, ${my})`,[[`(${my}, ${mx})`,'coord'],[`(${x1+x2}, ${y1+y2})`,'formula']]]},
euclid:d=>pk([
  ['Through two distinct points, how many lines can pass?','Exactly one',[['Infinite','op'],['Two','slip']]],
  ['A postulate is…','Accepted without proof',[['Proved from axioms','op'],['Same as a theorem','slip']]]
]),
triAdv:d=>pk([
  ['If two triangles have all corresponding angles equal, they are…','Similar',[['Congruent','formula'],['Neither','op']]],
  ['In similar triangles, corresponding sides are…','Proportional',[['Equal','formula'],['Perpendicular','op']]],
  ['AA similarity means…','Two angles equal ⟹ triangles similar',[['Two sides equal','formula'],['All angles 90°','op']]]
]),
circleAdv:d=>pk([
  ['A tangent to a circle is _____ to the radius at the point of contact.','Perpendicular',[['Parallel','formula'],['Equal','op']]],
  ['How many tangents can be drawn from a point outside a circle?',2,[[1,'op'],[3,'slip']]],
  ['The length of an arc is proportional to…','The angle at the centre',[['The radius only','formula'],['The diameter','op']]]
]),
constructions:d=>pk([
  ['To bisect an angle, you need a…','Compass and straightedge',[['Protractor','op'],['Ruler only','slip']]],
  ['When constructing a 60° angle, the compass width equals…','The radius of the arc',[['Half the radius','slip'],['The diameter','op']]]
]),
heron:d=>{const a=3,b=4,c=5,s=(a+b+c)/2;const area=Math.sqrt(s*(s-a)*(s-b)*(s-c));return[`Area of triangle with sides 3, 4, 5 using Heron's formula?`,`${area} sq units`,[[`${a+b+c} sq units`,'formula'],[`${a*b/2} sq units`,'slip']]]},
areaCircle:d=>{const radius=r(3,10);const a=f(22/7*radius*radius);return[`Area of circle with radius ${radius} cm? (π ≈ 22/7)`,`${a} cm²`,[[`${f(2*22/7*radius)} cm²`,'formula'],[`${f(22/7*radius)} cm²`,'slip']]]},
surfVolAdv:d=>{const radius=r(2,5),h=r(5,10);const v=f(22/7*radius*radius*h);return[`Volume of a cylinder: radius=${radius}, height=${h}? (π ≈ 22/7)`,`${v} cm³`,[[`${f(2*22/7*radius*h)} cm³`,'formula'],[`${f(22/7*radius*radius)} cm³`,'slip']]]},
trig:d=>pk([
  ['sin 30° = ?','1/2',[['1/√2','trig'],['√3/2','op']]],
  ['cos 60° = ?','1/2',[['√3/2','trig'],['1','op']]],
  ['tan 45° = ?',1,[[0,'trig'],['√3','op']]]
]),
trigApp:d=>pk([
  ['A tower casts a shadow equal to its height. Angle of elevation of the sun?','45°',[['30°','trig'],['60°','op']]],
  ['From a 20m building, angle of depression to a car is 30°. Distance of car from base?','20√3 m',[['20 m','trig'],['10 m','op']]]
]),
stats:d=>{const vals=[3,5,7,7,8];const mean=vals.reduce((a,b)=>a+b)/vals.length;return[`Mean of ${vals.join(', ')} = ?`,mean,[[7,'formula'],[vals.reduce((a,b)=>a+b),'op']]]},
prob:d=>{return[`A fair die is rolled. P(getting a 3) = ?`,'1/6',[['1/3','probAdd'],['3/6','op']]]},
pyth:d=>{const[a,b,c]=pk([[3,4,5],[5,12,13],[8,15,17]]);return d==1?[`Legs of a right triangle are ${a} and ${b}. Hypotenuse?`,c,[[a+b,'op'],[c*c,'sqs']]]:[`Hypotenuse is ${c} and one leg is ${a}. Other leg?`,b,[[c-a,'op'],[b*b,'sqs']]]}
};

// ═══════════════════════════════════════════════════════════════════
//  Learner model (unchanged logic)
// ═══════════════════════════════════════════════════════════════════
let S={name:'',role:'student',k:6,m:{},h:{},mis:{},sr:{},t:{},done:false},Q=null,DX=0,V=1;
function setClass(k){S.k=k;S.m={};S.h={};S.sr={};S.t={};S.mis={};S.ml=[];S.log=[.5];S.done=false;Q=null;
 const ids=LIST[k],dp={},D=id=>dp[id]??=Math.max(-1,...(PR[id]||[]).filter(p=>ids.includes(p)).map(D))+1;ids.forEach(D);const cnt={};
 C=ids.map(id=>{const d=dp[id],i=cnt[d]=(cnt[d]??-1)+1;return{id,n:N[id],p:(PR[id]||[]).filter(p=>ids.includes(p)),x:85+d*175,y:40+i*64}});C.forEach(c=>{S.m[c.id]=.5;S.h[c.id]=[.5];S.sr[c.id]=1})}
const col=m=>m<.4?'var(--bad)':m<.7?'var(--mid)':'var(--good)',pc=m=>Math.round(m*100)+'%',diff=m=>m<.4?1:m<.7?2:3;
function upd(c,ok,good,rm,om){let m=S.m[c],i=S.sr[c];S.t[c]=1;
 if(ok&&good){m+=.3*(1-m);i=Math.max(1,Math.round(i*2.2))}else if(ok){m+=.05*(1-m);i=Math.max(1,Math.round(i*1.2));S.mis[rm]=(S.mis[rm]||0)+1}
 else{m*=.7;i=1;S.mis[om]=(S.mis[om]||0)+1;if(rm&&rm!=om)S.mis[rm]=(S.mis[rm]||0)+1}
 S.m[c]=Math.min(.98,Math.max(.02,m));S.h[c].push(S.m[c]);(S.log||(S.log=[.5])).push(avg());S.sr[c]=i}
function saveStudentSnapshot(){
  if(!S.name)return;
  const id='stu_'+S.name.trim().replace(/\s+/g,'_').toLowerCase();
  let reg={};
  try{reg=JSON.parse(localStorage.getItem('eduspark_student_registry')||localStorage.getItem('parakh_student_registry')||'{}');}catch(e){}
  reg[id]={
    id,
    name:S.name,
    classLevel:S.k,
    m:{...S.m},
    t:{...S.t},
    mis:{...S.mis},
    ml:[...(S.ml||[])],
    log:[...(S.log||[.5])],
    done:S.done,
    totalAnswers:(S.ml||[]).length,
    overall:avg(),
    updatedAt:Date.now()
  };
  try{
    const regStr=JSON.stringify(reg);
    localStorage.setItem('eduspark_student_registry',regStr);
    localStorage.setItem('parakh_student_registry',regStr);
  }catch(e){}
}
let CUSTOM_Q=[];
function loadCustomQuestions(){
  try{CUSTOM_Q=JSON.parse(localStorage.getItem('eduspark_custom_questions')||localStorage.getItem('parakh_custom_questions')||'[]');}catch(e){CUSTOM_Q=[];}
  fetch(`/api/questions/custom?classLevel=${S.k}`)
    .then(r=>r.ok?r.json():[])
    .then(apiQs=>{
      if(Array.isArray(apiQs)&&apiQs.length){
        apiQs.forEach(aq=>{
          if(!CUSTOM_Q.some(cq=>String(cq.id)===String(aq.id))){
            CUSTOM_Q.push({
              id:aq.id,
              classLevel:aq.classLevel,
              conceptId:aq.conceptId,
              difficulty:aq.difficulty,
              stem:aq.stem,
              correct:aq.correct,
              distractors:aq.distractors||[],
              soundReason:aq.soundReasoning,
              flawedReason:aq.flawedReasoning,
              flawedReason2:aq.flawedReasoning2||'',
              fromApi:true
            });
          }
        });
        try{
          const cqStr=JSON.stringify(CUSTOM_Q);
          localStorage.setItem('eduspark_custom_questions',cqStr);
          localStorage.setItem('parakh_custom_questions',cqStr);
        }catch(e){}
        if(V==7)draw();
      }
    }).catch(()=>{});
}
function getCustomQuestions(conceptId,classLevel,difficulty){
  return CUSTOM_Q.filter(q=>q.conceptId===conceptId&&Number(q.classLevel)===Number(classLevel));
}
loadCustomQuestions();

function startQ(c,d,ctx){
  const cqs=getCustomQuestions(c,S.k,d);
  if(cqs.length>0&&Math.random()<0.75){
    const qObj=cqs[Math.floor(Math.random()*cqs.length)];
    const distPairs=(qObj.distractors||[]).map((dst,i)=>[dst,'mis_teacher_'+i]);
    const rPairs=[[qObj.flawedReason,'mis_teacher_flawed']];
    if(qObj.flawedReason2)rPairs.push([qObj.flawedReason2,'mis_teacher_flawed2']);
    else if(R[c]&&R[c][2])rPairs.push(R[c][2]);

    const it=[qObj.stem,qObj.correct,distPairs];
    Q={
      c,d,ctx,it,stage:0,
      opts:sh([[qObj.correct,null],...distPairs]),
      rs:sh([[qObj.soundReason,null],...rPairs]),
      isCustom:true,
      customId:qObj.id
    };
    return;
  }
  const it=G[c](d);
  Q={c,d,ctx,it,stage:0,opts:sh([[it[1],null],...it[2]]),rs:sh([[R[c][0],null],R[c][1],R[c][2]])};
}
function pickA(i){Q.a=Q.opts[i];Q.stage=1;draw()}
function pickR(i){
  Q.rr=Q.rs[i];
  Q.ok=Q.a[1]===null;
  Q.good=Q.rr[1]===null;
  Q.before=S.m[Q.c];
  upd(Q.c,Q.ok,Q.good,Q.rr[1],Q.a[1]);
  (S.ml||(S.ml=[])).push({
    c:Q.c,
    a:Q.a[1],
    r:Q.rr[1],
    q:Q.it[0],
    ans:String(Q.a[0]),
    reason:String(Q.rr[0]),
    ok:Q.ok,
    good:Q.good,
    time:new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})
  });
  saveStudentSnapshot();
  if(API_TOKEN){
    fetch('/api/attempts',{
      method:'POST',
      headers:{'Content-Type':'application/json',Authorization:`Bearer ${API_TOKEN}`},
      body:JSON.stringify({
        conceptId:Q.c,
        question:Q.it[0],
        selectedAnswer:String(Q.a[0]),
        correct:Q.ok?1:0,
        reasoningCorrect:Q.good?1:0,
        answerMisconception:Q.a[1]||null,
        reasoningMisconception:Q.rr[1]||null,
        difficulty:Q.d||1
      })
    }).catch(()=>{});
  }
  if(Q.ctx=='dx'){DX++;if(DX>=C.length){S.done=true;saveStudentSnapshot();Q=null;V=4}else startQ(C[DX].id,2,'dx')}else Q.stage=2;
  draw();
}
function weakest(){const w=[...C].sort((a,b)=>S.m[a.id]-S.m[b.id])[0],root=c=>{const p=c.p.filter(q=>S.m[q]<.6).sort((a,b)=>S.m[a]-S.m[b])[0];return p?root(B(p)):c};return{t:root(w),w}}
function nextRoom(){const{t}=weakest();startQ(t.id,diff(S.m[t.id]),'room')}
function practice(c){startQ(c,diff(S.m[c]),'room');V=5;draw();scrollTo(0,0)}
function go(n){if(S.role==='teacher'&&n!==1&&n!==9)n=7;V=n;if(n===9){FC_CLASS=S.k||6;}if(n==3){DX=0;startQ(C[0].id,2,'dx')}if(n==5)nextRoom();if(n==7){T.sel=-1;if(typeof fetchTeacherClassData==='function')fetchTeacherClassData(S.k);}draw();scrollTo(0,0)}
async function login(){
  const nm=$('#nm').value.trim()||(S.role=='student'?'Student':'Teacher');
  const em=($('#em')?.value||'').trim();
  const pw=($('#pw')?.value||'').trim();
  const k=S.role=='student'?+($('#cl')?.value||6):6;
  S.name=nm;
  if(em&&pw){
    try{
      let res=await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:em,password:pw})});
      let data=await res.json();
      if(!res.ok){
        res=await fetch('/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:nm,email:em,password:pw,role:S.role,classLevel:k})});
        data=await res.json();
      }
      if(data.token){
        API_TOKEN=data.token;
        localStorage.setItem("eduspark_token",API_TOKEN);
        localStorage.setItem("parakh_token",API_TOKEN);
        if(data.user?.name)S.name=data.user.name;
      }
    }catch(err){console.warn('API auth fallback:',err);}
  }
  if(S.role=='student'){setClass(k);saveStudentSnapshot();go(2)}else{if(!C.length)setClass(6);if(typeof fetchTeacherClassData==='function')fetchTeacherClassData(6);go(7)}
  loadCal();
}
function demo(){S.role='student';S.name='Demo student';setClass(6);saveStudentSnapshot();go(2)}
function quiz(){if(!Q)return'';let h=`<div class="card"><span class="pill">${N[Q.c]}</span> <span class="pill">Class ${S.k} · level ${Q.d} of 3</span><h2 style="margin-top:14px">${Q.it[0]}</h2>`;
 if(Q.stage==0)h+=Q.opts.map((o,i)=>`<button class="opt" onclick="pickA(${i})">${o[0]}</button>`).join('');
 else if(Q.stage==1)h+=`<p class="sub">You chose "${Q.a[0]}". Which reasoning is closest to yours? EduSpark reads your reasoning, not just your answer, to find the misconception behind it.</p>`+Q.rs.map((o,i)=>`<button class="opt" onclick="pickR(${i})">${o[0]}</button>`).join('');
 else{h+=`<p><b style="color:${Q.ok?'var(--good)':'var(--bad)'}">` +(Q.ok&&Q.good?'Correct, and the reasoning holds.':Q.ok?'Right answer, shaky reasoning.':'Not quite. The answer is '+Q.it[1]+'.')+'</b></p>';
  {const am=Q.a[1],rm=Q.rr[1],src=k=>k==am&&k==rm?'Seen in your answer and your reasoning':k==rm?'Found in your reasoning'+(Q.ok?', although your answer was right':''):'Found in your answer';h+=`<div class="det"><b>🔍 Misconception check</b><div class="dr"><span>Your answer</span><i>${Q.a[0]}</i><em class="${am?'bad':'ok'}">${am?'Pattern: '+M[am][0]:'No misconception'}</em></div><div class="dr"><span>Your reasoning</span><i>${Q.rr[0]}</i><em class="${rm?'bad':'ok'}">${rm?'Pattern: '+M[rm][0]:'Sound reasoning'}</em></div>`+[...new Set([am,rm].filter(Boolean))].map(k=>`<div class="warn"><b>${M[k][0]}</b> <span class="pill">${src(k)}</span><br>${M[k][1]}</div>`).join('')+(Q.ok&&rm?'<p class="sub">Your final answer was correct, but your reasoning has a gap. Only checking the reasoning catches this.</p>':'')+'</div>'}
  h+=`<p class="sub">Mastery of ${N[Q.c]}: ${pc(Q.before)} → <b style="color:${col(S.m[Q.c])}">${pc(S.m[Q.c])}</b>. Next review in ${S.sr[Q.c]} day${S.sr[Q.c]>1?'s':''}.</p><button class="btn" onclick="nextRoom();draw()">Next question</button>`}
 return h+'</div>'}
function wrapTxt(str,max=14){
 if(str.length<=max)return[str];
 const words=str.split(' ');
 if(words.length<=1)return[str];
 let half=str.length/2,bestIdx=0,minDiff=999,cur=0;
 for(let i=0;i<words.length-1;i++){
   cur+=words[i].length+(i>0?1:0);
   let diff=Math.abs(cur-half);
   if(diff<minDiff){minDiff=diff;bestIdx=i;}
 }
 return[words.slice(0,bestIdx+1).join(' '),words.slice(bestIdx+1).join(' ')];
}
function graph(){
 const BW=138,BH=46;
 const maxX=Math.max(...C.map(c=>c.x))+BW/2+25;
 const maxY=Math.max(...C.map(c=>c.y))+BH/2+25;
 let e='',n='';
 C.forEach(c=>c.p.forEach(p=>{
   const q=B(p);
   if(q){
     const sx=q.x===c.x?q.x:(q.x+BW/2),sy=q.x===c.x?(q.y+BH/2):q.y;
     const tx=q.x===c.x?c.x:(c.x-BW/2),ty=q.x===c.x?(c.y-BH/2):c.y;
     e+=`<line x1="${sx}" y1="${sy}" x2="${tx}" y2="${ty}" stroke="rgba(168,130,255,.55)" stroke-width="2"/>`;
   }
 }));
 C.forEach(c=>{
   const k=S.t[c.id];
   const lines=wrapTxt(c.n,14);
   const colBg=k?col(S.m[c.id]):'#8f78c9';
   const colTxt=k?'#0c0a22':'#ffffff';
   let txt='';
   if(lines.length===1){
     txt=`<text x="${c.x}" y="${c.y+(k?-2:4)}" text-anchor="middle" font-size="9" font-weight="600" style="fill:${colTxt}">${esc(lines[0])}</text>`;
   }else{
     txt=`<text x="${c.x}" y="${c.y-(k?6:3)}" text-anchor="middle" font-size="8.5" font-weight="600" style="fill:${colTxt}"><tspan x="${c.x}" dy="0">${esc(lines[0])}</tspan><tspan x="${c.x}" dy="11">${esc(lines[1])}</tspan></text>`;
   }
   if(k){
     txt+=`<text x="${c.x}" y="${c.y+(lines.length===1?11:15)}" text-anchor="middle" font-size="8" font-weight="700" style="fill:${colTxt};opacity:.95">★ ${pc(S.m[c.id])}</text>`;
   }
   n+=`<g style="cursor:pointer" onclick="practice('${c.id}')" role="button" tabindex="0"><title>Click to practice ${esc(c.n)}</title><rect x="${c.x-BW/2}" y="${c.y-BH/2}" width="${BW}" height="${BH}" rx="10" fill="${colBg}" opacity=".94" stroke="#ffffff" stroke-width="1.5"/>${txt}</g>`;
 });
 return`<svg viewBox="0 0 ${maxX} ${maxY}" width="100%" role="img" aria-label="Concept graph for Class ${S.k}">${e}${n}</svg>`}
const bars=()=>[...C].sort((a,b)=>S.m[a.id]-S.m[b.id]).map(c=>`<div class="row"><span>${c.n}</span><div class="bar"><i style="width:${S.m[c.id]*100}%;background:${col(S.m[c.id])}"></i></div><span style="width:40px">${S.t[c.id]?pc(S.m[c.id]):'–'}</span></div>`).join(''),avg=()=>C.reduce((s,c)=>s+S.m[c.id],0)/C.length;
const clsOpts=sel=>[1,2,3,4,5,6,7,8,9,10].map(k=>`<option value="${k}" ${k==sel?'selected':''}>Class ${k}</option>`).join('');
let T={sel:-1,f:"All",as:[]};function asg(c,d){T.as.push({c,d});draw()}
let TEACHER_API_DATA=null;
let TQ_FILTER='';
async function addTeacherQuestion(){
  const conceptId=$('#tq_c')?.value||(C[0]?C[0].id:'');
  const diff=+($('#tq_diff')?.value||1);
  const stem=($('#tq_stem')?.value||'').trim();
  const correct=($('#tq_ans')?.value||'').trim();
  const d1=($('#tq_d1')?.value||'').trim();
  const d2=($('#tq_d2')?.value||'').trim();
  const d3=($('#tq_d3')?.value||'').trim();
  const sound=($('#tq_sound')?.value||'').trim();
  const flawed=($('#tq_flawed')?.value||'').trim();
  if(!stem||!correct||!d1||!sound||!flawed){
    alert('Please fill in Question stem, Correct answer, at least one wrong option, Sound reasoning, and Flawed reasoning.');
    return;
  }
  const distractors=[d1,d2,d3].filter(Boolean);
  const newQ={
    id:'cq_'+Date.now(),
    classLevel:S.k,
    conceptId,
    difficulty:diff,
    stem,
    correct,
    distractors,
    soundReason:sound,
    flawedReason:flawed,
    createdAt:new Date().toISOString()
  };
  CUSTOM_Q.unshift(newQ);
  try{
    const cqStr=JSON.stringify(CUSTOM_Q);
    localStorage.setItem('eduspark_custom_questions',cqStr);
    localStorage.setItem('parakh_custom_questions',cqStr);
  }catch(e){}
  if(API_TOKEN&&S.role==='teacher'){
    try{
      const res=await fetch('/api/teacher/questions',{
        method:'POST',
        headers:{'Content-Type':'application/json',Authorization:`Bearer ${API_TOKEN}`},
        body:JSON.stringify({classLevel:S.k,conceptId,difficulty:diff,stem,correctAnswer:correct,distractors,soundReasoning:sound,flawedReasoning:flawed})
      });
      if(res.ok){
        const apiSaved=await res.json();
        newQ.id=apiSaved.id;
        newQ.fromApi=true;
        try{
          const cqStr=JSON.stringify(CUSTOM_Q);
          localStorage.setItem('eduspark_custom_questions',cqStr);
          localStorage.setItem('parakh_custom_questions',cqStr);
        }catch(e){}
      }
    }catch(err){}
  }
  alert(`Question for ${N[conceptId]||conceptId} successfully added to the Quiz Bank!`);
  draw();
}
async function removeTeacherQuestion(id){
  if(!confirm('Are you sure you want to remove this question from the quiz bank?'))return;
  CUSTOM_Q=CUSTOM_Q.filter(q=>String(q.id)!==String(id));
  try{
    const cqStr=JSON.stringify(CUSTOM_Q);
    localStorage.setItem('eduspark_custom_questions',cqStr);
    localStorage.setItem('parakh_custom_questions',cqStr);
  }catch(e){}
  if(API_TOKEN&&S.role==='teacher'){
    try{
      await fetch(`/api/teacher/questions/${id}`,{
        method:'DELETE',
        headers:{Authorization:`Bearer ${API_TOKEN}`}
      });
    }catch(e){}
  }
  draw();
}
async function fetchTeacherClassData(k){
  if(!API_TOKEN)return;
  try{
    const res=await fetch(`/api/teacher/classes/${k||S.k}/overview`,{headers:{Authorization:`Bearer ${API_TOKEN}`}});
    if(res.ok){TEACHER_API_DATA=await res.json();if(V==7)draw();}
  }catch(e){}
}
function getStudentsForClass(k){
  let reg={};
  try{reg=JSON.parse(localStorage.getItem('eduspark_student_registry')||localStorage.getItem('parakh_student_registry')||'{}');}catch(e){}
  if(S.name&&(Number(S.k)===Number(k)||!S.k)){
    const id='stu_'+S.name.trim().replace(/\s+/g,'_').toLowerCase();
    if(!reg[id]||(S.ml&&S.ml.length>(reg[id].ml?reg[id].ml.length:0))){
      reg[id]={id,name:S.name,classLevel:k,m:{...S.m},t:{...S.t},mis:{...S.mis},ml:[...(S.ml||[])],log:[...(S.log||[.5])],done:S.done,totalAnswers:(S.ml||[]).length,overall:avg(),updatedAt:Date.now()};
    }
  }
  if(TEACHER_API_DATA&&Number(TEACHER_API_DATA.classLevel)===Number(k)&&Array.isArray(TEACHER_API_DATA.students)){
    TEACHER_API_DATA.students.forEach(bs=>{
      const id='api_'+bs.id;
      if(!reg[id]){
        const mObj={};
        if(Array.isArray(bs.mastery)){bs.mastery.forEach(x=>{mObj[x.id]=x.score;});}
        reg[id]={id,name:bs.name,classLevel:k,m:mObj,t:{},mis:{},ml:bs.recentAttempts||[],overall:bs.overallMastery||0.5,updatedAt:Date.now()};
      }
    });
  }
  const live=Object.values(reg).filter(st=>Number(st.classLevel)===Number(k));
  const list=[];
  live.forEach(st=>{
    const scores=C.map(c=>(st.m&&st.m[c.id]!==undefined)?st.m[c.id]:0.5);
    const overall=scores.reduce((x,y)=>x+y,0)/Math.max(1,C.length);
    list.push({id:st.id,name:`★ ${st.name} (Live Student)`,rawName:st.name,isReal:true,scores,overall,attempts:st.ml||[],misconceptions:st.mis||{},t:st.t||{}});
  });
  let sd=7+Number(k);
  const rd=()=>(sd=(sd*9301+49297)%233280)/233280;
  const simulatedNames=["Aarav Sharma","Diya Verma","Vihaan Gupta","Ananya Singh","Kabir Mehta","Ishita Rao","Reyansh Joshi","Myra Kapoor","Arjun Nair","Saanvi Iyer","Krish Malhotra","Anvi Reddy","Dev Chopra","Navya Bose","Aditya Yadav","Kiara Khanna","Rohan Das","Tara Menon","Yash Tiwari","Meera Pillai","Ishaan Saxena","Riya Bansal","Veer Chauhan","Zoya Khan"];
  const neededSim=Math.max(8,24-list.length);
  for(let i=0;i<neededSim;i++){
    const sName=simulatedNames[i%simulatedNames.length];
    const scores=C.map((c,j)=>Math.min(.98,Math.max(.05,.72-j*.09+(rd()-.5)*.6)));
    const overall=scores.reduce((x,y)=>x+y,0)/Math.max(1,C.length);
    list.push({id:`sim_${i+1}`,name:`Roll ${String(i+1).padStart(2,'0')} · ${sName}`,rawName:sName,isReal:false,scores,overall,attempts:[],misconceptions:{},t:{}});
  }
  return list;
}

let FC_CLASS = 6;
let FC_SUBJ = 'Mathematics';
let FC_SEARCH = '';

function getSyllabusTree(k) {
  if (typeof window !== 'undefined' && window.NCERT_SYLLABUS && window.NCERT_SYLLABUS[k]) {
    return window.NCERT_SYLLABUS[k];
  }
  return null;
}


function practiceTopic(topic, chapter, subject) {
  if (subject === 'Mathematics') {
    // Match topic to closest math concept if possible
    const tLower = topic.toLowerCase();
    const matched = C.find(c => tLower.includes(c.n.toLowerCase()) || c.n.toLowerCase().includes(tLower));
    if (matched) {
      practice(matched.id);
      return;
    }
  }
  // Otherwise start adaptive practice on weakest concept with contextual toast
  const { t } = weakest();
  startQ(t.id, diff(S.m[t.id]), 'room');
  V = 5;
  draw();
  scrollTo(0,0);
}

function renderFlowchartView() {
  const syl = getSyllabusTree(FC_CLASS) || (typeof window !== 'undefined' && window.NCERT_SYLLABUS ? window.NCERT_SYLLABUS[6] : null);
  if (!syl) {
    return `<div class="card"><h2>NCERT Syllabus Flowcharts</h2><p class="sub">Loading syllabus data...</p></div>`;
  }
  const subjects = syl.subjects || [];
  if (!subjects.some(s => s.name === FC_SUBJ) && subjects.length) {
    FC_SUBJ = subjects[0].name;
  }
  const curSubject = subjects.find(s => s.name === FC_SUBJ) || subjects[0];
  const q = FC_SEARCH.trim().toLowerCase();

  const filteredChapters = (curSubject?.children || []).filter(ch => {
    if (!q) return true;
    if (ch.title.toLowerCase().includes(q)) return true;
    return (ch.children || []).some(t => t.title.toLowerCase().includes(q));
  });

  const totalTopics = (curSubject?.children || []).reduce((acc, ch) => acc + (ch.children?.length || 0), 0);

  return `
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:14px">
      <div>
        <h2 style="margin:0">NCERT Syllabus Flowchart · Class ${FC_CLASS}</h2>
        <p class="sub" style="margin:4px 0 0">Interactive chapter & prerequisite topic tree for Class ${FC_CLASS} (${syl.board || 'NCERT'})</p>
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        <label style="margin:0;font-size:0.85rem">Class:
          <select onchange="FC_CLASS=+this.value;draw()" style="padding:4px 10px;border-radius:10px;border:1px solid rgba(167,139,250,0.4);background:#fff;font-weight:600">
            ${[1,2,3,4,5,6,7,8,9,10].map(k => `<option value="${k}" ${k===FC_CLASS?'selected':''}>Class ${k}</option>`).join('')}
          </select>
        </label>
      </div>
    </div>

    <div class="card" style="margin-bottom:14px">
      <div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:4px">
        ${subjects.map(s => `
          <button class="btn ${s.name===FC_SUBJ?'':'off'}" onclick="FC_SUBJ='${esc(s.name)}';draw()" style="white-space:nowrap;padding:6px 14px">
            ${esc(s.name)}
          </button>
        `).join('')}
      </div>
    </div>

    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:16px">
        <div>
          <h3 style="margin:0;color:#7b57b0">📚 ${esc(curSubject?.name || FC_SUBJ)}</h3>
          <small class="sub">${(curSubject?.children || []).length} Chapters · ${totalTopics} Core Topics</small>
        </div>
        <div style="display:flex;gap:8px;align-items:center">
          <input type="text" placeholder="Search chapter or topic..." value="${esc(FC_SEARCH)}" oninput="FC_SEARCH=this.value;draw()" style="padding:6px 12px;border-radius:14px;border:1px solid #d3c6f3;font-size:0.85rem;min-width:200px">
          <button class="btn alt" style="padding:5px 12px;font-size:0.8rem" onclick="const ds=document.querySelectorAll('.fc-details');const allOpen=[...ds].every(d=>d.open);ds.forEach(d=>d.open=!allOpen)">
            Toggle All
          </button>
        </div>
      </div>

      <div class="flowchart-container">
        ${filteredChapters.length ? filteredChapters.map((ch, idx) => `
          <details class="fc-details syllabus-node" open style="margin-bottom:12px;border:1px solid rgba(167,139,250,0.25);border-radius:12px;padding:8px 12px;background:rgba(255,255,255,0.7)">
            <summary style="cursor:pointer;font-weight:600;font-size:0.95rem;color:#4c2882;display:flex;align-items:center;gap:8px">
              <span class="pill" style="font-size:0.75rem;padding:2px 8px">Ch ${idx+1}</span>
              <span>${esc(ch.title)}</span>
              <small class="sub" style="margin-left:auto;font-weight:normal">(${ch.children?.length || 0} topics)</small>
            </summary>
            <div class="syllabus-branch" style="margin:10px 0 6px 14px;border-left:2px solid #a78bfa;padding-left:14px;display:flex;flex-wrap:wrap;gap:8px">
              ${(ch.children || []).map(t => `
                <div class="syllabus-leaf clickable-topic" onclick="practiceTopic('${esc(t.title)}','${esc(ch.title)}','${esc(curSubject?.name||FC_SUBJ)}')" style="cursor:pointer;background:#f4eeff;border:1px solid #dcd0f7;padding:5px 12px;border-radius:8px;font-size:0.85rem;color:#3b1c6e;display:flex;align-items:center;gap:6px;transition:all .15s" title="Click to practice this topic">
                  <span style="color:#7b57b0;font-weight:700">●</span>
                  <span>${esc(t.title)}</span>
                  <small style="opacity:0.7;font-size:0.75rem">✎</small>
                </div>
              `).join('')}
            </div>
          </details>
        `).join('') : `<p class="sub" style="text-align:center;padding:20px">No chapters or topics matching "${esc(FC_SEARCH)}".</p>`}
      </div>
    </div>
  `;
}

const V_=[
()=>`<div class="g2"><div><span class="pill">AI-POWERED LEARNING PLATFORM · NCERT SYLLABUS</span><h1 style="margin-top:16px">Unlock your potential with AI-powered learning</h1><p class="sub">Full NCERT Mathematics syllabus for Classes 1 to 10. EduSpark finds the exact concept you're stuck on, from your reasoning, and builds adaptive practice around it.</p>
<div class="card" style="max-width:430px"><div class="row"><button class="btn ${S.role=='student'?'':'off'}" onclick="S.role='student';draw()">Student</button><button class="btn ${S.role=='teacher'?'':'off'}" onclick="S.role='teacher';draw()">Teacher</button></div>
<label>Name<input id="nm" placeholder="Your name"></label><label>Email<input type="email" id="em" placeholder="you@school.in"></label><label>Password<input type="password" id="pw" placeholder="At least 8 characters"></label>
${S.role=='student'?`<label>Your class<select id="cl">${clsOpts(6)}</select></label>`:''}<div class="row"><button class="btn" onclick="login()">Go to dashboard</button><button class="btn alt" onclick="demo()">Try demo</button></div></div></div>
<div class="orb" aria-hidden="true"><i style="left:30%;top:46%;width:7px;height:7px"></i><i style="left:36%;top:30%;width:5px;height:5px;background:#fff"></i><i style="left:58%;top:84%;width:9px;height:9px"></i></div></div>`,
()=>{const{t,w}=weakest(),q=[...C].sort((a,b)=>S.sr[a.id]-S.sr[b.id]||S.m[a.id]-S.m[b.id]),mis=Object.entries(S.mis).sort((a,b)=>b[1]-a[1]).slice(0,3),L=(S.log||[.5]).slice(-20),n=L.length-1,h=new Date().getHours(),g=h<12?'morning':h<17?'afternoon':'evening',X=i=>10+i/Math.max(1,n)*380,Y=v=>130-v*110,
d=n>0?`M${X(0)} ${Y(L[0])}`+L.slice(1).map((v,i)=>{const a=X(i),b=X(i+1);return` C${(a+b)/2} ${Y(L[i])},${(a+b)/2} ${Y(v)},${b} ${Y(v)}`}).join(''):'',
ring=`<svg width="120" height="120" viewBox="0 0 110 110" role="img" aria-label="Overall mastery"><defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#22d3ee"/><stop offset=".5" stop-color="#8b5cf6"/><stop offset="1" stop-color="#ec4899"/></linearGradient></defs><circle cx="55" cy="55" r="44" fill="none" stroke="#e1d9f5" stroke-width="9"/><circle cx="55" cy="55" r="44" fill="none" stroke="url(#rg)" stroke-width="10" stroke-linecap="round" stroke-dasharray="${S.done?avg()*276:0} 276" transform="rotate(-90 55 55)"/><text x="55" y="61" text-anchor="middle" font-size="20" font-weight="600" style="fill:url(#rg)">${S.done?pc(avg()):'–'}</text></svg>`,
bd=[['Diagnostic done',S.done],['Concept at 70%+',C.some(c=>S.m[c.id]>=.7)],['Five answers',n>=5],['All concepts 70%+',S.done&&C.every(c=>S.m[c.id]>=.7)]];
return`<div class="top"><h2 class="hi">Good ${g}, ${S.name}!</h2><div class="tools">${S.role=='teacher'?`<select onchange="setClass(+this.value);draw()" aria-label="Change class">${clsOpts(S.k)}</select>`:`<span style="color:#fff;padding:0 12px;font-size:.9rem">Class ${S.k} · NCERT Maths</span>`}</div></div><div class="dash">
<div class="card lvl" style="background:linear-gradient(145deg,#d9f4ff,#ebe0ff 55%,#ffdcee)"><h3>Level progress</h3><div style="text-align:center">${ring}</div><div style="text-align:center;margin-top:6px">${C.map(c=>`<span title="${c.n}" style="display:inline-block;width:12px;height:12px;border-radius:50%;margin:0 3px;background:${S.t[c.id]?col(S.m[c.id]):'#cbbfe6'}"></span>`).join('')}</div><button class="btn alt" style="width:100%;margin-top:8px" onclick="go(4)">View analysis</button></div>
<div class="card hwc"><h3>Revision due</h3>${q.slice(0,4).map(c=>`<button class="hwi" onclick="practice('${c.id}')"><span>Revise ${c.n}<small>${S.t[c.id]?`Review in ${S.sr[c.id]} day${S.sr[c.id]>1?'s':''}`:'Not tested yet'}</small></span>›</button>`).join('')}</div>
<div class="card crs"><h3>Your NCERT concepts (${C.length})</h3><div style="max-height:300px;overflow:auto">${q.map(c=>`<button class="course" onclick="practice('${c.id}')"><span>${c.n}<small>${S.t[c.id]?'Mastery '+pc(S.m[c.id]):'Not tested'} · Level ${diff(S.m[c.id])}</small></span>›</button>`).join('')}</div><button class="btn" style="width:100%;margin-top:8px" onclick="go(3)">${S.done?'Retake diagnostic':'Take diagnostic'}</button></div>
<div class="card act" style="background:linear-gradient(145deg,#fff0d9,#f1e2ff 55%,#d9f2ff)"><h3>Study activity <span class="pill" style="float:right">Mastery trend</span></h3><svg viewBox="0 0 400 150" width="100%" role="img" aria-label="Mastery trend">${[0,.5,1].map(v=>`<line x1="10" x2="390" y1="${Y(v)}" y2="${Y(v)}" stroke="#c4b2ee" stroke-dasharray="3 4"/><text class="dk" x="0" y="${Y(v)-3}" font-size="8">${v*100}%</text>`).join('')}${n>0?`<defs><linearGradient id="lg" x1="0" x2="1"><stop offset="0" stop-color="#22d3ee"/><stop offset=".5" stop-color="#8b5cf6"/><stop offset="1" stop-color="#ec4899"/></linearGradient><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a78bfa" stop-opacity=".5"/><stop offset="1" stop-color="#a78bfa" stop-opacity="0"/></linearGradient></defs><path d="${d} L${X(n)} 130 L${X(0)} 130 Z" fill="url(#ag)"/><path d="${d}" fill="none" stroke="url(#lg)" stroke-width="4" stroke-linecap="round"/>${L.map((v,i)=>`<circle cx="${X(i)}" cy="${Y(v)}" r="4.5" fill="#fff" stroke="${col(v)}" stroke-width="3"/>`).join('')}`:`<text class="dk" x="200" y="80" text-anchor="middle" font-size="11">Answer questions to see your trend</text>`}</svg></div>
<div class="card ach"><h3>Achievements</h3>${bd.map(([k,v])=>`<span class="chip ${v?'':'lock'}">${v?'★':'🔒'} ${k}</span>`).join('')}</div>
<div class="card pop"><h3>Misconceptions to fix</h3>${mis.length?mis.map(([k,v])=>`<div class="hwi" style="cursor:default"><span>${M[k][0]}<small>${v}× · ${M[k][1]}</small></span></div>`).join(''):'<p class="sub">None yet. Take the diagnostic to find them.</p>'}</div>
<div class="card map"><h3>Class schedule</h3>${calBoard()}<button class="btn alt" style="margin-top:10px" onclick="go(8)">Open full calendar</button></div><div class="card map"><h3>Class ${S.k} NCERT concept map</h3>${graph()}<button class="btn alt" style="margin-top:10px" onclick="go(9)">Explore NCERT Syllabus Flowcharts ›</button></div></div>`},
()=>`<h2>Diagnostic: question ${Math.min(DX+1,C.length)} of ${C.length}</h2><div class="bar" style="margin-bottom:14px"><i style="width:${DX/C.length*100}%;background:var(--acc)"></i></div>${quiz()}`,
()=>!S.done?`<div class="card"><h2>Take the diagnostic first</h2><p class="sub">Your analysis appears after a few short questions.</p><button class="btn" onclick="go(3)">Take the diagnostic</button></div>`:`<h2>Your learning analysis</h2><div class="g2"><div class="card"><h3>Mastery by concept</h3>${bars()}</div><div class="card"><h3>Concept map</h3>${graph()}</div></div>
<div class="card"><h3>Misconceptions found in your reasoning</h3>${Object.keys(S.mis).length?Object.entries(S.mis).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`<div class="warn"><b>${M[k][0]}</b> (${v}×)<br>${M[k][1]}</div>`).join(''):'<p class="sub">None detected.</p>'}<button class="btn" onclick="go(2)">Back to dashboard</button></div><div class="card"><h3>How each answer was read</h3>${(S.ml||[]).slice(-12).reverse().map(e=>`<div class="row"><span>${N[e.c]}</span><span style="flex:1;font-size:.85rem">Answer: <b style="color:${e.a?'var(--bad)':'var(--good)'}"}>${e.a?'wrong':'right'}</b> · Reasoning: <b style="color:${e.r?'var(--bad)':'var(--good)'}}">${e.r?'flawed':'sound'}</b></span><span class="pill">${e.r&&!e.a?'caught only by reasoning':e.r?'reasoning confirms it':e.a?'answer slip only':'clean'}</span></div>`).join('')}</div>`,
()=>{if(!Q)nextRoom();const{t,w}=weakest();return`<h2>AI learning room</h2><p class="sub">${t.id!=w.id&&Q.c==t.id?`Starting with ${t.n}, since ${w.n} builds on it.`:'Targeting your weakest concept. Difficulty adapts to your mastery.'}</p>${quiz()}`},
()=>`<h2>Progress and revision</h2><div class="card"><h3>Revision schedule</h3><div style="max-height:400px;overflow:auto">${[...C].sort((a,b)=>S.sr[a.id]-S.sr[b.id]||S.m[a.id]-S.m[b.id]).map(c=>{const h=S.h[c.id],p=h.map((v,i)=>`${i/Math.max(1,h.length-1)*80},${26-v*24}`).join(' ');return`<div class="row"><span>${c.n}</span><svg width="80" height="28"><polyline points="${p}" fill="none" stroke="${col(S.m[c.id])}" stroke-width="2"/></svg><span style="flex:1" class="sub">${S.t[c.id]?`${pc(S.m[c.id])} · review in ${S.sr[c.id]} day${S.sr[c.id]>1?'s':''}`:'Not tested yet'}</span><button class="btn alt" onclick="practice('${c.id}')">Revise</button></div>`}).join('')}</div><p class="sub">Intervals grow after a correct answer with sound reasoning, and reset to one day after a miss.</p></div>`,
()=>{
  const allStudents=getStudentsForClass(S.k);
  const tot=allStudents.length;
  const NM=allStudents.map(s=>s.name);
  const CL=allStudents.map(s=>s.scores);
  const sa=allStudents.map(s=>s.overall);
  const al=C.map((c,j)=>CL.map(s=>s[j]));
  const av=al.map(a=>a.reduce((x,y)=>x+y,0)/tot);
  const lo=al.map(a=>a.filter(v=>v<.4).length);
  const hi=al.map(a=>a.filter(v=>v>=.7).length);
  const ord=C.map((c,j)=>j).sort((a,b)=>lo[b]-lo[a]);
  const A=sa.reduce((x,y)=>x+y,0)/tot;

  const st=v=>v<.4?['At risk','var(--bad)']:v<.65?['Needs support','var(--mid)']:['On track','var(--good)'];
  const cell=v=>`<div style="background:${col(v)};color:#fff">${Math.round(v*100)}</div>`;
  const tile=(l,v,g)=>`<div class="card" style="margin:0;background:${g}"><div class="sub" style="font-size:.8rem">${l}</div><div style="font-size:1.9rem;font-weight:600">${v}</div></div>`;

  const mc={};
  allStudents.forEach(sObj=>{
    if(sObj.misconceptions){
      Object.entries(sObj.misconceptions).forEach(([k,cnt])=>{mc[k]=(mc[k]||0)+cnt;});
    }
    sObj.scores.forEach((v,j)=>{
      const id=C[j].id;
      if(R[id]){
        if(v<.5&&!sObj.isReal)mc[R[id][1][1]]=(mc[R[id][1][1]]||0)+1;
        if(v<.35&&!sObj.isReal)mc[R[id][2][1]]=(mc[R[id][2][1]]||0)+1;
      }
    });
  });

  let sd=7+Number(S.k);
  const rd=()=>(sd=(sd*9301+49297)%233280)/233280;
  const mcs=Object.entries(mc).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const wk=[...Array(6)].map((_,i)=>Math.min(.95,A*(.7+.06*i)+(rd()-.5)*.03));
  const X=i=>20+i*72,Y=v=>115-v*100;
  const d='M'+X(0)+' '+Y(wk[0])+wk.slice(1).map((v,i)=>{const a=X(i),b=X(i+1);return` C${(a+b)/2} ${Y(wk[i])},${(a+b)/2} ${Y(v)},${b} ${Y(v)}`}).join('');
  const idx=allStudents.map((_,i)=>i).filter(i=>T.f=='All'||st(sa[i])[0]==T.f);
  const sel=T.sel;
  const realCount=allStudents.filter(s=>s.isReal).length;

  return`<div class="row">
    <h2 style="margin:0">Class ${S.k} · teacher overview</h2>
    <div style="margin-left:auto;display:flex;gap:8px;align-items:center">
      ${realCount?`<span class="pill" style="background:#10b981;color:#fff">${realCount} Live Student${realCount>1?'s':''} Linked</span>`:''}
      <button class="btn alt" style="padding:4px 10px;font-size:.8rem" onclick="fetchTeacherClassData(${S.k});draw()">↻ Refresh</button>
      <select style="width:130px;margin:0" onchange="setClass(+this.value);T.sel=-1;if(typeof fetchTeacherClassData==='function')fetchTeacherClassData(+this.value);draw()" aria-label="Change class">${clsOpts(S.k)}</select>
    </div>
  </div>
  <p class="sub">${tot} students (${realCount} live student${realCount==1?'':'s'} linked from quizzes) · NCERT Mathematics</p>

  <div class="g4">
    ${tile('Class average',pc(A),'linear-gradient(145deg,#d9f4ff,#ebe0ff)')}
    ${tile('At risk',sa.filter(v=>v<.4).length+` of ${tot}`,'linear-gradient(145deg,#ffe0e6,#ffeede)')}
    ${tile('On track',sa.filter(v=>v>=.65).length+` of ${tot}`,'linear-gradient(145deg,#d9f7ea,#e6f4ff)')}
    ${tile('Misconceptions flagged',Object.values(mc).reduce((x,y)=>x+y,0),'linear-gradient(145deg,#fff0d9,#f1e2ff)')}
  </div>

  <div class="g2" style="margin-top:16px">
    <div class="card">
      <h3>Class mastery trend (6 weeks)</h3>
      <svg viewBox="0 0 400 130" width="100%" role="img" aria-label="Class mastery trend">
        <defs>
          <linearGradient id="tg" x1="0" x2="1"><stop offset="0" stop-color="#22d3ee"/><stop offset=".5" stop-color="#8b5cf6"/><stop offset="1" stop-color="#ec4899"/></linearGradient>
          <linearGradient id="ta" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a78bfa" stop-opacity=".45"/><stop offset="1" stop-color="#a78bfa" stop-opacity="0"/></linearGradient>
        </defs>
        ${[0,.5,1].map(v=>`<line x1="10" x2="390" y1="${Y(v)}" y2="${Y(v)}" stroke="#c4b2ee" stroke-dasharray="3 4"/>`).join('')}
        <path d="${d} L${X(5)} ${Y(0)} L${X(0)} ${Y(0)} Z" fill="url(#ta)"/>
        <path d="${d}" fill="none" stroke="url(#tg)" stroke-width="4" stroke-linecap="round"/>
        ${wk.map((v,i)=>`<circle cx="${X(i)}" cy="${Y(v)}" r="4.5" fill="#fff" stroke="${col(v)}" stroke-width="3"/><text class="dk" x="${X(i)}" y="128" text-anchor="middle" font-size="9">W${i+1}</text>`).join('')}
      </svg>
    </div>
    <div class="card">
      <h3>Who is where, by concept</h3>
      <div style="max-height:300px;overflow:auto">${C.map((c,j)=>`<div class="row"><span>${c.n}</span><div class="bar" style="display:flex"><i style="width:${lo[j]/tot*100}%;background:var(--bad)"></i><i style="width:${(tot-lo[j]-hi[j])/tot*100}%;background:var(--mid)"></i><i style="width:${hi[j]/tot*100}%;background:var(--good)"></i></div></div>`).join('')}</div>
      <p class="sub" style="font-size:.78rem">Red: below 40% · amber: 40 to 70% · green: 70%+</p>
    </div>
  </div>

  <div class="g2">
    <div class="card">
      <h3>Where to reteach</h3>
      ${ord.slice(0,3).map(j=>{const id=C[j].id;return`<div class="warn"><b>${C[j].n}</b>: ${lo[j]} of ${tot} below 40%<br>Common misconception: ${R[id]?M[R[id][1][1]][0].toLowerCase():'needs review'}.<br><button class="btn alt" style="padding:4px 12px;margin-top:6px" onclick="asg('${id}',3)">Assign practice</button></div>`}).join('')}
    </div>
    <div class="card">
      <h3>Most common misconceptions in the class</h3>
      ${mcs.length?mcs.map(([k,v])=>`<div style="margin:9px 0"><div style="display:flex;justify-content:space-between;font-size:.85rem"><span>${M[k]?M[k][0]:k}</span><b>${v}</b></div><div class="bar"><i style="width:${v/(mcs[0][1]||1)*100}%;background:linear-gradient(90deg,#22d3ee,#8b5cf6,#ec4899)"></i></div><div class="sub" style="font-size:.78rem">${M[k]?M[k][1]:''}</div></div>`).join(''):'<p class="sub">No misconceptions recorded yet.</p>'}
    </div>
  </div>

  <div class="g2">
    <div class="card">
      <h3>Suggested small groups</h3>
      ${ord.slice(0,3).map((j,g)=>{const n=allStudents.filter((x,i)=>al[j][i]<.4).map(x=>x.rawName||x.name);return`<div class="warn"><b>Group ${'ABC'[g]}: ${C[j].n}</b><br>${n.length?n.slice(0,6).join(', ')+(n.length>6?` +${n.length-6} more`:''):'No students below 40%'}</div>`}).join('')}
    </div>
    <div class="card">
      <h3>Assign practice</h3>
      <div class="row">
        <select id="ac" style="margin:0">${C.map(c=>`<option value="${c.id}">${c.n}</option>`).join('')}</select>
        <select id="ad" style="margin:0;width:150px"><option value="3">Due in 3 days</option><option value="7">Due in 7 days</option></select>
      </div>
      <button class="btn" onclick="asg($('#ac').value,$('#ad').value)">Assign to class</button>
      ${T.as.length?T.as.map(a=>`<div class="hwi" style="cursor:default"><span>${N[a.c]||a.c}<small>Due in ${a.d} days · ${(String(a.c).length*13+a.d*7)%60+20}% completed</small></span></div>`).join(''):'<p class="sub">No assignments yet.</p>'}
    </div>
  </div>

  <div class="card">
    <div class="row">
      <h3 style="margin:0">Students (${tot})</h3>
      <span class="sub" style="margin-left:auto">${realCount} live student${realCount>1?'s':''} taking quizzes</span>
    </div>
    <div style="margin:8px 0">${['All','At risk','Needs support','On track'].map(f=>`<button class="btn ${T.f==f?'':'off'}" style="padding:4px 14px;margin:2px" onclick="T.f='${f}';draw()">${f}</button>`).join('')}</div>
    <div style="max-height:360px;overflow:auto">
      ${idx.map(i=>{
        const stObj=allStudents[i];
        return `<div class="row" style="${stObj.isReal?'background:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:8px 12px;margin-bottom:6px':''}">
          <span style="width:230px;font-size:.85rem;font-weight:${stObj.isReal?'600':'400'}">
            ${stObj.isReal?`<span class="pill" style="background:#10b981;color:#fff;font-size:.68rem;padding:2px 6px">LIVE STUDENT</span> `:''}${stObj.name}
          </span>
          <div class="bar"><i style="width:${sa[i]*100}%;background:${st(sa[i])[1]}"></i></div>
          <span style="width:120px;font-size:.78rem;font-weight:600;color:${st(sa[i])[1]}">${st(sa[i])[0]} (${pc(sa[i])})</span>
          <button class="btn ${stObj.isReal?'':'alt'}" style="padding:4px 12px;${stObj.isReal?'background:#0d9488':''}" onclick="T.sel=${i};draw()">${stObj.isReal?'View Child Details':'View'}</button>
        </div>`;
      }).join('')||'<p class="sub">No students in this group.</p>'}
    </div>
  </div>

  ${sel>=0 ? (()=>{
    const stObj=allStudents[sel];
    if(!stObj) return '';
    if(stObj.isReal){
      const s=stObj.scores;
      const w=s.indexOf(Math.min(...s));
      const wc=C[w];
      const misEntries=Object.entries(stObj.misconceptions||{}).sort((a,b)=>b[1]-a[1]);
      const topMis=misEntries[0];
      const misDesc=topMis&&M[topMis[0]]?M[topMis[0]]:(R[wc.id]?M[R[wc.id][1][1]]:null);

      return `<div class="card" style="background:linear-gradient(145deg,#f0fdf4,#f5f3ff);border:2px solid #86efac;margin-top:16px">
        <div class="row">
          <div>
            <span class="pill" style="background:#10b981;color:#fff">LIVE CHILD PROGRESS REPORT</span>
            <h2 style="margin:6px 0 2px">${stObj.rawName || stObj.name}</h2>
            <p class="sub" style="margin:0">Class ${S.k} · Overall Mastery: <b style="color:${col(sa[sel])}">${pc(sa[sel])}</b> · Questions Attempted: <b>${stObj.attempts.length}</b></p>
          </div>
          <button class="btn off" style="margin-left:auto;padding:6px 14px" onclick="T.sel=-1;draw()">✕ Close</button>
        </div>

        <h3 style="margin-top:16px">Concept-by-Concept Mastery</h3>
        <div style="max-height:220px;overflow:auto;background:rgba(255,255,255,0.75);border-radius:8px;padding:8px 12px">
          ${C.map((c,j)=>{
            const sc=s[j];
            const isTested=(stObj.t&&stObj.t[c.id])||(stObj.attempts&&stObj.attempts.some(a=>a.c===c.id));
            return `<div class="row" style="padding:4px 0">
              <span style="flex:1;font-size:.85rem">${c.n}</span>
              <div class="bar" style="flex:2;margin:0 12px"><i style="width:${sc*100}%;background:${col(sc)}"></i></div>
              <span style="width:50px;font-size:.85rem;font-weight:600;color:${col(sc)}">${pc(sc)}</span>
              <span class="pill" style="font-size:.7rem;padding:1px 6px">${isTested?'Tested':'Baseline'}</span>
            </div>`;
          }).join('')}
        </div>

        <div class="warn" style="margin-top:14px;background:#fff;border-left:4px solid var(--bad)">
          <b>Target Remediation for ${stObj.rawName || stObj.name}:</b> Weakest concept is <b>${wc.n}</b> (${pc(s[w])}).<br>
          ${misDesc ? `Detected Reasoning Misconception: <i>"${misDesc[0]}"</i> — ${misDesc[1]}<br>` : ''}
          <b>Recommended Next Step:</b> Assign targeted revision on ${wc.n} at Level ${diff(s[w])}.
          <div style="margin-top:8px">
            <button class="btn alt" style="padding:4px 12px" onclick="asg('${wc.id}',3);alert('Targeted practice on ${wc.n} assigned to ${stObj.rawName||stObj.name}!')">Assign Targeted Practice</button>
          </div>
        </div>

        <h3 style="margin-top:16px">Child's Quiz Attempts & Reasoning Checks (${stObj.attempts.length})</h3>
        ${stObj.attempts.length === 0 ? `<p class="sub">No quiz questions attempted yet in this session. When the child answers questions in the Diagnostic or AI Learning Room, every question, answer choice, and diagnostic reasoning check will appear here live.</p>` : `
          <div style="max-height:360px;overflow:auto;display:flex;flex-direction:column;gap:10px">
            ${[...stObj.attempts].reverse().map(att=>{
              const cName=N[att.c]||att.c;
              const isAnsOk=att.ok||att.correct;
              const isReasonOk=att.good||att.reasoning_correct;
              const ansText=att.ans||att.selected_answer||att.selectedAnswer||'Selected';
              const reasonText=att.reason||att.reasoning||(isReasonOk?'Sound reasoning':'Flawed reasoning');
              const ansMis=att.a||att.answer_misconception||att.answerMisconception;
              const resMis=att.r||att.reasoning_misconception||att.reasoningMisconception;
              const timeStr=att.time||(att.created_at?new Date(att.created_at).toLocaleTimeString():'Recent');

              let tagHtml='';
              if(isAnsOk&&isReasonOk){
                tagHtml=`<span class="pill" style="background:#10b981;color:#fff">✓ Mastered (Right Ans + Sound Reason)</span>`;
              }else if(isAnsOk&&!isReasonOk){
                tagHtml=`<span class="pill" style="background:#f59e0b;color:#fff">⚠ Hidden Gap (Right Ans, Flawed Reason)</span>`;
              }else if(!isAnsOk&&!isReasonOk){
                tagHtml=`<span class="pill" style="background:#ef4444;color:#fff">✗ Conceptual Error</span>`;
              }else{
                tagHtml=`<span class="pill" style="background:#6366f1;color:#fff">⚡ Slip / Calculation Error</span>`;
              }

              const misDetail=(resMis&&M[resMis])?M[resMis]:(ansMis&&M[ansMis]?M[ansMis]:null);

              return `<div class="card" style="margin:0;padding:12px;background:#fff;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
                <div class="row" style="margin-bottom:6px">
                  <span class="pill" style="font-weight:600">${cName}</span>
                  ${tagHtml}
                  <span class="sub" style="margin-left:auto;font-size:.78rem">${timeStr}</span>
                </div>
                <p style="font-size:.9rem;font-weight:500;margin:4px 0 8px">Q: ${att.q||att.question||'Quiz question'}</p>
                <div style="background:#f8fafc;padding:8px 10px;border-radius:6px;font-size:.82rem;display:flex;flex-direction:column;gap:4px">
                  <div><b>Student Answer:</b> <span style="color:${isAnsOk?'var(--good)':'var(--bad)'}">${ansText} (${isAnsOk?'Correct':'Incorrect'})</span></div>
                  <div><b>Student's Stated Reasoning:</b> <i>"${reasonText}"</i> (${isReasonOk?'<span style="color:var(--good)">Sound</span>':'<span style="color:var(--bad)">Flawed</span>'})</div>
                  ${misDetail?`<div class="warn" style="margin:6px 0 0;padding:6px 10px;font-size:.8rem"><b>Flagged Misconception:</b> ${misDetail[0]}<br><span class="sub">${misDetail[1]}</span></div>`:''}
                </div>
              </div>`;
            }).join('')}
          </div>
        `}
      </div>`;
    }else{
      const s=CL[sel],w=s.indexOf(Math.min(...s)),id=C[w].id;
      return `<div class="card" style="background:linear-gradient(145deg,#fff0d9,#f1e2ff)">
        <div class="row">
          <h3 style="margin:0">${NM[sel]}: ${pc(sa[sel])} overall</h3>
          <button class="btn off" style="margin-left:auto;padding:4px 12px" onclick="T.sel=-1;draw()">Close</button>
        </div>
        ${C.map((c,j)=>`<div class="row"><span>${c.n}</span><div class="bar"><i style="width:${s[j]*100}%;background:${col(s[j])}"></i></div><span style="width:40px">${pc(s[j])}</span></div>`).join('')}
        <div class="warn"><b>Likely misconception on ${C[w].n}:</b> ${R[id]?M[R[id][1][1]][0]:'needs review'}<br>Suggested next step: practise ${C[w].n} at level ${diff(s[w])}. ${R[id]?M[R[id][1][1]][1]:''}</div>
      </div>`;
    }
  })() : ''}

  ${(()=>{
    const activeConceptId=TQ_FILTER||(C[0]?C[0].id:'');
    const conceptCustomQs=CUSTOM_Q.filter(q=>Number(q.classLevel)===Number(S.k)&&(!TQ_FILTER||q.conceptId===TQ_FILTER));

    return `<div class="card" style="margin-top:20px;border:2px solid #8b5cf6;background:linear-gradient(145deg,#faf5ff,#fdf2f8)">
      <div class="row">
        <div>
          <span class="pill" style="background:#7c3aed;color:#fff;font-weight:700">TEACHER ONLY · QUESTION BANK</span>
          <h3 style="margin:6px 0 2px">Manage Questions (Class ${S.k} NCERT Syllabus)</h3>
          <p class="sub" style="margin:0">Add classroom questions or remove questions. These questions appear directly in student quizzes!</p>
        </div>
        <div style="margin-left:auto;display:flex;gap:8px;align-items:center">
          <label style="margin:0;font-size:.82rem">Filter Chapter:
            <select id="tq_filter" style="margin:0;padding:4px 8px" onchange="TQ_FILTER=this.value;draw()">
              <option value="">All Chapters (${C.length})</option>
              ${C.map(c=>`<option value="${c.id}" ${c.id===TQ_FILTER?'selected':''}>${c.n}</option>`).join('')}
            </select>
          </label>
        </div>
      </div>

      <!-- Active Questions in Bank -->
      <div style="margin-top:14px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <b>Active Classroom Questions (${conceptCustomQs.length} custom question${conceptCustomQs.length===1?'':'s'} in bank)</b>
        </div>
        ${conceptCustomQs.length===0?`
          <div style="background:#fff;padding:14px;border-radius:8px;border:1px dashed #c084fc;text-align:center">
            <p class="sub" style="margin:0">No custom questions added for this chapter yet. Standard NCERT AI generator questions are currently active. Use the form below to add questions.</p>
          </div>
        `:`
          <div style="display:flex;flex-direction:column;gap:10px;max-height:320px;overflow:auto">
            ${conceptCustomQs.map(q=>`
              <div style="background:#fff;padding:12px 14px;border-radius:8px;border:1px solid #ddd6fe;box-shadow:0 1px 3px rgba(0,0,0,0.06);display:flex;flex-direction:column;gap:6px">
                <div class="row" style="margin:0">
                  <span class="pill" style="background:#ede9fe;color:#6d28d9;font-weight:600">${N[q.conceptId]||q.conceptId}</span>
                  <span class="pill" style="font-size:.7rem">Level ${q.difficulty}</span>
                  <button class="btn" style="background:#ef4444;color:#fff;margin-left:auto;padding:3px 12px;font-size:.78rem" onclick="removeTeacherQuestion('${q.id}')">🗑️ Remove Question</button>
                </div>
                <div style="font-weight:600;font-size:.9rem;color:#1e1b4b">Q: ${q.stem}</div>
                <div style="display:flex;gap:6px;flex-wrap:wrap;font-size:.82rem">
                  <span class="pill" style="background:#dcfce7;color:#15803d;font-weight:600">✓ Correct: ${q.correct}</span>
                  ${(q.distractors||[]).map(d=>`<span class="pill" style="background:#f1f5f9;color:#475569">✗ ${d}</span>`).join('')}
                </div>
                <div style="font-size:.78rem;color:#4b5563;background:#faf5ff;padding:6px 10px;border-radius:6px">
                  <div><b>Sound Reasoning:</b> <i>"${q.soundReason}"</i></div>
                  <div style="margin-top:2px"><b>Flawed Reasoning (Trap):</b> <i>"${q.flawedReason}"</i></div>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>

      <!-- Add Question Form -->
      <div style="margin-top:16px;background:#fff;padding:16px;border-radius:10px;border:1px solid #c084fc">
        <h4 style="margin:0 0 10px;color:#6d28d9;display:flex;align-items:center;gap:6px">
          <span>➕ Add New Question for Students</span>
        </h4>
        <div class="row" style="gap:10px;margin-bottom:8px">
          <label style="flex:2">Target Chapter / Concept
            <select id="tq_c" style="margin:0">
              ${C.map(c=>`<option value="${c.id}" ${c.id===activeConceptId?'selected':''}>${c.n}</option>`).join('')}
            </select>
          </label>
          <label style="flex:1">Difficulty
            <select id="tq_diff" style="margin:0">
              <option value="1">Level 1 (Basic)</option>
              <option value="2">Level 2 (Medium)</option>
              <option value="3">Level 3 (Advanced)</option>
            </select>
          </label>
        </div>
        <label style="margin-bottom:8px">Question Stem (The Question Text)
          <input id="tq_stem" placeholder="e.g. Which fraction is equivalent to 2/3?" style="margin:0">
        </label>
        <div class="row" style="gap:10px;margin-bottom:8px">
          <label style="flex:1">Correct Answer
            <input id="tq_ans" placeholder="e.g. 4/6" style="margin:0;border:1px solid #86efac">
          </label>
          <label style="flex:1">Wrong Option 1 (Distractor)
            <input id="tq_d1" placeholder="e.g. 3/4" style="margin:0;border:1px solid #fca5a5">
          </label>
        </div>
        <div class="row" style="gap:10px;margin-bottom:8px">
          <label style="flex:1">Wrong Option 2
            <input id="tq_d2" placeholder="e.g. 5/6" style="margin:0">
          </label>
          <label style="flex:1">Wrong Option 3 (Optional)
            <input id="tq_d3" placeholder="e.g. 2/6" style="margin:0">
          </label>
        </div>
        <div class="row" style="gap:10px;margin-bottom:12px">
          <label style="flex:1">Sound Reasoning (Why it is correct)
            <input id="tq_sound" placeholder="e.g. Multiply numerator and denominator by 2: (2*2)/(3*2) = 4/6." style="margin:0">
          </label>
          <label style="flex:1">Flawed Reasoning (Common trap)
            <input id="tq_flawed" placeholder="e.g. Added 1 to numerator and denominator: (2+1)/(3+1) = 3/4." style="margin:0">
          </label>
        </div>
        <button class="btn" style="background:#7c3aed;color:#fff;width:100%;padding:10px;font-size:.95rem" onclick="addTeacherQuestion()">
          ✓ Save Question to Quiz Bank
        </button>
      </div>
    </div>`;
  })()}

  <div class="card" style="overflow-x:auto">
    <h3>Mastery heatmap (%)</h3>
    <div class="heat" style="min-width:600px;grid-template-columns:200px repeat(${C.length},1fr)">
      <div></div>
      ${C.map(c=>`<div>${c.n.split(' ')[0]}</div>`).join('')}
      ${S.done?`<div><b>You</b></div>${C.map(c=>cell(S.m[c.id])).join('')}`:''}
      ${CL.slice(0,10).map((s,i)=>`<div>${NM[i]}</div>${s.map(cell).join('')}`).join('')}
    </div>
  </div>
  <div class="card map">
    <h3>Class schedule & timetable</h3>
    ${calBoard()}
    ${calEdit()}
  </div>`;
},()=>calV(),()=>renderFlowchartView()];
function draw(){const sd=S.role=='student',it=sd?[['Dashboard',2],['Diagnostic',3],['Analysis',4],['Learning room',5],['Progress',6],['NCERT Flowcharts',9],['Calendar',8]]:[['Teacher view',7],['NCERT Flowcharts',9]],lv=1+Math.floor((S.done?avg():0)*9);
 if(V==1){$('#app').innerHTML=`<div class="login"><span class="logo">EduSpark.</span>${V_[0]()}</div>`;return}
 const pl=sd?[['Learn',2,'🎓'],['Practice',5,'🧠'],['Flowcharts',9,'🌳'],['Progress',6,'📈'],['Calendar',8,'📅'],['Exit',1,'↩']]:[['Teacher view',7,'📊'],['Flowcharts',9,'🌳'],['Exit',1,'↩']];
 $('#app').innerHTML=`<div class="shell"><aside><span class="logo">EduSpark.</span><div class="prof"><div class="av">${(S.name[0]||'S').toUpperCase()}</div><b>${S.name}</b><small>${sd?`Class ${S.k} · Lvl ${lv}`:'Teacher'}</small></div>${it.map(([n,i])=>`<button class="${V==i?'on':''}" onclick="go(${i})">${n}</button>`).join('')}<button class="out" onclick="go(1)">Log out</button></aside><section class="content">${V_[V-1]()}</section></div><div class="pillnav">${pl.map(([n,i,e])=>`<button class="${V==i?'on':''}" onclick="go(${i})"><span>${e}</span>${n}</button>`).join('')}</div>`}

// Shared class calendar (teacher edits, students read). Wired to SQLite database API.
let CAL=[],CALMODE='local',CW=0,CMSG='';
const ds=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'),SUBJ=['Mathematics','Science','English','Hindi','Social Science','Computer'],TC={Class:'#7b57b0',Test:'#e0566e',Practice:'#1fa3b8',Revision:'#d99a14'};
function sample(k){const o=[],d0=new Date();for(let i=0;i<7;i++){const d=new Date(d0);d.setDate(d0.getDate()+i);if(d.getDay()==0)continue;o.push({date:ds(d),time:'09:00',subject:'Mathematics',type:'Class',title:N[LIST[k][i%LIST[k].length]]||'Maths',cls:k},{date:ds(d),time:'10:30',subject:SUBJ[1+i%5],type:i%3==2?'Test':'Class',title:i%3==2?'Weekly test':'Regular class',cls:k});if(i%2==0)o.push({date:ds(d),time:'15:00',subject:'Mathematics',type:'Practice',title:'EduSpark practice session',cls:k})}return o}
CAL=[...Array(10)].flatMap((_,i)=>sample(i+1).map((e,j)=>({...e,id:'s'+i+'_'+j})));
async function loadCal(){
  try{
    const r=await fetch('/api/calendar',{headers:API_TOKEN?{Authorization:`Bearer ${API_TOKEN}`}:{}});
    if(r.ok){
      const data=await r.json();
      if(Array.isArray(data)&&data.length){CAL=data.map(d=>({...d,id:d.id,cls:d.class_level??d.cls}));CALMODE='db';draw();}
    }
  }catch(e){}
}
function calBoard(){const b=new Date();b.setDate(b.getDate()+CW*7-((b.getDay()+6)%7));const days=[...Array(7)].map((_,i)=>{const d=new Date(b);d.setDate(b.getDate()+i);return d}),tk=ds(new Date()),f=(d,o)=>d.toLocaleDateString('en-IN',o);
 return`<div class="row"><button class="btn off" style="padding:4px 14px" onclick="CW--;draw()" aria-label="Previous week">‹</button><b style="flex:1;text-align:center">${f(days[0],{day:'numeric',month:'short'})} to ${f(days[6],{day:'numeric',month:'short',year:'numeric'})}</b><button class="btn off" style="padding:4px 14px" onclick="CW++;draw()" aria-label="Next week">›</button></div><div class="wk">${days.map(d=>{const k=ds(d),ev=CAL.filter(e=>e.date==k&&(e.cls==S.k||e.cls==0)).sort((a,c)=>a.time<c.time?-1:1);return`<div class="dy ${k==tk?'td':''}"><b>${f(d,{weekday:'short'})} ${d.getDate()}${k==tk?' · today':''}</b>${ev.map(e=>`<div class="ev" style="background:${TC[e.type]||'#7b57b0'}"><small>${esc(e.time)} · ${esc(e.type)}</small><b>${esc(e.subject)}</b><span>${esc(e.title)}</span></div>`).join('')||'<span class="sub" style="font-size:.75rem">No class</span>'}</div>`}).join('')}</div><p class="sub" style="font-size:.78rem;margin-bottom:0">${Object.keys(TC).map(t=>`<span style="color:${TC[t]}">■</span> ${t}`).join('  ')}</p>`}
function wr(ev){
  fetch('/api/calendar',{
    method:'POST',
    headers:{'Content-Type':'application/json',...(API_TOKEN?{Authorization:`Bearer ${API_TOKEN}`}:{})},
    body:JSON.stringify({classLevel:ev.cls,date:ev.date,time:ev.time,subject:ev.subject,type:ev.type,title:ev.title})
  }).then(r=>r.json()).then(data=>{
    if(data.id){CAL.push({...data,id:data.id,cls:data.class_level??ev.cls});CMSG='Saved to database.';}
    else{CAL.push({...ev,id:'l'+Date.now()});CMSG='Added (local).';}
    draw();
  }).catch(()=>{CAL.push({...ev,id:'l'+Date.now()});CMSG='Added (local).';draw();});
}
function addEv(){const ev={date:$('#cd').value,time:$('#ct').value||'09:00',subject:$('#cs').value,type:$('#cy').value,title:$('#cn').value.trim()||$('#cy').value,cls:+$('#cc').value};if(!ev.date){CMSG='Pick a date first.';draw();return}wr(ev)}
function delEv(id){
  fetch(`/api/calendar/${id}`,{method:'DELETE',headers:API_TOKEN?{Authorization:`Bearer ${API_TOKEN}`}:{}}).catch(()=>{});
  CAL=CAL.filter(e=>e.id!=id);draw();
}
function addSample(){sample(S.k).forEach(wr)}
loadCal();
function calEdit(){const up=CAL.filter(e=>e.cls==S.k||e.cls==0).sort((a,b)=>(a.date+a.time)<(b.date+b.time)?-1:1).slice(0,40);
 return`<div class="card"><h3>Edit the calendar (teacher)</h3>${CALMODE=='db'&&!CE?'<div class="warn">You need Editor access to this page to save changes for students.</div>':''}<div class="g2" style="gap:12px"><div><label>Date<input id="cd" type="date" value="${ds(new Date())}"></label><label>Time<input id="ct" type="time" value="09:00"></label><label>Title<input id="cn" placeholder="e.g. Fractions revision"></label></div><div><label>Subject<select id="cs">${SUBJ.map(x=>`<option>${x}</option>`).join('')}</select></label><label>Type<select id="cy">${Object.keys(TC).map(x=>`<option>${x}</option>`).join('')}</select></label><label>For<select id="cc"><option value="${S.k}">Class ${S.k}</option><option value="0">All classes</option></select></label></div></div>
<button class="btn" onclick="addEv()">Add to calendar</button> <button class="btn alt" onclick="addSample()">Add a sample week for Class ${S.k}</button><p class="sub">${esc(CMSG)}</p><h3>Scheduled for Class ${S.k}</h3><div style="max-height:320px;overflow:auto">${up.map(e=>`<div class="row"><span style="width:auto;flex:1;font-size:.85rem">${esc(e.date)} ${esc(e.time)} · <b>${esc(e.subject)}</b> · ${esc(e.type)}: ${esc(e.title)}${e.cls==0?' (all classes)':''}</span><button class="btn off" style="padding:3px 12px" onclick="delEv('${esc(e.id)}')">Delete</button></div>`).join('')||'<p class="sub">Nothing scheduled yet.</p>'}</div></div>`}
const calV=()=>`<div class="row"><h2 style="margin:0">Class ${S.k} calendar</h2>${S.role=='teacher'?`<select style="width:130px;margin:0 0 0 auto" onchange="setClass(+this.value);draw()" aria-label="Change class">${clsOpts(S.k)}</select>`:''}</div><p class="sub">${CALMODE=='db'?'Shared calendar: when the teacher changes it, every student sees the update.':'Preview mode: changes stay on this device only.'}</p><div class="card">${calBoard()}</div>${S.role=='teacher'?calEdit():''}`;
setClass(6);draw();
