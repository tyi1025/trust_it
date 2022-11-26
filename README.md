# Co-authors
[yulapshun](https://github.com/yulapshun)
[aledavide96](https://github.com/aledavide96)
[AanchalChugh](https://github.com/AanchalChugh)

# Backend Development Setup
1. Make sure MongoDB is install and running locally
2. Change working directory to `backend`
3. Run `npm install`
4. Run `cp env-example .env`
5. Modify `.env` if necessary to fill in with the correct values
6. Start the server with `npm start`
7. The API server will be started on the `PORT` specified in .env

# Frontend Development Setup
1. Run `npm install`
2. Run `cp env-example .env`
3. Modify `.env` if necessary to fill in with the correct values
4. Run `npm start`
5. The development server will be started on port 3000

# Backend Production Setup
1. Follow the same steps 1 to 5 as in development setup
2. Start the server with `npm run start-prod`
3. The API server will be started on the `PORT` specified in .env

# Frontend Production Setup
1. Follow the same steps 1 to 3 as in development setup
2. Build with `npm run build`
3. Serve with `npm run serve`
4. The frontend will be served on port 3000

# Data Import
A smaller set of bare minimum test data can be imported with the command `npm run importDummy`.
Data downloaded from the Internet can be imported with the command `npm run importData`, manufactuers all have usernames with their names turned to lower case and non alphanumeric characters removed.
A relative clean set of data can be imported with the command `npm run import`, this is the command you are looking for if you want to test out this application, must have `mongoimport` installed

# Scripts
### `createProduct`
Create product, deprecated

### `importDummydata`
Import minimal set of test data, execute with `npm run importDummy`, deprecated

### `scrapeCategories`, `scrapeIngredients`, `scrapeProducts`, `scrapeProducts`, `downloadProductImages`
Run these scripts in the order specifieed in the title to download data from Walgreens and PubChem. Takes a long time to run and all necessary data is already contained inside of `data` directory so it is not neccessary to rerun theme

### `importData`
Import the data downloaded from Walgreens and PubChem, takes a few minutes to run, execute with `npm run importData`, deprecated

### `export`
Export the database as JSON files into `data/export`, execute with `npm run export`, must have `mongoexport` installed

### `import`
Import the exported data into the database, execute with `npm run import`, must have `mongoimport` installed

### `calculateScore`
Recalculate overall, cancer, allergy & environment scores for products and ingredients, executed aynchronously everytime the backend starts or with the command `npm run calculateScores`

### `approveCertificates`
Approve certificates with pending status, execute with `npm run approveCertificates`

# Code Style
To check the code styles for the frontend, use React's default linter,
for the backend, run `npm run lint` inside backend directory.

Most important rules to follow are:
- Indent with 2 spaces
- Use single quotes for strings
- Use semi colons
