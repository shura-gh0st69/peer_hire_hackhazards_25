// Mock data for PeerHire platform
// This serves as a centralized data source to be replaced with MongoDB in the future

// Types for better TypeScript support
export interface User {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    completedJobs: number;
    skills: string[];
    online: boolean;
    email?: string;
    bio?: string;
    hourlyRate?: string;
    location?: string;
    joinedDate?: string;
    responseTime?: string;
    wallet?: string;
}

export interface Client {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    completedJobs: number;
    projectsPosted: number;
    email?: string;
    companySize?: string;
    industry?: string;
    location?: string;
    wallet?: string;
}

export interface Testimonial {
    id: string;
    name: string;
    role: string;
    avatar: string;
    content: string;
    rating: number;
    date?: string;
}

export interface Job {
    id: string;
    title: string;
    description: string;
    requirements: string;
    category: string;
    budget: string;
    deadline: string;
    createdAt: string;
    client: {
        id: string;
        name: string;
        avatar: string;
        rating: number;
        projectsPosted: number;
    };
    bids: number;
    status: "Open" | "In Progress" | "Completed" | "Cancelled";
    skills?: string[];
    duration?: string;
    complexity?: "Easy" | "Medium" | "Complex";
    attachments?: string[];
}

export interface Bid {
    id: string;
    jobId: string;
    freelancer: {
        id: string;
        name: string;
        avatar: string;
        rating: number;
        completedJobs: number;
        skills: string[];
    };
    amount: string;
    deliveryTime: string;
    proposal: string;
    status?: "Pending" | "Accepted" | "Rejected";
    submittedAt?: string;
}

export interface Message {
    id: string;
    conversationId: string;
    sender: "self" | "other";
    content: string;
    timestamp: string;
    read?: boolean;
    attachments?: string[];
}

export interface Conversation {
    id: string;
    participants: string[];
    user?: {
        id?: string;
        name: string;
        avatar: string;
        online: boolean;
    };
    lastMessage?: {
        content: string;
        timestamp: string;
        unread: boolean;
    };
    project: string;
    timestamp?: string;
    unread?: boolean;
}

export interface Contract {
    id: string;
    jobId: string;
    jobTitle: string;
    clientId: string;
    clientName: string;
    freelancerId: string;
    freelancerName: string;
    amount: string;
    startDate: string;
    endDate: string;
    status: "Active" | "Completed" | "Cancelled" | "Disputed" | "Pending";
    milestones?: Milestone[];
    escrowAddress?: string;
}

export interface Milestone {
    id: string;
    title: string;
    description: string;
    amount: string;
    dueDate: string;
    status: "Pending" | "In Progress" | "Completed" | "Released";
    submissions?: Submission[];
}

export interface Submission {
    id: string;
    description: string;
    attachments: string[];
    submittedAt: string;
    status: "Pending Review" | "Approved" | "Rejected";
}

export interface Payment {
    id: string;
    contractId: string;
    milestoneId?: string;
    amount: string;
    currency: string;
    timestamp: string;
    status: "Pending" | "Completed" | "Failed";
    txHash?: string;
    from: string;
    to: string;
    description: string;
}

export interface Review {
    id: string;
    contractId: string;
    fromUser: string;
    toUser: string;
    rating: number;
    comment: string;
    timestamp: string;
}

export interface ProjectVerification {
    id: string;
    milestoneId: string;
    recordings: string[];
    screenshots: string[];
    timestamp: string;
    status: "Submitted" | "Verified" | "Rejected";
    comments: string;
}

// Mock user data
export const users: User[] = [
    {
        id: "u1",
        name: "Alex Johnson",
        avatar: "https://i.pravatar.cc/150?img=1",
        rating: 4.8,
        completedJobs: 32,
        skills: ["React", "TypeScript", "Node.js", "Solidity"],
        online: true,
        email: "alex.johnson@example.com",
        bio: "Full stack developer with 5 years of experience specializing in React and blockchain technology.",
        hourlyRate: "0.05 ETH",
        location: "San Francisco, USA",
        joinedDate: new Date(2023, 5, 15).toISOString(),
        responseTime: "Under 2 hours",
        wallet: "0x1234...5678"
    },
    {
        id: "u2",
        name: "Samantha Lee",
        avatar: "https://i.pravatar.cc/150?img=2",
        rating: 4.9,
        completedJobs: 47,
        skills: ["UI/UX Design", "Figma", "Adobe XD", "Wireframing"],
        online: false,
        email: "samantha.lee@example.com",
        bio: "UI/UX designer with a passion for creating intuitive and beautiful user experiences.",
        hourlyRate: "0.04 ETH",
        location: "Toronto, Canada",
        joinedDate: new Date(2023, 2, 10).toISOString(),
        responseTime: "Under 1 hour",
        wallet: "0xabcd...efgh"
    },
    {
        id: "u3",
        name: "Michael Chen",
        avatar: "https://i.pravatar.cc/150?img=3",
        rating: 4.7,
        completedJobs: 28,
        skills: ["Solidity", "Smart Contracts", "DeFi", "EVM"],
        online: true,
        email: "michael.chen@example.com",
        bio: "Blockchain developer specialized in Solidity smart contracts and DeFi protocols.",
        hourlyRate: "0.06 ETH",
        location: "Singapore",
        joinedDate: new Date(2022, 11, 5).toISOString(),
        responseTime: "Same day",
        wallet: "0x9876...5432"
    },
    {
        id: "u4",
        name: "Emily Rodriguez",
        avatar: "https://i.pravatar.cc/150?img=4",
        rating: 4.6,
        completedJobs: 19,
        skills: ["React Native", "iOS", "Android", "Mobile Development"],
        online: true,
        email: "emily.rodriguez@example.com",
        bio: "Mobile app developer with expertise in React Native and native app development.",
        hourlyRate: "0.045 ETH",
        location: "Berlin, Germany",
        joinedDate: new Date(2023, 1, 20).toISOString(),
        responseTime: "Under 3 hours",
        wallet: "0xijkl...mnop"
    },
    {
        id: "u5",
        name: "David Kim",
        avatar: "https://i.pravatar.cc/150?img=60",
        rating: 4.8,
        completedJobs: 36,
        skills: ["Vue.js", "JavaScript", "CSS", "Front-end Development"],
        online: false,
        email: "david.kim@example.com",
        bio: "Frontend specialist with expert knowledge in Vue.js and modern CSS techniques.",
        hourlyRate: "0.042 ETH",
        location: "Seoul, South Korea",
        joinedDate: new Date(2022, 8, 12).toISOString(),
        responseTime: "Under 5 hours",
        wallet: "0xqrst...uvwx"
    },
    {
        id: "u6",
        name: "Lisa Wang",
        avatar: "https://i.pravatar.cc/150?img=30",
        rating: 5.0,
        completedJobs: 52,
        skills: ["Python", "Machine Learning", "Data Science", "TensorFlow"],
        online: true,
        email: "lisa.wang@example.com",
        bio: "AI and machine learning expert with a background in data science and blockchain analytics.",
        hourlyRate: "0.065 ETH",
        location: "New York, USA",
        joinedDate: new Date(2022, 6, 8).toISOString(),
        responseTime: "Under 2 hours",
        wallet: "0xyzab...cdef"
    }
];

// Mock client data
export const clients: Client[] = [
    {
        id: "c1",
        name: "TechStart Inc.",
        avatar: "https://i.pravatar.cc/150?img=5",
        rating: 4.7,
        completedJobs: 15,
        projectsPosted: 23,
        email: "contact@techstart.io",
        companySize: "11-50 employees",
        industry: "Blockchain Technology",
        location: "Austin, USA",
        wallet: "0x2468...1357"
    },
    {
        id: "c2",
        name: "BlockFin Ltd.",
        avatar: "https://i.pravatar.cc/150?img=6",
        rating: 4.9,
        completedJobs: 28,
        projectsPosted: 35,
        email: "projects@blockfin.com",
        companySize: "51-200 employees",
        industry: "DeFi",
        location: "London, UK",
        wallet: "0x1357...2468"
    },
    {
        id: "c3",
        name: "NFT Innovations",
        avatar: "https://i.pravatar.cc/150?img=8",
        rating: 4.9,
        completedJobs: 12,
        projectsPosted: 18,
        email: "team@nftinnovations.xyz",
        companySize: "2-10 employees",
        industry: "NFT & Digital Art",
        location: "Miami, USA",
        wallet: "0x7890...1234"
    },
    {
        id: "c4",
        name: "Web3 Ventures",
        avatar: "https://i.pravatar.cc/150?img=7",
        rating: 4.6,
        completedJobs: 9,
        projectsPosted: 14,
        email: "info@web3ventures.co",
        companySize: "11-50 employees",
        industry: "Web3 Infrastructure",
        location: "Lisbon, Portugal",
        wallet: "0x5678...9012"
    }
];

// Mock testimonials data
export const testimonials: Testimonial[] = [
    {
        id: "t1",
        name: "David Johnson",
        role: "Frontend Developer",
        avatar: "https://i.pravatar.cc/150?img=11",
        content: "PeerHire transformed how I find freelance work. The blockchain payment system ensures I get paid on time, every time.",
        rating: 5,
        date: new Date(2023, 9, 15).toISOString()
    },
    {
        id: "t2",
        name: "Sarah Williams",
        role: "UX Designer",
        avatar: "https://i.pravatar.cc/150?img=12",
        content: "The AI matching system helped me find projects perfectly aligned with my skills. I've doubled my client base since joining.",
        rating: 5,
        date: new Date(2023, 8, 22).toISOString()
    },
    {
        id: "t3",
        name: "Michael Chen",
        role: "Blockchain Engineer",
        avatar: "https://i.pravatar.cc/150?img=13",
        content: "Lower fees mean I keep more of what I earn. The Screenpipe integration helps showcase my design process to clients in a transparent way.",
        rating: 4,
        date: new Date(2023, 10, 5).toISOString()
    },
    {
        id: "t4",
        name: "Rachel Morgan",
        role: "Product Manager",
        avatar: "https://i.pravatar.cc/150?img=25",
        content: "As a client, PeerHire makes it easy to find qualified talent quickly and manage projects efficiently. The work verification features give me confidence in the deliverables.",
        rating: 5,
        date: new Date(2024, 0, 12).toISOString()
    }
];

// Mock jobs data
export const jobs: Job[] = [
    {
        id: "job1",
        title: "React Frontend Developer for DeFi Dashboard",
        description: "We are looking for an experienced React developer to build a decentralized finance dashboard that integrates with multiple blockchain protocols.",
        requirements: "At least 2 years of experience with React, familiarity with Web3 libraries, and experience with data visualization libraries.",
        category: "Frontend",
        budget: "0.8",
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        client: {
            id: "c1",
            name: "TechStart Inc.",
            avatar: "https://i.pravatar.cc/150?img=5",
            rating: 4.7,
            projectsPosted: 23
        },
        bids: 8,
        status: "Open",
        skills: ["React", "Web3", "JavaScript", "Data Visualization"],
        duration: "2 months",
        complexity: "Medium",
        attachments: ["project_brief.pdf", "ui_mockups.fig"]
    },
    {
        id: "job2",
        title: "Smart Contract Developer for NFT Marketplace",
        description: "Looking for a Solidity developer to build smart contracts for our NFT marketplace. The contracts should support ERC-721 and ERC-1155 standards.",
        requirements: "Strong knowledge of Solidity, experience with NFT-related contracts, and understanding of security best practices.",
        category: "Blockchain",
        budget: "1.2",
        deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days from now
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        client: {
            id: "c3",
            name: "NFT Innovations",
            avatar: "https://i.pravatar.cc/150?img=8",
            rating: 4.9,
            projectsPosted: 12
        },
        bids: 5,
        status: "Open",
        skills: ["Solidity", "ERC-721", "ERC-1155", "Smart Contracts", "Security"],
        duration: "1 month",
        complexity: "Complex",
        attachments: ["contract_specs.md", "architecture.png"]
    },
    {
        id: "job3",
        title: "Backend Developer for Blockchain API",
        description: "We need a backend developer to create a high-performance API that interfaces with multiple blockchain networks.",
        requirements: "Experience with Node.js, Express, blockchain RPC interfaces, and database design for high-performance APIs.",
        category: "Backend",
        budget: "0.9",
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        client: {
            id: "c2",
            name: "BlockFin Ltd.",
            avatar: "https://i.pravatar.cc/150?img=6",
            rating: 4.9,
            projectsPosted: 35
        },
        bids: 3,
        status: "Open",
        skills: ["Node.js", "Express", "API Development", "Database Design"],
        duration: "3 months",
        complexity: "Medium",
        attachments: ["api_requirements.doc"]
    },
    {
        id: "job4",
        title: "UI/UX Designer for Mobile Wallet App",
        description: "We need a designer to create a sleek and intuitive UI for our mobile cryptocurrency wallet application.",
        requirements: "Experience in mobile app design, understanding of cryptocurrency concepts, and ability to create user-friendly interfaces for complex functionality.",
        category: "Design",
        budget: "0.7",
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        client: {
            id: "c4",
            name: "Web3 Ventures",
            avatar: "https://i.pravatar.cc/150?img=7",
            rating: 4.6,
            projectsPosted: 14
        },
        bids: 6,
        status: "Open",
        skills: ["UI/UX", "Mobile Design", "Figma", "Crypto"],
        duration: "1.5 months",
        complexity: "Medium",
        attachments: ["current_design.fig", "requirements.pdf"]
    },
    {
        id: "job5",
        title: "Full Stack Developer for DAO Platform",
        description: "We're building a platform for DAOs to manage governance, treasury, and member coordination. Looking for a full-stack developer to join our team.",
        requirements: "Experience with React, Node.js, smart contracts integration, and Web3 authentication systems.",
        category: "Full Stack",
        budget: "1.5",
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        client: {
            id: "c1",
            name: "TechStart Inc.",
            avatar: "https://i.pravatar.cc/150?img=5",
            rating: 4.7,
            projectsPosted: 23
        },
        bids: 7,
        status: "Open",
        skills: ["React", "Node.js", "Web3", "TypeScript", "Smart Contracts"],
        duration: "4 months",
        complexity: "Complex",
        attachments: ["platform_spec.pdf"]
    },
    {
        id: "job6",
        title: "Smart Contract Audit for Token",
        description: "Need a security audit for our ERC-20 token with custom functionality.",
        requirements: "Must have previous experience in smart contract auditing and a strong understanding of security vulnerabilities in Solidity.",
        category: "Security",
        budget: "1.0",
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        client: {
            id: "c2",
            name: "BlockFin Ltd.",
            avatar: "https://i.pravatar.cc/150?img=6",
            rating: 4.9,
            projectsPosted: 35
        },
        bids: 5,
        status: "In Progress",
        skills: ["Solidity", "Smart Contract Security", "Auditing", "ERC-20"],
        duration: "2 weeks",
        complexity: "Complex",
        attachments: ["contract_code.sol"]
    }
];

// Mock bids data
export const bids: Bid[] = [
    {
        id: "bid1",
        jobId: "job1",
        freelancer: {
            id: "u1",
            name: "Alex Johnson",
            avatar: "https://i.pravatar.cc/150?img=1",
            rating: 4.8,
            completedJobs: 32,
            skills: ["React", "TypeScript", "Node.js", "Solidity"]
        },
        amount: "0.75",
        deliveryTime: "10 days",
        proposal: "I have extensive experience building DeFi dashboards with React and have integrated with protocols like Uniswap, Aave, and Compound. I can deliver a high-performance, responsive interface with real-time data visualization.",
        status: "Pending",
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: "bid2",
        jobId: "job1",
        freelancer: {
            id: "u4",
            name: "Emily Rodriguez",
            avatar: "https://i.pravatar.cc/150?img=4",
            rating: 4.6,
            completedJobs: 19,
            skills: ["React Native", "iOS", "Android", "React"]
        },
        amount: "0.78",
        deliveryTime: "12 days",
        proposal: "I've built multiple React applications for fintech companies and have the skills to create a beautiful, intuitive DeFi dashboard that your users will love. I'm familiar with all major Web3 libraries and can ensure the dashboard connects seamlessly to blockchain data.",
        status: "Pending",
        submittedAt: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: "bid3",
        jobId: "job2",
        freelancer: {
            id: "u3",
            name: "Michael Chen",
            avatar: "https://i.pravatar.cc/150?img=3",
            rating: 4.7,
            completedJobs: 28,
            skills: ["Solidity", "Smart Contracts", "DeFi", "EVM"]
        },
        amount: "1.1",
        deliveryTime: "15 days",
        proposal: "As a smart contract developer with 5+ years of experience, I've developed multiple NFT marketplaces on Ethereum and Layer 2 solutions. I can ensure your contracts are secure, gas-efficient, and implement all the features you need for a successful marketplace.",
        status: "Accepted",
        submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: "bid4",
        jobId: "job3",
        freelancer: {
            id: "u1",
            name: "Alex Johnson",
            avatar: "https://i.pravatar.cc/150?img=1",
            rating: 4.8,
            completedJobs: 32,
            skills: ["React", "TypeScript", "Node.js", "Solidity"]
        },
        amount: "0.85",
        deliveryTime: "25 days",
        proposal: "I've built several high-performance APIs that interface with Ethereum, Binance Smart Chain, and Polygon. I can create a scalable solution that handles multiple blockchain networks efficiently.",
        status: "Pending",
        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: "bid5",
        jobId: "job4",
        freelancer: {
            id: "u2",
            name: "Samantha Lee",
            avatar: "https://i.pravatar.cc/150?img=2",
            rating: 4.9,
            completedJobs: 47,
            skills: ["UI/UX Design", "Figma", "Adobe XD", "Wireframing"]
        },
        amount: "0.68",
        deliveryTime: "14 days",
        proposal: "I specialize in crypto and fintech app UI/UX design and have worked on multiple wallet applications. I can create an interface that balances security features with ease of use.",
        status: "Pending",
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }
];

// Mock conversations data
export const conversations: Conversation[] = [
    {
        id: "conv1",
        participants: ["u1", "c1"],
        user: {
            id: "c1",
            name: "TechStart Inc.",
            avatar: "https://i.pravatar.cc/150?img=5",
            online: true
        },
        lastMessage: {
            content: "Hi there! I saw your bid on my project and I'm impressed with your proposal.",
            timestamp: "10:35 AM",
            unread: true
        },
        project: "React Frontend Developer for DeFi Dashboard"
    },
    {
        id: "conv2",
        participants: ["u3", "c2"],
        user: {
            id: "c2",
            name: "BlockFin Ltd.",
            avatar: "https://i.pravatar.cc/150?img=6",
            online: false
        },
        lastMessage: {
            content: "Thanks for your proposal. Can we schedule a call to discuss the details?",
            timestamp: "Yesterday",
            unread: false
        },
        project: "Smart Contract Developer for NFT Marketplace"
    },
    {
        id: "conv3",
        participants: ["u2", "c4"],
        user: {
            id: "c4",
            name: "Web3 Innovations",
            avatar: "https://i.pravatar.cc/150?img=7",
            online: true
        },
        lastMessage: {
            content: "Your previous work looks impressive. What's your availability like next month?",
            timestamp: "2 days ago",
            unread: false
        },
        project: "Full Stack Developer for DAO Platform"
    },
    {
        id: "conv4",
        participants: ["u4", "c3"],
        user: {
            id: "c3",
            name: "NFT Innovations",
            avatar: "https://i.pravatar.cc/150?img=8",
            online: false
        },
        lastMessage: {
            content: "I've reviewed your portfolio and think you'd be perfect for our upcoming project.",
            timestamp: "3 days ago",
            unread: false
        },
        project: "Mobile App Developer for NFT Showcase"
    }
];

// Mock messages for specific conversations
export const messages: Record<string, Message[]> = {
    "conv1": [
        {
            id: "msg1",
            conversationId: "conv1",
            sender: "other",
            content: "Hi there! I saw your bid on my project and I'm impressed with your proposal.",
            timestamp: "10:30 AM",
            read: true
        },
        {
            id: "msg2",
            conversationId: "conv1",
            sender: "self",
            content: "Thank you! I'm excited about the possibility of working on your project. I have some ideas I'd like to discuss.",
            timestamp: "10:32 AM",
            read: true
        },
        {
            id: "msg3",
            conversationId: "conv1",
            sender: "other",
            content: "Great! I'm particularly interested in how you'd approach the user dashboard component.",
            timestamp: "10:35 AM",
            read: true
        },
        {
            id: "msg4",
            conversationId: "conv1",
            sender: "self",
            content: "For the dashboard, I'm thinking of using a modular approach with reusable widgets that can display different types of data from various blockchain sources.",
            timestamp: "10:38 AM",
            read: true
        }
    ],
    "conv2": [
        {
            id: "msg5",
            conversationId: "conv2",
            sender: "self",
            content: "Hello, I'm interested in your Smart Contract Developer role. I have 5+ years of experience with Solidity development.",
            timestamp: "Yesterday, 9:15 AM",
            read: true
        },
        {
            id: "msg6",
            conversationId: "conv2",
            sender: "other",
            content: "Hi Michael, thanks for reaching out. Your profile looks impressive. Could you tell me more about your experience with NFT contract development?",
            timestamp: "Yesterday, 10:20 AM",
            read: true
        },
        {
            id: "msg7",
            conversationId: "conv2",
            sender: "self",
            content: "I've built several NFT marketplaces using both ERC-721 and ERC-1155 standards. My most recent project was for a digital art platform that needed custom royalty distribution logic.",
            timestamp: "Yesterday, 10:45 AM",
            read: true
        },
        {
            id: "msg8",
            conversationId: "conv2",
            sender: "other",
            content: "Thanks for your proposal. Can we schedule a call to discuss the details?",
            timestamp: "Yesterday, 2:30 PM",
            read: true
        }
    ]
};

// Mock contracts data
export const contracts: Contract[] = [
    {
        id: "contract1",
        jobId: "job2",
        jobTitle: "Smart Contract Developer for NFT Marketplace",
        clientId: "c3",
        clientName: "NFT Innovations",
        freelancerId: "u3",
        freelancerName: "Michael Chen",
        amount: "1.1",
        startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        status: "Active",
        escrowAddress: "0xabcd1234abcd1234abcd1234abcd1234abcd1234",
        milestones: [
            {
                id: "ms1",
                title: "Smart Contract Architecture",
                description: "Define the contract structure and relationships",
                amount: "0.3",
                dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
                status: "In Progress",
                submissions: []
            },
            {
                id: "ms2",
                title: "NFT Base Implementation",
                description: "Implement ERC-721 and ERC-1155 base contracts",
                amount: "0.4",
                dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
                status: "Pending",
                submissions: []
            },
            {
                id: "ms3",
                title: "Marketplace Features",
                description: "Implement listing, bidding, and sales features",
                amount: "0.4",
                dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
                status: "Pending",
                submissions: []
            }
        ]
    },
    {
        id: "contract2",
        jobId: "job6",
        jobTitle: "Smart Contract Audit for Token",
        clientId: "c2",
        clientName: "BlockFin Ltd.",
        freelancerId: "u1",
        freelancerName: "Alex Johnson",
        amount: "1.0",
        startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
        status: "Active",
        escrowAddress: "0xefgh5678efgh5678efgh5678efgh5678efgh5678",
        milestones: [
            {
                id: "ms4",
                title: "Initial Code Review",
                description: "First pass review of contract code",
                amount: "0.2",
                dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
                status: "In Progress",
                submissions: []
            },
            {
                id: "ms5",
                title: "Detailed Security Analysis",
                description: "In-depth security analysis and vulnerability testing",
                amount: "0.5",
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                status: "Pending",
                submissions: []
            },
            {
                id: "ms6",
                title: "Final Report and Recommendations",
                description: "Complete audit report with findings and fixes",
                amount: "0.3",
                dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
                status: "Pending",
                submissions: []
            }
        ]
    }
];

// Mock payments data
export const payments: Payment[] = [
    {
        id: "payment1",
        contractId: "contract1",
        milestoneId: "ms1",
        amount: "0.3",
        currency: "ETH",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: "Pending",
        txHash: "0xabcd1234...",
        from: "NFT Innovations",
        to: "Escrow Contract",
        description: "Milestone 1: Smart Contract Architecture"
    },
    {
        id: "payment2",
        contractId: "contract2",
        milestoneId: "ms4",
        amount: "0.2",
        currency: "ETH",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: "Completed",
        txHash: "0xefgh5678...",
        from: "BlockFin Ltd.",
        to: "Alex Johnson",
        description: "Milestone 1: Initial Code Review"
    }
];

// Mock reviews data
export const reviews: Review[] = [
    {
        id: "review1",
        contractId: "contract2",
        fromUser: "BlockFin Ltd.",
        toUser: "Alex Johnson",
        rating: 4.9,
        comment: "Alex did an outstanding job with our code review. Very thorough and professional.",
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: "review2",
        contractId: "contract2",
        fromUser: "Alex Johnson",
        toUser: "BlockFin Ltd.",
        rating: 4.8,
        comment: "Great client to work with. Clear requirements and prompt responses.",
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    }
];

// Mock project verification data
export const projectVerifications: ProjectVerification[] = [
    {
        id: "verification1",
        milestoneId: "ms4",
        recordings: ["recording1.mp4", "recording2.mp4"],
        screenshots: ["screenshot1.png", "screenshot2.png", "screenshot3.png"],
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: "Verified",
        comments: "Code review recorded with explanations of potential vulnerabilities found."
    }
];

// Mock jobs for client dashboard
export const clientJobs = [
    {
        id: "cj1",
        title: "React Frontend Developer for DeFi Dashboard",
        bids: 8,
        status: "Open"
    },
    {
        id: "cj2",
        title: "Smart Contract Audit for Token",
        bids: 5,
        status: "In Progress"
    }
];

// Mock pending bids for client dashboard
export const pendingBids = [
    {
        id: "pb1",
        jobTitle: "React Frontend Developer for DeFi Dashboard",
        freelancer: "Alex Johnson",
        amount: "0.75 ETH",
        deliveryTime: "10 days"
    },
    {
        id: "pb2",
        jobTitle: "React Frontend Developer for DeFi Dashboard",
        freelancer: "Emily Rodriguez",
        amount: "0.78 ETH",
        deliveryTime: "12 days"
    }
];

// Mock dashboard data for fallback
export const mockFreelancerDashboard = {
  ongoingProjects: 2,
  activeApplications: 5,
  totalEarnings: 5850,
  recentActivities: [
    {
      type: 'job-application',
      title: 'You applied for "React Developer" job',
      time: '2 hours ago'
    },
    {
      type: 'bid-accepted',
      title: 'Your bid was accepted for "UI Design"',
      time: 'Yesterday'
    },
    {
      type: 'payment',
      title: 'You received payment for "Mobile App"',
      time: '3 days ago'
    }
  ],
  recommendedJobs: [
    {
      title: "React Developer for Financial Dashboard",
      description: "We need an experienced React developer to build a responsive dashboard with data visualization components.",
      budget: "$3,000-$5,000",
      skills: ["React", "TypeScript", "D3.js"],
      posted: "2 days ago",
      bids: 8,
      match: 95
    }
  ]
};

export const mockClientDashboard = {
  activeJobs: 2,
  totalSpent: 12750,
  escrowBalance: 4250,
  recentActivities: [
    {
      type: 'job-posted',
      title: 'You posted a new job "React Developer"',
      time: '3 hours ago'
    },
    {
      type: 'bid-new',
      title: 'New bid received for "UI Design"',
      time: 'Yesterday'
    },
    {
      type: 'payment',
      title: 'Payment released for "Logo Design"',
      time: '2 days ago'
    }
  ],
  pendingBids: [
    {
      jobTitle: "UI/UX Designer for Mobile App",
      freelancer: "Sarah Johnson",
      bid: "$1,200",
      rating: 4.8,
      delivery: "7 days"
    }
  ]
};

// Helper functions to work with the mock data
export const getJobById = (jobId: string): Job | undefined => {
    return jobs.find(job => job.id === jobId);
};

export const getBidsByJobId = (jobId: string): Bid[] => {
    return bids.filter(bid => bid.jobId === jobId);
};

export const getMessagesByConversationId = (conversationId: string): Message[] => {
    return messages[conversationId] || [];
};

export const getUserById = (userId: string): User | undefined => {
    return users.find(user => user.id === userId);
};

export const getClientById = (clientId: string): Client | undefined => {
    return clients.find(client => client.id === clientId);
};

export const getContractsByFreelancerId = (freelancerId: string): Contract[] => {
    return contracts.filter(contract => contract.freelancerId === freelancerId);
};

export const getContractsByClientId = (clientId: string): Contract[] => {
    return contracts.filter(contract => contract.clientId === clientId);
};
