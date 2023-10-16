import express from "express";
import ViteExpress from "vite-express";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get, set } from "firebase/database";
import makeNewRoutine from "./routine.js";

const app = express();

app.use(express.json());

const firebaseConfig = {
  databaseURL: "https://atos-9b2e6-default-rtdb.firebaseio.com/"
};

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

app.post('/users/:userId/new', (req, res) => {
  console.log(`post: /users/${req.params.userId}/new`);
  const dbRef = ref(getDatabase());

  get(child(dbRef, `setup/`))
    .then((snapshot) => snapshot.val())
    .then(({workout, schedules}) => makeNewRoutine(req.body.params, workout, schedules))
    .then((routine) => set(ref(database, `users/${req.params.userId}`), {
      routine
    }))
    .then(() => set(ref(database, `users/${req.params.userId}/lifts`), {
      primary: req.body.params.primaryLifts,
      auxiliary: req.body.params.auxiliaryLifts
    }))
    .catch((err) => console.log(err));
}); 

app.get('/users/:userId/routine', (req, res) => {
  console.log(`get: /users/${req.params.userId}/routine`);
  const dbRef = ref(getDatabase());

  get(child(dbRef, `/users/${req.params.userId}/routine`))
    .then((snapshot) => snapshot.val())
    .then((routine) => res.send(routine).sendStatus(200))
    .catch((err) => console.log(err));
});

ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));
