const { App } = require("@slack/bolt");
const shell = require("shelljs");
const { EMAIL, getTask, headers } = require("./jira-issues.module");
const BASE_URL = "https://test-shuliak.atlassian.net/rest/api/2/issue/";

const { commentView } = require("./views");

require("dotenv").config();

let IS_LOGED_IN = false;

const app = new App({
  token: process.env.BOT_USER_OAUTH_TOKEN,
  signingSecret: process.env.SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SOCKET_TOKEN,
});

const comment = (comment) => ({
  body: comment,
});

app.event("hello", () => {
  app.client.conversations.close();
});

app.command("/login", async ({ command, ack, say }) => {
  try {
    await ack();
    let txt = command.text;
    if (txt !== EMAIL) {
      say(EMAIL + " not valid");
    } else {
      IS_LOGED_IN = true;
      say(" Congrtats! :smile: \n You are authorized.\n enter /comment  ");
    }
  } catch (error) {
    console.error(error);
  }
});
app.command("/comment", async (event) => {
  const { command, ack, say, client } = event;
  try {
    await ack();
    if (!IS_LOGED_IN) {
      say("use /login + your email to authorize");
      return;
    }
    let txt = command.text;
    if (txt) {
      try {
        const res = await getTask(txt);
        if (!res.error) {
          client.views.open({
            trigger_id: command.trigger_id,

            view: commentView(txt),
          });
        }

        // say();
      } catch (error) {
        console.error(error);
      }
    } else {
      say("Issue  not existing");
    }
  } catch (error) {
    console.log("err");
    console.error(error);
  }
});
app.view("comment", async ({ ack, body, client, view }) => {
  await ack();

  const val = Object.values(view["state"]["values"])[0].ml_input.value;
  const user = body["user"]["id"];

  console.log(val, user);
  console.log(body.view.private_metadata);

  let msg = "Your submission was successful!";

  const task = await fetch(BASE_URL + body.view.private_metadata + "/comment", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(
        EMAIL + ":" + process.env.JIRA_TOKEN
      ).toString("base64")}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(comment(val)),
  });

  const res = await task.json();
  console.log(task.statusText + ": " + task.status);
  if (res.status) {
    try {
      await client.chat.postMessage({
        channel: user,
        text: msg,
      });
    } catch (error) {
      console.error(error);
    }
  }
});

app.start(5000);
shell.exec("clear");
