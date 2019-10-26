async function getNewTurtle() {
  try {
    const response = await fetch(
      "https://ddls7k3du0.execute-api.us-west-1.amazonaws.com/dev2/"
    );
    const json = await response.json();
    const imageURL = await json.body.Item.url;
    const turtleName = await json.body.Item.name;

    document.getElementById("turtlepic").src = imageURL;
    document.getElementById("currentturtle").innerText = turtleName;
  } catch (e) {
    console.log(e);
  }
}

async function updateTurtleCount() {
  try {
    const response = await fetch(
      "https://6tjpaow9al.execute-api.us-west-1.amazonaws.com/default/lambdaReadWriteBucketFile"
    );
    const json = await response.json();
    const count = await json.body;

    document.getElementById("turtlecount").innerText = count;
  } catch (e) {
    console.log(e);
  }
}

document.addEventListener("DOMContentLoaded", updateTurtleCount, false);
