export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


export function* dataGenerator(days: number, start_at: number) {
  let i = 0;
  while (i < days) {
    const seconds = start_at + (i * 3600 * 24);
    yield {
      "countByRating": {
        "0": getRandomInt(0, 5),
        "1": getRandomInt(0, 10),
        "2": getRandomInt(0, 20),
        "3": getRandomInt(0, 30),
        "4": getRandomInt(0, 50),
        "5": getRandomInt(0, 60),
        "6": getRandomInt(0, 70),
        "7": getRandomInt(0, 30),
        "0.5": getRandomInt(0, 10),
        "1.5": getRandomInt(0, 5),
        "2.5": getRandomInt(0, 5),
        "4.5": getRandomInt(0, 50),
        "5.5": getRandomInt(0, 50),
        "undefined": getRandomInt(100, 400)
      },
      "countWithAudio": 0,
      "countWithQA": 262,
      "owner": "7Tbg0SwakaVoCXHlu1rniHQ6gwz1",
      "whenCreated": {
        "seconds": seconds,
        "nanoseconds": 0
      },
      "whenLastModified": {
        "seconds": seconds,
        "nanoseconds": 0
      }
    }
    i++;
  }
}
