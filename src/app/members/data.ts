export interface UserMetadata {
  id: string;
  email: string;
  memberType: string;
  firstName: string;
  lastName: string;
  fullName: string;
  country: string;
  university: string;
  major: string;
  schoolYear: string;
  discordUsername: string;
  githubUrl: string;
  linkedinUrl: string;
  personalWebsite: string;
  flowerProfile: string;
  roles: string[];
  level?: number;
  points?: number;
}

export const membersData: UserMetadata[] = [
  {
    id: "1",
    email: "john.doe@example.com",
    memberType: "member",
    firstName: "John",
    lastName: "Doe",
    fullName: "John Doe",
    country: "USA",
    university: "Michigan State University",
    major: "Computer Science",
    schoolYear: "Junior",
    discordUsername: "johnd",
    githubUrl: "https://github.com/johndoe",
    linkedinUrl: "https://linkedin.com/in/johndoe",
    personalWebsite: "https://johndoe.com",
    flowerProfile: "/flowers/1/lvl3.png",
    roles: ["member", "project lead"],
    level: 3,
    points: 1500
  },
  {
    id: "2",
    email: "jane.smith@example.com",
    memberType: "admin",
    firstName: "Jane",
    lastName: "Smith",
    fullName: "Jane Smith",
    country: "Canada",
    university: "University of Toronto",
    major: "Artificial Intelligence",
    schoolYear: "Senior",
    discordUsername: "janes",
    githubUrl: "https://github.com/janesmith",
    linkedinUrl: "https://linkedin.com/in/janesmith",
    personalWebsite: "https://janesmith.com",
    flowerProfile: "/flowers/2/lvl4.png",
    roles: ["admin", "mentor"],
    level: 4,
    points: 2200
  },
  {
    id: "3",
    email: "mike.johnson@example.com",
    memberType: "member",
    firstName: "Mike",
    lastName: "Johnson",
    fullName: "Mike Johnson",
    country: "UK",
    university: "University of Cambridge",
    major: "Data Science",
    schoolYear: "Sophomore",
    discordUsername: "mikej",
    githubUrl: "https://github.com/mikejohnson",
    linkedinUrl: "https://linkedin.com/in/mikejohnson",
    personalWebsite: "",
    flowerProfile: "/flowers/3/lvl2.png",
    roles: ["member"],
    level: 2,
    points: 800
  },
  {
    id: "4",
    email: "emily.brown@example.com",
    memberType: "member",
    firstName: "Emily",
    lastName: "Brown",
    fullName: "Emily Brown",
    country: "Australia",
    university: "University of Melbourne",
    major: "Machine Learning",
    schoolYear: "Freshman",
    discordUsername: "emilyb",
    githubUrl: "https://github.com/emilybrown",
    linkedinUrl: "",
    personalWebsite: "https://emilybrown.net",
    flowerProfile: "/flowers/4/lvl1.png",
    roles: ["member", "event organizer"],
    level: 1,
    points: 300
  },
  {
    id: "5",
    email: "alex.wong@example.com",
    memberType: "member",
    firstName: "Alex",
    lastName: "Wong",
    fullName: "Alex Wong",
    country: "Singapore",
    university: "National University of Singapore",
    major: "Robotics",
    schoolYear: "Senior",
    discordUsername: "alexw",
    githubUrl: "https://github.com/alexwong",
    linkedinUrl: "https://linkedin.com/in/alexwong",
    personalWebsite: "",
    flowerProfile: "/flowers/5/lvl3.png",
    roles: ["member", "workshop leader"],
    level: 3,
    points: 1700
  },
  {
    id: "6",
    email: "sarah.lee@example.com",
    memberType: "admin",
    firstName: "Sarah",
    lastName: "Lee",
    fullName: "Sarah Lee",
    country: "South Korea",
    university: "Seoul National University",
    major: "Natural Language Processing",
    schoolYear: "Graduate",
    discordUsername: "sarahlee",
    githubUrl: "https://github.com/sarahlee",
    linkedinUrl: "https://linkedin.com/in/sarahlee",
    personalWebsite: "https://sarahlee.dev",
    flowerProfile: "/flowers/1/lvl5.png",
    roles: ["admin", "research lead"],
    level: 5,
    points: 3000
  },
  {
    id: "7",
    email: "david.miller@example.com",
    memberType: "member",
    firstName: "David",
    lastName: "Miller",
    fullName: "David Miller",
    country: "Germany",
    university: "Technical University of Munich",
    major: "Computer Vision",
    schoolYear: "Junior",
    discordUsername: "davidm",
    githubUrl: "https://github.com/davidmiller",
    linkedinUrl: "",
    personalWebsite: "",
    flowerProfile: "/flowers/2/lvl2.png",
    roles: ["member"],
    level: 2,
    points: 950
  },
  {
    id: "8",
    email: "emma.wilson@example.com",
    memberType: "member",
    firstName: "Emma",
    lastName: "Wilson",
    fullName: "Emma Wilson",
    country: "France",
    university: "École Polytechnique",
    major: "Applied Mathematics",
    schoolYear: "Sophomore",
    discordUsername: "emmaw",
    githubUrl: "https://github.com/emmawilson",
    linkedinUrl: "https://linkedin.com/in/emmawilson",
    personalWebsite: "https://emmawilson.fr",
    flowerProfile: "/flowers/3/lvl3.png",
    roles: ["member", "tutor"],
    level: 3,
    points: 1600
  },
  {
    id: "9",
    email: "ryan.garcia@example.com",
    memberType: "member",
    firstName: "Ryan",
    lastName: "Garcia",
    fullName: "Ryan Garcia",
    country: "Spain",
    university: "University of Barcelona",
    major: "Deep Learning",
    schoolYear: "Senior",
    discordUsername: "ryang",
    githubUrl: "https://github.com/ryangarcia",
    linkedinUrl: "https://linkedin.com/in/ryangarcia",
    personalWebsite: "",
    flowerProfile: "/flowers/4/lvl4.png",
    roles: ["member", "project manager"],
    level: 4,
    points: 2400
  },
  {
    id: "10",
    email: "olivia.chen@example.com",
    memberType: "member",
    firstName: "Olivia",
    lastName: "Chen",
    fullName: "Olivia Chen",
    country: "China",
    university: "Tsinghua University",
    major: "AI Ethics",
    schoolYear: "Graduate",
    discordUsername: "oliviac",
    githubUrl: "https://github.com/oliviachen",
    linkedinUrl: "https://linkedin.com/in/oliviachen",
    personalWebsite: "https://oliviachen.cn",
    flowerProfile: "/flowers/5/lvl3.png",
    roles: ["member", "ethics committee"],
    level: 3,
    points: 1800
  },
  {
    id: "11",
    email: "daniel.kim@example.com",
    memberType: "member",
    firstName: "Daniel",
    lastName: "Kim",
    fullName: "Daniel Kim",
    country: "USA",
    university: "Stanford University",
    major: "Quantum Computing",
    schoolYear: "Junior",
    discordUsername: "danielk",
    githubUrl: "https://github.com/danielkim",
    linkedinUrl: "",
    personalWebsite: "",
    flowerProfile: "/flowers/1/lvl2.png",
    roles: ["member"],
    level: 2,
    points: 900
  },
  {
    id: "12",
    email: "sophia.taylor@example.com",
    memberType: "admin",
    firstName: "Sophia",
    lastName: "Taylor",
    fullName: "Sophia Taylor",
    country: "UK",
    university: "Imperial College London",
    major: "Robotics and AI",
    schoolYear: "Senior",
    discordUsername: "sophiat",
    githubUrl: "https://github.com/sophiataylor",
    linkedinUrl: "https://linkedin.com/in/sophiataylor",
    personalWebsite: "https://sophiataylor.co.uk",
    flowerProfile: "/flowers/2/lvl5.png",
    roles: ["admin", "outreach coordinator"],
    level: 5,
    points: 2800
  },
  {
    id: "13",
    email: "ethan.nguyen@example.com",
    memberType: "member",
    firstName: "Ethan",
    lastName: "Nguyen",
    fullName: "Ethan Nguyen",
    country: "Vietnam",
    university: "Vietnam National University",
    major: "Natural Language Processing",
    schoolYear: "Sophomore",
    discordUsername: "ethann",
    githubUrl: "https://github.com/ethannguyen",
    linkedinUrl: "https://linkedin.com/in/ethannguyen",
    personalWebsite: "",
    flowerProfile: "/flowers/3/lvl2.png",
    roles: ["member", "translator"],
    level: 2,
    points: 1100
  },
  {
    id: "14",
    email: "ava.martinez@example.com",
    memberType: "member",
    firstName: "Ava",
    lastName: "Martinez",
    fullName: "Ava Martinez",
    country: "Mexico",
    university: "National Autonomous University of Mexico",
    major: "Computer Graphics",
    schoolYear: "Freshman",
    discordUsername: "avam",
    githubUrl: "https://github.com/avamartinez",
    linkedinUrl: "",
    personalWebsite: "https://avamartinez.mx",
    flowerProfile: "/flowers/4/lvl1.png",
    roles: ["member"],
    level: 1,
    points: 400
  },
  {
    id: "15",
    email: "liam.wang@example.com",
    memberType: "member",
    firstName: "Liam",
    lastName: "Wang",
    fullName: "Liam Wang",
    country: "Canada",
    university: "University of Waterloo",
    major: "Data Science",
    schoolYear: "Senior",
    discordUsername: "liamw",
    githubUrl: "https://github.com/liamwang",
    linkedinUrl: "https://linkedin.com/in/liamwang",
    personalWebsite: "",
    flowerProfile: "/flowers/5/lvl4.png",
    roles: ["member", "data analyst"],
    level: 4,
    points: 2100
  },
  {
    id: "16",
    email: "zoe.adams@example.com",
    memberType: "member",
    firstName: "Zoe",
    lastName: "Adams",
    fullName: "Zoe Adams",
    country: "Australia",
    university: "University of Sydney",
    major: "AI in Healthcare",
    schoolYear: "Graduate",
    discordUsername: "zoea",
    githubUrl: "https://github.com/zoeadams",
    linkedinUrl: "https://linkedin.com/in/zoeadams",
    personalWebsite: "https://zoeadams.com.au",
    flowerProfile: "/flowers/1/lvl3.png",
    roles: ["member", "healthcare liaison"],
    level: 3,
    points: 1900
  },
  {
    id: "17",
    email: "lucas.silva@example.com",
    memberType: "member",
    firstName: "Lucas",
    lastName: "Silva",
    fullName: "Lucas Silva",
    country: "Brazil",
    university: "University of São Paulo",
    major: "Reinforcement Learning",
    schoolYear: "Junior",
    discordUsername: "lucass",
    githubUrl: "https://github.com/lucassilva",
    linkedinUrl: "",
    personalWebsite: "",
    flowerProfile: "/flowers/2/lvl2.png",
    roles: ["member"],
    level: 2,
    points: 850
  },
  {
    id: "18",
    email: "mia.tanaka@example.com",
    memberType: "admin",
    firstName: "Mia",
    lastName: "Tanaka",
    fullName: "Mia Tanaka",
    country: "Japan",
    university: "University of Tokyo",
    major: "Human-Computer Interaction",
    schoolYear: "Senior",
    discordUsername: "miat",
    githubUrl: "https://github.com/miatanaka",
    linkedinUrl: "https://linkedin.com/in/miatanaka",
    personalWebsite: "https://miatanaka.jp",
    flowerProfile: "/flowers/3/lvl5.png",
    roles: ["admin", "UI/UX lead"],
    level: 5,
    points: 3100
  },
  {
    id: "19",
    email: "noah.patel@example.com",
    memberType: "member",
    firstName: "Noah",
    lastName: "Patel",
    fullName: "Noah Patel",
    country: "India",
    university: "Indian Institute of Technology Bombay",
    major: "Computer Vision",
    schoolYear: "Sophomore",
    discordUsername: "noahp",
    githubUrl: "https://github.com/noahpatel",
    linkedinUrl: "https://linkedin.com/in/noahpatel",
    personalWebsite: "",
    flowerProfile: "/flowers/4/lvl2.png",
    roles: ["member", "research assistant"],
    level: 2,
    points: 1200
  },
  {
    id: "20",
    email: "isabella.mueller@example.com",
    memberType: "member",
    firstName: "Isabella",
    lastName: "Mueller",
    fullName: "Isabella Mueller",
    country: "Germany",
    university: "RWTH Aachen University",
    major: "Autonomous Systems",
    schoolYear: "Graduate",
    discordUsername: "isabellam",
    githubUrl: "https://github.com/isabellamueller",
    linkedinUrl: "https://linkedin.com/in/isabellamueller",
    personalWebsite: "https://isabellamueller.de",
    flowerProfile: "/flowers/5/lvl4.png",
    roles: ["member", "robotics team lead"],
    level: 4,
    points: 2600
  }
];