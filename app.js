var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost/interEV";
const client = new MongoClient(url, { useUnifiedTopology: true });
var request = require("request");

var headers = {
  "content-type": "application/x-www-form-urlencoded"
};

function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body);
  }
}

async function main(collectionName) {
  try {
    await client.connect();

    console.log("connected");
    var user = await client
      .db()
      .collection(collectionName)
      .find()
      .toArray();

    user.forEach(user => {
      var newUserName = user.userName + "new";
      var dataString = "username=" + newUserName + "&orgName=Org1";

      var options = {
        url: "http://localhost:4000/users",
        method: "POST",
        headers: headers,
        body: dataString
      };
      client
        .db()
        .collection("user")
        .updateOne(
          { _id: user._id },
          { $set: { userName: newUserName } },
          { upsert: true }
        )
        .then(() => {
          request(options, callback);
        });
    });
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

async function EVOwners(collectionName) {
  try {
    await client.connect();

    console.log("connected");
    var user = await client
      .db()
      .collection(collectionName)
      .find()
      .toArray();

    user.forEach(async user => {
      var newUserName = user.owner.firstName + "new";
      console.log(newUserName);
      var dataString = "username=" + newUserName + "&orgName=Org1";

      var options = {
        url: "http://localhost:4000/users",
        method: "POST",
        headers: headers,
        body: dataString
      };
      client
        .db("interEV")
        .collection(collectionName)
        .updateOne(
          { _id: user._id },
          { $set: { "owner.firstName": newUserName } },
          { upsert: true }
        )
        .then(() => {
          request(options, callback);
        });
    });
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main("user");
main("user2");
EVOwners("EVOwners");
