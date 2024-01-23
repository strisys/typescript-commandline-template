import process from 'process';
import './env-config';
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

async function main(): Promise<void> {
  // const responseA = (await processText('what is LangSmith?'));
  await processPage('https://docs.smith.langchain.com/overview');

}

// https://js.langchain.com/docs/get_started/quickstart#retrieval-chain
const processPage = async (url: string): Promise<void> => {
  const loader = new CheerioWebBaseLoader('https://docs.smith.langchain.com/overview');
  const docs = (await loader.load());

  console.log(docs.length);
  console.log(docs[0].pageContent.length);

  const splitter = new RecursiveCharacterTextSplitter();
  const splitDocs = await splitter.splitDocuments(docs);

  console.log(splitDocs.length);
  console.log(splitDocs[0].pageContent.length);

  const embeddings = new OpenAIEmbeddings();

  const vectorstore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    embeddings
  );
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