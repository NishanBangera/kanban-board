// import bcrypt from "bcryptjs";

const sampleData = {
  sections: [
    {
      id: "1",
      name: "To do",
      tasks: [
        {
          id: "3",
          title: "Modifying cart layout",
          tag: "Design",
          dueDate: String(new Date("2025-02-15").toLocaleString("en-US", {
            day:"numeric",
            weekday: "short"
          })),
          user: {
            id: "1",
            image: "/assets/avatar/avatar3",
            name: "Harry",
          },
        },
        {
          id: "1",
          title: "Add Chart",
          tag: "Programming",
          dueDate: String(new Date("2025-02-18").toLocaleString("en-US", {
            day:"numeric",
            weekday: "short"
          })),
          user: {
            id: "1",
            image: "/assets/avatar/avatar1",
            name: "Harry",
          },
        },
      ],
    },
    {
      id: "2",
      name: "In Progress",
      tasks: [
        {
          id: "4",
          title: "Debug landing page",
          tag: "Testing",
          dueDate: String(new Date("2025-02-15").toLocaleString("en-US", {
            day:"numeric",
            weekday: "short"
          })),
          user: {
            id: "3",
            image: "/assets/avatar/avatar4",
            name: "Rhanerya",
          },
        },
      ],
    },
    {
      id: "3",  
      name: "Review",
      tasks: [
        {
          id: "2",
          title: "Fixing Bugs",
          tag: "Programming",
          dueDate: String(new Date("2025-02-17").toLocaleString("en-US", {
            day:"numeric",
            weekday: "short"
          })),
          user: {
            id: "2",
            image: "/assets/avatar/avatar2",
            name: "Hermonie",
          },
        },
        {
          id: "4",
          title: "Debug landing page",
          tag: "Testing",
          dueDate: String(new Date("2025-02-15").toLocaleString("en-US", {
            day:"numeric",
            weekday: "short"
          })),
          user: {
            id: "3",
            image: "/assets/avatar/avatar4",
            name: "Rhanerya",
          },
        },
      ],
    },
  ],
};

export const users = [
  {
      id: 1,
      name: "Emily Johnson",
      avatar: "https://dummyjson.com/icon/emilys/128",
  },
  {
      id: 2,
      name: "Michael Williams",
      avatar: "https://dummyjson.com/icon/michaelw/128",
  },
  {
      id: 3,
      name: "James Davis",
      avatar: "https://dummyjson.com/icon/jamesd/128",
  },
  {
      id: 4,
      name: "Emma Miller",
      avatar: "https://dummyjson.com/icon/emmaj/128",
  },
  {
      id: 5,
      name: "Alexander Jones",
      avatar: "https://dummyjson.com/icon/alexanderj/128",
  },
];

export default sampleData
