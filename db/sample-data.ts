import bcrypt from "bcryptjs";

const sampleData = {
  sections: [
    {
      id: "1",
      name: "To do",
      taskIds: [
        {
          id: "3",
          title: "Modifying cart layout",
          tag: "Design",
          dueDate: new Date("2025-02-15"),
          user: {
            id: 1,
            image: "/assets/avatar/avatar3",
            name: "Harry",
            email: "harry@test.com",
            password: bcrypt.hash("123456", 10),
          },
        },
        {
          id: "1",
          title: "Add Chart",
          tag: "Programming",
          dueDate: new Date("2025-02-18"),
          user: {
            id: "1",
            image: "/assets/avatar/avatar1",
            name: "Harry",
            email: "harry@test.com",
            password: bcrypt.hash("123456", 10),
          },
        },
      ],
    },
    {
      id: "2",
      name: "In Progress",
      taskIds: [
        {
          id: "4",
          title: "Debug landing page",
          tag: "Testing",
          dueDate: new Date("2025-02-15"),
          user: {
            id: "3",
            image: "/assets/avatar/avatar4",
            name: "Rhanerya",
            email: "rhanerya@test.com",
            password: bcrypt.hash("123456", 10),
          },
        },
      ],
    },
    {
      id: "3",  
      name: "Review",
      taskIds: [
        {
          id: "2",
          title: "Fixing Bugs",
          tag: "Programming",
          dueDate: new Date("2025-02-17"),
          user: {
            id: "2",
            image: "/assets/avatar/avatar2",
            name: "Hermonie",
            email: "hermonie@test.com",
            password: bcrypt.hash("123456", 10),
          },
        },
        {
          id: "4",
          title: "Debug landing page",
          tag: "Testing",
          dueDate: new Date("2025-02-15"),
          user: {
            id: "3",
            image: "/assets/avatar/avatar4",
            name: "Rhanerya",
            email: "rhanerya@test.com",
            password: bcrypt.hash("123456", 10),
          },
        },
      ],
    },
  ],
};

export default sampleData
