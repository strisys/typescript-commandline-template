import process from 'process';
import './env-config';
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";

async function main(): Promise<void> {
  // const responseA = (await processText('what is LangSmith?'));
  await processPage('https://docs.smith.langchain.com/overview');

}

const getClient = (): ChatOpenAI => {
  return new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY
  });
}

const fetchContentAndSplit = async (url: string): Promise<any> => {
  const loader = new CheerioWebBaseLoader(url);
  const docs = (await loader.load());

  console.log(docs.length);
  console.log(docs[0].pageContent.length);

  const splitter = new RecursiveCharacterTextSplitter();
  const splitDocs = await splitter.splitDocuments(docs);

  console.log(splitDocs.length);
  console.log(splitDocs[0].pageContent.length);

  return splitDocs;
}

const hydrateVectorStore = async (url: string): Promise<MemoryVectorStore> => {
  const splitDocs = await fetchContentAndSplit(url);
  const embeddings = new OpenAIEmbeddings();

  const vectorstore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    embeddings
  );

  return vectorstore;
}

// https://js.langchain.com/docs/get_started/quickstart#retrieval-chain
const processPage = async (url: string): Promise<void> => {
  const vectorstore = await hydrateVectorStore(url);

  const chatModel = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY
  });

  const prompt = ChatPromptTemplate.fromTemplate(`Answer the following question based only on the provided context:
    <context>
    {context}
    </context>

    Question: {input}`);

  const documentChain = await createStuffDocumentsChain({
    llm: chatModel,
    prompt,
  });

  const retriever = vectorstore.asRetriever();

  const retrievalChain = await createRetrievalChain({
    combineDocsChain: documentChain,
    retriever,
  });

  const result = await retrievalChain.invoke({
    input: "what is LangSmith?",
  });

  console.log(result.answer);
}

const processText = async (text: string): Promise<string> => {
  const prompt = ChatPromptTemplate.fromMessages([
    ['system', 'You are a world class technical documentation writer.'],
    ['user', '{input}']
  ]);


  const chain = prompt.pipe(getClient()).pipe(new StringOutputParser());

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