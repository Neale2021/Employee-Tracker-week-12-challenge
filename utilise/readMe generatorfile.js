// generateReadme function populating the README.md
function generateReadme(answers) {
    return `
<h1 align="center">${answers.Title} 👋</h1>
  
## Table of Contents
- [Tasks](#Tasks)
- [UserStory](#UserStory)
- [installations](#installations)
- [Contributers](#contributers)

## Tasks
${answers.Tasks}

## User Story
 ${answers.userStory}

## installations
 ${answers.installations}

## Contributers
${answers.Contributers}

Find me on GitHub: [${answers.gitHub}](https://github.com/${answers.gitHub})<br />
<br />
✉️ Email me : ${answers.email}<br /><br />
    `;
  }
  
  module.exports = generateReadme;