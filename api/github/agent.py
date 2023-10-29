import os
from dotenv import load_dotenv
from langchain.agents import AgentType
from langchain.agents import initialize_agent
from langchain.agents.agent_toolkits.github.toolkit import GitHubToolkit
from langchain.llms import OpenAI
from langchain.utilities.github import GitHubAPIWrapper

load_dotenv()

# This example also requires an OpenAI API key
llm = OpenAI(temperature=0)

# Define your GitHub API Wrapper
github = GitHubAPIWrapper(
    github_app_id=os.getenv("GITHUB_APP_ID", ),
    github_app_private_key=os.getenv("GITHUB_APP_PRIVATE_KEY"),
    github_base_branch=os.getenv("GITHUB_BASE_BRANCH", "main"),
    github_branch=os.getenv("GITHUB_BRANCH", "main"),
    github_repository=os.getenv("GITHUB_REPOSITORY"),
)


# toolkit = GitHubToolkit.from_github_api_wrapper(github)
# # print(toolkit.get_tools())
# agent = initialize_agent(
#     toolkit.get_tools(), llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, verbose=True
# )
# print(github.get_issues())
# print(github.get_issue(8)['body'])
# print(github.read_file('README.md'))
# print(github.read_file('src/email.js'))
old=github.read_file('src/email.js')
print(github.create_file(f"""src/dog.js
hi
                         """))
# print(github.update_file(f"""src/email.js
# OLD <<<<
# {old}
# >>>> OLD
# NEW <<<<
# Steve48787!
# >>>> NEW
# """))
# print(github.read_file('src/email.js'))
# agent.run(
#     "You have the software engineering capabilities of a Google Principle engineer. You are tasked with completing issues on a github repository. Please look at the existing issues, generate the code, update repository files. As final action, create pull request to review your changes."
# )

# agent.run(
#     "You have the software engineering capabilities of a Google Principle engineer. You are tasked to create a new function in javascript that output hello world on a github repository. Create file with new function then create a pull request."
# )