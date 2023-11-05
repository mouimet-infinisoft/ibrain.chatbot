import { intention2codeTemplate } from "../../../../../ai/prompt_templates/intention2codeTemplate";

const requirements = `1. Language is Typescript.
2. Template structure must be respected.
3. Use fetch only, anything else is not authorized. For example: Axios is not allowed.
4. Assume any secret are available from process.env['SECRET']`

const template = `
const express = require('express');
const router = express.Router();

router.post('/search', (req, res) => {
    // You generate the implementation

  try {

  } catch (error) {
    res.status(500).send('Error');
  }
});

module.exports = router;
`;

const example2 = `
const express = require('express');
const fs = require('fs');
const router = express.Router();

const BASE_PATH = '/home/nitr0gen/apis/api/';

// POST /fs/search - Search for a file
router.post('/search', (req, res) => {
  const { filename } = req.body;
  try {
    const files = fs.readdirSync(BASE_PATH);
    const matchingFiles = files.filter(file => file.includes(filename));
    res.json(matchingFiles);
  } catch (error) {
    res.status(500).send('Error searching for files');
  }
});

module.exports = router;
`;
const example = ""
export const initApiPrompts = async () => {
  const intention2jsExpressRouterPrompt = await intention2codeTemplate.partial({
    requirements,
    example,
    template,
  });

  return {
    intention2jsExpressRouterPrompt,
  };
};
