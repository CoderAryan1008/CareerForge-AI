const resume = `Aryan Sharma
Software Developer | Full-Stack Developer

Professional Summary
Motivated Information Technology student with strong foundations in data structures, algorithms, database management, and web development. Experienced in building full-stack applications using React, Node.js, Express, and MongoDB. Comfortable working with REST APIs, authentication, and Git-based development. Strong problem-solving skills with hands-on experience in competitive programming and software development projects.

Education
Bachelor of Technology in Information Technology
XYZ Institute of Technology, Pune
2024 – 2028
CGPA: 9.4/10

Technical Skills

Programming Languages: C++, JavaScript, Java, Python
Frontend: HTML, CSS, JavaScript, React.js, Bootstrap
Backend: Node.js, Express.js, REST APIs
Databases: MongoDB, MySQL
Tools: Git, GitHub, VS Code, Postman
Core Computer Science: Data Structures and Algorithms, DBMS, OOP, Computer Networks, Operating Systems

Projects

Resume Builder & Interview Preparation Platform

Developed a MERN-based web application that allows users to create and manage professional resumes.
Implemented user authentication using JWT and bcrypt.
Built REST APIs using Node.js and Express.js.
Used MongoDB and Mongoose for storing user and resume information.
Integrated an AI-based interview preparation feature that analyzes a user's resume and job description.
Designed the system to generate technical questions, identify skill gaps, and create personalized preparation plans.

Contest Tracker

Developed a React-based platform for tracking upcoming programming contests from Codeforces and other competitive programming platforms.
Integrated external APIs to retrieve contest information.
Implemented filtering and sorting of contests based on their status and start time.
Added bookmarking functionality for contests users want to participate in.

Personal Finance Tracker

Developed a web application for tracking income and expenses.
Used PHP and MySQL for backend data management.
Implemented CRUD operations for financial transactions.
Designed database tables to store and retrieve user financial records.

Achievements

Strong performance in competitive programming and data structures and algorithms.
Solved numerous problems involving arrays, strings, trees, graphs, dynamic programming, and binary search.
Participated in coding contests and technical competitions.

Other Skills

Problem solving
Analytical thinking
Team collaboration
Communication
Debugging and troubleshooting
Ability to learn new technologies quickly`;

const selfdescription = `I am an Information Technology student who is passionate about software development and problem solving. I enjoy understanding how systems work internally and building applications that solve practical problems.

My strongest areas are data structures and algorithms, C++, JavaScript, React, Node.js, Express, MongoDB, and SQL. I have experience developing full-stack applications and working with REST APIs, authentication, databases, and third-party APIs.

I particularly enjoy backend development and problem solving, but I am also comfortable working on frontend applications using React. I have been actively improving my knowledge of core computer science subjects such as DBMS, operating systems, computer networks, and object-oriented programming.

I am looking for a software engineering internship or entry-level software development role where I can apply my problem-solving skills, work on real-world applications, learn from experienced developers, and contribute to a collaborative engineering team.

One of my current goals is to strengthen my knowledge of system design, cloud technologies, testing, and production-level software development.`

const jobdecription = `Software Development Engineer Intern
We are looking for a motivated Software Development Engineer Intern to join our engineering team and contribute to the development of scalable and reliable software applications.

Responsibilities

Design, develop, test, and maintain web applications and backend services.
Build and consume RESTful APIs.
Work with frontend technologies such as React.js, HTML, CSS, and JavaScript.
Develop backend services using Node.js and Express.js.
Work with databases such as MongoDB and PostgreSQL.
Write clean, maintainable, and well-documented code.
Debug existing applications and identify performance and reliability issues.
Participate in code reviews and collaborate with other developers.
Write unit and integration tests for application features.
Work with Git and GitHub for version control.
Participate in technical discussions and contribute to software architecture decisions.
Learn and apply software engineering best practices.

Required Qualifications

Currently pursuing a Bachelor's degree in Computer Science, Information Technology, or a related field.
Strong understanding of data structures and algorithms.
Good knowledge of JavaScript and modern web development.
Experience with React.js and Node.js.
Understanding of REST APIs and backend development.
Experience with at least one database such as MongoDB, MySQL, or PostgreSQL.
Familiarity with Git and version control.
Good understanding of object-oriented programming.
Strong analytical and problem-solving skills.

Preferred Qualifications

Experience with TypeScript.
Familiarity with Docker and containerization.
Basic knowledge of AWS or another cloud platform.
Understanding of CI/CD pipelines.
Experience writing automated tests using tools such as Jest or similar frameworks.
Familiarity with Redis or other caching technologies.
Basic understanding of system design and scalable backend architectures.
Experience working with AI APIs or integrating AI-powered features into applications.

Soft Skills

Strong communication and collaboration skills.
Ability to work effectively in a team.
Willingness to learn new technologies.
Ability to take ownership of assigned tasks.
Good debugging and problem-solving abilities.`

module.exports = {
  resume, selfdescription, jobdecription
};

/*
{
  "matchScore": 85,
  "technicalQuestions": [
    {
      "question": "Explain the concept of middleware in Express.js and how you utilized it in your Resume Builder project.",
      "intent": "To verify the candidate's understanding of Node.js/Express architecture and practical implementation of authentication/security.",
      "answer": "Define middleware as functions that have access to the request and response objects. Explain how they were used for logging, parsing JSON bodies, or implementing JWT-based authentication in the project."
    },
    {
      "question": "How do you handle state management in React, and when would you choose Context API over Redux or other state management libraries?",
      "intent": "To assess frontend proficiency and decision-making skills regarding state management.",
      "answer": "Discuss local vs global state. Mention Context API for simple global states to avoid prop drilling and Redux or Zustand for more complex, high-frequency state updates."
    },
    {
      "question": "In your Resume Builder project, how did you model the data schema in MongoDB to handle complex relationships between users and their resumes?",
      "intent": "To evaluate database design skills and understanding of NoSQL modeling.",
      "answer": "Explain the schema design, potentially using Mongoose refs or sub-documents, and justifying the choice of MongoDB over a relational database."
    }
  ],
  "behavioralQuestions": [
    {
      "question": "Tell me about a time you encountered a significant bug in one of your projects. How did you identify it and resolve it?",
      "intent": "To gauge troubleshooting skills, persistence, and systematic approach to problem-solving.",
      "answer": "Use the STAR method (Situation, Task, Action, Result). Highlight the tools used (like Postman or browser console) and the logical steps taken to isolate and fix the issue."
    },
    {
      "question": "How do you handle learning a new technology under a time constraint?",
      "intent": "To test the candidate's adaptability and learning efficiency.",
      "answer": "Describe a specific instance, emphasizing the process: identifying core concepts, building a small prototype, referring to documentation, and breaking the learning into manageable chunks."
    }
  ],
  "skillGap": [
    {
      "skill": "System Design",
      "severity": "high"
    },
    {
      "skill": "Cloud Deployment (AWS/Azure/GCP)",
      "severity": "medium"
    },
    {
      "skill": "Automated Testing (Jest/Cypress)",
      "severity": "medium"
    }
  ],
  "preparationPlan": [
    {
      "day": 1,
      "focus": "System Design Fundamentals",
      "tasks": [
        "Study load balancing, caching, and database sharding basics",
        "Review common API design patterns (RESTful principles)"
      ]
    },
    {
      "day": 2,
      "focus": "Advanced React Concepts",
      "tasks": [
        "Review React hooks (useEffect, useMemo, useCallback) performance optimization",
        "Practice state management best practices"
      ]
    },
    {
      "day": 3,
      "focus": "Backend Scalability & Security",
      "tasks": [
        "Deep dive into JWT security and token rotation",
        "Research database indexing for query performance optimization"
      ]
    },
    {
      "day": 4,
      "focus": "Cloud Basics",
      "tasks": [
        "Learn basics of deploying MERN applications to platforms like Render, Vercel, or AWS",
        "Understand environment variables and secret management"
      ]
    },
    {
      "day": 5,
      "focus": "Testing",
      "tasks": [
        "Learn the basics of Jest for unit testing",
        "Write simple test cases for a utility function in an existing project"
      ]
    },
    {
      "day": 6,
      "focus": "Project Deep-Dive",
      "tasks": [
        "Refactor one component or API route for better maintainability",
        "Prepare to explain technical trade-offs made in the Resume Builder project"
      ]
    },
    {
      "day": 7,
      "focus": "Mock Interviews & Review",
      "tasks": [
        "Perform a mock interview focusing on technical explanations",
        "Review resume bullet points and STAR examples for behavioral questions"
      ]
    }
  ]
}
*/