export const APIkey = "AIzaSyBKsxB7SuZvOCJUCfWSsW9jkBRKtYBa0MY";

export const eventCardDatas = [
  {
    name: "Disney On Ice: Mickey's Search Party", // boston
    imgLink: new URL("../assets/event-card-demo.png", import.meta.url).href,
    description:
      "This ice skating show features beloved Disney characters and promises an enchanting experience for all ages. Mickey and his friends will guide you through a magical world of Disney stories, making it the perfect way to end your festive journey.",
    lat: 42.3188,
    long: -71.0852,
    // we can also add some data regarding price and age range
  },
  {
    name: "2024 North Carolina Christmas Festival",
    imgLink: new URL("../assets/event-card-demo.png", import.meta.url).href,
    description:
      "Filled with festive lights, music, and local crafts, this festival captures the holiday spirit with spectacular decorations and performances. Enjoy traditional holiday foods and the festive atmosphere of the community celebration.",
    lat: 35.2083,
    long: -80.8303,
  },
  {
    name: "Top of the Rock VIP Pass",
    imgLink: new URL("../assets/event-card-demo.png", import.meta.url).href,
    description:
      "Experience the magic of New York City during the holidays with the Top of the Rock and Rockefeller Center VIP Pass. Enjoy panoramic views of NYC's skyline, including the famous Rockefeller Christmas Tree. Explore NYC's holiday festivities with access to top attractions, ensuring an unforgettable holiday experience.",
    lat: 40.6943,
    long: -73.9249,
  },
  {
    name: "America's larg Aquarium",
    imgLink: new URL("../assets/event-card-demo.png", import.meta.url).href,
    description:
      "The Georgia Aquarium is one of the largest aquariums in the world. Explore the marine life and holiday exhibits that captivate all ages. Experience the wonders of dolphins, whales, and more as you learn about marine conservation during this festive season.",
    lat: 33.7628,
    long: -84.422,
  },
];

/*
current plan:
manually fill out event objects with data
create pathGenerator
 -on start, generate look up table of distances
 -on startpoint changed, generate path
*/
