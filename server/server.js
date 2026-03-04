const express = require("express");
const webpush = require("web-push");
const cors = require("cors");
const bodyParser = require("body-parser");

const PUBLIC_VAPID =
  "BNOJyTgwrEwK9lbetRcougxkRgLpPs1DX0YCfA5ZzXu4z9p_Et5EnvMja7MGfCqyFCY4FnFnJVICM4bMUcnrxWg";
const PRIVATE_VAPID = "_kRzHiscHBIGftfA7IehH9EA3RvBl8SBYhXBAMz6GrI";

const fakeDatabase = [];

const app = express();

app.use(cors());
app.use(bodyParser.json());

webpush.setVapidDetails("mailto:you@domain.com", PUBLIC_VAPID, PRIVATE_VAPID);

app.post("/subscription", (req, res) => {
  const subscription = req.body;
  fakeDatabase.push(subscription);

  res.status(200).send({});
});

app.post("/sendNotification", (req, res) => {
  try {
    const notificationPayload = {
      notification: {
        title: "Novo Comentário!",
        body: "Você recebeu um incrível comentário. O que deseja fazer?",
        icon: "assets/img/cat-icon.png",
        actions: [
          {
            action: "like",
            title: "👍 Like",
          },
          {
            action: "whatever",
            title: "¯\\_(ツ)_/¯",
          },
        ],
      },
    };

    const promises = [];
    fakeDatabase.forEach((subscription) => {
      promises.push(
        webpush.sendNotification(
          subscription,
          JSON.stringify(notificationPayload),
        ),
      );
    });
    Promise.all(promises).then(() => res.sendStatus(200));
  } catch (err) {
    console.log(err);
    res.sendStatus(200);
  }
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
