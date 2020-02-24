# GitHub Repository Template

## About

This is our Webmap template, which should be used to create webmaps for Hackney.

## Prerequisites

You will need to have
[git installed](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).
You will also need [node and npm installed](https://nodejs.org/en/download/).

## Setting Up

Open terminal / bash and run the following:

```bash
git clone `https://github.com/LBHackney-IT/lbh-webmap-template.git`
```

You will need to create a file called `mapbox.js` in `src/js/helpers`, and a
file called `.npmrc` in the root of the project. Sandrine Balley
(sandrine.balley@hackney.gov.uk) or Marta Villalobos
(marta.villalobos@hackney.gov.uk) can give you the file contents for both files.

Name your data file `map-definition.json` and add it to
`data/YOUR_MAP_NAME_GOES_HERE/config/`.

Go back to terminal and run the following commands:

```bash
cd lbh-webmap-template
npm install
npm start
```

When you see the text "Listening on port 9000..." (this could take a minute or
so), open your web browser and go to
`http://localhost:9000/YOUR_MAP_NAME_GOES_HERE/index.html` for the whole page
version (with header), or
`http://localhost:9000/YOUR_MAP_NAME_GOES_HERE/embed.html` for the embed
version.

## Troubleshooting

If you have a javascript error and you require more information than what is
available in the console, you should set `isDist = false` in
`tasks/gulp/compile-assets.js` (line 34) and then stop (CTRL+C) and re-run
`npm start`. Please remember to set this back to `true` when you are ready to
build and deploy to production.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to
discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
