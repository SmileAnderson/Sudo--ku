import { TRAINING_DIFFICULTIES } from '../utils/constants.js';

// Training modules configuration
export const trainingModules = [
  {
    id: 'phishing',
    title: 'Phishing Defense Training',
    description: 'Learn to identify and defend against phishing attacks',
    difficulty: TRAINING_DIFFICULTIES.BEGINNER,
    duration: '15 min',
    color: '#3b82f6',
    objectives: [
      'Identify phishing email characteristics',
      'Understand social engineering tactics',
      'Learn proper response procedures',
      'Practice with real-world examples'
    ]
  },
  {
    id: 'passwords',
    title: 'Password Security Training',
    description: 'Master strong password creation and management',
    difficulty: TRAINING_DIFFICULTIES.BEGINNER,
    duration: '10 min',
    color: '#059669',
    objectives: [
      'Create strong, unique passwords',
      'Understand password manager benefits',
      'Learn multi-factor authentication',
      'Avoid common password mistakes'
    ]
  },
  {
    id: 'social-engineering',
    title: 'Social Engineering Awareness',
    description: 'Recognize and counter social engineering tactics',
    difficulty: TRAINING_DIFFICULTIES.INTERMEDIATE,
    duration: '20 min',
    color: '#f59e0b',
    objectives: [
      'Identify social engineering techniques',
      'Understand psychological manipulation',
      'Learn verification procedures',
      'Practice scenario-based responses'
    ]
  },
  {
    id: 'malware',
    title: 'Malware Prevention',
    description: 'Identify and prevent malware infections',
    difficulty: TRAINING_DIFFICULTIES.INTERMEDIATE,
    duration: '18 min',
    color: '#ef4444',
    objectives: [
      'Understand malware types and vectors',
      'Recognize infection symptoms',
      'Learn prevention techniques',
      'Understand incident response'
    ]
  },
  {
    id: 'data-protection',
    title: 'Data Protection Training',
    description: 'Protect sensitive data and ensure privacy compliance',
    difficulty: TRAINING_DIFFICULTIES.ADVANCED,
    duration: '25 min',
    color: '#8b5cf6',
    objectives: [
      'Understand data classification',
      'Learn encryption principles',
      'Master privacy regulations',
      'Implement data protection controls'
    ]
  },
  {
    id: 'incident-response',
    title: 'Incident Response Training',
    description: 'Learn effective incident response procedures',
    difficulty: TRAINING_DIFFICULTIES.ADVANCED,
    duration: '30 min',
    color: '#dc2626',
    objectives: [
      'Understand incident response phases',
      'Learn containment strategies',
      'Master communication protocols',
      'Practice decision-making scenarios'
    ]
  }
];

// Training questions organized by module
export const gameQuestions = {
  phishing: [
    {
      id: 1,
      question: "You receive an urgent email from your 'bank' asking you to verify your account immediately. What should you do?",
      options: [
        "Click the link immediately to secure your account",
        "Call your bank directly using their official number to verify",
        "Forward the email to your IT department first",
        "Reply with your account details to confirm identity"
      ],
      correct: 1,
      explanation: "Always verify requests independently through official channels. Banks never ask for account details via email."
    },
    {
      id: 2,
      question: "Which of these is the biggest red flag in a phishing email?",
      options: [
        "Professional company logo and formatting",
        "Urgent language with threats of account closure",
        "Your correct name in the greeting",
        "Links to the company's official website"
      ],
      correct: 1,
      explanation: "Phishing emails often use urgency and threats to pressure quick action without careful consideration."
    },
    {
      id: 3,
      question: "What should you do if you accidentally clicked a suspicious link?",
      options: [
        "Ignore it and hope nothing happens",
        "Immediately disconnect from the internet and report to IT",
        "Wait to see if anything suspicious occurs",
        "Run a virus scan next week"
      ],
      correct: 1,
      explanation: "Quick action can prevent further damage. Disconnect and report immediately to IT security team."
    },
    {
      id: 4,
      question: "How can you verify if an email is legitimate?",
      options: [
        "Check if it has your company logo",
        "Look for spelling and grammar errors only",
        "Verify sender through independent communication channel",
        "Trust it if it mentions your recent activities"
      ],
      correct: 2,
      explanation: "Always verify through independent channels like calling the official number or visiting the official website directly."
    },
    {
      id: 5,
      question: "What is 'spear phishing'?",
      options: [
        "Phishing emails sent to everyone in a company",
        "Targeted phishing attacks using personal information",
        "Phishing through social media only",
        "Phishing that uses spear-shaped graphics"
      ],
      correct: 1,
      explanation: "Spear phishing targets specific individuals using their personal information to make attacks more convincing."
    },
    {
      id: 6,
      question: "Which email sender is most suspicious?",
      options: [
        "security@yourbank.com",
        "noreply@company-name.com",
        "admin@company-security.net",
        "alerts@yourbankname.secure-login.com"
      ],
      correct: 3,
      explanation: "Suspicious domains often add extra words or use non-official domain extensions to mimic legitimate organizations."
    },
    {
      id: 7,
      question: "What should you check before clicking any link in an email?",
      options: [
        "The email subject line",
        "Hover over the link to see the actual URL destination",
        "The sender's profile picture",
        "The time the email was sent"
      ],
      correct: 1,
      explanation: "Always hover over links to see where they actually lead before clicking. The displayed text and actual URL often differ."
    },
    {
      id: 8,
      question: "If an email claims to be from your CEO asking for urgent wire transfer, you should:",
      options: [
        "Process the transfer immediately due to urgency",
        "Call or meet the CEO in person to verify the request",
        "Forward the email to the finance department",
        "Reply asking for more details"
      ],
      correct: 1,
      explanation: "High-value requests should always be verified through direct, in-person or phone contact with the requester."
    },
    {
      id: 9,
      question: "What is 'whaling' in cybersecurity?",
      options: [
        "Attacks targeting marine biology websites",
        "Large-scale phishing campaigns",
        "Phishing attacks specifically targeting executives",
        "Attacks that use whale images"
      ],
      correct: 2,
      explanation: "Whaling specifically targets high-value individuals like executives, using sophisticated techniques to steal credentials or money."
    },
    {
      id: 10,
      question: "Which attachment type is generally safest to open?",
      options: [
        ".exe executable files",
        ".scr screen saver files",
        ".pdf from unknown senders",
        ".txt plain text files from known contacts"
      ],
      correct: 3,
      explanation: "Plain text files from known contacts pose the lowest risk, while executable files should never be opened from emails."
    }
  ],

  passwords: [
    {
      id: 1,
      question: "What makes a password truly strong?",
      options: [
        "Using your birthday and pet's name",
        "12+ characters with mixed case, numbers, and symbols",
        "A simple word that's easy to remember",
        "Your favorite movie title"
      ],
      correct: 1,
      explanation: "Strong passwords are long (12+ characters) and use a mix of uppercase, lowercase, numbers, and special characters."
    },
    {
      id: 2,
      question: "How often should you change your passwords?",
      options: [
        "Every day to be extra safe",
        "Only when there's a known security breach",
        "Every 30 days without exception",
        "Every 90 days or when compromised"
      ],
      correct: 3,
      explanation: "Regular password changes (90 days) or immediate changes when compromised provide the best security balance."
    },
    {
      id: 3,
      question: "What's the best way to manage multiple strong passwords?",
      options: [
        "Write them down in a notebook",
        "Use the same password for everything",
        "Use a reputable password manager",
        "Store them in a text file on your computer"
      ],
      correct: 2,
      explanation: "Password managers generate, store, and auto-fill unique strong passwords securely."
    },
    {
      id: 4,
      question: "Which password is strongest?",
      options: [
        "Password123!",
        "Tr0ub4dor&3",
        "correct horse battery staple",
        "MyBirthday1985!"
      ],
      correct: 2,
      explanation: "Long passphrases with random words are often stronger and easier to remember than complex short passwords."
    },
    {
      id: 5,
      question: "What is two-factor authentication (2FA)?",
      options: [
        "Using two different passwords",
        "Having two user accounts",
        "Using password plus additional verification method",
        "Changing passwords twice per month"
      ],
      correct: 2,
      explanation: "2FA requires something you know (password) plus something you have (phone, token) or something you are (biometric)."
    },
    {
      id: 6,
      question: "Where should you never store passwords?",
      options: [
        "In a dedicated password manager",
        "In your browser's built-in password storage",
        "Written on sticky notes on your monitor",
        "In an encrypted file"
      ],
      correct: 2,
      explanation: "Physical notes visible to others pose a significant security risk. Use proper digital password storage instead."
    },
    {
      id: 7,
      question: "What should you do if you suspect your password has been compromised?",
      options: [
        "Wait a week to see if anything happens",
        "Change the password immediately",
        "Only change it if you see suspicious activity",
        "Change it next month during regular updates"
      ],
      correct: 1,
      explanation: "Immediate password changes when compromise is suspected can prevent unauthorized access and data theft."
    },
    {
      id: 8,
      question: "Which is the best backup method for 2FA?",
      options: [
        "SMS text messages only",
        "Backup codes stored securely",
        "Calling support when needed",
        "Using the same phone number everywhere"
      ],
      correct: 1,
      explanation: "Backup codes provide secure recovery options when primary 2FA methods are unavailable."
    },
    {
      id: 9,
      question: "What makes 'password spraying' attacks effective?",
      options: [
        "They use very complex passwords",
        "They target one account with many passwords",
        "They use common passwords against many accounts",
        "They only work on old systems"
      ],
      correct: 2,
      explanation: "Password spraying uses common weak passwords against many accounts to avoid account lockouts while finding weak credentials."
    },
    {
      id: 10,
      question: "When sharing accounts with team members, you should:",
      options: [
        "Share your personal password with them",
        "Create shared credentials managed by password manager",
        "Write the password on a whiteboard",
        "Send passwords via unencrypted email"
      ],
      correct: 1,
      explanation: "Shared accounts should use dedicated credentials managed through secure password sharing features in password managers."
    }
  ],

  'social-engineering': [
    {
      id: 1,
      question: "A caller claims to be from IT and asks for your password to 'fix your account'. What do you do?",
      options: [
        "Provide the password since they're from IT",
        "Hang up and call IT through official channels to verify",
        "Give them a hint about your password",
        "Ask them to call back later"
      ],
      correct: 1,
      explanation: "Legitimate IT staff never ask for passwords. Always verify through official channels."
    },
    {
      id: 2,
      question: "What is 'pretexting' in social engineering?",
      options: [
        "Sending text messages with malware",
        "Creating a fabricated scenario to engage victims",
        "Using fake websites to steal data",
        "Installing malicious software"
      ],
      correct: 1,
      explanation: "Pretexting involves creating a false scenario or identity to manipulate victims into revealing information."
    },
    {
      id: 3,
      question: "Someone claiming to be from your bank calls asking to verify your account details. You should:",
      options: [
        "Provide the information they request",
        "Hang up and call your bank's official number",
        "Ask them to email you instead",
        "Give partial information to test them"
      ],
      correct: 1,
      explanation: "Never provide sensitive information to incoming callers. Always initiate contact through official channels."
    },
    {
      id: 4,
      question: "What is 'baiting' in social engineering?",
      options: [
        "Offering something enticing to trigger curiosity",
        "Sending threatening messages",
        "Creating fake websites",
        "Using fishing metaphors in emails"
      ],
      correct: 0,
      explanation: "Baiting offers something attractive (like free software or USB drives) to entice victims into compromising actions."
    },
    {
      id: 5,
      question: "A person in your office lobby asks you to let them in because they 'forgot their badge'. You should:",
      options: [
        "Let them in since they seem to work here",
        "Ask them to wait while you verify with security",
        "Ignore them completely",
        "Give them directions to the front desk"
      ],
      correct: 1,
      explanation: "Physical security requires verification. Even helpful gestures can compromise building security."
    },
    {
      id: 6,
      question: "What psychological principle do social engineers often exploit?",
      options: [
        "People's desire to be helpful",
        "Fear of technology",
        "Love of complicated processes",
        "Preference for written communication"
      ],
      correct: 0,
      explanation: "Social engineers exploit natural human tendencies like helpfulness, authority respect, and fear to manipulate victims."
    },
    {
      id: 7,
      question: "An email threatens legal action unless you click a link immediately. This is likely:",
      options: [
        "A legitimate legal notice",
        "A social engineering attack using fear",
        "A system maintenance notification",
        "A software update request"
      ],
      correct: 1,
      explanation: "Fear-based urgency is a common social engineering tactic. Legitimate legal notices come through official channels."
    },
    {
      id: 8,
      question: "What is 'quid pro quo' in social engineering?",
      options: [
        "Latin phrases in phishing emails",
        "Offering a service in exchange for information",
        "Using quotes in malicious messages",
        "A type of malware"
      ],
      correct: 1,
      explanation: "Quid pro quo attacks offer help or services in exchange for information or access, like fake IT support calls."
    },
    {
      id: 9,
      question: "Someone calls claiming to conduct a 'security survey' asking about your company's systems. You should:",
      options: [
        "Answer their questions to be helpful",
        "Decline and report the call to security",
        "Ask them to email the questions",
        "Transfer them to your manager"
      ],
      correct: 1,
      explanation: "Unsolicited 'surveys' about security practices are often reconnaissance attempts. Report such calls."
    },
    {
      id: 10,
      question: "Which authority figure claim should make you most suspicious?",
      options: [
        "Your direct manager calling about a project",
        "Unknown 'federal agent' demanding immediate compliance",
        "Your IT department scheduling maintenance",
        "HR announcing policy changes"
      ],
      correct: 1,
      explanation: "Impersonating authority figures is common in social engineering. Verify claims through independent channels."
    }
  ],

  malware: [
    {
      id: 1,
      question: "Which of these is a common sign of malware infection?",
      options: [
        "Computer running normally",
        "Slow performance and unexpected pop-ups",
        "Fast internet browsing",
        "No changes in behavior"
      ],
      correct: 1,
      explanation: "Malware often causes slow performance, pop-ups, crashes, and unexpected behavior."
    },
    {
      id: 2,
      question: "What should you do if you suspect malware on your computer?",
      options: [
        "Continue working and ignore it",
        "Disconnect from network and report to IT immediately",
        "Try to remove it yourself first",
        "Restart the computer and hope it goes away"
      ],
      correct: 1,
      explanation: "Immediate isolation prevents spread to other systems. Report to IT for professional remediation."
    },
    {
      id: 3,
      question: "What is ransomware?",
      options: [
        "Software that improves computer performance",
        "Malware that encrypts files and demands payment",
        "A type of antivirus program",
        "Software for managing passwords"
      ],
      correct: 1,
      explanation: "Ransomware encrypts victim files and demands payment for decryption keys, often with no guarantee of recovery."
    },
    {
      id: 4,
      question: "Which file type is most likely to contain malware?",
      options: [
        ".txt text files",
        ".jpg image files",
        ".exe executable files",
        ".pdf document files"
      ],
      correct: 2,
      explanation: "Executable files (.exe) can run code directly and are commonly used to distribute malware."
    },
    {
      id: 5,
      question: "What is a 'trojan horse' in cybersecurity?",
      options: [
        "A large wooden horse statue",
        "Malware disguised as legitimate software",
        "A type of computer virus from Greece",
        "A security tool for protecting networks"
      ],
      correct: 1,
      explanation: "Trojans appear as legitimate software but contain hidden malicious functionality."
    },
    {
      id: 6,
      question: "How does malware typically spread through email?",
      options: [
        "By reading the email content",
        "Through malicious attachments or links",
        "By replying to emails",
        "Through the email header information"
      ],
      correct: 1,
      explanation: "Email malware spreads through infected attachments or links that download malicious code when opened."
    },
    {
      id: 7,
      question: "What is the difference between a virus and a worm?",
      options: [
        "Viruses are worse than worms",
        "Worms spread automatically, viruses need host files",
        "Viruses are newer than worms",
        "There is no difference"
      ],
      correct: 1,
      explanation: "Worms self-replicate across networks independently, while viruses attach to and spread through host files."
    },
    {
      id: 8,
      question: "What should you do if you receive a suspicious USB drive?",
      options: [
        "Plug it in to see what's on it",
        "Don't use it and report to IT security",
        "Use it only on an old computer",
        "Share it with colleagues first"
      ],
      correct: 1,
      explanation: "Unknown USB drives often contain malware and should never be used. Report findings to IT security."
    },
    {
      id: 9,
      question: "What is 'adware'?",
      options: [
        "Software that blocks advertisements",
        "Malware that displays unwanted advertisements",
        "A type of antivirus software",
        "Software for creating advertisements"
      ],
      correct: 1,
      explanation: "Adware displays unwanted ads, tracks user behavior, and can slow system performance."
    },
    {
      id: 10,
      question: "Which is the best protection against malware?",
      options: [
        "Only using expensive computers",
        "Multiple layers including antivirus, updates, and training",
        "Avoiding all internet use",
        "Using only mobile devices"
      ],
      correct: 1,
      explanation: "Effective malware protection requires multiple layers: antivirus, system updates, user training, and safe computing practices."
    }
  ],

  'data-protection': [
    {
      id: 1,
      question: "What is data classification?",
      options: [
        "Organizing files in folders",
        "Categorizing data based on sensitivity and protection requirements",
        "Deleting old files",
        "Backing up important data"
      ],
      correct: 1,
      explanation: "Data classification categorizes information based on sensitivity to apply appropriate protection measures."
    },
    {
      id: 2,
      question: "When should personal data be encrypted?",
      options: [
        "Only when sending emails",
        "Only when storing on removable media",
        "Both at rest and in transit",
        "Never, it's too complicated"
      ],
      correct: 2,
      explanation: "Personal data should be encrypted both when stored (at rest) and when transmitted (in transit)."
    },
    {
      id: 3,
      question: "What does GDPR require for data breach notifications?",
      options: [
        "Notification within 72 hours to authorities",
        "Notification within 30 days to authorities",
        "No notification required",
        "Only notify if asked by authorities"
      ],
      correct: 0,
      explanation: "GDPR requires data controllers to notify authorities within 72 hours of becoming aware of a breach."
    },
    {
      id: 4,
      question: "Which principle is fundamental to data protection?",
      options: [
        "Collect as much data as possible",
        "Data minimization - only collect what's necessary",
        "Store data indefinitely",
        "Share data freely within organization"
      ],
      correct: 1,
      explanation: "Data minimization means collecting only data that is necessary for specific, legitimate purposes."
    },
    {
      id: 5,
      question: "What is the 'right to be forgotten'?",
      options: [
        "Right to forget your password",
        "Right to have personal data deleted",
        "Right to forget training requirements",
        "Right to ignore data protection laws"
      ],
      correct: 1,
      explanation: "The right to erasure allows individuals to request deletion of their personal data under certain conditions."
    },
    {
      id: 6,
      question: "How should sensitive documents be disposed of?",
      options: [
        "Throw them in regular trash",
        "Secure shredding or incineration",
        "Leave them in recycling bins",
        "Store them indefinitely"
      ],
      correct: 1,
      explanation: "Sensitive documents must be securely destroyed through cross-cut shredding or secure incineration."
    },
    {
      id: 7,
      question: "What is 'data pseudonymization'?",
      options: [
        "Using fake names for employees",
        "Processing data so it can't identify individuals without additional info",
        "Creating backup copies of data",
        "Translating data into different languages"
      ],
      correct: 1,
      explanation: "Pseudonymization processes personal data so individuals cannot be identified without additional information."
    },
    {
      id: 8,
      question: "Who can access confidential customer data?",
      options: [
        "Anyone in the company",
        "Only employees with legitimate business need",
        "All managers regardless of department",
        "Anyone with computer access"
      ],
      correct: 1,
      explanation: "Access to sensitive data should be limited to those with legitimate business need and proper authorization."
    },
    {
      id: 9,
      question: "What should you do with customer data when leaving the company?",
      options: [
        "Take copies for future reference",
        "Delete all personal copies and return company data",
        "Share it with your replacement",
        "Keep it for potential freelance work"
      ],
      correct: 1,
      explanation: "All company data must be returned and personal copies deleted when employment ends."
    },
    {
      id: 10,
      question: "Which constitutes a data protection impact assessment (DPIA) trigger?",
      options: [
        "Processing employee email addresses",
        "Large-scale processing of sensitive personal data",
        "Storing customer names and addresses",
        "Processing publicly available information"
      ],
      correct: 1,
      explanation: "DPIAs are required for high-risk processing, especially large-scale processing of sensitive data."
    }
  ],

  'incident-response': [
    {
      id: 1,
      question: "What is the first step in incident response?",
      options: [
        "Notify the media",
        "Identify and contain the incident",
        "Fix all vulnerabilities",
        "Restore all systems immediately"
      ],
      correct: 1,
      explanation: "The first priority is to identify the scope and contain the incident to prevent further damage."
    },
    {
      id: 2,
      question: "Who should be notified first during a serious security incident?",
      options: [
        "All employees via email",
        "Social media followers",
        "Internal incident response team and management",
        "Customers and partners"
      ],
      correct: 2,
      explanation: "Internal teams must be notified first to coordinate response before external communications."
    },
    {
      id: 3,
      question: "What does 'containment' mean in incident response?",
      options: [
        "Putting the incident in a container",
        "Stopping the incident from spreading or causing more damage",
        "Documenting everything that happened",
        "Notifying all stakeholders"
      ],
      correct: 1,
      explanation: "Containment involves stopping the incident from spreading and preventing additional damage."
    },
    {
      id: 4,
      question: "When should you preserve evidence during an incident?",
      options: [
        "Only after the incident is resolved",
        "As soon as possible after detection",
        "Only if law enforcement requests it",
        "Never, focus on restoration"
      ],
      correct: 1,
      explanation: "Evidence should be preserved immediately to maintain its integrity for investigation and potential legal proceedings."
    },
    {
      id: 5,
      question: "What is the purpose of a 'lessons learned' meeting?",
      options: [
        "To assign blame for the incident",
        "To improve future incident response",
        "To celebrate successful resolution",
        "To plan marketing communications"
      ],
      correct: 1,
      explanation: "Lessons learned meetings identify improvements to prevent similar incidents and enhance response procedures."
    },
    {
      id: 6,
      question: "During incident response, communication should be:",
      options: [
        "Immediate and detailed to everyone",
        "Delayed until all facts are known",
        "Timely, accurate, and to appropriate audiences",
        "Limited to technical teams only"
      ],
      correct: 2,
      explanation: "Effective incident communication is timely, accurate, and targeted to appropriate stakeholders."
    },
    {
      id: 7,
      question: "What is 'business continuity' in incident response?",
      options: [
        "Continuing business as if nothing happened",
        "Maintaining critical business functions during and after incidents",
        "Focusing only on technical recovery",
        "Shutting down all operations"
      ],
      correct: 1,
      explanation: "Business continuity ensures critical business functions continue despite incidents or disasters."
    },
    {
      id: 8,
      question: "Who typically leads the incident response team?",
      options: [
        "The CEO always",
        "Any available employee",
        "A designated incident commander",
        "External consultants only"
      ],
      correct: 2,
      explanation: "A designated incident commander provides leadership and coordination during incident response."
    },
    {
      id: 9,
      question: "What should be included in incident documentation?",
      options: [
        "Only technical details",
        "Timeline, actions taken, decisions made, and lessons learned",
        "Just the final resolution",
        "Only financial impact"
      ],
      correct: 1,
      explanation: "Comprehensive documentation includes timeline, actions, decisions, impact, and lessons learned."
    },
    {
      id: 10,
      question: "When is an incident considered 'resolved'?",
      options: [
        "When the immediate threat is contained",
        "When normal operations are restored and vulnerabilities addressed",
        "When media attention dies down",
        "When the incident response team disbands"
      ],
      correct: 1,
      explanation: "Incidents are resolved when normal operations resume and underlying vulnerabilities are addressed to prevent recurrence."
    }
  ]
};

// Helper functions for training modules
export const getModuleById = (moduleId) => {
  return trainingModules.find(module => module.id === moduleId);
};

export const getModulesByDifficulty = (difficulty) => {
  return trainingModules.filter(module => module.difficulty === difficulty);
};

export const getQuestionsByModule = (moduleId) => {
  return gameQuestions[moduleId] || [];
};

export const calculateModuleScore = (answers, questions) => {
  if (!answers || !questions || questions.length === 0) return 0;
  
  const correctAnswers = answers.filter((answer, index) => {
    const question = questions[index];
    return question && answer === question.correct;
  }).length;
  
  return Math.round((correctAnswers / questions.length) * 100);
};

export const validateAnswer = (questionId, moduleId, selectedAnswer) => {
  const questions = getQuestionsByModule(moduleId);
  const question = questions.find(q => q.id === questionId);
  
  if (!question) return null;
  
  return {
    isCorrect: selectedAnswer === question.correct,
    correctAnswer: question.correct,
    explanation: question.explanation
  };
};

export const calculateCompletionTime = (startTime, endTime) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return Math.round((end - start) / 1000); // Return seconds
};

export const getModuleProgress = (completedModules, totalModules = trainingModules.length) => {
  return Math.round((completedModules.length / totalModules) * 100);
};

export const getNextModule = (completedModules) => {
  // Return next uncompleted module in order of difficulty
  const orderedModules = [
    'phishing',
    'passwords', 
    'social-engineering',
    'malware',
    'data-protection',
    'incident-response'
  ];
  
  return orderedModules.find(moduleId => !completedModules.includes(moduleId));
};

export const getModuleStats = (moduleId, userAnswers = []) => {
  const questions = getQuestionsByModule(moduleId);
  const module = getModuleById(moduleId);
  
  if (!questions.length || !userAnswers.length) {
    return {
      questionsTotal: questions.length,
      questionsAnswered: 0,
      correctAnswers: 0,
      score: 0,
      timeSpent: 0,
      module: module
    };
  }
  
  return {
    questionsTotal: questions.length,
    questionsAnswered: userAnswers.length,
    correctAnswers: correctCount,
    score: Math.round((correctCount / questions.length) * 100),
    timeSpent: totalTime,
    module: module
  };
};

export const getTotalQuestions = () => {
  return Object.values(gameQuestions).reduce((total, questions) => total + questions.length, 0);
};

export const getQuestionCount = (moduleId) => {
  const questions = getQuestionsByModule(moduleId);
  return questions.length;
};

export const isModuleComplete = (moduleId, completedModules) => {
  return completedModules.includes(moduleId);
};

export const getCompletionRate = (completedModules) => {
  return Math.round((completedModules.length / trainingModules.length) * 100);
};

export const getModuleOrder = () => {
  return trainingModules.map(module => module.id);
};

export const getRandomQuestion = (moduleId) => {
  const questions = getQuestionsByModule(moduleId);
  if (questions.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
};

export const shuffleQuestions = (moduleId) => {
  const questions = getQuestionsByModule(moduleId);
  const shuffled = [...questions];
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
};

export const getModuleDuration = (moduleId) => {
  const module = getModuleById(moduleId);
  return module ? module.duration : '0 min';
};

export const getModuleColor = (moduleId) => {
  const module = getModuleById(moduleId);
  return module ? module.color : '#64748b';
};

export const getModuleObjectives = (moduleId) => {
  const module = getModuleById(moduleId);
  return module ? module.objectives : [];
};

export const searchModules = (searchTerm) => {
  if (!searchTerm) return trainingModules;
  
  const term = searchTerm.toLowerCase();
  return trainingModules.filter(module => 
    module.title.toLowerCase().includes(term) ||
    module.description.toLowerCase().includes(term) ||
    module.objectives.some(obj => obj.toLowerCase().includes(term))
  );
};

export const getModulesByStatus = (completedModules) => {
  const completed = trainingModules.filter(module => 
    completedModules.includes(module.id)
  );
  
  const available = trainingModules.filter(module => 
    !completedModules.includes(module.id)
  );
  
  return { completed, available };
};