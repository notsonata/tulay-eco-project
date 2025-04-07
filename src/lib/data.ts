export type Barangay =
  | "Bagong Silang"
  | "Calendola"
  | "Cuyab"
  | "Estrella"
  | "G.S.I.S."
  | "Landayan"
  | "Langgam"
  | "Laram"
  | "Magsaysay"
  | "Narra"
  | "Nueva"
  | "Poblacion"
  | "Riverside"
  | "Rosario"
  | "Sampaguita Village"
  | "San Antonio"
  | "San Roque"
  | "San Vicente"
  | "Santo Niño"
  | "United Bayanihan"
  | "United Better Living";

export const BARANGAYS: Barangay[] = [
  "Bagong Silang",
  "Calendola",
  "Cuyab",
  "Estrella",
  "G.S.I.S.",
  "Landayan",
  "Langgam",
  "Laram",
  "Magsaysay",
  "Narra",
  "Nueva",
  "Poblacion",
  "Riverside",
  "Rosario",
  "Sampaguita Village",
  "San Antonio",
  "San Roque",
  "San Vicente",
  "Santo Niño",
  "United Bayanihan",
  "United Better Living"
];

export type IssueCategory =
  | "Illegal Dumping"
  | "Blocked Drainage/Canal"
  | "Water Pollution - Visual"
  | "Air Pollution - Visual/Odor"
  | "Uncollected Garbage"
  | "Damaged Public Facility"
  | "Lack of Shade/Tree Issue";

export const ISSUE_CATEGORIES: IssueCategory[] = [
  "Illegal Dumping",
  "Blocked Drainage/Canal",
  "Water Pollution - Visual",
  "Air Pollution - Visual/Odor",
  "Uncollected Garbage",
  "Lack of Shade/Tree Issue"
];

export type ReportStatus = "Reported" | "Verified" | "Invalid/Spam" | "Action Taken" | "Resolved";

export interface UserInfo {
  name: string;
  phoneNumber: string;
  barangay: Barangay;
}

export interface ReportImage {
  url: string;
  thumbnail: string;
}

export interface Report {
  id: string;
  reporterName: string;
  reporterPhoneNumber: string;
  reporterBarangay: Barangay;
  issueDescription: string;
  issueCategory: IssueCategory;
  latitude: number;
  longitude: number;
  street?: string;  // New field
  landmark?: string; // New field
  images: ReportImage[];
  status: ReportStatus;
  submissionTimestamp: string;
  lastUpdatedTimestamp: string;
  upvoteCount: number;
  commentCount: number;
}

export interface Comment {
  id: string;
  reportId: string;
  commenterName: string;
  commenterPhoneNumber: string;
  commenterBarangay: Barangay;
  commentText: string;
  commentTimestamp: string;
}

// Mock data for development
export const MOCK_REPORTS: Report[] = [
  {
    id: "1",
    reporterName: "Juan Dela Cruz",
    reporterPhoneNumber: "09123456789",
    reporterBarangay: "Landayan",
    issueDescription: "Large pile of garbage dumped near the creek. It's blocking water flow and causing bad odor in the area.",
    issueCategory: "Illegal Dumping",
    latitude: 14.355573,
    longitude: 121.055078,
    images: [
      {
        url: "https://www.esc.nsw.gov.au/__data/assets/image/0011/164873/varieties/bannerLrg.jpg",
        thumbnail: "https://www.esc.nsw.gov.au/__data/assets/image/0011/164873/varieties/bannerLrg.jpg"
      }
    ],
    status: "Reported",
    submissionTimestamp: "2025-04-01T10:30:00Z",
    lastUpdatedTimestamp: "2025-04-01T10:30:00Z",
    upvoteCount: 5,
    commentCount: 2
  },
  {
    id: "2",
    reporterName: "Maria Santos",
    reporterPhoneNumber: "09876543210",
    reporterBarangay: "San Vicente",
    issueDescription: "Clogged canal causing flooding during rainy days. Water doesn't drain properly and creates stagnant pools.",
    issueCategory: "Blocked Drainage/Canal",
    latitude: 14.362342,
    longitude: 121.048741,
    images: [
      {
        url: "https://www.researchgate.net/profile/Lazarus-Justin/publication/344456427/figure/fig1/AS:942356937322507@1601686810670/Plastic-waste-blocking-drains.png",
        thumbnail: "https://www.researchgate.net/profile/Lazarus-Justin/publication/344456427/figure/fig1/AS:942356937322507@1601686810670/Plastic-waste-blocking-drains.png"
      }
    ],
    status: "Verified",
    submissionTimestamp: "2025-04-02T14:15:00Z",
    lastUpdatedTimestamp: "2025-04-03T09:20:00Z",
    upvoteCount: 12,
    commentCount: 3
  },
  {
    id: "3",
    reporterName: "Antonio Reyes",
    reporterPhoneNumber: "09123456788",
    reporterBarangay: "Rosario",
    issueDescription: "Factory emitting dark smoke throughout the day. Air quality is poor and residents are complaining of respiratory issues.",
    issueCategory: "Air Pollution - Visual/Odor",
    latitude: 14.358127,
    longitude: 121.062331,
    images: [
      {
        url: "https://www8.gmanews.tv/webpics/v3/2012/11/thumb-econ-pplant1.jpg",
        thumbnail: "https://www8.gmanews.tv/webpics/v3/2012/11/thumb-econ-pplant1.jpg"
      }
    ],
    status: "Action Taken",
    submissionTimestamp: "2025-03-28T08:45:00Z",
    lastUpdatedTimestamp: "2025-04-04T11:10:00Z",
    upvoteCount: 25,
    commentCount: 6
  },
  {
    id: "4",
    reporterName: "Elena Gomez",
    reporterPhoneNumber: "09187654321",
    reporterBarangay: "Santo Niño",
    issueDescription: "Water in the creek has turned greenish-black with visible oil slicks. Dead fish spotted floating on the surface.",
    issueCategory: "Water Pollution - Visual",
    latitude: 14.351982,
    longitude: 121.057266,
    images: [
      {
        url: "https://www.thegef.org/sites/default/files/Laguna-de-Bay-Tayuman-Bridge_870.jpg",
        thumbnail: "https://www.thegef.org/sites/default/files/Laguna-de-Bay-Tayuman-Bridge_870.jpg"
      }
    ],
    status: "Resolved",
    submissionTimestamp: "2025-03-25T16:20:00Z",
    lastUpdatedTimestamp: "2025-04-02T13:45:00Z",
    upvoteCount: 18,
    commentCount: 4
  },
  {
    id: "5",
    reporterName: "Ramon Ortega",
    reporterPhoneNumber: "09765432109",
    reporterBarangay: "Narra",
    issueDescription: "Community playground equipment is damaged. The slide has sharp edges and some bolts are loose, creating safety hazards for children.",
    issueCategory: "Damaged Public Facility",
    latitude: 14.364520,
    longitude: 121.053185,
    images: [
      {
        url: "https://i0.wp.com/www.middleeastmonitor.com/wp-content/uploads/2024/10/GettyImages-2160516358.jpg?fit=1200%2C800&ssl=1",
        thumbnail: "https://i0.wp.com/www.middleeastmonitor.com/wp-content/uploads/2024/10/GettyImages-2160516358.jpg?fit=1200%2C800&ssl=1"
      }
    ],
    status: "Verified",
    submissionTimestamp: "2025-04-03T09:10:00Z",
    lastUpdatedTimestamp: "2025-04-04T08:30:00Z",
    upvoteCount: 8,
    commentCount: 2
  }
];

export const MOCK_COMMENTS: Comment[] = [
  {
    id: "1",
    reportId: "1",
    commenterName: "Pedro Penduko",
    commenterPhoneNumber: "09123498765",
    commenterBarangay: "Landayan",
    commentText: "I also saw this yesterday. It's getting worse and attracting stray animals.",
    commentTimestamp: "2025-04-01T15:45:00Z"
  },
  {
    id: "2",
    reportId: "1",
    commenterName: "Linda Garcia",
    commenterPhoneNumber: "09567891234",
    commenterBarangay: "Landayan",
    commentText: "This has been a problem for weeks now. Please address this issue asap.",
    commentTimestamp: "2025-04-02T09:30:00Z"
  },
  {
    id: "3",
    reportId: "2",
    commenterName: "Miguel Castro",
    commenterPhoneNumber: "09234567891",
    commenterBarangay: "San Vicente",
    commentText: "During the last heavy rain, the water reached our doorsteps because of this clogged canal.",
    commentTimestamp: "2025-04-02T18:20:00Z"
  },
  {
    id: "4",
    reportId: "2",
    commenterName: "Sophia Rivera",
    commenterPhoneNumber: "09876123456",
    commenterBarangay: "San Roque",
    commentText: "This affects the neighboring barangays too. We need proper drainage maintenance.",
    commentTimestamp: "2025-04-03T10:15:00Z"
  },
  {
    id: "5",
    reportId: "3",
    commenterName: "Ronaldo Mendoza",
    commenterPhoneNumber: "09654321987",
    commenterBarangay: "Rosario",
    commentText: "My children have been coughing because of this. The smoke is worst in the evenings.",
    commentTimestamp: "2025-03-29T19:45:00Z"
  }
];

// Mock Admin Users
export const MOCK_ADMINS = [
  {
    username: "admin",
    password: "admin123", // Note: In a real app, never store passwords in plain text
  },
];

// API simulation functions (temporary for MVP)
let reports = [...MOCK_REPORTS];
let comments = [...MOCK_COMMENTS];

// Utility function to create a new ID
const createId = () => Math.random().toString(36).substring(2, 9);

// Simulated API functions
export const fetchReports = () => {
  return Promise.resolve([...reports]);
};

export const fetchReportById = (id: string) => {
  const report = reports.find((r) => r.id === id);
  if (!report) return Promise.reject(new Error("Report not found"));
  return Promise.resolve({ ...report });
};

// Update the createReport function to support the new fields
export const createReport = (reportData: Omit<Report, "id" | "submissionTimestamp" | "lastUpdatedTimestamp" | "upvoteCount" | "commentCount" | "status">) => {
  const newReport: Report = {
    ...reportData,
    id: createId(),
    submissionTimestamp: new Date().toISOString(),
    lastUpdatedTimestamp: new Date().toISOString(),
    upvoteCount: 0,
    commentCount: 0,
    status: "Reported"
  };
  
  reports = [newReport, ...reports];
  return Promise.resolve({ ...newReport });
};

export const upvoteReport = (id: string) => {
  const reportIndex = reports.findIndex((r) => r.id === id);
  if (reportIndex === -1) return Promise.reject(new Error("Report not found"));
  
  reports[reportIndex] = {
    ...reports[reportIndex],
    upvoteCount: reports[reportIndex].upvoteCount + 1,
    lastUpdatedTimestamp: new Date().toISOString()
  };
  
  return Promise.resolve({ ...reports[reportIndex] });
};

export const fetchCommentsByReportId = (reportId: string) => {
  const reportComments = comments.filter((c) => c.reportId === reportId);
  return Promise.resolve([...reportComments]);
};

export const createComment = (commentData: Omit<Comment, "id" | "commentTimestamp">) => {
  const newComment: Comment = {
    ...commentData,
    id: createId(),
    commentTimestamp: new Date().toISOString()
  };
  
  comments = [newComment, ...comments];
  
  // Update comment count for the report
  const reportIndex = reports.findIndex((r) => r.id === commentData.reportId);
  if (reportIndex !== -1) {
    reports[reportIndex] = {
      ...reports[reportIndex],
      commentCount: reports[reportIndex].commentCount + 1,
      lastUpdatedTimestamp: new Date().toISOString()
    };
  }
  
  return Promise.resolve({ ...newComment });
};

export const updateReportStatus = (id: string, status: ReportStatus) => {
  const reportIndex = reports.findIndex((r) => r.id === id);
  if (reportIndex === -1) return Promise.reject(new Error("Report not found"));
  
  reports[reportIndex] = {
    ...reports[reportIndex],
    status,
    lastUpdatedTimestamp: new Date().toISOString()
  };
  
  return Promise.resolve({ ...reports[reportIndex] });
};

export const deleteReport = (id: string) => {
  const reportIndex = reports.findIndex((r) => r.id === id);
  if (reportIndex === -1) return Promise.reject(new Error("Report not found"));
  
  const deletedReport = reports[reportIndex];
  reports = reports.filter((r) => r.id !== id);
  
  // Also delete associated comments
  comments = comments.filter((c) => c.reportId !== id);
  
  return Promise.resolve({ ...deletedReport });
};

export const deleteComment = (id: string) => {
  const commentIndex = comments.findIndex((c) => c.id === id);
  if (commentIndex === -1) return Promise.reject(new Error("Comment not found"));
  
  const deletedComment = comments[commentIndex];
  comments = comments.filter((c) => c.id !== id);
  
  // Update comment count for the report
  const reportIndex = reports.findIndex((r) => r.id === deletedComment.reportId);
  if (reportIndex !== -1 && reports[reportIndex].commentCount > 0) {
    reports[reportIndex] = {
      ...reports[reportIndex],
      commentCount: reports[reportIndex].commentCount - 1,
      lastUpdatedTimestamp: new Date().toISOString()
    };
  }
  
  return Promise.resolve({ ...deletedComment });
};

export const verifyAdmin = (username: string, password: string) => {
  const admin = MOCK_ADMINS.find(
    (a) => a.username === username && a.password === password
  );
  
  if (admin) {
    return Promise.resolve({ success: true });
  } else {
    return Promise.reject(new Error("Invalid credentials"));
  }
};
