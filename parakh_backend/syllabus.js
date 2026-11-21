// Structured NCERT-aligned syllabus outline for Parakh flowcharts.
// Use chapter/topic/subtopic nodes; verify annual editions and state-specific rationalisation before production.
const subjectsByClass = {
  1: {
    Mathematics: [['Numbers and Counting',['counting','number names','compare numbers']],['Addition and Subtraction',['joining and adding','taking away','number stories']],['Shapes and Space',['2D shapes','3D objects','position and direction']],['Measurement',['length','weight','capacity','time']],['Patterns and Data',['repeating patterns','sorting','picture data']]],
    English: [['Listening and Speaking',['sounds and rhymes','conversation','story retelling']],['Reading',['letters and words','picture reading','short stories']],['Writing',['letter formation','words and sentences','creative drawing and writing']]],
    Hindi: [['भाषा और ध्वनि',['वर्ण पहचान','स्वर और व्यंजन','ध्वनि अभ्यास']],['पठन',['शब्द पढ़ना','चित्र-पठन','छोटी कहानियाँ']],['लेखन',['वर्ण और शब्द लेखन','सरल वाक्य','रचनात्मक लेखन']]],
    EVS: [['Myself and Family',['body parts','family members','feelings and care']],['My Surroundings',['home and school','neighbourhood','plants and animals']],['Health and Safety',['food and water','cleanliness','safe habits']]]
  },
  2: {
    Mathematics: [['Numbers',['place value','number comparison','number patterns']],['Operations',['addition with regrouping','subtraction with regrouping','multiplication as groups']],['Shapes and Measurement',['shapes and solids','length and weight','time and money']],['Data and Patterns',['repeating patterns','sorting and tallying']]],
    English: [['Oral Language',['listening','conversation','recitation']],['Reading',['phonics and fluency','comprehension','poems and stories']],['Writing and Grammar',['sentences','nouns and pronouns','guided paragraphs']]],
    Hindi: [['पठन-पाठन',['कविता और कहानी','शब्दार्थ','समझकर पढ़ना']],['व्याकरण',['संज्ञा का परिचय','लिंग और वचन','सरल वाक्य']],['लेखन',['वाक्य लेखन','चित्र-वर्णन','अनुच्छेद']]],
    EVS: [['Family and Community',['relationships','people at work','community helpers']],['Living World',['plants','animals','food habits']],['Places and Travel',['home and school','transport','directions']],['Health',['water','shelter','hygiene']]]
  },
  3: {
    Mathematics: [['Numbers',['place value','rounding and comparison','number patterns']],['Four Operations',['addition and subtraction','multiplication','division']],['Fractions and Measurement',['equal parts','length and mass','capacity and time','money']],['Geometry and Data',['2D and 3D shapes','perimeter intuition','tables and pictographs']]],
    English: [['Reading',['stories and poems','comprehension','vocabulary']],['Grammar',['nouns and verbs','adjectives','pronouns','punctuation']],['Writing and Speaking',['paragraphs','letters and descriptions','oral presentation']]],
    Hindi: [['पाठ और कविता',['कहानी-पठन','कविता-पठन','शब्दार्थ']],['भाषा-अध्ययन',['संज्ञा','क्रिया','विशेषण','विराम चिह्न']],['अभिव्यक्ति',['अनुच्छेद','पत्र','चित्र-वर्णन']]],
    EVS: [['Family and Friends',['relationships','work and play','care and sharing']],['Food and Water',['food sources','cooking','water use and conservation']],['Shelter and Travel',['houses','materials','transport and maps']],['Plants and Animals',['plant parts','animal homes','living together']]]
  },
  4: {
    Mathematics: [['Numbers and Operations',['large numbers','four operations','estimation']],['Multiples and Fractions',['multiples and factors','fractions','decimal introduction']],['Geometry',['angles and shapes','symmetry','maps and views']],['Measurement and Data',['length mass capacity','time and money','perimeter and area intuition','data handling']]],
    English: [['Literature',['stories','poems','drama and dialogue']],['Language',['parts of speech','tense in context','sentence types']],['Composition',['paragraph writing','letters','descriptions and summaries']]],
    Hindi: [['साहित्य',['कहानियाँ','कविताएँ','संवाद']],['व्याकरण',['संज्ञा-सर्वनाम','क्रिया-काल','वाक्य और विराम']],['रचना',['अनुच्छेद','पत्र','कहानी लेखन']]],
    EVS: [['People and Places',['family and community','maps and directions','travel']],['Natural Resources',['water','soil','plants and forests']],['Life and Work',['food and farming','animals','occupations and crafts']],['Health and Environment',['shelter','waste','health and safety']]]
  },
  5: {
    Mathematics: [['Numbers',['large numbers','operations and estimation','factors and multiples']],['Fractions and Decimals',['equivalent fractions','operations with fractions','decimal notation']],['Geometry',['angles','triangles and quadrilaterals','symmetry and patterns']],['Measurement and Data',['area and perimeter','volume intuition','time and money','charts']]],
    English: [['Literature',['prose','poetry','plays']],['Grammar and Vocabulary',['word classes','tense','connectors and punctuation']],['Writing and Communication',['paragraph and story','letters and emails','reports and presentations']]],
    Hindi: [['साहित्य-पठन',['गद्य','पद्य','नाटक/संवाद']],['व्याकरण',['शब्द-भेद','काल','वाक्य-रचना']],['लेखन-कौशल',['कहानी','पत्र','वर्णन और सार']]],
    EVS: [['Family and Society',['diversity','community and work','rights and responsibilities']],['Earth and Resources',['water and land','plants and animals','natural resources']],['Science in Daily Life',['food and health','materials','travel and communication']],['Environment',['ecosystems','waste management','conservation']]]
  },
  6: {
    Mathematics: [['Knowing Our Numbers',['large numbers','estimation']],['Whole Numbers and Integers',['number line','operations','properties']],['Playing with Numbers',['factors and multiples','prime and composite','divisibility']],['Fractions and Decimals',['equivalence','comparison','operations']],['Basic Geometry',['points lines angles','triangles and quadrilaterals','3D shapes']],['Mensuration and Data',['perimeter and area','data handling','patterns']]],
    Science: [['Food',['components of food','nutrients and tests','balanced diet']],['Materials',['sorting materials','separation methods','changes around us']],['Living World',['plants','body movement','habitats']],['Motion and Measurement',['standard units','measurement','motion']],['Light and Electricity',['shadows and reflections','electric circuits','magnets']],['Water Air and Waste',['water cycle','air around us','waste and environment']]],
    "Social Science": [['History',['what is history','early humans','first farmers and cities']],['Geography',['Earth and globes','latitudes and longitudes','motions of Earth']],['Civics',['diversity','government','local administration']]],
    English: [['Reading',['prose and poetry','comprehension']],['Language',['grammar in context','vocabulary']],['Writing',['paragraphs','letters','creative writing']]],
    Hindi: [['वसंत/साहित्य',['गद्य-पाठ','कविता','पठन-बोध']],['व्याकरण',['शब्द-भेद','वाक्य','विराम-चिह्न']],['रचना',['अनुच्छेद','पत्र','रचनात्मक लेखन']]]
  },
  7: {
    Mathematics: [['Integers and Rational Numbers',['operations','number line','properties']],['Fractions Decimals and Percent',['operations','conversion','applications']],['Algebra',['expressions','simple equations','identities intuition']],['Geometry',['lines and angles','triangles','congruence','symmetry']],['Mensuration and Data',['perimeter and area','data handling','mean and probability intuition']]],
    Science: [['Nutrition and Respiration',['nutrition in plants','nutrition in animals','respiration']],['Transport and Excretion',['transport in plants','circulation','excretion']],['Heat and Acids',['temperature and heat','acids bases indicators']],['Motion and Forces',['speed','force and pressure','friction']],['Light and Electricity',['reflection','electric current and effects']],['Environment',['weather and climate','soil','water cycle','forests and wastewater']]],
    "Social Science": [['History',['medieval societies','kingdoms and empires','architecture and culture']],['Geography',['environment','inside Earth','air and water','natural vegetation']],['Civics',['equality','state government','media','markets']]],
    English: [['Literature',['stories and poems','comprehension']],['Grammar',['tense','modifiers','sentence structure']],['Writing',['descriptive writing','letters','reports']]],
    Hindi: [['साहित्य',['गद्य','पद्य','पठन-बोध']],['व्याकरण',['संज्ञा-सर्वनाम','क्रिया-काल','वाक्य-विचार']],['रचना',['पत्र','अनुच्छेद','संवाद']]]
  },
  8: {
    Mathematics: [['Rational Numbers',['properties','operations','number representation']],['Powers and Squares',['exponents','squares and square roots','cubes and cube roots']],['Algebra',['linear equations','identities','factorisation']],['Geometry',['quadrilaterals','practical geometry','mensuration']],['Data and Proportion',['direct and inverse proportion','graphs','data handling']],['Comparing Quantities',['percentages','profit loss discount','interest']]],
    Science: [['Matter',['materials and fibres','metals and non-metals','coal and petroleum','combustion']],['Living Systems',['cell','microorganisms','reproduction in animals','adolescence']],['Force and Energy',['force and pressure','friction','sound','electric effects']],['Light and Space',['light','stars and solar system']],['Environment',['conservation','pollution','natural phenomena']]],
    "Social Science": [['History',['company rule','colonial administration','rural and tribal life','reform and nationalism']],['Geography',['resources','land soil water','agriculture','industries','human resources']],['Civics',['constitution','secularism','parliament','judiciary','marginalisation']]],
    English: [['Literature',['prose','poetry','drama']],['Language',['grammar and usage','vocabulary']],['Writing',['formal and informal letters','essays','reports and dialogue']]],
    Hindi: [['साहित्य',['गद्य-पद्य','पठन-बोध']],['व्याकरण',['वाक्य-रचना','काल और वाच्य','अलंकार/मुहावरे']],['लेखन',['निबंध','पत्र','संवाद']]]
  },
  9: {
    Mathematics: [['Number Systems',['real numbers','rational and irrational numbers','exponents']],['Algebra',['polynomials','linear equations in two variables']],['Coordinate Geometry',['Cartesian plane','plotting points']],['Geometry',['Euclid geometry','lines and angles','triangles','quadrilaterals','circles']],['Mensuration and Statistics',['Heron formula','surface area and volume','statistics and probability']]],
    Science: [['Matter',['states of matter','mixtures and separation','atoms and molecules']],['Living World',['cell','tissues','diversity of organisms']],['Motion and Force',['motion graphs','Newton laws','gravitation']],['Energy and Sound',['work and energy','sound']],['Natural Resources',['environment','food resources','improvement in food resources']]],
    "Social Science": [['History',['French Revolution','Russian Revolution','Nazism','forest society','pastoralists']],['Geography',['India size and location','physical features','drainage','climate','vegetation and wildlife','population']],['Political Science',['democracy','constitution','elections','institutions','rights']],['Economics',['village economy','people as resource','poverty','food security']]],
    English: [['Literature',['Beehive prose and poetry','Moments supplementary reading']],['Language',['grammar and vocabulary','reading comprehension']],['Writing',['descriptive and narrative writing','formal letters','articles and reports']]],
    Hindi: [['साहित्य',['क्षितिज/स्पर्श पाठ','काव्य-पाठ','पूरक पठन']],['व्याकरण',['शब्द और पद','उपसर्ग-प्रत्यय','वाक्य-भेद']],['रचना',['अनुच्छेद','पत्र','संवाद और सूचना']]]
  },
  10: {
    Mathematics: [['Real Numbers',['Euclid division lemma','fundamental theorem of arithmetic','irrationality']],['Algebra',['polynomials','pair of linear equations','quadratic equations','arithmetic progressions']],['Coordinate Geometry',['distance formula','section formula']],['Geometry',['triangles and similarity','circles and tangents']],['Trigonometry',['ratios','identities','heights and distances']],['Mensuration and Statistics',['areas related to circles','surface area and volume','statistics','probability']]],
    Science: [['Chemistry',['chemical reactions','acids bases and salts','metals and non-metals','carbon compounds']],['Biology',['life processes','control and coordination','reproduction','heredity and evolution']],['Physics',['light reflection and refraction','human eye','electricity','magnetic effects']],['Environment',['energy sources','our environment','resource management']]],
    "Social Science": [['History',['nationalism in Europe','nationalism in India','global world','industrialisation','print culture']],['Geography',['resources','forest and wildlife','water','agriculture','minerals and energy','manufacturing','lifelines']],['Political Science',['power sharing','federalism','gender religion and caste','political parties','outcomes of democracy']],['Economics',['development','sectors','money and credit','globalisation','consumer rights']]],
    English: [['Literature',['First Flight prose and poetry','Footprints Without Feet']],['Language',['grammar and usage','reading comprehension']],['Writing',['formal letters','analytical paragraphs','creative and discursive writing']]],
    Hindi: [['साहित्य',['क्षितिज/स्पर्श गद्य','काव्य','पूरक पाठ']],['व्याकरण',['वाक्य-रचना','समास','पदबंध','मुहावरे']],['रचना',['औपचारिक पत्र','अनुच्छेद','विज्ञापन/सूचना लेखन']]]
  }
};

function toNodes(items, classLevel, subject) {
  return items.map(([title, children], i) => ({
    id: `c${classLevel}-${subject.toLowerCase().replace(/[^a-z0-9]+/g,'-')}-${i+1}`,
    title,
    type: 'chapter',
    children: children.map((name, j) => ({
      id: `c${classLevel}-${subject.toLowerCase().replace(/[^a-z0-9]+/g,'-')}-${i+1}-t${j+1}`,
      title: name,
      type: 'topic',
      children: []
    }))
  }));
}

const syllabus = Object.fromEntries(Object.entries(subjectsByClass).map(([level, subjects]) => [level, {
  classLevel: Number(level), board: 'NCERT-aligned outline', subjects: Object.entries(subjects).map(([name, chapters]) => ({
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), name,
    children: toNodes(chapters, Number(level), name)
  }))
}]));

module.exports = { syllabus };
