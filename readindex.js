//dependancies
const fs = require("fs");
const util = require("util");
const inquirer = require("inquirer");
const generateReadme = require("../Employee-Tracker-week-12-challenge/utilise/readMe generatorfile")
const writeFileAsync = util.promisify(fs.writeFile);

//Questions prompted to generate the README.md
function promptUser(){
    return inquirer.prompt([
        {
            type: "input",
            name: "Title",
            message: "What is the title of your project?",
        },
        {
            type: "input",
            name: "Tasks",
            message: "explain your tasks on of your project: "
        },
        {
            type: "input",
            name: "userStory",
            message: "What is the users storys?"
        },
        {
            type: "input",
            name: "installations",
            message: "What have you installed to create your project? ",
        },

        {
            type: "input",
            name: "Contributers",
            message: "Who contributed to complete your project?"
        },
        {
            type: "input",
            name: "gitHub",
            message: "Please enter your GitHub username: "
        },
        {
            type: "input",
            name: "email",
            message: "Please enter your email: "
        }
    ]);
} 

  async function init() {
    try {
        // User questions and generate responses
        const answers = await promptUser();
        const generateContent = generateReadme(answers);
        // Create and write new README.md to file
        await writeFileAsync('/Users/nealephilippe/Desktop/Employee Tracker week 12/Employee-Tracker-week-12-challenge', generateContent);
        console.log('✔️  Successfully wrote to README.md');
    }   catch(err) {
        console.log(err);
    }
  }
  
  init();  