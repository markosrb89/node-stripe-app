const express = require("express");
const stripe = require("stripe")("sk_test_4LT4BCtge2nJTssSOL1UMDmJ");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");

const app = express();
const port = process.env.PORT || 4040;

// Handlebars Middleware
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set static folder
app.use(express.static(`${__dirname}/public`));

// Index Route
app.get("/", (request, response) => {
    response.render("index");
});

// Charge Route
app.use("/charge", (request, response) => {
    const amount = 2500;

    stripe.customers.create({
        email: request.body.stripeEmail,
        source: request.body.stripeToken
    })
    .then(customer => stripe.charges.create({
        amount,
        description: "Web Development Course",
        currency: "usd",
        customer: customer.id
    }))
    .then(() => response.render("success"));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});