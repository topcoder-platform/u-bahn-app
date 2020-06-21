async function getLocations() {
  const mockLocationTags = [
    { name: "London" },
    { name: "York" },
    { name: "Carmen" },
    { name: "Savanahville" },
    { name: "Audra" },
    { name: "Elainaville" },
    { name: "Howellstad" },
    { name: "Reneefort" },
    { name: "Vanside" },
    { name: "Jonatan" },
    { name: "Gottliebton" },
    { name: "Ervinchester" },
    { name: "Matteoburgh" },
    { name: "Curtmouth" },
    { name: "Raphaelleton" },
    { name: "Laishaside" },
    { name: "Trystanmouth" },
    { name: "Torrey" },
    { name: "Abernathystad" },
    { name: "Danland" },
    { name: "Lednertown" },
    { name: "Athenamouth" },
    { name: "Abagailport" },
    { name: "Andres" },
    { name: "Herbert" },
    { name: "Bergstrombury" },
    { name: "Santinoside" },
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
