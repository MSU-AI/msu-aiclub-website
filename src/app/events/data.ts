export interface Event {
  id: string;
  title: string;
  photo?: string;
  description?: string;
  time: Date;
  place: string;
  points: number;
}

export const eventsData: Event[] = [
  {
    id: "1",
    title: "AI Workshop",
    photo: "https://example.com/ai-workshop.jpg",
    description: "Join us for an exciting AI workshop where we'll explore the latest trends in machine learning.",
    time: "2023-08-15T14:00:00",
    place: "Engineering Building, Room 101",
    points: 50
  },
  {
    id: "2",
    title: "Hackathon Kickoff",
    description: "Get ready for our annual hackathon! Come for the kickoff and form your teams.",
    time: "2023-09-01T10:00:00",
    place: "Student Union, Grand Hall",
    points: 100
  },
  {
    id: "3",
    title: "Guest Lecture: Ethics in AI",
    photo: "https://example.com/ethics-lecture.jpg",
    time: "2023-08-22T16:30:00",
    place: "Auditorium A",
    points: 30
  }
];

