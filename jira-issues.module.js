const fetch = require("node-fetch");
const EMAIL = "shuliak.lyubov@gmail.com";
const BASE_URL = "https://test-shuliak.atlassian.net/rest/api/2/issue/";

const headers = () => ({
  headers: {
    Authorization: `Basic ${Buffer.from(
      EMAIL + ":" + process.env.JIRA_TOKEN
    ).toString("base64")}`,
    Accept: "application/json",
  },
});

const getTask = async (taskID) => {
  try {
    const task = await fetch(BASE_URL + taskID, {
      method: "GET",
      ...headers(),
    });
    return taskID;
  } catch (error) {
    console.log(error);
    return { error: "error" };
  }
};

const commentTask = async (taskID, text) => {
  try {
    const task = await fetch(BASE_URL + taskID + "/comment", {
      method: "PUT",
      ...headers(),
      body: JSON.stringify(comment(text)),
    });
    const res = task.json();
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getTask, commentTask, EMAIL, headers };
