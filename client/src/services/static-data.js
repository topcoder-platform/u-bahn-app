async function getLocations() {
  const mockLocationTags = [
    { name: "London" },
    { name: "New York" },
    { name: "East Carmen" },
    { name: "Savanahville" },
    { name: "Lake Audra" },
    { name: "Elainaville" },
    { name: "Howellstad" },
    { name: "West Reneefort" },
    { name: "Vanside" },
    { name: "East Jonatan" },
    { name: "Gottliebton" },
    { name: "Ervinchester" },
    { name: "Matteoburgh" },
    { name: "Curtmouth" },
    { name: "North Raphaelleton" },
    { name: "Laishaside" },
    { name: "West Trystanmouth" },
    { name: "West Torrey" },
    { name: "Abernathystad" },
    { name: "Danland" },
    { name: "Lednertown" },
    { name: "Athenamouth" },
    { name: "North Abagailport" },
    { name: "North Andres" },
    { name: "New Herbert" },
    { name: "Bergstrombury" },
    { name: "West Santinoside" },
  ];
  return mockLocationTags;
}

async function getAchievements() {
  const mockAchievementsTags = [
    { name: "Informatika" },
    { name: "Upwork" },
    { name: "TopCoder" },
  ];

  return mockAchievementsTags;
}

export default {
  getLocations,
  getAchievements,
};
