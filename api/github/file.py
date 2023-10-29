import os
from dotenv import load_dotenv
from langchain.agents import Agent, Tool, AgentExecutor
from langchain.utilities.github import GitHubAPIWrapper
from langchain.llms.openai import OpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.agents.agent_toolkits.github.toolkit import GitHubToolkit
from langchain.agents.agent_toolkits import FileManagementToolkit
from langchain.tools.file_management import (
    ReadFileTool,
    CopyFileTool,
    DeleteFileTool,
    MoveFileTool,
    WriteFileTool,
    ListDirectoryTool,
)
from pydantic import BaseModel, Field
from tempfile import TemporaryDirectory
from typing import Dict, Any, Optional

# Load environment variables from .env file
load_dotenv()

# Define your GitHub API Wrapper
github_api_wrapper = GitHubAPIWrapper(
    github_app_id=os.getenv("GITHUB_APP_ID", ),
    github_app_private_key=os.getenv("GITHUB_APP_PRIVATE_KEY"),
    github_base_branch=os.getenv("GITHUB_BASE_BRANCH", "main"),
    github_branch=os.getenv("GITHUB_BRANCH", "dev"),
    github_repository=os.getenv("GITHUB_REPOSITORY"),
)

# Define your tools
github_tools = [
    Tool(
        name="GitHub",
        func=github_api_wrapper.run,
        description="Interface to GitHub API"
    )
]

# Define File Management Toolkit
working_directory = TemporaryDirectory()
file_toolkit = FileManagementToolkit(
    root_dir=str(working_directory.name)
)

# Define your prompt template
prefix = "You are an AI assistant for managing GitHub repositories. Your task is: {task}."
suffix = "Question: {query}"
prompt_template = PromptTemplate.from_template(prefix + "{agent_scratchpad}" + suffix)

# Define your LLM Chain
llm_chain = LLMChain(llm=OpenAI(openai_api_key=os.getenv("OPENAI_API_KEY"), temperature=0), prompt=prompt_template)

# Define your Zero Shot Agent
class GitHubAgent(Agent):
    toolkits = [GitHubToolkit(tools=github_tools), file_toolkit]
    allowed_toolkits = ["GitHubToolkit", "FileManagementToolkit"]
    llm_chain = llm_chain

    class Config:
        arbitrary_types_allowed = True

    def _call(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        task = inputs.get("task", "")
        query = inputs.get("query", "")
        context = {"task": task, "query": query}
        response = self.run_llm_chain_with_toolkits(context=context)
        return response

# Define your Agent Executor
class GitHubAgentExecutor(AgentExecutor):

    @classmethod
    def from_agent_and_toolkits(cls, agent: GitHubAgent, toolkits: list, verbose: bool = False) -> "GitHubAgentExecutor":
        return super().from_agent_and_toolkits(agent=agent, toolkits=toolkits, verbose=verbose)

# Instantiate and use your agent
github_agent = GitHubAgent()
executor = GitHubAgentExecutor.from_agent_and_toolkits(agent=github_agent, toolkits=[GitHubToolkit(tools=github_tools), file_toolkit])

# Example usage:
response = executor({
    "task": "Utilize the information in README.md to address issues and pull requests. Apply CRUD operations to develop Python code for a modular application.",
    "query": "README.md\n# This is the content of the README file"
})
print(response)