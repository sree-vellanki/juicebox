const { client, getAllUsers, createUser } = require("./index");

async function testDB() {
  try {
    console.log("TESTING!!!!");
    const users = await getAllUsers();

    console.log("getAllUsers: ", users);

    console.log("......TESTING DONE!");
  } catch (error) {
    console.error("Something doesn't feel right....");
    throw error;
  }
}

async function dropTables() {
  try {
    console.log("Starting the table drop....");

    await client.query(`
        DROP TABLE IF EXISTS users`);

    console.log("Table drop finito!!");
  } catch (error) {
    console.error("Error in table drop!");
    throw error;
  }
}

async function createTables() {
  try {
    console.log("Making the tables...");

    await client.query(`
        CREATE TABLE users(
            id SERIAL PRIMARY KEY,
            username varchar(255) UNIQUE NOT NULL,
            password varchar(255) NOT NULL
        );
        `);

    console.log("Done making tables!");
  } catch (error) {
    console.error("There's a problem in making the tables...");

    throw error;
  }
}

async function createInitialUsers() {
  try {
    console.log("Starting to create users...");

    const albert = await createUser({
      username: "albert",
      password: "bertie99",
    });
    const sandy = await createUser({
      username: "sandy",
      password: "2sandy4me",
    });
    const glamgal = await createUser({
      username: "glamgal",
      password: "soglam",
    });

    //console.log(result);

    console.log("Finished creating users!");
  } catch (error) {
    console.error("Error creating users!");
    throw error;
  }
}

async function rebuildDB() {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
  } catch (error) {
    console.error(error);
  }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
