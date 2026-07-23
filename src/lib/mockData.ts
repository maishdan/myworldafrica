import event1 from "@/assets/event1.jpg";
import event2 from "@/assets/event2.jpg";
import event3 from "@/assets/event3.jpg";
import riders from "@/assets/riders.jpg";
import drivers from "@/assets/drivers.jpg";
import explorers from "@/assets/explorers.jpg";

export type Event = {
  id: string;
  title: string;
  location: string;
  country: string;
  date: string;
  audience: "Riders" | "Drivers" | "Explorers" | "All";
  host: string;
  image: string;
  price: string;
  spots: number;
  taken: number;
};

export const events: Event[] = [
  {
    id: "vic-falls-rally",
    title: "Victoria Falls Adventure Rally",
    location: "Livingstone",
    country: "Zambia",
    date: "2026-08-14",
    audience: "Riders",
    host: "Kaya Ndlovu",
    image: event1,
    price: "Free",
    spots: 120,
    taken: 87,
  },
  {
    id: "cape-coast-run",
    title: "Cape Coast Sunset Run",
    location: "Cape Town",
    country: "South Africa",
    date: "2026-09-02",
    audience: "Riders",
    host: "Thandi Mokoena",
    image: event2,
    price: "R450",
    spots: 60,
    taken: 41,
  },
  {
    id: "sahara-crossing",
    title: "Sahara Crossing Expedition",
    location: "Merzouga",
    country: "Morocco",
    date: "2026-10-19",
    audience: "Drivers",
    host: "Amine Bennani",
    image: event3,
    price: "$980",
    spots: 24,
    taken: 18,
  },
  {
    id: "serengeti-loop",
    title: "Serengeti Loop Meetup",
    location: "Arusha",
    country: "Tanzania",
    date: "2026-11-05",
    audience: "All",
    host: "Juma Kilonzo",
    image: riders,
    price: "$120",
    spots: 80,
    taken: 32,
  },
  {
    id: "namib-dunes",
    title: "Namib Dunes 4x4 Convoy",
    location: "Swakopmund",
    country: "Namibia",
    date: "2026-12-11",
    audience: "Drivers",
    host: "Petrus Amupolo",
    image: drivers,
    price: "N$1800",
    spots: 30,
    taken: 12,
  },
  {
    id: "lamu-cultural",
    title: "Lamu Cultural Weekend",
    location: "Lamu Island",
    country: "Kenya",
    date: "2027-01-22",
    audience: "Explorers",
    host: "Aisha Hassan",
    image: explorers,
    price: "KSh 7,500",
    spots: 40,
    taken: 22,
  },
];

export type Short = {
  id: string;
  author: string;
  handle: string;
  location: string;
  caption: string;
  image: string;
  likes: number;
  comments: number;
};

export const shorts: Short[] = [
  {
    id: "s1",
    author: "Kaya Ndlovu",
    handle: "@kaya_rides",
    location: "Chobe · Botswana",
    caption: "Chasing the sun with the crew. Red dust in the lungs, freedom in the throttle. 🏍️🔥",
    image: riders,
    likes: 2431,
    comments: 128,
  },
  {
    id: "s2",
    author: "Petrus Amupolo",
    handle: "@dune_petrus",
    location: "Sossusvlei · Namibia",
    caption: "Dune 45 at dawn — the Cruiser purrs, the desert sings.",
    image: drivers,
    likes: 1876,
    comments: 94,
  },
  {
    id: "s3",
    author: "Aisha Hassan",
    handle: "@aisha.wanders",
    location: "Marrakech · Morocco",
    caption: "Souks, spices and stories older than time.",
    image: explorers,
    likes: 3120,
    comments: 210,
  },
  {
    id: "s4",
    author: "Thandi Mokoena",
    handle: "@thandi.rides",
    location: "Chapman's Peak · SA",
    caption: "The Atlantic on my left, the mountain on my right. This is home.",
    image: event2,
    likes: 4092,
    comments: 302,
  },
  {
    id: "s5",
    author: "Juma Kilonzo",
    handle: "@juma_offroad",
    location: "Ngorongoro · Tanzania",
    caption: "Woke up above the clouds. The Great Rift Valley says hello.",
    image: event1,
    likes: 2765,
    comments: 141,
  },
  {
    id: "s6",
    author: "Amine Bennani",
    handle: "@amine.saharan",
    location: "Erg Chebbi · Morocco",
    caption: "Camel or bike? Some evenings you take both.",
    image: event3,
    likes: 1908,
    comments: 87,
  },
];
