const { sleep } = require("./lib");

const users = [
  { id: "thouse", displayName: "Tom House", password: "test", organization: "Ministry of Health" },
  { id: "pkleffmann", displayName: "Piet Kleffmann", password: "test", organization: "ACMECorp" },
  { id: "mstein", displayName: "Mauro Stein", password: "test", organization: "UmbrellaCorp" },
  { id: "jdoe", displayName: "John Doe", password: "test", organization: "Ministry of Finance" },
  {
    id: "jxavier",
    displayName: "Jane Xavier",
    password: "test",
    organization: "Ministry of Education"
  },
  { id: "dviolin", displayName: "Dana Violin", password: "test", organization: "Centralbank" },
  { id: "auditUser", displayName: "Romina Checker", password: "test", organization: "Audit" }
];

const createUser = async (axios, user) => {
  await axios.post("/user.create", {
    ...user
  });
};

export const provisionUsers = async axios => {
  try {
    for (const user of users) {
      await createUser(axios, user);
      const data = {
        "user.view": [user.id]
      };
      await grantPermissionsToUser(axios, data);
      console.log(`~> added User ${user.displayName}`);
    }
    //Special permissions for mstein
    const data = {
      "global.intent.list": ["mstein"],
      "global.createProject": ["mstein"],
      "user.view": ["mstein"]
    };
    await grantPermissionsToUser(axios, data);

    console.log("~> global Permissions granted for mstein");
  } catch (err) {
    await handleError(axios, err);
  }
};

const grantPermissionsToUser = async (axios, data) => {
  await axios.post("/global.intent.grantPermission", data);
};

const handleError = async (axios, err) => {
  if (err.response && err.response.status === 409) {
    console.log("Seems like the users already exist");
  } else {
    console.log(err.message);
    const timeout_s = 20;
    console.log(`Blockchain or API are not up yet, sleeping for ${timeout_s} seconds`);
    await sleep(timeout_s * 1000);
    console.log("Stop sleeping");
    await provisionUsers(axios);
  }
};
