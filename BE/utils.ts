import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";
import { CronJob } from "cron";
import projectModal from "./modal/projectModal";

export type context = {
  token: string;
  userId: string;
};

export const isAuth =
  (callBack: any) => async (_: any, params: any, context: context) => {
    let isUserValid;
    try {
      isUserValid =
        jwt.verify(context.token, process.env.ACCESS_HIDDEN_KEY ?? "") &&
        context.userId;
    } catch (error) {
      throw new GraphQLError("need auth broo", {
        extensions: {
          code: "INVALID_TOKEN",
        },
      });
    }

    if (isUserValid) {
      try {
        let res = await callBack(_, params, context);
        return res;
      } catch (error) {
        throw error;
      }
    } else {
      throw new GraphQLError("need auth broo", {
        extensions: {
          code: "INVALID_TOKEN",
        },
      });
    }
  };

var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_MAIL_SERVICE_MAIL,
    pass: process.env.SMTP_MAIL_SERVICE_PASSWORD,
  },
});

const sendMail = (data: any) => {
  var mailOptions = {
    from: process.env.SMTP_MAIL_SERVICE_MAIL,
    to: data.userId.email,
    subject: "reminder for the project deadline",
    text: `project name ${data.title} #id: ${data.id} has about to reach the due date so please verify the current status of project`,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (error: any, info: any) {
      if (error) {
        reject(error);
      } else {
        resolve("Email sent: " + info.response);
      }
    });
  });
};

const job = CronJob.from({
  cronTime: "* */12 * * *",
  onTick: async function () {
    const now = new Date(); // Current date and time
    const twentyFourHoursFromNow = new Date(
      now.getTime() + 24 * 60 * 60 * 1000
    ); // 24 hours ahead
    try {
      const datas = await projectModal
        .find({
          dueDate: { $lte: twentyFourHoursFromNow }, // Due date between now and 24 hours from now
          isNotified: false,
          status: "INPROGRESS",
        })
        .populate(["userId", "clientId"]);
      if (datas.length) {
        datas.forEach((data: any) => {
          sendMail(data)
            .then(() => {
              console.log(
                `email is send to the user with email: ${data.userId?.email} for project: ${data.title}`
              );
              projectModal
                .findOneAndUpdate({ _id: data.id }, { isNotified: true })
                .then(() => {
                  console.log(
                    `isNotification key updated successfully for project Id: ${data.id} `
                  );
                })
                .catch((err) =>
                  console.log(
                    `fail to update isNotification key for project Id: ${data.id} `
                  )
                );
            })
            .catch((err) => console.log("error", err));
        });
      }
    } catch (error) {
      console.log("error in cron job", error);

      if (!job.running) {
        console.log("job restarting");
        job.start();
        console.log("job restarted successfully");
      }
    }

    console.log("job done");
  },
  start: false,
  timeZone: "Asia/Kolkata",
});

export const cornJobForNotifyTheDueDateOfProject = () => {
  console.log("hiiii");

  job.start();
};
