const db = require("./database");

const internships = [
    {
        title: "Frontend Development Intern",
        company: "TechNova Solutions",
        location: "Hyderabad",
        description: "Work on responsive web interfaces and frontend features.",
        skills: "HTML, CSS, JavaScript",
        duration: "3 months",
        stipend: "₹10,000/month",
        application_url: "https://example.com/apply/frontend"
    },
    {
        title: "Backend Development Intern",
        company: "CodeSphere Technologies",
        location: "Bengaluru",
        description: "Develop REST APIs and work with databases.",
        skills: "Node.js, Express, SQL",
        duration: "6 months",
        stipend: "₹15,000/month",
        application_url: "https://example.com/apply/backend"
    },
    {
        title: "IoT Engineering Intern",
        company: "SmartEdge Labs",
        location: "Pune",
        description: "Assist with IoT devices, sensors, and data collection.",
        skills: "IoT, C, Embedded Systems",
        duration: "3 months",
        stipend: "₹8,000/month",
        application_url: "https://example.com/apply/iot"
    },
    {
        title: "Data Analyst Intern",
        company: "DataBridge Analytics",
        location: "Remote",
        description: "Analyze datasets and prepare reports and dashboards.",
        skills: "Python, SQL, Excel",
        duration: "4 months",
        stipend: "₹12,000/month",
        application_url: "https://example.com/apply/data"
    },
    {
        title: "Cloud Computing Intern",
        company: "CloudWorks India",
        location: "Chennai",
        description: "Learn cloud infrastructure and deployment practices.",
        skills: "AWS, Linux, Networking",
        duration: "6 months",
        stipend: "₹15,000/month",
        application_url: "https://example.com/apply/cloud"
    }
];

const sql = `
    INSERT INTO internships
    (title, company, location, description, skills, duration, stipend, application_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`;

let completed = 0;

internships.forEach((internship) => {
    db.run(
        sql,
        [
            internship.title,
            internship.company,
            internship.location,
            internship.description,
            internship.skills,
            internship.duration,
            internship.stipend,
            internship.application_url
        ],
        (err) => {
            if (err) {
                console.error("Error inserting record:", err.message);
            } else {
                completed++;

                if (completed === internships.length) {
                    console.log("Seed data inserted successfully.");
                    db.close();
                }
            }
        }
    );
});