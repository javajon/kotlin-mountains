import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import client from './client.js';
import { promisify } from 'util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Convert gRPC client methods to promises
const getAllAsync = promisify(client.getAll.bind(client));
const insertAsync = promisify(client.insert.bind(client));
const updateAsync = promisify(client.update.bind(client));
const removeAsync = promisify(client.remove.bind(client));

const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.get("/", async (req, res) => {
    try {
        const data = await getAllAsync({});
        res.render("mountains", {
            results: data.mountains
        });
    } catch (err) {
        console.error('Error getting mountains:', err);
        res.status(500).send('Error loading mountains');
    }
});

app.post("/save", async (req, res) => {
    try {
        const newMountain = {
            name: req.body.name,
            elevation: parseInt(req.body.elevation),
            location: req.body.location
        };

        const data = await insertAsync(newMountain);
        console.log("Mountain created successfully", data);
        res.redirect("/");
    } catch (err) {
        console.error('Error creating mountain:', err);
        res.status(500).send('Error creating mountain');
    }
});

app.post("/update", async (req, res) => {
    try {
        const updateMountain = {
            id: req.body.id,
            name: req.body.name,
            elevation: parseInt(req.body.elevation),
            location: req.body.location
        };

        const data = await updateAsync(updateMountain);
        console.log("Mountain updated successfully", data);
        res.redirect("/");
    } catch (err) {
        console.error('Error updating mountain:', err);
        res.status(500).send('Error updating mountain');
    }
});

app.post("/remove", async (req, res) => {
    try {
        await removeAsync({ id: req.body.mountain_id });
        console.log("Mountain removed successfully");
        res.redirect("/");
    } catch (err) {
        console.error('Error removing mountain:', err);
        res.status(500).send('Error removing mountain');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running at port %d", PORT);
});