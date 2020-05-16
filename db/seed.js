const {
  client,
  getAllUsers,
  createUser,
  updateUser,
  createPost,
  updatePost,
  getAllPosts,
  getPostsByUser,
  getUserById,
} = require("./index");

async function createTables() {
  try {
    console.log("Making the tables...");

    await client.query(`
        CREATE TABLE users(
            id SERIAL PRIMARY KEY,
            username varchar(255) UNIQUE NOT NULL,
            password varchar(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            location VARCHAR(255),
            active BOOLEAN DEFAULT true
        );
        CREATE TABLE posts(
          id SERIAL PRIMARY KEY,
          "authorId" INTEGER REFERENCES users(id) NOT NULL,
          title VARCHAR(255) NOT NULL,
          content TEXT NOT NULL,
          active BOOLEAN DEFAULT true
        )
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
      name: "Albert",
      location: "Jacksonville",
    });
    const sandy = await createUser({
      username: "sandy",
      password: "2sandy4me",
      name: "Sandy",
      location: "New York",
    });
    const glamgal = await createUser({
      username: "glamgal",
      password: "soglam",
      name: "Gloria",
      location: "Huston",
    });

    //console.log(result);

    console.log("Finished creating users!");
  } catch (error) {
    console.error("Error creating users!");
    throw error;
  }
}

async function createInitialPosts() {
  try {
    const [albert, sandy, glamgal] = await getAllUsers();

    await createPost(
      {
        authorId: albert.id,
        title: "First Post",
        content:
          "This is my first post. I hope I love writing blogs as much as I love writing them.",
      },
      {
        authorId: sandy.id,
        title: "Meme Post",
        content: "This is a meme post. I only post memes. I am a meme.",
      },
      {
        authorId: glamgal.id,
        title: "Trolling",
        content:
          "Hahahaha you got trolled. At least you didn't get Rick Rolled.",
      }
    );

    // a couple more
  } catch (error) {
    throw error;
  }
}

async function rebuildDB() {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialPosts();
  } catch (error) {
    console.error(error);
  }
}

async function testDB() {
  try {
    console.log("TESTING!!!!");
    const users = await getAllUsers();

    console.log("getAllUsers: ", users);

    console.log("Calling updateUser on users[0]");
    const updateUserResult = await updateUser(users[0].id, {
      name: "Newname Sogood",
      location: "Lesterville, KY",
    });
    // console.log("Result:", updateUserResult);

    console.log("Calling getAllPosts");
    const posts = await getAllPosts();
    console.log("Result:", posts);

    console.log("Calling updatePost on posts[0]");
    const updatePostResult = await updatePost(posts[0].id, {
      title: "New Title",
      content: "Updated Content",
    });
    console.log("Result:", updatePostResult);

    console.log("Calling getUserById with 1");
    const albert = await getUserById(1);
    console.log("Result:", albert);

    console.log("......TESTING DONE!");
  } catch (error) {
    console.error("Something doesn't feel right....Nooooooooo!!!!!");
    throw error;
  }
}

async function dropTables() {
  try {
    console.log("Starting the table drop....");

    await client.query(`
        DROP TABLE IF EXISTS posts;
        DROP TABLE IF EXISTS users;`);

    console.log("Table drop finito!!");
  } catch (error) {
    console.error("Error in table drop!");
    throw error;
  }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
