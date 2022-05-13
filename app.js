const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DBError:${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

//1.GET Players APL:
app.get("/players/", async (request, response) => {
  try {
    const getPlayersQuery = `
    SELECT 
      *
    FROM
      cricket_team
    `;
    const playersList = await db.all(getPlayersQuery);
    response.send(playersList);
  } catch {
    console.log(`DBError:${e.message}; IN GET method`);
  }
});

//2.POST add a Player API:
app.post("/players/", async (request, response) => {
  try {
    let playerDetails = request.body;
    let { playerName, jerseyNumber, role } = playerDetails;
    const postPlayerQuery = `
    INSERT INTO
     cricket_team(player_name,jersey_number,role)
    VALUES
     (${playerName},${jerseyNumber},${role})
    `;
    const addedPlayer = await db.run(postPlayerQuery);
    response.send(`Player Added to Team`);
  } catch (e) {
    console.log(`DBError:${e.message}; IN POST method`);
  }
});
