import process from 'process';
import './env-config';
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";

async function main(): Promise<void> {
  const response = (await processText('what is LangSmith?'));
  console.log(response);
}

const processText = async (text: string): Promise<string> => {
  const prompt = ChatPromptTemplate.fromMessages([
    ['system', 'You are a world class technical documentation writer.'],
    ['user', '{input}'],
  ]);

  const chatModel = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY
  });

  const chain = prompt.pipe(chatModel).pipe(new StringOutputParser());

  const response = (await chain.invoke({
    input: text,
  }));

  console.log(response);

  return response;
}

const processError = (err: Error): void => {
  console.log("error message: ", err.message);
  console.log("error stack: ", err.stack);
  process.exit(1);
};

main().catch(processError);